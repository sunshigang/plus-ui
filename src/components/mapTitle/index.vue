<template>
    <div v-if="draggingStyle" class="beforeConstruction"></div>
    <!-- <div v-if="draggingStyle" class="drag" :style="{ left: dragPosition + '%' }"></div>
    <div v-if="draggingStyle" class="dragIcon" @mousedown="startDrag" :style="{ left: dragPosition + '%' }"></div> -->
    <div v-if="draggingStyle" class="AfterConstruction"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import bus from '../../libs/eventbus';

const dragPosition = ref(50); // 拖动图标当前的left百分比（10%-90%）
const isDragging = ref(false);
const draggingStyle = ref(false);

// ========== 1. 提取所有事件处理函数为命名函数（关键：确保off能精准销毁） ==========
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

// Bus事件：功能面板点击回调（命名函数）
const handleFunctionPanelClicked = (data) => {
    draggingStyle.value = data.index === 1 && data.isSelected;
};

// ========== 2. 挂载/卸载生命周期：完整绑定+精准销毁 ==========
onMounted(() => {
    // Window事件绑定（命名函数）
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseleave', handleMouseUp);

    // Bus事件绑定（命名函数）
    bus.on('function-panel-clicked', handleFunctionPanelClicked);
});

onUnmounted(() => {
    // ========== 核心：精准销毁所有监听 ==========
    // 1. 销毁Window事件（必须传原函数引用）
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
    window.removeEventListener('mouseleave', handleMouseUp);

    // 2. 销毁Bus事件（必须传原函数引用，精准解绑）
    bus.off('function-panel-clicked', handleFunctionPanelClicked);

    // ========== 兜底：清理所有状态/全局变量 ==========
    // 重置响应式状态
    dragPosition.value = 50;
    isDragging.value = false;
    draggingStyle.value = false;

    // 清理window上的自定义属性（避免内存泄漏）
    delete window.dragStartX;
    delete window.dragStartPercent;

    // 兜底：若仍在拖动中，强制结束并重置
    if (isDragging.value) {
        isDragging.value = false;
        bus.emit('dragIcon:screenRatio', 0.5); // 恢复默认比例
    }
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