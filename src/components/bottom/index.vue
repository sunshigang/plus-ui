<template>
    <div v-if="timeIsShow" class="time-column">
        <div class="leftArrow" @click="clickLeftArrow"></div>
        <div class="rightArrow" @click="clickRightArrow"></div>
        <div class="circle"></div>
        <div class="circle1"></div>
        <div class="base-line"></div>
        <div class="top-line"></div>
        <div v-for="(year, index) in years" :key="index" class="time-unit" @click="currentYear = year">
            <div class="star-icon-container">
                <div class="star-icon" :class="{ selected: year === currentYear }"></div>
            </div>
            <div class="year-text" :class="{ active: year === currentYear }">
                {{ year }}
            </div>
        </div>
    </div>
    <div class="backButton">
        <!-- 左侧线条区域 -->
        <div class="back-line left-line">
            <div class="dash-line dash1"></div>
            <div class="solid-circle"></div>
            <div class="dash-line dash2"></div>
            <div class="hollow-circle"></div>
            <div class="dash-line dash3"></div>
        </div>
        <!-- 返回按钮 -->
        <div class="backImg" @click="clickBack"></div>
        <!-- 右侧线条区域 -->
        <div class="back-line right-line">
            <div class="dash-line dash1"></div>
            <div class="solid-circle"></div>
            <div class="dash-line dash2"></div>
            <div class="hollow-circle"></div>
            <div class="dash-line dash3"></div>
        </div>
    </div>
    <div class="legend" v-if="legendShowHide">
        <div class="legendBody">
            <div class="legendTitle" v-for="item in legendItems" :key="item.id">
                <div class="legendRect"
                    :style="{ background: item.rgb, border: item.id <= 26 ? '2px solid #25A239' : 'none' }"></div>
                <div class="legendText">{{ item.name }}</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { ref, reactive, toRefs, onMounted, getCurrentInstance, watch, computed } from 'vue'
import bus from '../../libs/eventbus'
const route = useRoute()
const timeIsShow = ref(false)
const years = ref([2023, 2024, 2025]) // 年份数组
const currentYear = ref(2025) // 默认选中 2023
const router = useRouter()
const legendShowHide = ref(false) // 图例显示隐藏状态
const legendItems = ref([
    { id: 1, name: '一级保护区', rgb: 'rgb(213, 133, 146)' },
    { id: 2, name: '二级保护区', rgb: 'rgb(229, 227, 108) ' },
    { id: 3, name: '三级保护区', rgb: 'rgb(145, 149, 194)' },
    { id: 4, name: '灵岩山湖景区', rgb: 'rgb(87, 116, 115)' },
    { id: 5, name: '方山山林景区', rgb: 'rgb(130, 145, 143)' },
    { id: 6, name: '方岩丹霞景区', rgb: 'rgb(228, 176, 129)' },
    { id: 7, name: '风景游赏用地', rgb: 'rgb(192, 218, 117)' },
    { id: 8, name: '旅游服务设施用地', rgb: 'rgb(248, 61, 114)' },
    { id: 9, name: '居民社会用地', rgb: 'rgb(255, 166, 78)' },
    { id: 10, name: '交通与功能用地', rgb: 'rgb(255, 255, 255)' },
    { id: 11, name: '林地', rgb: 'rgb(81, 137, 14)' },
    { id: 12, name: '园地', rgb: 'rgb(94, 182, 60,0.2) ' },
    { id: 13, name: '耕地', rgb: 'rgb(187, 186, 34)' },
    { id: 14, name: '草地', rgb: 'rgb(128, 160, 93)' },
    { id: 15, name: '水域', rgb: 'rgb(32, 227, 255)' },
    { id: 16, name: '滞留地', rgb: 'rgb(147, 146, 146)' },
    { id: 17, name: '景群', rgb: 'rgb(189, 188, 153)' },
    { id: 18, name: '景区分区', rgb: 'rgb(170, 163, 108)' },
    { id: 19, name: '居民社会用地', rgb: 'rgb(255, 166, 78)' },
    { id: 20, name: '交通与功能用地', rgb: 'rgb(255, 255, 255)' },
    { id: 21, name: '灵岩山湖景区', rgb: 'rgb(87, 116, 115)' },
    { id: 22, name: '方山山林景区', rgb: 'rgb(130, 145, 143)' },
    { id: 23, name: '方岩丹霞景区', rgb: 'rgb(228, 176, 129)' },
    { id: 24, name: '方岩风景名胜区范围_16版', rgb: 'rgb(197, 229, 252)' },
    { id: 25, name: '方岩风景名胜区总体规划范围', rgb: 'rgb(204, 252, 228)' },
    { id: 26, name: '在编方岩风景名胜区范围', rgb: 'rgb(255, 190, 190)' },
])
// 滑块移动方法（向右/向左切换年份）
const moveSlider = direction => {
    const currentIndex = years.value.findIndex(item => item === currentYear.value)
    let newIndex = currentIndex + direction
    // 边界处理
    newIndex = Math.max(0, Math.min(newIndex, years.value.length - 1))
    currentYear.value = years.value[newIndex]

    currentYear.value = years.value[newIndex]
}
const clickLeftArrow = () => {
    moveSlider(-1)
}
const clickRightArrow = () => {
    moveSlider(1)
}
onMounted(() => {
    console.log('当前路由路径：', route.path)
    // bus.on('previewModel', data => {
    //     console.log("🚀 ~ clickBack ~ data:", data)
    // })
    bus.on('function-panel-clicked', index => {
        console.log('🚀 ~ index:', index)
        if (index.index === 0) {
        } else if (index.index === 1) {
            // legendShowHide.value = !legendShowHide.value
            timeIsShow.value = false
        } else if (index.index === 2) {
            timeIsShow.value = index.isSelected // 切换时间轴显示状态
            if (!index.isSelected) {
                // 如果时间轴被隐藏，重置为默认年份
                currentYear.value = 2025
            }
        }
    })
    bus.on('scheme-review-clicked', data => {
        legendShowHide.value = data
    })
    bus.on('vector-layer-clicked', data => {
        if (data) {
            legendShowHide.value = false
        }
    })
    bus.on('planning-achievement-clicked', data => {
        legendShowHide.value = false
    })
})
// 监听currentYear变化，自动触发事件
watch(currentYear, newYear => {
    console.log('🚀 ~ newYear:', newYear)
    bus.emit('time-change', newYear)
})
const clickBack = () => {

    if (route.path == '/screen/screen') {
        router.push('/')
    } else {
        router.push('/project/major')

    }

}
</script>

<style lang="scss" scoped>
.legend {
    z-index: 2;
    pointer-events: auto;
    position: absolute;
    width: 30rem;
    height: 15.6rem;
    left: 22.6rem;
    top: 86.2rem;
    background: url(../../static/image/bottom/legend.png) no-repeat;
    background-size: 100% 100%;

    .legendBody {
        margin-left: 3rem;
        margin-top: 3.4rem;
        width: 80%;
        height: 61%;
        overflow-y: auto;
        /* 超出高度出现垂直滚动条 */
        display: flex;
        flex-direction: column;
        /* 移除水平居中，让内容从顶部开始 */
        justify-content: flex-start;

        &::-webkit-scrollbar {
            width: 0.6rem; // 滚动条宽度
        }

        &::-webkit-scrollbar-thumb {
            background-color: rgba(255, 207, 112, 0.01); // 滚动条滑块颜色（与文字渐变呼应）
            border-radius: 0.3rem; // 滚动条圆角
        }

        &::-webkit-scrollbar-track {
            background-color: transparent; // 滚动条轨道透明
        }

        .legendTitle {
            display: flex;
            align-items: center;
            /* 垂直居中 */
            margin-bottom: 1.5rem;
            /* 每个标题间距 */

            .legendRect {
                width: 32px;
                height: 16px;
                background: rgba(55, 72, 35, 0.6);
                border: 2px solid #25a239;
                margin-right: 1.6rem;
                margin-left: 0.5rem;
            }

            .legendText {
                height: 16px;
                font-family: SourceHanSansCN, SourceHanSansCN;
                font-weight: 400;
                font-size: 16px;
                color: #ffffff;
                line-height: 16px;
                /* 与文字高度一致，垂直居中 */
                text-align: left;
                font-style: normal;
                text-transform: none;
            }
        }
    }
}

.time-column {
    z-index: 2;
    pointer-events: auto;
    position: absolute;
    left: 50%; // 先让元素左边缘对齐屏幕50%处
    transform: translateX(-49rem); // 向左移动自身宽度的一半（98rem / 2 = 49rem），实现居中
    bottom: 19rem;
    width: 98rem;
    height: 10.8rem;
    background: url(../../static/image/bottom/timeLine.png) no-repeat;
    background-size: 100% 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    .leftArrow {
        position: absolute;
        left: 21.6rem;
        top: 2.8rem;
        width: 1.6rem;
        height: 1.8rem;
        background: url(../../static/image/bottom/arrow-left.png) no-repeat;
        background-size: 100% 100%;
        cursor: pointer;
    }

    .rightArrow {
        position: absolute;
        right: 21.6rem;
        top: 2.8rem;
        width: 1.6rem;
        height: 1.8rem;
        background: url(../../static/image/bottom/arrow-right.png) no-repeat;
        background-size: 100% 100%;
        cursor: pointer;
    }

    .circle {
        position: absolute;
        width: 0.4rem;
        height: 0.4rem;
        top: 3.5rem;
        left: 23.6rem;
        background: #fff8c7;
        border-radius: 50%;
    }

    .circle1 {
        position: absolute;
        width: 0.4rem;
        height: 0.4rem;
        top: 3.5rem;
        left: 74rem;
        background: #fff8c7;
        border-radius: 50%;
    }

    .base-line {
        position: absolute;
        width: 49.2rem;
        height: 1.2rem;
        top: 3.6rem;
        left: 24.4rem;
        background: #847650;
        opacity: 0.4;
    }

    .top-line {
        position: absolute;
        width: 49.2rem;
        height: 0.2rem;
        top: 3.6rem;
        left: 24.4rem;
        background: #847650;
    }

    .time-unit {
        display: flex;
        flex-direction: column;
        /* 子元素垂直排列 */
        align-items: center;
        /* 水平居中 */
        justify-content: center;
        /* 垂直居中 */

        position: relative;
        width: 8.2rem;
        height: 100%;
        /* 占满父容器高度，确保垂直居中 */
        /* 移除旧的 margin，避免干扰 */
        margin-left: 0;
        margin-top: 0;

        .star-icon-container {
            width: 3.8rem;
            /* 与选中星星的最大宽度一致 */
            height: 3.8rem;
            display: flex;
            justify-content: center;
            align-items: center;

            .star-icon {
                margin: 0;
                width: 1.4rem;
                height: 1.4rem;
                background: url(../../static/image/bottom/star-select.png) no-repeat;
                background-size: 100% 100%;
                transition: all 0.3s ease;
                cursor: pointer;
            }

            .star-icon.selected {
                width: 3.8rem;
                height: 3.8rem;
                background: url(../../static/image/bottom/star-selected.png) no-repeat;
                background-size: 100% 100%;
                cursor: pointer;
            }
        }

        .year-text {
            margin: 0.5rem 0 0 0;
            /* 仅保留与星星的垂直间距 */
            color: #fff;
            font-family: 'DINPro';
            font-weight: 400;
            font-size: 2rem;
        }

        .year-text.active {
            font-weight: 500;
        }
    }
}

.backButton {
    z-index: 2;
    pointer-events: auto;
    position: absolute;
    left: 50%; // 与time-column一致，左边缘先对齐屏幕50%处
    transform: translateX(-18rem);
    bottom: 4rem;
    width: 36rem;
    height: 9.9rem;
    display: flex;
    justify-content: center;
    align-content: center;

    /* 通用线条样式 */
    .back-line {
        display: flex;
        align-items: center;
        height: 100%;
    }

    /* 左侧线条：从右向左排列 */
    .left-line {
        flex-direction: row-reverse;
        margin-right: 6rem;
        /* 与按钮间距 */

        /* 虚线通用样式 */
        .dash-line {
            background: repeating-linear-gradient(to right, #ffd700, #ffd700 0.2rem, transparent 0.2rem, transparent 0.3rem);
            height: 0.1rem;
            /* 调整为0.1rem */
        }

        /* 实心圆 */
        .solid-circle {
            width: 0.6rem;
            height: 0.6rem;
            border-radius: 50%;
            background-color: #ffd700;
            margin: 0 0.3rem;
        }

        /* 空心圆 */
        .hollow-circle {
            width: 1.3rem;
            height: 1.3rem;
            border-radius: 50%;
            border: 0.2rem solid #ffd700;
            background-color: transparent;
            margin: 0 0.3rem;
        }

        /* 左侧各段虚线长度 */
        .dash1 {
            width: 2.2rem;
        }

        .dash2 {
            width: 2.9rem;
        }

        .dash3 {
            width: 5.2rem;
        }
    }

    /* 右侧线条：从左向右排列 */
    .right-line {
        flex-direction: row;
        margin-left: 1rem;
        /* 与按钮间距 */

        /* 虚线通用样式（与左侧一致） */
        .dash-line {
            background: repeating-linear-gradient(to right, #ffd700, #ffd700 0.2rem, transparent 0.2rem, transparent 0.3rem);
            height: 0.1rem;
            /* 调整为0.1rem */
        }

        /* 实心圆（与左侧一致） */
        .solid-circle {
            width: 0.6rem;
            height: 0.6rem;
            border-radius: 50%;
            background-color: #ffd700;
            margin: 0 0.3rem;
        }

        /* 空心圆（与左侧一致） */
        .hollow-circle {
            width: 1.3rem;
            height: 1.3rem;
            border-radius: 50%;
            border: 0.2rem solid #ffd700;
            background-color: transparent;
            margin: 0 0.3rem;
        }

        /* 右侧各段虚线长度（与左侧对称） */
        .dash1 {
            width: 2.2rem;
        }

        .dash2 {
            width: 2.9rem;
        }

        .dash3 {
            width: 5.2rem;
        }
    }

    .backImg {
        position: absolute;
        width: 10.1rem;
        height: 9.9rem;
        background: url(../../static/image/bottom/back1.png) no-repeat;
        background-size: 100% 100%;
        cursor: pointer;
    }
}
</style>
