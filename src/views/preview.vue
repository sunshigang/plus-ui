<template>
    <div class="preview-page">
        <iframe id="iframe" ref="iframeRef" frameborder="0" :src="iframeUrl" style="width: 100%; height: 100%"
            allow="xr-spatial-tracking *" @load="handleIframeLoad"></iframe>
        <my-mask>
            <template v-slot:main>
                <top-header></top-header>
                <bottom />
            </template>
        </my-mask>
        <div class="loading-mask" v-if="loading">
            <div class="loading-content">
                <div class="loading-spinner"></div>
                <div class="loading-text">三维模型正在加载中，请稍后...</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import bus from '@/libs/eventbus'
import TopHeader from '@/components/TopHeader'
import myMask from '@/components/mask'
import bottom from '@/components/bottom'

const iframeUrl = "http://127.0.0.1:46150/";
const iframeRef = ref(null);
const isIframeLoaded = ref(false);
const loading = ref(false);
const modelPreviewData = ref(null); // 存储模型预览数据
const isUeReceivedFirstMsg = ref(false);
// iframe加载完成后标记状态
const handleIframeLoad = () => {
    isIframeLoaded.value = true;
    console.log('iframe加载完成，可发送消息');

    // 若iframe加载前已收到模型数据，立即执行加载
    if (modelPreviewData.value) {
        loadModel(modelPreviewData.value);
    }
};
/* 三维协议消息发送 */
const sendMsgUE = (data) => {
    if (!iframeRef.value || !isIframeLoaded.value) {
        console.warn('iframe尚未加载或已被移除，无法发送消息', data);
        return;
    }
    try {
        iframeRef.value.contentWindow.postMessage(data, "*");
    } catch (error) {
        console.error('发送iframe消息失败（可能是跨域问题）', error, data);
    }
};
// 新增：监听UE发送给Web的消息（关键：接收OnLoadAssets回调）
const listenUEMessage = (event) => {
    const ueMsg = event.data;
    console.log('收到UE消息：', ueMsg);
    if (!isUeReceivedFirstMsg.value && ueMsg.Command) {
        isUeReceivedFirstMsg.value = true;
        loading.value = true;
        console.log('UE开始接收消息，开启loading提示');
    }

    // 生成成功/ID有重复，关闭loading
    if (ueMsg.Command === 'OnLoadAssets' && (ueMsg.Args?.State === '文件下载成功' || ueMsg.Args?.State === 'ID有重复')) {
        loading.value = false;
        console.log(`收到${ueMsg.Command}（状态：${ueMsg.Args.State}），关闭loading提示`);
    }
};
// 模型加载核心逻辑
const loadModel = (data) => {
    const coords = data.modelCoordinate.split(',');
    const x = parseFloat(coords[0]).toFixed(6);
    const y = parseFloat(coords[1]).toFixed(6);
    const z = '0.000';
    const z1 = (15000).toFixed(3);
    const url = data.threeDModel;
    const path = url.replace(/^https?:\/\/[^\/]+\//, '');
    const result = path.replace(/^fangyan\//, '');
    console.log("🚀 ~ 模型路径:", result);
    setTimeout(() => {
        sendMsgUE({
            "Command": "SetCameraMove_Geo",
            "Args": {
                "CoordType": 0,
                "TargetLocation": `X=${x} Y=${y} Z=${z}`,
                "CameraLocation": `X=${x} Y=${y} Z=${z1}`,
                "Duration": 1.0
            }
        });
        // 加载模型
        sendMsgUE({
            "Command": "LoadAssets",
            "Args": {
                "ID": data.id,
                "Name": result,
                "State": 0,
                "Angle": 0,
                "CoordType": 0,
                "Location": data.modelCoordinate,
                "Scale": "1,1,1"
            }
        });

        // sendMsgUE({ "Command": "GetAllAssets" });
        // sendMsgUE({
        //     "Command": "DeleteAssets",
        //     "Args": {
        //         "ID": data.id
        //     }
        // });
    }, 2000);
};
onMounted(() => {
    window.addEventListener('message', listenUEMessage);
    bus.on('attraction-body-clicked', data => {
        sendMsgUE({
            "Command": "SwitchCamera",
            "Args": {
                "ID": data,
                "Duration": 1.0
            }
        });
    });
    // 监听模型预览事件
    bus.on('previewModel', (data) => {
        console.log('收到模型预览数据：', data);
        modelPreviewData.value = data;

        // 若iframe已加载完成，直接执行加载；否则等待iframe加载完成后执行
        if (isIframeLoaded.value) {
            loadModel(data);
        } else {
            console.log('iframe未加载完成，等待加载后执行模型加载');
        }
    });



});

// 3. 单独定义onUnmounted，统一解绑所有事件（符合Vue规范）
onUnmounted(() => {
    bus.off('previewModel');
    bus.off('attraction-body-clicked');
    window.removeEventListener('message', listenUEMessage);
});

</script>
<style lang="scss" scoped>
.preview-page {
    width: 100%;
    height: 99.8vh;
    background: url(../../../static/image/map/map.png) no-repeat;
    background-size: 100% 100%;
    position: relative;
}

.loading-mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
}

// 加载内容容器
.loading-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
}

// 加载动画（原生CSS实现，无需图标）
.loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid rgba(255, 255, 255, 0.2);
    border-top: 4px solid #ffffff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

// 加载文字
.loading-text {
    color: #ffffff;
    font-size: 16px;
    font-weight: 500;
}

// 旋转动画
@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>
