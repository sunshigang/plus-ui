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
import { ref, onMounted, onUnmounted } from 'vue'
import bus from '@/libs/eventbus'
import TopHeader from '@/components/TopHeader'
import myMask from '@/components/mask'
import bottom from '@/components/bottom'
import { ElMessage, ElAlert } from 'element-plus'
import { getInfo } from '@/api/project/normal/index';
import { useRouter, useRoute } from 'vue-router'

const iframeUrl = "http://127.0.0.1:46150/";
const iframeRef = ref(null);
const isIframeLoaded = ref(false);
const isUeReceivedFirstMsg = ref(false);
const router = useRouter()
const route = useRoute()

const projectIdCheck = ref('')
const projectmMdelCoordinate = ref('')
const projectMajorFlag = ref(false)
const projectThreeDModelUrl = ref('')
const projectThreeDModelOssId = ref('')
const allowLoadModel = ref(true)
const hasLoadedModel = ref(false)

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

// 监听UE发送给Web的消息
const listenUEMessage = (event) => {
    const ueMsg = event.data;
    console.log('收到UE消息：', ueMsg);

    if (!isUeReceivedFirstMsg.value && ueMsg.Command) {
        isUeReceivedFirstMsg.value = true;
    }

    if (ueMsg.Command === 'OnLoadAssets' && ueMsg.Args?.State) {
        const state = ueMsg.Args.State;
        console.log('模型加载状态：', state);

        // 修复1：在消息监听时实时解析坐标（确保数据已赋值）
        const coords = projectmMdelCoordinate.value
            ? projectmMdelCoordinate.value.split(',').map(coord => {
                const num = parseFloat(coord.trim());
                return isNaN(num) ? 0 : num.toFixed(6);
            })
            : [0, 0, 0, 0];
        const [x, y, z, angle = 0] = coords;

        // 根据不同状态处理
        switch (state) {
            case '模型下载成功':
                ElMessage.success(`State：${state}`);
                if (allowLoadModel.value && !hasLoadedModel.value) {
                    hasLoadedModel.value = true;
                    console.log('开始执行模型加载逻辑');
                }
                break;
            case '文件状态:false':
                if (ueMsg.Args?.Msg?.includes('找不到该路径文件')) {
                    ElMessage.error('State：minio找不到该路径文件');
                } else if (ueMsg.Args?.Msg?.includes('找到该路径文件')) {
                    ElMessage.warning('State：minio找到该路径文件（文件状态为false）');
                } else {
                    ElMessage.warning(`State：${state}`);
                }
                allowLoadModel.value = false;
                break;
            case '文件下载失败':
                ElMessage.error(`State：${state}`);
                allowLoadModel.value = false;
                break;
            case '文件挂载失败':
                ElMessage.error(`State：${state}（pak的文件资产有问题）`);
                allowLoadModel.value = false;
                break;
            case '生成成功':
                ElMessage.success(`State：${state}（正常加载）`);
                if (allowLoadModel.value && !hasLoadedModel.value) {
                    hasLoadedModel.value = true;
                    console.log('模型生成成功，执行后续初始化');
                }
                break;
            case 'ID有重复':
                ElMessage.warning(`State：${state}`);
                allowLoadModel.value = false;
                sendMsgUE({
                    "Command": "SetCameraMove_Geo",
                    "Args": {
                        "CoordType": 0,
                        "TargetLocation": `X=${x} Y=${y} Z=${z}`,
                        "CameraLocation": `X=${x} Y=${y} Z=10000.000`,
                        "Duration": 1.0
                    }
                });
                break;
            default:
                ElMessage.info(`State：${state}（未定义状态）`);
                break;
        }
    }
};

// 处理模型路径（去除域名和前缀）
const loadModel = () => {
    // 修复2：在loadModel内实时解析坐标（确保数据已就绪）
    const coords = projectmMdelCoordinate.value.split(',').map(coord => {
        const num = parseFloat(coord.trim());
        return isNaN(num) ? 0 : num.toFixed(6);
    });
    const [x, y, z, angle = 0] = coords;

    // 验证必要数据
    if (!projectIdCheck.value || !projectThreeDModelUrl.value || !projectmMdelCoordinate.value) {
        ElMessage.error('模型数据不完整，无法加载');
        return;
    }
    if (!allowLoadModel.value) {
        ElMessage.warning('当前状态不允许加载模型，请检查文件状态');
        return;
    }

    try {
        // 设置相机位置
        sendMsgUE({
            "Command": "SetCameraMove_Geo",
            "Args": {
                "CoordType": 0,
                "TargetLocation": `X=${x} Y=${y} Z=${z}`,
                "CameraLocation": `X=${x} Y=${y} Z=1000.000`,
                "Duration": 1.0
            }
        });

        // 加载模型
        setTimeout(() => {
            if (allowLoadModel.value && !hasLoadedModel.value) {
                sendMsgUE({
                    "Command": "LoadAssets",
                    "Args": {
                        "ID": projectThreeDModelOssId.value,
                        // 修复3：Ref变量通过.value访问原始字符串，才能调用replace
                        "Name": projectThreeDModelUrl.value.replace(/^https?:\/\/[^\/]+\/fangyan\//, ''),
                        "State": 0,
                        "Angle": angle,
                        "CoordType": 0,
                        "Location": `${x},${y},${z}`,
                        "Scale": "1,1,1"
                    }
                });
            } else if (hasLoadedModel.value) {
                console.log('模型已加载，无需重复发送LoadAssets命令');
            } else {
                console.log('当前状态不允许加载模型，取消发送LoadAssets命令');
            }
        }, 2000);
    } catch (error) {
        console.error('模型加载失败', error);
        ElMessage.error('模型加载失败，请重试');
    }
};

// iframe加载完成后执行
const handleIframeLoad = () => {
    isIframeLoaded.value = true;
    console.log('iframe加载完成');
    if (projectThreeDModelUrl.value && projectmMdelCoordinate.value) {
        loadModel();
    }
};

// 返回按钮逻辑
const clickBack = () => {
    sendMsgUE({
        "Command": "SwitchCamera",
        "Args": {
            "ID": "Main",
            "Duration": 1.0
        }
    });
    sendMsgUE({
        "Command": "DeleteAssets",
        "Args": {
            "ID": projectThreeDModelOssId.value,
        }
    });
    setTimeout(() => {
        if (projectMajorFlag.value === false) {
            router.push(`/project/normal/normal-view/${projectIdCheck.value}`)
        } else if (projectMajorFlag.value === true) {
            router.push(`/project/major/major-view/${projectIdCheck.value}`)
        }
    }, 1000);
};
window.addEventListener('message', listenUEMessage);
// 初始化加载数据
onMounted(async () => {
    const projectId = route.query.id;
    if (!projectId) {
        ElMessage.error('缺少项目ID');
        return;
    }

    try {
        const response = await getInfo(projectId);
        const projectData = response.data;
        // 赋值响应式变量
        projectIdCheck.value = projectData.id;
        projectmMdelCoordinate.value = projectData.modelCoordinate;
        projectMajorFlag.value = projectData.majorFlag;

        // 解析三维模型数据（兼容JSON格式）
        const projectDataModel = JSON.parse(projectData.threeDModel);
        projectThreeDModelUrl.value = projectDataModel[0].url;
        projectThreeDModelOssId.value = projectDataModel[0].ossId;

        // 若iframe已加载完成，立即触发模型加载
        if (isIframeLoaded.value) {
            loadModel();
        }
    } catch (err) {
        ElMessage.error('数据获取失败：' + (err.message || '未知错误'));
    }

    // 绑定事件监听

    bus.on('attraction-body-clicked', data => {
        sendMsgUE({
            "Command": "SwitchCamera",
            "Args": { "ID": data, "Duration": 1.0 }
        });
    });
});

// 清理资源
onUnmounted(() => {
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
        background: url(../static/image/bottom/back1.png) no-repeat;
        background-size: 100% 100%;
        cursor: pointer;
    }
}
</style>