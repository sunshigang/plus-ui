<template>
    <div id="leftSidebar">
        <div v-show="superadminShowOrHide" class="leftLine" v-hasPermi="['screen:function:review']"></div>
        <div :class="schemeReviewStyle == true ? 'schemeReviewSelected' : 'schemeReviewSelect'"
            @click="clickSchemeReview" v-hasPermi="['screen:function:review']" v-show="superadminShowOrHide">
            <div class="schemeReviewFont">方案审查</div>
        </div>
        <div class="leftLine1" v-hasPermi="['screen:function:achievement']"></div>
        <div :class="planningAchievementStyle == true ? 'planningAchievementSelected' : 'planningAchievementSelect'"
            @click="clickPlanningAchievement" v-hasPermi="['screen:function:achievement']">
            <div class="planningAchievementsFont">规划成果</div>
        </div>
        <div class="leftLine1" v-hasPermi="['screen:function:vector']"></div>
        <div :class="vectorLayerStyle == true ? 'planningAchievementSelected' : 'planningAchievementSelect'"
            @click="clickVectorLayer" v-hasPermi="['screen:function:vector']">
            <div class="planningAchievementsFont">矢量图层</div>
        </div>
        <div class="lanternEar"></div>
    </div>
    <div v-show="sceneRoamingShow" class="sceneRoaming" @click="clickSceneRoaming"
        v-hasPermi="['screen:function:roam']"></div>
    <div class="searchBox" v-hasPermi="['screen:function:achievement']" v-if="planningAchievementStyle">
        <!-- 调整：option绑定改为item.name（显示）、item.id（值） -->
        <el-select v-model="selectedValues" filterable placeholder="请输入点位名称搜索" class="search-input"
            @clear="handleSelectClear" style="--el-select-input-font-size: 0.833vw;" :teleported="false">
            <template #empty>
                <div style="padding: 0.52083vw; color: #999;">暂无匹配的点位</div>
            </template>
            <el-option v-for="item in filteredOptionsPoi" :key="item.id" :label="item.name" :value="item.id"
                style="font-size: 0.729167vw;" />
        </el-select>
        <!-- 禁用判断：判断是否为空值（undefined/''） -->
        <div class="search-btn" @click="handleSearch" :class="{ disabled: selectedValues === '' }">
            搜索
        </div>
    </div>
</template>

<script setup>
import { reactive, toRefs, onMounted, onUnmounted, getCurrentInstance, ref, computed } from 'vue'
import bus from '../../libs/eventbus'
import { getInfo } from '@/api/login'
// 定义响应式数据
const sceneRoamingShow = ref(true)
const { proxy } = getCurrentInstance()
const superadminShowOrHide =ref(true)
const schemeReviewStyle = ref(false)
const planningAchievementStyle = ref(false)
const vectorLayerStyle = ref(false)
const sceneRoamingStart = ref(false)

// 选中值改为绑定id（数字），初始值为空字符串
const selectedValues = ref('')
const searchQuery = ref('')
// 核心修改：移除value/label，id从1开始编号
const allOptionsPoi = ref([
    { id: 1, name: '五峰书院' },
    { id: 2, name: '胡公祠' },
    { id: 3, name: '石鼓寮' },
    { id: 4, name: '方岩' },
    { id: 5, name: '广慈寺' },
    { id: 6, name: '天门' },
    { id: 7, name: '步云亭' },
    { id: 8, name: '南岩' },
    { id: 9, name: '绍常祠堂' },
    { id: 10, name: '大坑' },
    { id: 11, name: '驻霞峰' },
    { id: 12, name: '小坑' },
    { id: 13, name: '鸡鸣峰' },
    { id: 14, name: '桃花峰' },
    { id: 15, name: '抗日阵亡将士纪念碑' },
    { id: 16, name: '寿山谷' },
    { id: 17, name: '狮峰' },
    { id: 18, name: '五云洞' },
    { id: 19, name: '小寮' },
    { id: 20, name: '大寮' },
    { id: 21, name: '德清寺' },
    { id: 22, name: '西村' },
    { id: 23, name: '伏虎听经' },
    { id: 24, name: '竹林寺' },
    { id: 25, name: '独行谷' },
    { id: 26, name: '灵岩寺' },
    { id: 27, name: '灵岩' },
    { id: 28, name: '灵岩苦槠林' },
    { id: 29, name: '灵山湖' },
    { id: 30, name: '岩后村' },
    { id: 31, name: '大园村' },
    { id: 32, name: '后山头村' },
    { id: 33, name: '长坑村' },
    { id: 34, name: '金竹村' },
    { id: 35, name: '岩上村' },
    { id: 36, name: '岩下街' },
    { id: 37, name: '岩下村' },
    { id: 38, name: '橙麓村' },
    { id: 39, name: '桃花珠瀑' },
    { id: 40, name: '覆釜峰' },
    { id: 41, name: '龙湫瀑' },
    { id: 42, name: '天墨水瀑' },
    { id: 43, name: '瀑布峰' },
    { id: 44, name: '重楼' },
    { id: 45, name: '固厚峰' },
    { id: 46, name: '石马坑' },
    { id: 47, name: '刘英烈士陵园' },
    { id: 48, name: '公岩' },
    { id: 49, name: '婆岩' },
    { id: 50, name: '烧焦岩' },
    { id: 51, name: '洪福寺' },
    { id: 52, name: '洪福村' },
    { id: 53, name: '俞溪头村' },
    { id: 54, name: '云溪村' },
    { id: 55, name: '傅阳村' },
    { id: 56, name: '西岐村' },
    { id: 57, name: '仙岩村' },
    { id: 58, name: '仙岩瀑' },
    { id: 59, name: '古竹畈村' },
    { id: 60, name: '杨渠村' },
    { id: 61, name: '大路任村' },
    { id: 62, name: '新楼村' },
    { id: 63, name: '红柿园村' },
    { id: 64, name: '下丁村' },
    { id: 65, name: '上丁村' },
    { id: 66, name: '凌宅村' },
    { id: 67, name: '方山口村' },
    { id: 68, name: '红军纪念馆' },
    { id: 69, name: '方山寺' },
    { id: 70, name: '铜山村' },
    { id: 71, name: '铜山岭铜矿遗址' },
    { id: 72, name: '吴越铜矿遗址' },
    { id: 73, name: '钱王古道' },
    { id: 74, name: '林坑铜矿遗址' },
    { id: 75, name: '竹海枫林' },
    { id: 76, name: '武肃王生祠' },
    { id: 77, name: '三川村' },
    { id: 78, name: '独松村' },
    { id: 79, name: '橙里王村' },
    { id: 80, name: '下宅村' },
    { id: 81, name: '文楼村' },
    { id: 82, name: '派溪村' },
    { id: 83, name: '象瑚里村' },
    { id: 84, name: '桐坑村' },
    { id: 85, name: '先盆村' },
    { id: 86, name: '金江龙' },
    { id: 87, name: '墁塘村' },
    { id: 88, name: '两门头村' },
    { id: 89, name: '岘口村' },
    { id: 90, name: '四知村' },
    { id: 91, name: '儒家村' },
    { id: 92, name: '西卢村' },
    { id: 93, name: '胡祖坑村' },
    { id: 94, name: '塘里村' },
    { id: 95, name: '杨溪源' },
    { id: 96, name: '台门村' },
    { id: 97, name: '外木坦村' },
    { id: 98, name: '上里叶村' },
    { id: 99, name: '玄中寺' },
    { id: 100, name: '方岩北门停车场' },
    { id: 101, name: '方岩岩下街停车场' },
    { id: 102, name: '方岩入口处停车场' },
    { id: 103, name: '方岩南门停车场' },
    { id: 104, name: '灵岩景区停车场' },
    { id: 105, name: '浙东人民解放军' },
    { id: 106, name: '浙东游击根据地' },
    { id: 107, name: '金鼓洞' },
    { id: 108, name: '五色洞' },
    { id: 109, name: '飞崖洞' },
    { id: 110, name: '罗汉古洞' },
    { id: 111, name: '胡公读书堂' },
    { id: 112, name: '抗战时期浙江省政府及相关机构旧址' },
    { id: 113, name: '抗日纪念碑' },
    { id: 114, name: '五峰双洞' },
    { id: 115, name: '云谷洞' },
    { id: 116, name: '万成庙' },
])

// 模糊搜索逻辑：匹配name字段
const filteredOptionsPoi = computed(() => {
    if (!searchQuery.value) return allOptionsPoi.value

    return allOptionsPoi.value.filter(item => {
        return item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    })
})

// 清空逻辑：重置为初始空值
const handleSelectClear = () => {
    selectedValues.value = ''
    searchQuery.value = ''
}

const clickSchemeReview = () => {
    schemeReviewStyle.value = !schemeReviewStyle.value
    planningAchievementStyle.value = false
    vectorLayerStyle.value = false
    bus.emit('scheme-review-clicked', {
        isShow: schemeReviewStyle.value,
        module: 'schemeReview'
    })
    sceneRoamingShow.value = true
}

const clickPlanningAchievement = () => {
    schemeReviewStyle.value = false
    planningAchievementStyle.value = !planningAchievementStyle.value
    vectorLayerStyle.value = false
    bus.emit('planning-achievement-clicked', {
        isShow: planningAchievementStyle.value,
        module: 'planningAchievement'
    })
    if (!planningAchievementStyle.value) {
        selectedValues.value = ''
        searchQuery.value = ''
    }
}

const clickVectorLayer = () => {
    schemeReviewStyle.value = false
    planningAchievementStyle.value = false
    vectorLayerStyle.value = !vectorLayerStyle.value
    console.log("🚀 ~ clickVectorLayer ~ vectorLayerStyle.value:", vectorLayerStyle.value)
    bus.emit('vector-layer-clicked', vectorLayerStyle.value)
    sceneRoamingShow.value = !vectorLayerStyle.value
}

const clickSceneRoaming = () => {
    sceneRoamingStart.value = !sceneRoamingStart.value
    bus.emit('scene-roaming-clicked', sceneRoamingStart.value)
}

// 搜索逻辑：根据选中的id匹配name
const handleSearch = () => {
    // 排除空值（''/undefined）
    if (selectedValues.value === '') return

    // 根据id查找对应的点位名称
    const item = allOptionsPoi.value.find(i => i.id === selectedValues.value)
    const selectedName = item?.name || ''

    console.log('选中的点位名称：', selectedName)
    bus.emit('search-relic', selectedName)

    // 可选：搜索后清空选中值
    // selectedValues.value = ''
    // searchQuery.value = ''
}

onMounted(async () => {
    const userData = await getInfo()
    const currentUser = userData.data.roles[0]
    if(currentUser=='superadmin'){
        superadminShowOrHide.value =false
    }
    filteredOptionsPoi.value = [...allOptionsPoi.value]
})

onUnmounted(() => {
    // 重置所有响应式状态
    sceneRoamingShow.value = true
    schemeReviewStyle.value = false
    planningAchievementStyle.value = false
    vectorLayerStyle.value = false
    sceneRoamingStart.value = false
    selectedValues.value = ''
    searchQuery.value = ''

    if (sceneRoamingStart.value) {
        bus.emit('scene-roaming-clicked', false)
    }

    const leftSidebar = document.getElementById('leftSidebar')
    const sceneRoaming = document.querySelector('.sceneRoaming')
    const searchBtn = document.querySelector('.search-btn')

    if (leftSidebar) {
        leftSidebar.onclick = null
    }
    if (sceneRoaming) {
        sceneRoaming.onclick = null
    }
    if (searchBtn) {
        searchBtn.onclick = null
    }
})
</script>

<style lang="scss" scoped>
#leftSidebar {
    pointer-events: auto;
    position: absolute;
    width: 3.8vw;
    height: 89.5vh;
    top: 6.5%;
    left: 6.875%;
    z-index: 2;
    display: flex;
    flex-direction: column;

    .leftLine {
        width: 0.05208vw;
        height: 3.64583vw;
        background: repeating-linear-gradient(to bottom, transparent 0, transparent 0.2083vw, #fad126 0.2083vw, #fad126 0.26vw);
        margin: 0 auto;
        position: relative;
    }

    .leftLine::after {
        content: '';
        position: absolute;
        top: calc(3.6458vw * 0.5);
        left: 50%;
        transform: translateX(-50%);
        width: 0.3125vw;
        height: 0.3125vw;
        border-radius: 50%;
        background: radial-gradient(circle, #fff99d 0%, #fad126 100%);
        box-shadow: 0 0 0.2083vw rgba(250, 209, 38, 0.8);
    }

    .schemeReviewSelected {
        width: 3.8vw;
        height: 9.8958vw;
        background: url(../../static/image/left/scheme-selected.png) no-repeat;
        background-size: 100% 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #ffffff;
        font-family: 'xianglifang';
        font-weight: 400;
        font-size: 1.25vw;
        cursor: pointer;

        .schemeReviewFont {
            width: 1.667vw;
            height: 6.40625vw;
            display: flex;
            justify-content: center;
            align-items: center;
            writing-mode: vertical-lr;
            text-orientation: upright;
            letter-spacing: 0.2083vw;
        }
    }

    .schemeReviewSelect {
        cursor: pointer;
        width: 3.8vw;
        height: 9.8958vw;
        background: url(../../static/image/left/scheme-select.png) no-repeat;
        background-size: 100% 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #7a4a28;
        font-family: 'xianglifang';
        font-weight: 400;
        font-size: 1.25vw;

        .schemeReviewFont {
            width: 1.667vw;
            height: 6.40625vw;
            display: flex;
            justify-content: center;
            align-items: center;
            writing-mode: vertical-lr;
            text-orientation: upright;
            letter-spacing: 0.2083vw;
        }
    }

    .leftLine1 {
        width: 0.05208vw;
        height: 3.125vw;
        background: repeating-linear-gradient(to bottom, transparent 0, transparent 0.2083vw, #fad126 0.2083vw, #fad126 0.26vw);
        margin: 0 auto;
        position: relative;
    }

    .leftLine1::after {
        content: '';
        position: absolute;
        top: calc(3.125vw * 0.5);
        left: 50%;
        transform: translateX(-50%);
        width: 0.3125vw;
        height: 0.3125vw;
        border-radius: 50%;
        background: radial-gradient(circle, #fff99d 0%, #fad126 100%);
        box-shadow: 0 0 0.2083vw rgba(250, 209, 38, 0.8);
    }

    .planningAchievementSelect {
        width: 3.8vw;
        height: 9.8958vw;
        background: url(../../static/image/left/scheme-select.png) no-repeat;
        background-size: 100% 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #7a4a28;
        font-family: 'xianglifang';
        font-weight: 400;
        font-size: 1.25vw;
        cursor: pointer;

        .planningAchievementsFont {
            width: 1.667vw;
            height: 6.40625vw;
            display: flex;
            justify-content: center;
            align-items: center;
            writing-mode: vertical-lr;
            text-orientation: upright;
            letter-spacing: 0.2083vw;
        }
    }

    .planningAchievementSelected {
        width: 3.842vw;
        height: 9.8958vw;
        background: url(../../static/image/left/scheme-selected.png) no-repeat;
        background-size: 100% 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #ffffff;
        font-family: 'xianglifang';
        font-weight: 400;
        font-size: 1.25vw;
        cursor: pointer;

        .planningAchievementsFont {
            width: 1.667vw;
            height: 6.40625vw;
            display: flex;
            justify-content: center;
            align-items: center;
            writing-mode: vertical-lr;
            text-orientation: upright;
            letter-spacing: 0.2083vw;
        }
    }

    .lanternEar {
        width: 1.4573vw;
        height: 6.3vw;
        background: url(../../static/image/left/lantern-ear.png) no-repeat;
        background-size: 100% 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 0;
        margin-bottom: auto;
        margin-left: auto;
        margin-right: auto;
    }
}

.sceneRoaming {
    left: 6.7%;
    position: absolute;
    pointer-events: auto;
    width: 4.479vw;
    height: 4.53125vw;
    bottom: 4%;
    background: url(../../static/image/left/sceneRoaming.png) no-repeat;
    background-size: cover;
    cursor: pointer;
    z-index: 3;
}

.searchBox {
    pointer-events: auto;
    position: absolute;
    width: 13.3854vw;
    height: 3.54167vw;
    top: 17.78%;
    left: 12.08%;
    background: url(../../static/image/left/search.png) no-repeat;
    background-size: cover;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    z-index: 2;

    // 核心修改：el-select 基础样式
    .search-input {
        flex: 1;
        height: 60%;
        margin-left: 1.04167vw;
        border: none !important; // 强制清除边框
        outline: none;
        background: transparent !important; // 背景透明
        min-height: 2.083vw;
        color: #584424;
        font-size: 0.833vw;
        font-family: 'SourceHanSansCN-Regular';
    }

    // 1. 调整 el-select 基础容器样式
    :deep(.el-select__wrapper) {
        width: 100%;
        min-height: 1.875vw;
        background: transparent !important;
        // 1. 清除基础边框 + 重置边框颜色变量
        border: 0 !important;
        --el-border-color: transparent !important;
        --el-border-color-focus: transparent !important;
        --el-select-border-color: transparent !important;
        --el-select-border-color-focus: transparent !important;
        outline: none !important; // 清除聚焦外边框
        box-shadow: none !important; // 清除聚焦阴影
        margin-top: 0.15625vw;

        // 2. 聚焦状态强制清除边框/阴影
        &.is-focus {
            border: 0 !important;
            outline: none !important;
            box-shadow: none !important;
            --el-select-border-color-focus: transparent !important;
        }

        // 输入框样式（原有保留，补充强制清除边框）
        :deep(.el-input__inner) {
            background: transparent !important;
            border: 0 !important;
            min-height: 1.875vw;
            padding: 0 0.52083vw;
            color: #584424;
            font-size: 0.833vw;
            outline: none !important;
            box-shadow: none !important; // 输入框聚焦阴影也清除

            &:focus {
                box-shadow: none !important;
                border: 0 !important;
            }
        }

        // 下拉箭头/清除按钮样式（原有保留）
        :deep(.el-select__caret) {
            color: #a57223;
        }

        :deep(.el-input__clear) {
            color: #a57223;

            &:hover {
                color: #fad126;
            }
        }
    }

    // 5. 调整下拉框容器样式（关键：解决下拉框挂载到body的问题）
    :deep(.el-select-dropdown) {
        width: 5.2083vw !important;
        background: rgba(245, 211, 110, 0.2) !important; // 半透明背景
        border: 0 !important; // 清除下拉框边框
        border-radius: 0.2083vw; // 可选：圆角

        // 6. 调整下拉选项样式
        :deep(.el-select-dropdown__item) {
            color: #584424; // 选项文字颜色
            font-size: 0.729167vw;
            padding: 0.4167vw 0.52083vw; // 选项内边距

            // 选项hover样式
            &:hover {
                background: rgba(245, 211, 110, 0.4) !important;
                color: #584424;
            }

            // 选项选中样式
            &.selected {
                background: rgba(245, 211, 110, 0.6) !important;
                color: #584424;
            }
        }

        // 7. 调整下拉框空状态样式（可选）
        :deep(.el-select-dropdown__empty) {
            color: #999;
            padding: 0.52083vw;
        }
    }


    .search-btn {
        width: 3.125vw;
        height: 60%;
        margin-right: 0.15625vw;
        border-radius: 0.15625vw;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #a57223;
        font-size: 1.04167vw;
        font-weight: 400;
        font-family: 'xianglifang';
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
            color: #fff;
        }

        &.disabled {
            color: #ccc;
            cursor: not-allowed;

            &:hover {
                color: #ccc;
            }
        }
    }
}
</style>
