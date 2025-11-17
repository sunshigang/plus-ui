<template>
    <div v-if="draggingStyle" class="beforeConstruction"></div>
    <div v-if="draggingStyle" class="drag" :style="{ left: dragPosition + '%' }"></div>
    <div v-if="draggingStyle" class="dragIcon" @mousedown="startDrag" :style="{ left: dragPosition + '%' }"></div>
    <div v-if="draggingStyle" class="AfterConstruction"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import bus from '../../libs/eventbus';

const dragPosition = ref(50); // 拖动图标当前的left百分比（10%-90%）
const isDragging = ref(false);
const draggingStyle = ref(false);

// 开始拖动：记录初始位置
const startDrag = (e) => {
    e.preventDefault();
    isDragging.value = true;
    window.dragStartX = e.clientX;
    window.dragStartPercent = dragPosition.value;
};

// 处理拖动：实时更新位置（不发送数据，避免频繁触发）
const handleMouseMove = (e) => {
    if (!isDragging.value) return;

    const screenWidth = window.innerWidth;
    const offsetX = e.clientX - window.dragStartX;
    const offsetPercent = (offsetX / screenWidth) * 100;
    let percentage = window.dragStartPercent + offsetPercent;

    // 边界限制 + 保留1位小数
    percentage = Math.max(10, Math.min(90, Math.round(percentage * 10) / 10));
    dragPosition.value = percentage;
};

// 结束拖动：计算最终比例并通过bus发送
const handleMouseUp = () => {
    if (isDragging.value) {
        // 核心：计算拖动图标最终位置占屏幕的比例（已是百分比，直接转小数）
        const dragIconScreenRatio = dragPosition.value / 100;
        // 通过bus发送比例，命名建议带标识，避免与其他事件冲突
        bus.emit('dragIcon:screenRatio', dragIconScreenRatio);
        console.log('拖动结束，图标屏幕比例：', dragIconScreenRatio); // 调试用

        // 重置拖动状态
        isDragging.value = false;
        delete window.dragStartX;
        delete window.dragStartPercent;
    }
};

// 监听事件与清理
onMounted(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseleave', handleMouseUp);

    bus.on('function-panel-clicked', (data) => {
        draggingStyle.value = data.index === 1 && data.isSelected;
    });
});

onUnmounted(() => {
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
    window.removeEventListener('mouseleave', handleMouseUp);
    bus.off('function-panel-clicked');
});
</script>

<style lang="scss" scoped>
/* 样式保持不变 */
.beforeConstruction {
    pointer-events: auto;
    position: absolute;
    width: 375px;
    height: 59px;
    z-index: 2;
    background-size: 100% 100%;
    top: 20%;
    transform: translateX(-50%);
    background: url(../../static/image/map/beforeConstruction.png) no-repeat;
    left: 25%;
}

.AfterConstruction {
    pointer-events: auto;
    position: absolute;
    width: 375px;
    height: 59px;
    z-index: 2;
    background-size: 100% 100%;
    top: 20%;
    transform: translateX(-50%);
    background: url(../../static/image/map/AfterConstruction.png) no-repeat;
    left: 75%;
}

.drag {
    pointer-events: auto;
    position: absolute;
    width: 2px;
    height: 90%;
    background: #ffffff;
    top: 0%;
}

.dragIcon {
    pointer-events: auto;
    position: absolute;
    width: 38px;
    height: 38px;
    background: url(../../static/image/map/drag-icon.png) no-repeat;
    background-size: cover;
    top: 50%;
    transform: translate(-50%, -50%);
    cursor: ew-resize;
    z-index: 3;

    &:active {
        transform: translate(-50%, -50%) scale(1.05);
    }
}
</style>