<template>
    <div class="main">
        <div class="top">
            <div class="titleName">数字方岩三维可视化平台</div>
        </div>
        <div class="bottom"></div>
        <div class="left"></div>
        <div class="right"></div>
        <slot name="main"></slot>
    </div>
</template>

<script>
</script>

<style scoped>
.main {
    width: 100%;
    height: 100vh;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    pointer-events: none;
}

.top {
    width: 100%;
    height: 14.5833vw;
    position: absolute;
    top: 0;
    left: 0;
    background: url(../../static/image/mask/mask_top.png) no-repeat;
    background-size: 100% 100%;
    z-index: 1;
}

.titleName {
    width: 29%;
    height: 2.65625vw;
    position: absolute;
    top: 14%;
    left: 36%;
    font-family: 'PangMenZhenDao';
    font-weight: normal;
    font-size: 2.1875vw;
    color: #FDFFE5;
    text-align: left;
    font-style: normal;
    background: radial-gradient(0deg, #FFFFFF 15%, #F3EFAE 100%);
    line-height: 2.86458vw;
    text-align: center;

}

.bottom {
    width: 100%;
    height: 10.4167vw;
    position: absolute;
    bottom: 0;
    left: 0;
    background: url(../../static/image/mask/mask_bottom.png) no-repeat;
    background-size: 100% 100%;
}

.left {
    width: 18.75vw;
    height: 100vh;
    position: absolute;
    left: 0;
    top: 0;
    background: url(../../static/image/mask/mask_left.png) no-repeat;
    background-size: 100% 100%;
}

.right {
    width: 18.75vw;
    height: 100vh;
    position: absolute;
    top: 0;
    right: 0;
    background: url(../../static/image/mask/mask_right.png) no-repeat;
    background-size: 100% 100%;
}
</style>
