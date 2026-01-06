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

    <!-- 动态绑定图例容器高度 + 背景图 -->
    <div class="legend" v-if="legendVisible" :style="legendContainerStyle">
        <div class="legendBody" :style="legendBodyStyle">
            <div class="legendTitle" v-for="item in filteredLegendItems" :key="item.id">
                <div class="legendRect" :style="{
                    borderColor: item.rgb,
                    background: convertRgbToRgba(item.rgb, 0.2),
                    border: '2px solid ' + item.rgb
                }"></div>
                <div class="legendText">{{ item.name }}</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { ref, reactive, toRefs, onMounted, onUnmounted, watch, computed } from 'vue'
import bus from '../../libs/eventbus'
const route = useRoute()
const legendVisible = ref(false)
const filteredLegendItems = ref([]);
const timeIsShow = ref(false)
const years = ref([2022, 2023, 2024, 2025]) // 年份数组
const currentYear = ref(2025) // 默认选中 2025
const router = useRouter()
const selectedLayerNames = ref([]);

// 静态图例数据（保留原有RGB）
const staticLegendItems = ref([
    { id: 1, name: '一级保护区', rgb: 'rgb(213, 133, 146)' },
    { id: 2, name: '二级保护区', rgb: 'rgb(229, 227, 108)' },
    { id: 3, name: '三级保护区', rgb: 'rgb(145, 149, 194)' },
    { id: 4, name: '灵岩山湖景区', rgb: 'rgb(87, 116, 115)' },
    { id: 5, name: '方山山林景区', rgb: 'rgb(130, 145, 143)' },
    { id: 6, name: '方岩丹霞景区', rgb: 'rgb(228, 176, 129)' },
    { id: 7, name: '风景游赏用地', rgb: 'rgb(192, 218, 117)' },
    { id: 8, name: '旅游服务设施用地', rgb: 'rgb(248, 61, 114)' },
    { id: 9, name: '居民社会用地', rgb: 'rgb(255, 166, 78)' },
    { id: 10, name: '交通与功能用地', rgb: 'rgb(255, 255, 255)' },
    { id: 11, name: '林地', rgb: 'rgb(81, 137, 14)' },
    { id: 12, name: '园地', rgb: 'rgb(94, 182, 60)' },
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
    { id: 27, name: '生态保护红线', rgb: 'rgb(255, 0, 0)' },
    { id: 28, name: '一级人文景源', rgb: 'rgb(255, 102, 102)' },
    { id: 29, name: '二级人文景源', rgb: 'rgb(255, 153, 102)' },
    { id: 30, name: '三级人文景源', rgb: 'rgb(255, 204, 102)' },
    { id: 31, name: '一级自然景源', rgb: 'rgb(102, 255, 102)' },
    { id: 32, name: '二级自然景源', rgb: 'rgb(102, 255, 153)' },
    { id: 33, name: '三级自然景源', rgb: 'rgb(102, 255, 204)' },
    { id: 34, name: '行政村', rgb: 'rgb(102, 153, 255)' },
    { id: 35, name: '停车场', rgb: 'rgb(204, 102, 255)' },
    { id: 36, name: '岩洞寺庙文化景源', rgb: 'rgb(153, 102, 255)' },
    { id: 37, name: '胡公文化景源', rgb: 'rgb(204, 102, 153)' },
    { id: 38, name: '书院文化景源', rgb: 'rgb(102, 204, 153)' },
    { id: 39, name: '抗战历史文化景源', rgb: 'rgb(255, 102, 153)' },
    { id: 40, name: '对外交通', rgb: 'rgb(255, 204, 0)' },
    { id: 41, name: '机动车道', rgb: 'rgb(204, 204, 0)' },
    { id: 42, name: '一级车行道', rgb: 'rgb(153, 204, 0)' },
    { id: 43, name: '一级游步道', rgb: 'rgb(102, 204, 0)' },
    { id: 44, name: '二级游步道', rgb: 'rgb(51, 204, 0)' },
    { id: 45, name: '客运索道', rgb: 'rgb(0, 204, 51)' },
    { id: 46, name: '主要景观游赏线', rgb: 'rgb(0, 204, 102)' },
]);

// 动态备注图例项
const dynamicRemarkLegendItems = ref([]);

// 合并静态+动态图例
const legendItems = computed(() => {
    const remarkItems = dynamicRemarkLegendItems.value.map((item, index) => ({
        id: 47 + index,
        // 🔥 修复：优先用 item.layerName（和图层管理统一），无则用 item.name
        name: item.layerName || item.name || `未命名备注${index + 1}`,
        rgb: item.rgb || 'rgb(252, 218, 78)',
        isRemark: true
    }));
    return [...staticLegendItems.value, ...remarkItems];
});

// 核心：RGB转RGBA（添加0.2透明度）
const convertRgbToRgba = (rgbStr, opacity = 0.2) => {
    // 匹配rgb(xxx, xxx, xxx)格式，提取数字
    const match = rgbStr.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (match) {
        const [, r, g, b] = match;
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
    // 兼容已有带透明度的RGB（兜底）
    return rgbStr;
};

// 核心：动态计算图例容器样式（含高度、背景图）
const legendContainerStyle = computed(() => {
    const len = filteredLegendItems.value.length;
    // 动态高度：1个=100px / 2个=120px / ≥3个=156px
    let height = len === 1 ? '100px' : len === 2 ? '120px' : '156px';

    return {
        zIndex: 2,
        pointerEvents: 'auto',
        position: 'absolute',
        left: '11%',
        bottom: '4%',
        width: '330px',
        height: height,
        // 背景图随容器尺寸自适应
        background: 'url(/legend.png) no-repeat center center',
        backgroundSize: '100% 100%', // 关键：背景图拉伸适配容器高度
        backgroundPosition: '0 0', // 确保背景图从左上角开始显示
    };
});

// 核心：动态计算图例内容区高度
const legendBodyStyle = computed(() => {
    const len = filteredLegendItems.value.length;
    let height = len === 1 ? '40%' : len === 2 ? '55%' : '61%';
    return {
        marginLeft: '30px',
        marginTop: '34px',
        width: '80%',
        height: height,
        overflowY: 'auto', // 超过3个时显示滚动条
        overflowX: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start'
    };
});

// 滑块移动方法
const moveSlider = direction => {
    const currentIndex = years.value.findIndex(item => item === currentYear.value)
    let newIndex = currentIndex + direction
    newIndex = Math.max(0, Math.min(newIndex, years.value.length - 1))
    currentYear.value = years.value[newIndex]
}
const clickLeftArrow = () => {
    moveSlider(-1)
}
const clickRightArrow = () => {
    moveSlider(1)
}

// ========== 提取所有Bus回调为命名函数（关键：确保off能精准销毁） ==========
// 1. 备注图例更新回调
const handleUpdateRemarkLegend = (remarkList) => {
    if (!remarkList || !Array.isArray(remarkList) || remarkList.length === 0) {
        dynamicRemarkLegendItems.value = [];
        filteredLegendItems.value = [];
        return;
    }
    dynamicRemarkLegendItems.value = remarkList.map((item, index) => ({
        id: 47 + index,
        name: item.layerName || `未命名备注${index + 1}`,
        rgb: item.rgb || 'rgb(252, 218, 78)',
        isRemark: true
    }));
    bus.emit('layerNamesSelected', selectedLayerNames.value || []);
};

// 2. 选中图层名称过滤图例回调
const handleLayerNamesSelected = (selectedNames) => {
    if (!selectedNames || selectedNames.length === 0) {
        filteredLegendItems.value = [];
        legendVisible.value = false;
        return;
    }
    // 过滤图例（匹配名称）
    filteredLegendItems.value = legendItems.value.filter(item => {
        return selectedNames.includes(item.name);
    });
    // 去重
    filteredLegendItems.value = [...new Map(
        filteredLegendItems.value.map(item => [item.name, item])
    ).values()];
    legendVisible.value = true;
};

// 3. 图例显隐回调
const handleLegendVisibility = (isVisible) => {
    legendVisible.value = isVisible;
};

// 4. 功能面板点击回调
const handleFunctionPanelClicked = (index) => {
    if (index.index === 2) {
        timeIsShow.value = index.isSelected
        if (!index.isSelected) {
            currentYear.value = 2025
        }
    } else {
        timeIsShow.value = false
    }
};

// 5. 方案审查回调
const handleSchemeReviewClicked = (data) => {
    if (!data.isShow) filteredLegendItems.value = [];
};

// 6. 矢量图层点击回调（空函数，保留）
const handleVectorLayerClicked = (data) => {
    // 无操作，仅保留监听
};

// 7. 规划成果点击回调（空函数，保留）
const handlePlanningAchievementClicked = (data) => {
    // 无操作，仅保留监听
};

onMounted(() => {
    // 监听备注图例更新
    bus.on('updateRemarkLegend', handleUpdateRemarkLegend);

    // 监听选中的图层名称，过滤图例
    bus.on('layerNamesSelected', handleLayerNamesSelected);

    // 监听图例显隐事件
    bus.on('legend-visibility', handleLegendVisibility);

    // 监听功能面板点击
    bus.on('function-panel-clicked', handleFunctionPanelClicked);

    // 监听方案审查
    bus.on('scheme-review-clicked', handleSchemeReviewClicked);

    // 监听矢量图层
    bus.on('vector-layer-clicked', handleVectorLayerClicked);

    // 监听规划成果
    bus.on('planning-achievement-clicked', handlePlanningAchievementClicked);
})

// ========== 补全所有Bus监听销毁 ==========
onUnmounted(() => {
    // 1. 销毁备注图例更新监听
    bus.off('updateRemarkLegend', handleUpdateRemarkLegend);
    // 2. 销毁选中图层名称监听
    bus.off('layerNamesSelected', handleLayerNamesSelected);
    // 3. 销毁图例显隐监听
    bus.off('legend-visibility', handleLegendVisibility);
    // 4. 销毁功能面板点击监听
    bus.off('function-panel-clicked', handleFunctionPanelClicked);
    // 5. 销毁方案审查监听
    bus.off('scheme-review-clicked', handleSchemeReviewClicked);
    // 6. 销毁矢量图层点击监听
    bus.off('vector-layer-clicked', handleVectorLayerClicked);
    // 7. 销毁规划成果点击监听
    bus.off('planning-achievement-clicked', handlePlanningAchievementClicked);

    // 可选：清理其他可能的定时器/监听（如果有）
    // 例如：如果有手动创建的setTimeout/setInterval，需在此clear
});

// 监听年份变化
watch(currentYear, newYear => {
    console.log("🚀 ~ newYear:", newYear)
    bus.emit('time-change', newYear)
})
</script>

<style lang="scss" scoped>
// 仅保留基础样式，动态属性全部移到JS的computed中
.legend {
    // 清空固定属性，由legendContainerStyle动态绑定覆盖

    .legendBody {
        &::-webkit-scrollbar {
            width: 0.3125vw; // 滚动条宽度
        }

        &::-webkit-scrollbar-thumb {
            background-color: rgba(255, 207, 112, 0.01); // 滚动条滑块透明
            border-radius: 0.15625vw;
        }

        &::-webkit-scrollbar-track {
            background-color: transparent; // 滚动条轨道透明
        }

        .legendTitle {
            display: flex;
            align-items: center;
            margin-bottom: 0.78125vw; // 每个图例项间距

            .legendRect {
                width: 1.6667vw;
                height: 0.833vw;
                margin-right: 0.833vw;
                margin-left: 0.26vw;
            }

            .legendText {
                height: 0.833vw;
                font-family: SourceHanSansCN, SourceHanSansCN;
                font-weight: 400;
                font-size: 0.833vw;
                color: #ffffff;
                line-height: 0.833vw;
                text-align: left;
            }
        }
    }
}

.time-column {
    z-index: 2;
    pointer-events: auto;
    position: absolute;
    left: 50%;
    transform: translateX(-25.52vw);
    bottom: 9.8958vw;
    width: 51.04167vw;
    height: 5.625;
    background: url(../../static/image/bottom/timeLine.png) no-repeat;
    background-size: 100% 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    .leftArrow {
        position: absolute;
        left: 11.25vw;
        top: 1.4583vw;
        width: 0.833vw;
        height: 0.9375vw;
        background: url(../../static/image/bottom/arrow-left.png) no-repeat;
        background-size: 100% 100%;
        cursor: pointer;
    }

    .rightArrow {
        position: absolute;
        right: 11.25vw;
        top: 1.4583vw;
        width: 0.8333vw;
        height: 0.9375vw;
        background: url(../../static/image/bottom/arrow-right.png) no-repeat;
        background-size: 100% 100%;
        cursor: pointer;
    }

    .circle {
        position: absolute;
        width: 0.2083vw;
        height: 0.2083vw;
        top: 1.823vw;
        left: 12.29167vw;
        background: #fff8c7;
        border-radius: 50%;
    }

    .circle1 {
        position: absolute;
        width:0.2083vw;
        height: 0.2083vw;
        top: 1.823vw;
        left: 38.54167vw;
        background: #fff8c7;
        border-radius: 50%;
    }

    .base-line {
        position: absolute;
        width: 25.625vw;
        height: 0.625vw;
        top: 1.875vw;
        left: 12.7083vw;
        background: #847650;
        opacity: 0.4;
    }

    .top-line {
        position: absolute;
        width: 25.625vw;
        height: 0.104167vw;
        top: 1.875vw;
        left: 12.7083vw;
        background: #847650;
    }

    .time-unit {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: relative;
        width: 4.27083vw;
        height: 100%;

        .star-icon-container {
            width: 1.979167vw;
            height: 1.979167vw;
            display: flex;
            justify-content: center;
            align-items: center;

            .star-icon {
                margin: 0;
                width: 0.729167vw;
                height: 0.729167vw;
                background: url(../../static/image/bottom/star-select.png) no-repeat;
                background-size: 100% 100%;
                transition: all 0.3s ease;
                cursor: pointer;
            }

            .star-icon.selected {
                width: 1.979167vw;
                height: 1.979167vw;
                background: url(../../static/image/bottom/star-selected.png) no-repeat;
                background-size: 100% 100%;
                cursor: pointer;
            }
        }

        .year-text {
            margin: 0.26vw 0  0.7vw;
            color: #fff;
            font-family: 'DINPro';
            font-weight: 400;
            font-size: 1.04167vw;
        }

        .year-text.active {
            font-weight: 500;
        }
    }
}
</style>