<template>
    <div class="preview-page">
        <!-- iframe 加载状态提示（可选，提升用户体验） -->
        <div v-if="isIframeLoading" class="iframe-loading">加载 3D 模型中...</div>

        <iframe id="iframe" frameborder="0" :src="iframeUrl" style="width: 100%; height: 100%"
            allow="xr-spatial-tracking *" @load="handleIframeLoad" @error="handleIframeError"
            v-show="!isLeaving"></iframe>

        <my-mask>
            <template v-slot:main>
                <top-header></top-header>
                <bottom />
            </template>
        </my-mask>

        <div class="backButton">
            <div class="back-line left-line">
                <div class="dash-line dash1"></div>
                <div class="solid-circle"></div>
                <div class="dash-line dash2"></div>
                <div class="hollow-circle"></div>
                <div class="dash-line dash3"></div>
            </div>
            <div class="backImg" @click="clickBack"></div>
            <div class="back-line right-line">
                <div class="dash-line dash1"></div>
                <div class="solid-circle"></div>
                <div class="dash-line dash2"></div>
                <div class="hollow-circle"></div>
                <div class="dash-line dash3"></div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, onBeforeUnmount } from 'vue'
import bus from '@/libs/eventbus'
import TopHeader from '@/components/TopHeader'
import myMask from '@/components/mask'
import bottom from '@/components/bottom'
import { ElMessage, ElAlert } from 'element-plus'
import { getInfo } from '@/api/project/normal/index'
import { useRouter, useRoute } from 'vue-router'

// 基础配置
const iframeUrl = ref('http://127.0.0.1:46150/') // 改为 ref，方便动态修改（可选）
const router = useRouter()
const route = useRoute()
const projectId = route.query.id
const projectType = route.query.type
console.log("🚀 ~ projectType:", projectType)
const isLeaving = ref(false) // 标记是否正在离开页面（避免 iframe 提前销毁）
const iframeRef = ref(null) // 用 ref 更可靠地获取 iframe 元素

// 响应式状态
const isIframeLoading = ref(true) // iframe 加载状态
const projectMajorFlag = ref(false) // 是否为主要项目（用于返回路由）
const projectThreeDModelOssId = ref('') // 3D 模型 OSS ID（用于删除资源）

// 1. 校验项目ID
if (!projectId) {
    ElMessage.error('缺少项目ID');
    // 无 ID 时跳回上一页（避免空白页）
    setTimeout(() => router.back(), 1500);
}

// 2. 点击返回按钮
const clickBack = () => {
    if (isLeaving.value) return; // 防止重复点击
    isLeaving.value = true; // 标记开始离开
    console.log("🚀 ~ clickBack ~ projectThreeDModelOssId.value:", projectThreeDModelOssId.value)
    const sendFinalMessages = () => {
        // 1. 删除资源
        if (projectThreeDModelOssId.value) {
            sendMsgUE({
                "Command": "DeleteAssets",
                "Args": { "ID": projectThreeDModelOssId.value }
            });
        }
        // 2. 切换相机
        sendMsgUE({
            "Command": "SwitchCamera",
            "Args": { "ID": "Main", "Duration": 1.0 }
        });
    };
    sendFinalMessages();
    // 延迟跳回对应页面
    setTimeout(() => {
        const targetRoute = projectMajorFlag.value
        console.log("🚀 ~ clickBack ~ targetRoute:", targetRoute)
        console.log("🚀 ~ clickBack ~ projectType:", projectType)
        if (targetRoute == true) {
            if (projectType == 'major-add') {
                router.push(`/project/major/major-add/${projectId}`)
            } else if (projectType == 'major-edit') {
                router.push(`/project/major/major-edit/${projectId}`)
            } else if (projectType == 'major-repeatEdit') {
                router.push(`/project/major/major-repeat-edit/${projectId}`)
            } else if (projectType == 'major-share') {
                router.push(`/project/major/major-share/${projectId}`)
            } else {
                router.push(`/project/major/major-view/${projectId}`)
            }
        } else {
            if (projectType == 'normal-add') {
                router.push(`/project/normal/normal-add/${projectId}`)
            } else if (projectType == 'normal-edit') {
                router.push(`/project/normal/normal-edit/${projectId}`)
            } else if (projectType == 'normal-repeatEdit') {
                router.push(`/project/normal/normal-repeat-edit/${projectId}`)
            } else if (projectType == 'normal-share') {
                router.push(`/project/normal/normal-share/${projectId}`)
            } else {
                router.push(`/project/normal/normal-view/${projectId}`)
            }
        }
    }, 1000);
};

// 3. 监听事件总线：切换相机
const handleAttractionClick = (data) => {
    sendMsgUE({
        "Command": "SwitchCamera",
        "Args": { "ID": data, "Duration": 1.0 }
    });
};

// 4. iframe 加载完成
const handleIframeLoad = () => {
    isIframeLoading.value = false;
    // iframe 就绪后，初始化 UE + 加载 3D 模型
    nextTick(() => {
        initUE();
    });
};

// 5. iframe 加载失败
const handleIframeError = () => {
    isIframeLoading.value = false;
    ElMessage.error('3D 模型页面加载失败，请检查服务是否运行');
};

// 6. 初始化 UE 场景
const initUE = () => {
    setTimeout(() => loadThreeDModel(), 2000);
};

// 7. 加载 3D 模型（解析接口数据）
const loadThreeDModel = async () => {
    if (!projectId || isLeaving.value) return;
    try {
        // 异步请求：必须加 await
        const response = await getInfo(projectId);
        const projectData = response.data;

        // 赋值基础数据
        projectMajorFlag.value = projectData.majorFlag || false;

        // 解析 3D 模型数据（兼容 JSON 字符串）
        let threeDModel = projectData.threeDModel;
        if (typeof threeDModel === 'string') {
            threeDModel = JSON.parse(threeDModel); // 安全解析
        }

        // 校验模型数据格式
        if (!Array.isArray(threeDModel) || threeDModel.length === 0) {
            ElMessage.warning('未找到 3D 模型数据');
            return;
        }

        const model = threeDModel[0];
        projectThreeDModelOssId.value = model.ossId || '';
        let modelUrl = model.url;
        if (modelUrl) {
            modelUrl = modelUrl.replace(/^https?:\/\/[^\/]+\/fangyan\//, '');
        }
        const modelLocation = projectData.modelCoordinate || "120.187549,28.924376,110,0"
        const coords = modelLocation.split(',').map(coord => {
            const num = parseFloat(coord.trim());
            return isNaN(num) ? 0 : num.toFixed(6);
        });
        const [x, y, z, angle] = coords;

        sendMsgUE({
            "Command": "SetCameraMove_Geo",
            "Args": {
                "CoordType": 0,
                "TargetLocation": `X=${x} Y=${y} Z=${z}`,
                "CameraLocation": `X=${x} Y=${y} Z=15000.000`,
                "Duration": 1.0
            }
        });
        sendMsgUE({
            "Command": "PingPongMsg",
            "Args": {
                "Type": "Ping"
            }
        });
        // sendMsgUE({
        //     "Command": "DeleteAssets",
        //     "Args": { "ID": projectThreeDModelOssId.value }
        // });
        sendMsgUE({
            "Command": "LoadAssets", // 假设 UE 有加载资源的命令，需与 UE 端约定
            "Args": {
                "ID": model.ossId,
                "Name": modelUrl,
                "State": 0,
                "Angle": angle,
                "CoordType": 0,
                "Location": `${x},${y},${z}`,
                "Scale": "1,1,1",
                "OffsetVec": "X=0.0 Y=0.0 Z=550.000"
            }
        });
        sendMsgUE({
            "Command": "GetAllAssets",
        });
    } catch (err) {
        ElMessage.error(`数据获取失败：${err.message || '未知错误'}`);
        console.error('加载 3D 模型异常：', err);
    }
};

// 8. 向 UE 发送消息（安全版）
const sendMsgUE = (data) => {
    try {
        const iframe = iframeRef.value || document.getElementById('iframe');
        if (iframe && iframe.contentWindow) {
            // 明确目标源：避免 * 带来的安全风险
            iframe.contentWindow.postMessage(data, "*");
        } else {
            console.warn('UE 页面未就绪，消息发送失败');
        }
    } catch (err) {
        console.error('发送消息到 UE 失败：', err);
    }
};
const handleUEMessage = (e) => {
    if (e.origin !== 'http://127.0.0.1:46150' && e.origin !== 'http://localhost') return;
    console.log('收到 UE 回执：', e.data);
};
// 9. 生命周期：挂载时绑定事件总线
onMounted(() => {
    window.addEventListener('message', handleUEMessage);
    bus.on('attraction-body-clicked', handleAttractionClick);
});

// 10. 生命周期：卸载时清理资源（关键！）
onUnmounted(() => {
    window.removeEventListener('message', handleUEMessage);
    bus.off('attraction-body-clicked', handleAttractionClick);
    isLeaving.value = false;
});
</script>

<style lang="scss" scoped>
.preview-page {
    width: 100%;
    height: 99.8vh;
    background: url('../../../static/image/map/map.png') no-repeat;
    background-size: 100% 100%;
    position: relative;
    overflow: hidden; // 避免滚动条
}

// iframe 加载状态样式
.iframe-loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 18px;
    color: #ffd700;
    z-index: 999;
    background: rgba(0, 0, 0, 0.5);
    padding: 16px 32px;
    border-radius: 8px;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

.backButton {
    z-index: 2;
    pointer-events: auto;
    position: absolute;
    left: 50%;
    transform: translateX(-180px);
    bottom: 40px;
    width: 360px;
    height: 99px;
    display: flex;
    justify-content: center;
    align-content: center;

    .back-line {
        display: flex;
        align-items: center;
        height: 100%;
    }

    .left-line {
        flex-direction: row-reverse;
        margin-right: 60px;

        .dash-line {
            background: repeating-linear-gradient(to right, #ffd700, #ffd700 2px, transparent 2px, transparent 3px);
            height: 1px;
        }

        .solid-circle {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background-color: #ffd700;
            margin: 0 3px;
        }

        .hollow-circle {
            width: 13px;
            height: 13px;
            border-radius: 50%;
            border: 2px solid #ffd700;
            background-color: transparent;
            margin: 0 3px;
        }

        .dash1 {
            width: 22px;
        }

        .dash2 {
            width: 29px;
        }

        .dash3 {
            width: 52px;
        }
    }

    .right-line {
        flex-direction: row;
        margin-left: 10px;

        .dash-line {
            background: repeating-linear-gradient(to right, #ffd700, #ffd700 2px, transparent 2px, transparent 3px);
            height: 1px;
        }

        .solid-circle {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background-color: #ffd700;
            margin: 0 3px;
        }

        .hollow-circle {
            width: 13px;
            height: 13px;
            border-radius: 50%;
            border: 2px solid #ffd700;
            background-color: transparent;
            margin: 0 3px;
        }

        .dash1 {
            width: 22px;
        }

        .dash2 {
            width: 29px;
        }

        .dash3 {
            width: 52px;
        }
    }

    .backImg {
        position: absolute;
        width: 101px;
        height: 99px;
        background: url('../static/image/bottom/back1.png') no-repeat;
        background-size: 100% 100%;
        cursor: pointer;
        // 增加hover效果（可选）
        transition: transform 0.2s;

        &:hover {
            transform: scale(1.05);
        }
    }
}
</style>