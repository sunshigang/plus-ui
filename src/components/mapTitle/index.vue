<template>
    <div class="mapImg">
        <div class="beforeConstruction"></div>
        <!-- 保持 left 绑定逻辑不变 -->
        <!-- <div class="drag" :style="{ left: dragPosition + '%' }"></div>
        <div class="dragIcon" @mousedown="startDrag" :style="{ left: dragPosition + '%' }"></div> -->
        <div class="AfterConstruction"></div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const dragPosition = ref(50)
const isDragging = ref(false)

// 开始拖动：新增记录初始位置，避免拖动起点偏移
const startDrag = e => {
    isDragging.value = true
    e.preventDefault()
    // 可选：记录拖动开始时的鼠标X坐标与当前dragPosition的偏差（优化精准度）
    window.dragStartX = e.clientX
    window.dragStartPercent = dragPosition.value
}

// 处理拖动：优化坐标计算，避免百分比精度丢失
const handleMouseMove = e => {
    if (!isDragging.value) return

    const screenWidth = window.innerWidth
    // 方案1：直接计算鼠标占比（基础版）
    let percentage = (e.clientX / screenWidth) * 100

    // 方案2（可选优化）：基于初始位置计算偏移，减少抖动
    // const offsetX = e.clientX - window.dragStartX
    // const offsetPercent = (offsetX / screenWidth) * 100
    // let percentage = window.dragStartPercent + offsetPercent

    // 边界限制 + 保留1位小数（避免频繁更新导致的性能损耗）
    percentage = Math.max(10, Math.min(90, Math.round(percentage * 10) / 10))
    dragPosition.value = percentage
}

const handleMouseUp = () => {
    isDragging.value = true
    // 清除临时变量
    delete window.dragStartX
    delete window.dragStartPercent
}

// 监听事件：确保事件绑定/解绑完整
onMounted(() => {
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    // 补充监听mouseleave（防止鼠标移出窗口后仍处于拖动状态）
    window.addEventListener('mouseleave', handleMouseUp)
})

onUnmounted(() => {
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('mouseup', handleMouseUp)
    window.removeEventListener('mouseleave', handleMouseUp)
})
</script>

<style lang="scss" scoped>
.mapImg {
    pointer-events: auto;
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: -1;
    background: url(../../static/image/map/map.png) no-repeat;
    background-size: cover;

    .beforeConstruction,
    .AfterConstruction {
        pointer-events: auto;
        position: absolute;
        width: 37.5rem;
        height: 5.9rem;
        z-index: 2;
        background-size: 100% 100%;
        top: 20%;
        transform: translateX(-50%);
    }
    .beforeConstruction {
        background: url(../../static/image/map/beforeConstruction.png) no-repeat;
        left: 25%;
    }
    .AfterConstruction {
        background: url(../../static/image/map/AfterConstruction.png) no-repeat;
        left: 75%;
    }

    .drag {
        pointer-events: auto;
        position: absolute;
        width: 0.2rem;
        height: 90%;
        background: #ffffff;
        top: 0%;
        /* 关键：移除 transition 过渡，消除滞后 */
        /* transition: left 0.1s ease; */
    }

    .dragIcon {
        pointer-events: auto;
        position: absolute;
        width: 3.8rem;
        height: 3.8rem;
        background: url(../../static/image/map/drag-icon.png) no-repeat;
        background-size: cover;
        top: 50%;
        transform: translate(-50%, -50%);
        cursor: ew-resize;
        z-index: 3;
        /* 可选：添加鼠标按下时的视觉反馈 */
        &:active {
            transform: translate(-50%, -50%) scale(1.05);
        }
    }
}
</style>
