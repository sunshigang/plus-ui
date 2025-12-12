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
import { ref, reactive, toRefs, onMounted, onUnmounted, getCurrentInstance, watch, nextTick } from 'vue' // 新增 onUnmounted
import { addMarks } from "./draw.js";
import bus from '../../libs/eventbus'
import { ElMessage } from 'element-plus';

// 响应式数据
const layerName = ref(null)
const remarkContents = ref(null)
const popupIsShow = ref(false)
const popupData = reactive({
    type: '',
    wkt: '',
    area: '',
    length: '',
})
// 存储拖动相关事件（用于解绑）
const dragEventRefs = ref({
    mouseDown: null,
    mouseMove: null,
    mouseUp: null
})

// 取消弹窗（重置状态）
const cleanPopup = () => {
    popupIsShow.value = false
    layerName.value = null
    remarkContents.value = null
    popupData.type = ''
    popupData.wkt = ''
    popupData.area = ''
    popupData.length = ''
}

// 确认弹窗（保存数据）
const confirmPopup = () => {
    if (!layerName.value) {
        ElMessage.warning('请输入名称');
        return; // 阻止后续执行
    }
    addMarks({
        layerName: layerName.value,
        remarkcontents: remarkContents.value,
        wkt: popupData.wkt.join(','),
        type: popupData.type,
        area: popupData.area,
        length: popupData.length,
        checked: false
    }).then((res) => {
        console.log('标注信息保存成功', res);
        ElMessage.success('保存成功');
        cleanPopup() // 保存成功后关闭弹窗
    }).catch((error) => {
        console.error('标注信息保存失败', error);
        ElMessage.error('保存失败，请重试');
    });
}

// ========== 1. 提取Bus回调为命名函数（精准解绑） ==========
const handleDrawResult = (data) => {
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
}

// ========== 2. 自定义拖动指令（优化事件存储，支持解绑） ==========
const vDrag = {
    mounted: (el, bindings) => {
        // 存储mousedown事件引用
        dragEventRefs.value.mouseDown = function (e) {
            let id = (e.target || e.srcElement).id
            if (id == 'popupBody') {
                var disx = e.pageX - el.offsetLeft
                var disy = e.pageY - el.offsetTop

                // 存储mousemove事件引用
                dragEventRefs.value.mouseMove = function (e) {
                    el.style.left = e.pageX - disx + 'px'
                    el.style.top = e.pageY - disy + 'px'
                }

                // 存储mouseup事件引用
                dragEventRefs.value.mouseUp = function () {
                    document.removeEventListener('mousemove', dragEventRefs.value.mouseMove)
                    document.removeEventListener('mouseup', dragEventRefs.value.mouseUp)
                    // 清空事件引用
                    dragEventRefs.value.mouseMove = null
                    dragEventRefs.value.mouseUp = null
                }

                // 使用addEventListener绑定（便于后续解绑）
                document.addEventListener('mousemove', dragEventRefs.value.mouseMove)
                document.addEventListener('mouseup', dragEventRefs.value.mouseUp)
            }
        }
        // 绑定mousedown事件
        el.addEventListener('mousedown', dragEventRefs.value.mouseDown)
    },
    unmounted: (el) => {
        // 指令卸载时解绑所有拖动事件
        if (dragEventRefs.value.mouseDown) {
            el.removeEventListener('mousedown', dragEventRefs.value.mouseDown)
            dragEventRefs.value.mouseDown = null
        }
        if (dragEventRefs.value.mouseMove) {
            document.removeEventListener('mousemove', dragEventRefs.value.mouseMove)
            dragEventRefs.value.mouseMove = null
        }
        if (dragEventRefs.value.mouseUp) {
            document.removeEventListener('mouseup', dragEventRefs.value.mouseUp)
            dragEventRefs.value.mouseUp = null
        }
    }
}

// ========== 3. 生命周期：挂载/卸载逻辑 ==========
onMounted(() => {
    // 绑定Bus事件（命名函数）
    bus.on('draw-result', handleDrawResult);
})

onUnmounted(() => {
    // ========== 核心：销毁所有监听/事件 ==========
    // 1. 解绑Bus事件（精准解绑）
    bus.off('draw-result', handleDrawResult);

    // 2. 解绑拖动指令的所有事件（兜底）
    const popupEl = document.getElementById('popup-column');
    if (popupEl && dragEventRefs.value.mouseDown) {
        popupEl.removeEventListener('mousedown', dragEventRefs.value.mouseDown);
    }
    if (dragEventRefs.value.mouseMove) {
        document.removeEventListener('mousemove', dragEventRefs.value.mouseMove);
    }
    if (dragEventRefs.value.mouseUp) {
        document.removeEventListener('mouseup', dragEventRefs.value.mouseUp);
    }

    // ========== 兜底：清理所有状态 ==========
    // 强制关闭弹窗
    popupIsShow.value = false;
    // 重置所有响应式数据
    layerName.value = null;
    remarkContents.value = null;
    popupData.type = '';
    popupData.wkt = '';
    popupData.area = '';
    popupData.length = '';
    // 清空事件引用
    dragEventRefs.value = {
        mouseDown: null,
        mouseMove: null,
        mouseUp: null
    };

    // 3. 清理Element Plus的tooltip（避免残留）
    const tooltips = document.querySelectorAll('.el-tooltip__popper');
    tooltips.forEach(tooltip => tooltip.remove());
})
</script>

<style lang="scss" scoped>
#popup-column {
    pointer-events: auto;
    position: absolute;
    left: 60%;
    top: 40%;
    width: 494px;
    height: 258px;
    background: url(../../static/image/popup/notesPopup.png) no-repeat;
    background-size: 100% 100%;

    .popupBody {
        width: 100%;
        height: 91%;
        margin-top: 10px;

        .popupHeaderLabel {
            position: absolute;
            left: 200px;
            top: 20px;
            width: 78px;
            height: 26px;
            font-family: 'xianglifang';
            font-weight: 400;
            font-size: 24px;
            color: #fff8c7;
        }

        .closeButtonImg {
            position: absolute;
            cursor: pointer;
            width: 10px;
            height: 10px;
            top: 20px;
            left: 460px;
        }

        .popupContent {
            width: 96%;
            height: 76%;
            display: flex;
            flex-direction: column;
            position: absolute;
            top: 50px;
            left: 10px;

            .memoField {
                margin-top: 10px;
                width: 100%;
                height: 13%;

                .memoFieldLabel {
                    margin-left: 50px;
                    font-family: 'SourceHanSansCN-Medium';
                    font-weight: 500;
                    font-size: 16px;
                    color: #e9cc2f;

                    .memoFieldValue {
                        color: #ffffff !important;
                    }

                    .memoFieldValueType {
                        margin-left: 10px;
                    }

                    .memoFieldValueArea {
                        margin-left: 4px;
                    }

                    .input-border-style {
                        width: 300px;
                        height: 25px;
                        margin-left: 10px;
                    }

                    :deep(.el-input) {
                        --el-input-border-color: #FFDD54;
                    }

                    :deep(.el-input__wrapper.is-focus) {
                        border-color: #FFDD54 !important;
                        box-shadow: 0 0 0 1px rgba(255, 221, 84, 0.5);
                    }

                    :deep(.el-input__wrapper) {
                        font-weight: 400;
                        font-size: 14px;
                        background: rgba(255, 229, 84, 0.18);
                        border-radius: 4px;
                    }

                    :deep(.el-input__inner) {
                        color: #ffffff;
                    }

                    .polygonSAreaStyle {
                        cursor: pointer;
                        margin-left: 44px;
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
                font-size: 16px;
                color: #FFFFFF;

                .cancelButton {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    width: 72px;
                    height: 32px;
                    background: url(../../static/image/popup/cancelButton.png) no-repeat;
                    background-size: 100% 100%;
                    cursor: pointer;
                }

                .confirmButton {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    width: 72px;
                    height: 32px;
                    background: url(../../static/image/popup/confirmButton.png) no-repeat;
                    background-size: 100% 100%;
                    margin-left: 70px;
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