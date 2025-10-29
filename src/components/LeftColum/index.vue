<template>
    <div id="leftSidebar">
        <div class="leftLine"></div>
        <div :class="schemeReviewStyle == true ? 'schemeReviewSelected' : 'schemeReviewSelect'"
            @click="clickSchemeReview" v-hasPermi="['screen:function:review']">
            <div class="schemeReviewFont">方案审查</div>
        </div>
        <div class="leftLine1" v-hasPermi="['screen:function:review']"></div>
        <div :class="planningAchievementStyle == true ? 'planningAchievementSelected' : 'planningAchievementSelect'"
            @click="clickPlanningAchievement" v-hasPermi="['screen:function:achievement']">
            <div class="planningAchievementsFont">规划成果</div>
        </div>
        <div class="leftLine1" v-hasPermi="['screen:function:achievement']"></div>
        <div :class="vectorLayerStyle == true ? 'planningAchievementSelected' : 'planningAchievementSelect'"
            @click="clickVectorLayer" v-hasPermi="['screen:function:vector']">
            <div class="planningAchievementsFont">矢量图层</div>
        </div>
        <div class="lanternEar"></div>
    </div>
    <div class="searchBox" v-hasPermi="['screen:function:achievement']" v-if="planningAchievementStyle">
        <input v-model="searchInput" class="search-input" placeholder="请输入搜索内容" />
        <!-- 新增：右侧搜索按钮 -->
        <div class="search-btn" @click="handleSearch">搜索</div>
    </div>

</template>

<script setup>
import { reactive, toRefs, onMounted, getCurrentInstance, ref, computed } from 'vue'
import bus from '../../libs/eventbus'
// import { getRelicInfoById, getRelicInfoPage } from "../../api/map"

const { proxy } = getCurrentInstance()
// 定义响应式数据
const searchInput = ref('')
const schemeReviewStyle = ref(false)
const planningAchievementStyle = ref(false)
const vectorLayerStyle = ref(false)
const clickSchemeReview = () => {
    // 切换方案审查样式
    schemeReviewStyle.value = !schemeReviewStyle.value
    planningAchievementStyle.value = false
    vectorLayerStyle.value = false
    // 触发事件总线，通知其他组件
    bus.emit('scheme-review-clicked', schemeReviewStyle.value)
    // 可扩展：调用接口获取方案数据，更新地图等
    // getRelicInfoPage().then(response => {
    //     console.log('获取方案数据成功', response)
    // })
}
const clickPlanningAchievement = () => {
    // 切换规划成果样式
    schemeReviewStyle.value = false
    planningAchievementStyle.value = !planningAchievementStyle.value
    vectorLayerStyle.value = false
    // 触发事件总线，通知其他组件
    bus.emit('planning-achievement-clicked', planningAchievementStyle.value)
    if (planningAchievementStyle.value == false) {
        searchInput.value = ''
    }
}
const clickVectorLayer = () => {
    // 切换矢量图层样式
    schemeReviewStyle.value = false
    planningAchievementStyle.value = false
    vectorLayerStyle.value = !vectorLayerStyle.value
    // 触发事件总线，通知其他组件
    bus.emit('vector-layer-clicked', vectorLayerStyle.value)
}

// 新增：搜索按钮点击事件
const handleSearch = () => {
    console.log('搜索内容：', searchInput.value)
    bus.emit('search-relic', searchInput.value)
}

onMounted(() => { })
</script>

<style lang="scss" scoped>
#leftSidebar {
    pointer-events: auto;
    position: absolute;
    width: 7.3rem;
    height: 86.5vh;
    top: 6.5%;
    left: 6.875%;
    z-index: 2;
    display: flex;
    flex-direction: column;

    .leftLine {
        width: 0.1rem;
        height: 12rem;
        background: repeating-linear-gradient(to bottom, transparent 0, transparent 0.4rem, #fad126 0.4rem, #fad126 0.5rem);
        margin: 0 auto;
        /* 相对定位，给伪元素做参考 */
        position: relative;
    }

    /* 明亮点：用伪元素实现，定位到四分之三处 */
    .leftLine::after {
        content: '';
        position: absolute;
        /* 四分之三高度 = 8.5rem * 0.75 = 6.375rem（根据实际高度调整） */
        top: calc(12rem * 0.75);
        left: 50%;
        transform: translateX(-50%);
        width: 0.6rem;
        /* 亮点宽度，可调整 */
        height: 0.6rem;
        /* 亮点高度，可调整 */
        border-radius: 50%;
        /* 圆形 */
        /* 渐变亮点，模拟发光效果 */
        background: radial-gradient(circle, #fff99d 0%, #fad126 100%);
        /* 可选：加光晕增强视觉 */
        box-shadow: 0 0 0.4rem rgba(250, 209, 38, 0.8);
    }

    .schemeReviewSelected {
        width: 7.3rem;
        height: 19rem;
        background: url(../../static/image/left/scheme-selected.png) no-repeat;
        background-size: 100% 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #ffffff;
        font-family: 'xianglifang';
        font-weight: 400;
        font-size: 2.4rem;
        cursor: pointer;

        .schemeReviewFont {
            width: 3.2rem;
            height: 12.3rem;
            display: flex;
            justify-content: center;
            /* 水平居中（竖排时为左右居中） */
            align-items: center;
            /* 垂直居中（竖排时为上下居中） */
            /* 核心属性：竖排文字 */
            writing-mode: vertical-lr;
            /* 文字竖直排列，从左到右方向 */
            text-orientation: upright;
            /* 确保文字正向显示（不旋转） */
            /* 控制两字之间的间距为0.2rem */
            letter-spacing: 0.4rem;
        }
    }

    .schemeReviewSelect {
        cursor: pointer;
        width: 7.3rem;
        height: 19rem;
        background: url(../../static/image/left/scheme-select.png) no-repeat;
        background-size: 100% 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #7a4a28;
        font-family: 'xianglifang';
        font-weight: 400;
        font-size: 2.4rem;

        .schemeReviewFont {
            width: 3.2rem;
            height: 12.3rem;
            display: flex;
            justify-content: center;
            /* 水平居中（竖排时为左右居中） */
            align-items: center;
            /* 垂直居中（竖排时为上下居中） */
            /* 核心属性：竖排文字 */
            writing-mode: vertical-lr;
            /* 文字竖直排列，从左到右方向 */
            text-orientation: upright;
            /* 确保文字正向显示（不旋转） */
            /* 控制两字之间的间距为0.2rem */
            letter-spacing: 0.4rem;
        }
    }

    .leftLine1 {
        width: 0.1rem;
        height: 9rem;
        background: repeating-linear-gradient(to bottom, transparent 0, transparent 0.4rem, #fad126 0.4rem, #fad126 0.5rem);
        margin: 0 auto;
        /* 相对定位，给伪元素做参考 */
        position: relative;
    }

    /* 明亮点：用伪元素实现，定位到四分之三处 */
    .leftLine1::after {
        content: '';
        position: absolute;
        /* 四分之三高度 = 8.5rem * 0.75 = 6.375rem（根据实际高度调整） */
        top: calc(9rem * 0.5);
        left: 50%;
        transform: translateX(-50%);
        width: 0.6rem;
        /* 亮点宽度，可调整 */
        height: 0.6rem;
        /* 亮点高度，可调整 */
        border-radius: 50%;
        /* 圆形 */
        /* 渐变亮点，模拟发光效果 */
        background: radial-gradient(circle, #fff99d 0%, #fad126 100%);
        /* 可选：加光晕增强视觉 */
        box-shadow: 0 0 0.4rem rgba(250, 209, 38, 0.8);
    }

    .planningAchievementSelect {
        width: 7.3rem;
        height: 19rem;
        background: url(../../static/image/left/scheme-select.png) no-repeat;
        background-size: 100% 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #7a4a28;
        font-family: 'xianglifang';
        font-weight: 400;
        font-size: 2.4rem;
        cursor: pointer;

        .planningAchievementsFont {
            width: 3.2rem;
            height: 12.3rem;
            display: flex;
            justify-content: center;
            /* 水平居中（竖排时为左右居中） */
            align-items: center;
            /* 垂直居中（竖排时为上下居中） */
            /* 核心属性：竖排文字 */
            writing-mode: vertical-lr;
            /* 文字竖直排列，从左到右方向 */
            text-orientation: upright;
            /* 确保文字正向显示（不旋转） */
            /* 控制两字之间的间距为0.2rem */
            letter-spacing: 0.4rem;
        }
    }

    .planningAchievementSelected {
        width: 7.3rem;
        height: 19rem;
        background: url(../../static/image/left/scheme-selected.png) no-repeat;
        background-size: 100% 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #ffffff;
        font-family: 'xianglifang';
        font-weight: 400;
        font-size: 2.4rem;
        cursor: pointer;

        .planningAchievementsFont {
            width: 3.2rem;
            height: 12.3rem;
            display: flex;
            justify-content: center;
            /* 水平居中（竖排时为左右居中） */
            align-items: center;
            /* 垂直居中（竖排时为上下居中） */
            /* 核心属性：竖排文字 */
            writing-mode: vertical-lr;
            /* 文字竖直排列，从左到右方向 */
            text-orientation: upright;
            /* 确保文字正向显示（不旋转） */
            /* 控制两字之间的间距为0.2rem */
            letter-spacing: 0.4rem;
        }
    }

    .lanternEar {
        width: 2.8rem;
        height: 12.1rem;
        background: url(../../static/image/left/lantern-ear.png) no-repeat;
        background-size: 100% 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        /* 核心调整：与上方元素间距为0 */
        margin-top: 0;
        /* 核心调整：在剩余空间中垂直居中，同时水平居中 */
        margin-bottom: auto;
        margin-left: auto;
        margin-right: auto;
    }
}

.searchBox {
    pointer-events: auto;
    position: absolute;
    width: 25.7rem;
    height: 6.8rem;
    top: 17.78%;
    left: 12.08%;
    background: url(../../static/image/left/search.png) no-repeat;
    background-size: cover;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    z-index: 2;

    /* 输入框样式 */
    .search-input {
        flex: 1;
        /* 占满剩余空间 */
        height: 60%;
        margin-left: 3rem;
        /* 与左侧背景图间距 */
        padding: 0 0.5rem;
        border: none;
        outline: none;
        background: transparent;
        /* 透明背景，贴合搜索框底图 */
        color: #584424;
        /* 文字白色，适配背景 */
        font-size: 1.6rem;
        font-family: 'SourceHanSansCN-Regular';
        width: 10rem;
        // background-color: red;
    }

    /* 搜索按钮样式 */
    .search-btn {
        width: 6rem;
        height: 60%;
        margin-right: 0.3rem;
        /* 与右侧间距 */
        border-radius: 0.3rem;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #a57223;
        font-size: 2rem;
        font-weight: 400;
        font-family: 'xianglifang';
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
            color: #fff;
        }
    }
}

.sceneRoaming {
    pointer-events: auto;
    position: absolute;
    width: 8.6rem;
    height: 8.7rem;
    top: 85.28%;
    left: 6.25%;
    background: url(../../static/image/left/sceneRoaming.png) no-repeat;
    background-size: cover;
    z-index: 2;
    cursor: pointer;
}
</style>
