<template>
    <div v-if="popupIsShow" id="popup-column" v-drag>
        <div class="popupBody" id="popupBody">
            <div class="popupHeaderLabel">备注信息</div>
            <img src="../../static/image/popup/chahao.png" class="closeButtonImg" @click="cleanPopup" />
            <div class="popupContent">
                <div class="memoField">
                    <div class="memoFieldLabel">
                        图层名称:
                        <el-input v-model="layerName" class="input-border-style" placeholder="请输入名称" />
                    </div>
                </div>
                <div class="memoField">
                    <div class="memoFieldLabel">
                        图层类型:
                        <span class="memoFieldValueType">{{ popupData.type }}</span>
                        <span v-if="popupData.type == 'polygon'" class="memoFieldValueArea">，面积：{{ popupData.area ||
                            0 }}平方米</span>
                        <span v-else-if="popupData.type == 'polyline'" class="memoFieldValueArea">，长度：{{
                            popupData.length || 0 }}米</span>
                    </div>
                </div>
                <div class="memoField">
                    <div class="memoFieldLabel">
                        wkt:
                        <el-tooltip v-if="popupData.type == 'polygon'" class="box-item" effect="dark"
                            :content="String(popupData.wkt)" placement="top">
                            <span class="polygonSAreaStyle">面坐标</span>
                        </el-tooltip>
                        <el-tooltip v-else-if="popupData.type == 'polyline'" class="box-item" effect="dark"
                            :content="String(popupData.wkt)" placement="top">
                            <span class="polygonSAreaStyle">线坐标</span>
                        </el-tooltip>
                        <span v-else class="memoFieldValue">{{ popupData.wkt }}</span>
                    </div>
                </div>
                <div class="memoField">
                    <div class="memoFieldLabel">
                        备注信息:
                        <el-input v-model="remarkContents" class="input-border-style" placeholder="请输入备注信息" />
                    </div>
                </div>
                <div class="selectbody">
                    <div class="cancelButton" @click="cleanPopup">取消</div>
                    <div class="confirmButton" @click="confirmPopup">确定</div>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup>
import { ref, reactive, toRefs, onMounted, getCurrentInstance, watch, nextTick } from 'vue'
import { addMarks } from "./draw.js";
import bus from '../../libs/eventbus'
import { ElMessage } from 'element-plus';
const layerName = ref(null)
const remarkContents = ref(null)
const popupIsShow = ref(false)
const popupData = reactive({
    type: '',
    wkt: '',
    area: '',
    length: '',
})
//取消弹窗
const cleanPopup = () => {
    popupIsShow.value = false
    layerName.value = null
    remarkContents.value = null
    popupData.type = ''
    popupData.wkt = ''
    popupData.area = ''
    popupData.length = ''
}
const confirmPopup = () => {
    if (!layerName.value) {
        ElMessage.warning('请输入名称');
        return; // 阻止后续执行
    } else {
        addMarks({
            layerName: layerName.value,
            remarkcontents: remarkContents.value,
            wkt: popupData.wkt.join(','),
            type: popupData.type,
            area: popupData.area,
            length: popupData.length,
            checked:false
        }).then((res) => {
            console.log('标注信息保存成功', res);
            // 新增：显示保存成功提示
            ElMessage.success('保存成功');
            cleanPopup() // 保存成功后关闭弹窗
        }).catch((error) => {
            console.error('标注信息保存失败', error);
            // 优化：失败时也显示提示
            ElMessage.error('保存失败，请重试');
        });
    }
}
//弹窗单元数据
const attributeUnitList = ref([])
const { proxy } = getCurrentInstance()
const vDrag = {
    mounted: (el, bindings) => {
        el.onmousedown = function (e) {
            let id = (e.target || e.srcElement).id
            if (id == 'popupBody') {
                var disx = e.pageX - el.offsetLeft
                var disy = e.pageY - el.offsetTop
                document.onmousemove = function (e) {
                    el.style.left = e.pageX - disx + 'px'
                    el.style.top = e.pageY - disy + 'px'
                }
                document.onmouseup = function () {
                    document.onmousemove = document.onmouseup = null
                }
            }
        }
    },
}

onMounted(() => {
    bus.on('draw-result', data => {
        console.log('draw-result', data)
        popupIsShow.value = data.status
        if (data.type == 'polygon') {
            popupData.type = data.type
            popupData.wkt = data.coordinates
            popupData.area = data.area
        } else if (data.type == 'polyline') {
            popupData.type = data.type
            popupData.wkt = data.coordinates
            popupData.length = data.length
        } else {
            popupData.type = data.type
            popupData.wkt = data.coordinates
        }
    })

})
</script>

<style lang="scss" scoped>
#popup-column {
    pointer-events: auto;
    position: absolute;
    left: 60%;
    top: 40%;
    width: 49.4rem;
    height: 25.8rem;
    background: url(../../static/image/popup/notesPopup.png) no-repeat;
    background-size: 100% 100%;

    .popupBody {
        width: 100%;
        height: 91%;
        margin-top: 1rem;

        .popupHeaderLabel {
            position: absolute;
            left: 20rem;
            top: 2rem;
            width: 7.8rem;
            height: 2.6rem;
            font-family: 'xianglifang';
            font-weight: 400;
            font-size: 2.4rem;
            color: #fff8c7;
        }

        .closeButtonImg {
            position: absolute;
            cursor: pointer;
            width: 1rem;
            height: 1rem;
            top: 2rem;
            left: 46rem;
        }

        .popupContent {
            width: 96%;
            height: 76%;
            display: flex;
            flex-direction: column;
            position: absolute;
            top: 5rem;
            left: 1rem;

            .memoField {
                margin-top: 1rem;
                width: 100%;
                height: 13%;

                .memoFieldLabel {
                    margin-left: 5rem;
                    font-family: 'SourceHanSansCN-Medium';
                    font-weight: 500;
                    font-size: 1.6rem;
                    color: #e9cc2f;

                    .memoFieldValue {
                        color: #ffffff !important;
                        /* !important 确保覆盖父类颜色（若有冲突） */
                    }

                    .memoFieldValueType {
                        margin-left: 1rem;
                    }

                    .memoFieldValueArea {
                        margin-left: 0.4rem;
                    }

                    .input-border-style {
                        width: 30rem;
                        height: 2.5rem;
                        margin-left: 1rem;
                    }

                    :deep(.el-input) {
                        --el-input-border-color: #FFDD54;
                    }

                    :deep(.el-input__wrapper.is-focus) {
                        border-color: #FFDD54 !important;
                        box-shadow: 0 0 0 0.1rem rgba(255, 221, 84, 0.5);
                    }

                    :deep(.el-input__wrapper) {
                        font-weight: 400;
                        font-size: 1.4rem;
                        background: rgba(255, 229, 84, 0.18);
                        border-radius: 0.4rem;
                    }

                    :deep(.el-input__inner) {
                        color: #ffffff;
                    }

                    .polygonSAreaStyle {
                        cursor: pointer;
                        margin-left: 4.4rem;
                    }
                }
            }

            .selectbody {
                width: 100%;
                height: 30%;
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                font-family: 'SourceHanSansCN-Regular';
                font-weight: 500;
                font-size: 1.6rem;
                color: #FFFFFF;

                .cancelButton {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    width: 7.2rem;
                    height: 3.2rem;
                    background: url(../../static/image/popup/cancelButton.png) no-repeat;
                    background-size: 100% 100%;
                    cursor: pointer;
                }

                .confirmButton {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    width: 7.2rem;
                    height: 3.2rem;
                    background: url(../../static/image/popup/confirmButton.png) no-repeat;
                    background-size: 100% 100%;
                    margin-left: 7rem;
                    cursor: pointer;
                }
            }

        }


    }
}

::-webkit-scrollbar {
    width: 0;
    height: 0;
    background-color: transparent;
}
</style>
