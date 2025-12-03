<template>
    <div class="preview-page">
        <div v-if="isDeletingModel" class="delete-loading">正在删除模型...</div>
        <div v-if="isIframeLoading" class="iframe-loading">加载 3D 模型中...</div>
        <!-- 🌟 调整：改用 isRouteLeaving 控制 iframe 隐藏（仅路由跳转时隐藏） -->
        <iframe ref="iframeRef" frameborder="0" :src="iframeUrl" style="width: 100%; height: 100%"
            allow="xr-spatial-tracking *" v-show="!isRouteLeaving"></iframe>
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
import { ref, onMounted, onUnmounted, watch } from 'vue'
import bus from '@/libs/eventbus'
import TopHeader from '@/components/TopHeader'
import myMask from '@/components/mask'
import bottom from '@/components/bottom'
import { ElMessage, ElAlert } from 'element-plus'
import { getInfo } from '@/api/project/normal/index'
import { useRouter, useRoute } from 'vue-router'
import messageHandler from '@/libs/messageHandler.js'

// 基础配置
const iframeUrl = ref('http://127.0.0.1:46150/')
const router = useRouter()
const route = useRoute()
const projectId = route.query.id
const projectType = route.query.type
console.log("🚀 ~ projectType:", projectType)

const isRouteLeaving = ref(false)
const isClicking = ref(false)
const isDeletingModel = ref(false);
const iframeRef = ref(null)
const loadAssetsStatus = ref(''); // 缓存最终状态
// 响应式状态
const isIframeLoading = ref(true)
const projectMajorFlag = ref(false)
const projectThreeDModelOssId = ref('')
const isWebRtcConnected = ref(false)
const loadModelTimer = ref(null)
// 新增：核心防重标记 - 确保模型只加载一次
const isModelLoaded = ref(false)
const loadAssetsDebounceTimer = ref(null);

// ========== 新增：模型ID防重集合（核心修改） ==========
// 存储已发送给UE加载的模型ID，避免重复加载
const loadedModelIds = ref(new Set());

// ========== 新增：DeleteAssets 回调相关变量 ==========
const deleteAssetsResolve = ref(null); // 存储Promise的resolve函数
const deleteAssetsTimer = ref(null);  // DeleteAssets超时定时器
// ========== /新增 ==========

// 1. 校验项目ID
if (!projectId) {
    ElMessage.error('缺少项目ID');
    setTimeout(() => router.back(), 1500);
}

// ========== 新增：处理UE的DeleteAssets回调 ==========
/**
 * 监听UE推送的OnDeleteAssets指令（需UE端配合实现）
 * UE端执行完DeleteAssets后，需发送：{ Command: 'OnDeleteAssets', Args: { State: '成功/失败/其他' } }
 */
const handleOnDeleteAssets = (args) => {
    console.log("🔥 接收OnDeleteAssets指令：", args);
    const state = args?.State;
    // 清除超时定时器
    clearTimeout(deleteAssetsTimer.value);

    // 根据UE返回的状态处理
    if (state === '成功') {
        ElMessage.success('模型删除成功！');
        // 🌟 删除成功后，从防重集合中移除该ID（下次可重新加载）
        loadedModelIds.value.delete(projectThreeDModelOssId.value);
        deleteAssetsResolve?.('success'); // 触发Promise.resolve
    } else {
        ElMessage.error(`模型删除失败：${state || '未知原因'}`);
        deleteAssetsResolve?.('fail'); // 触发Promise.resolve（失败也继续跳转）
    }

    // 重置resolve函数，防止重复触发
    deleteAssetsResolve.value = null;
};

/**
 * 封装DeleteAssets发送逻辑为Promise（等待UE回调/超时）
 * @param {string} ossId - 模型OSS ID
 * @returns {Promise} 回调/超时后resolve
 */
const sendDeleteAssets = (ossId) => {
    return new Promise((resolve) => {
        // 存储resolve函数，供UE回调触发
        deleteAssetsResolve.value = resolve;

        // 发送DeleteAssets指令到UE
        sendMsgUE({
            "Command": "DeleteAssets",
            "Args": { "ID": ossId }
        });

        // 超时兜底：2秒未收到回调则强制resolve（避免卡死）
        deleteAssetsTimer.value = setTimeout(() => {
            // 🌟 超时后也移除ID（避免防重集合一直存在）
            loadedModelIds.value.delete(ossId);
            resolve('timeout');
            deleteAssetsResolve.value = null;
        }, 2000);
    });
};
// ========== /新增 ==========

// 2. 点击返回按钮（改造：异步等待DeleteAssets完成 + 保留UE场景到最后）
const clickBack = async () => {
    if (isClicking.value) return;
    isClicking.value = true;
    isDeletingModel.value = true;
    try {
        // ========== 改造：先执行DeleteAssets并等待回调/超时 ==========
        if (projectThreeDModelOssId.value) {
            await sendDeleteAssets(projectThreeDModelOssId.value);
        }
        sendMsgUE({
            "Command": "SwitchCamera",
            "Args": { "ID": "Main", "Duration": 1.0 }
        });
        // 短延时确保SwitchCamera指令发送完成，再执行跳转
        setTimeout(() => {
            isRouteLeaving.value = true;
            const targetRoute = projectMajorFlag.value
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

            // 跳转后重置状态
            setTimeout(() => {
                isClicking.value = false;
                isRouteLeaving.value = false;
            }, 1000);
        }, 400);
    } catch (err) {
        ElMessage.error(`返回失败：${err.message}`);
        // 异常时重置防重复点击标记
        isClicking.value = false;
    } finally {
        isDeletingModel.value = false;
        // 清理定时器，防止内存泄漏
        clearTimeout(deleteAssetsTimer.value);
        deleteAssetsResolve.value = null;
    }
};

// 3. 监听事件总线：切换相机
const handleAttractionClick = (data) => {
    sendMsgUE({
        "Command": "SwitchCamera",
        "Args": { "ID": data, "Duration": 1.0 }
    });
};

// 修复WebRTC监听：确保100%捕获连接成功状态
const captureWebRtcConnected = () => {
    // 方案1：重写console.log，精准捕获player.js的连接日志
    const originalLog = console.log;
    console.log = function (...args) {
        originalLog.apply(console, args);
        const logContent = args.join('');
        if (logContent.includes('WebRTC 已连接 ✅')) {
            console.log('✅ 捕获到WebRTC连接成功（console.log）');
            isWebRtcConnected.value = true;
            // 连接成功后立即清除超时定时器，避免重复加载
            clearTimeout(loadModelTimer.value);
            // 恢复原始console.log，避免影响其他日志
            console.log = originalLog;
        }
    };

    // 方案2：5秒轮询兜底（防止方案1失效）
    const pollTimer = setInterval(() => {
        if (isWebRtcConnected.value) {
            clearInterval(pollTimer);
            return;
        }
        // 5秒未捕获则强制标记连接成功（适配UE加载延迟）
        console.log('✅ 轮询兜底：标记WebRTC连接成功');
        isWebRtcConnected.value = true;
        clearTimeout(loadModelTimer.value);
        clearInterval(pollTimer);
    }, 5000);
};

// 处理 UE 发送的 OnLoadAssets 指令
const handleOnLoadAssets = (args) => {
    console.log("🔥 接收OnLoadAssets指令：", args);
    const state = args?.State;
    loadAssetsStatus.value = state; // 覆盖为最新状态

    // 防抖：等待500ms，确保UE推送完所有状态后，只显示最终状态
    clearTimeout(loadAssetsDebounceTimer.value);
    loadAssetsDebounceTimer.value = setTimeout(() => {
        const finalState = loadAssetsStatus.value;
        switch (finalState) {
            case '文件状态:false':
                isIframeLoading.value = false;
                ElMessage.error('MinIO中未找到该模型文件！请检查文件路径/MinIO配置');
                break;
            case '文件状态:true':
                // ElMessage.error('minio找到该路径文件'); // 注释掉无关提示
                break;
            case '文件下载失败':
                isIframeLoading.value = false;
                ElMessage.error('模型文件下载失败！请检查MinIO网络/文件权限');
                break;
            case '文件下载成功':
                // ElMessage.error('文件下载成功'); // 注释掉无关提示
                break;
            case '生成成功':
                isIframeLoading.value = false;
                ElMessage.success('3D模型加载成功！');
                break;
            case '文件挂载失败':
                isIframeLoading.value = false;
                ElMessage.error('模型PAK文件损坏/与UE版本不兼容，挂载失败！');
                break;
            case 'ID有重复':
                isIframeLoading.value = false;
                ElMessage.warning('模型ID重复，已加载现有模型！');
                break;
            default:
                // ElMessage.info(`模型加载状态：${finalState || '未知'}`); // 注释掉无关提示
                break;
        }
    }, 500); // 等待500ms，确保拿到最终状态
};

const currentLoadingModel = ref(null);
// 7. 加载 3D 模型（核心：增加基于ID的防重逻辑）
const loadThreeDModel = async () => {
    // 防重判断：已加载/无ID/已点击返回/WebRTC未连接 → 直接返回
    if (isModelLoaded.value || !projectId || isClicking.value || !isWebRtcConnected.value) {
        console.log('📌 模型加载防重触发，跳过执行');
        return;
    }

    try {
        const response = await getInfo(projectId);
        const projectData = response.data;

        projectMajorFlag.value = projectData.majorFlag || false;

        let threeDModel = projectData.threeDModel;
        if (typeof threeDModel === 'string') {
            threeDModel = JSON.parse(threeDModel);
        }

        if (!Array.isArray(threeDModel) || threeDModel.length === 0) {
            ElMessage.warning('未找到 3D 模型数据');
            isIframeLoading.value = false;
            return;
        }

        const model = threeDModel[0];
        const currentModelId = model.ossId || '';
        // ========== 核心修改：ID重复校验 ==========
        if (loadedModelIds.value.has(currentModelId)) {
            console.log('📌 模型ID已存在，跳过重复加载');
            isIframeLoading.value = false;
            ElMessage.warning('模型ID重复，已加载现有模型！');
            return; // 终止加载逻辑
        }

        projectThreeDModelOssId.value = currentModelId;
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
        currentLoadingModel.value = {
            id: currentModelId,
            name: modelUrl,
            location: modelLocation
        };

        // 🌟 标记为已加载：将ID加入防重集合
        loadedModelIds.value.add(currentModelId);
        // 标记为已加载（布尔值兜底）
        isModelLoaded.value = true;

        // 仅发送一次指令到UE
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
            "Command": "LoadAssets",
            "Args": {
                "ID": currentModelId,
                "Name": modelUrl,
                "State": 0,
                "Angle": angle,
                "CoordType": 0,
                "Location": `${x},${y},0`,
                "Scale": "1,1,1",
                "OffsetVec": `X=0.0 Y=0.0 Z=${(Number(z) * 100).toFixed(3)}`
            }
        });
    } catch (err) {
        ElMessage.error(`数据获取失败：${err.message || '未知错误'}`);
        console.error('加载 3D 模型异常：', err);
        isIframeLoading.value = false;
        // 加载失败时重置标记
        isModelLoaded.value = false;
    }
};

// 8. 向 UE 发送消息
const sendMsgUE = (data) => {
    if (!isWebRtcConnected.value) {
        console.warn('❌ WebRTC未连接，消息发送失败：', data);
        return;
    }
    try {
        const iframe = iframeRef.value;
        if (iframe && iframe.contentWindow) {
            iframe.contentWindow.postMessage(data, "*");
        } else {
            console.warn('UE 页面未就绪，消息发送失败');
        }
    } catch (err) {
        console.error('发送消息到 UE 失败：', err);
    }
};

// 9. 生命周期
onMounted(() => {
    // 1. 注册OnLoadAssets监听
    console.log('📌 开始注册OnLoadAssets监听');
    messageHandler.onCommand('OnLoadAssets', handleOnLoadAssets);
    // 2. 初始化WebRTC连接捕获（仅执行一次，不重复注册message事件）
    captureWebRtcConnected();
    // ========== 新增：注册OnDeleteAssets监听 ==========
    messageHandler.onCommand('OnDeleteAssets', handleOnDeleteAssets);
    // ========== /新增 ==========

    // 3. 注册事件总线监听
    bus.on('attraction-body-clicked', handleAttractionClick);

    // 4. 等待iframe加载完成
    const iframe = iframeRef.value;
    if (iframe) {
        iframe.onload = () => {
            console.log('✅ iframe加载完成，等待WebRTC连接...');
        };
    }

    // 5. 监听WebRTC连接状态（仅触发一次）
    const unwatch = watch(isWebRtcConnected, (connected) => {
        if (connected) {
            loadThreeDModel();
            unwatch(); // 立即取消监听，防止重复触发
        }
    }, { immediate: false }); // 关闭立即执行

    // 6. 超时兜底：缩短到8秒，且连接成功后会被清除
    clearTimeout(loadModelTimer.value); // 先清除旧定时器，防止重复
    loadModelTimer.value = setTimeout(() => {
        if (!isWebRtcConnected.value) {
            console.warn('⚠️ WebRTC连接超时，强制加载模型');
            isWebRtcConnected.value = true;
            loadThreeDModel();
        }
    }, 8000);
});

// 10. 卸载时清理
onUnmounted(() => {
    bus.off('attraction-body-clicked', handleAttractionClick);
    messageHandler.offCommand('OnLoadAssets', handleOnLoadAssets);
    // ========== 新增：取消OnDeleteAssets监听 + 清理定时器 ==========
    messageHandler.offCommand('OnDeleteAssets', handleOnDeleteAssets);
    clearTimeout(deleteAssetsTimer.value);
    // ========== /新增 ==========
    clearTimeout(loadModelTimer.value); // 清除超时定时器
    isClicking.value = false; // 重置防重复点击标记
    isRouteLeaving.value = false; // 重置iframe显示标记
    isModelLoaded.value = false; // 重置防重标记
    loadedModelIds.value.clear(); // 清空模型ID防重集合
    clearTimeout(loadAssetsDebounceTimer.value);
    deleteAssetsResolve.value = null; // 重置resolve
});
</script>

<style lang="scss" scoped>
.preview-page {
    width: 100%;
    height: 99.8vh;
    background: url('../../../static/image/map/map.png') no-repeat;
    background-size: 100% 100%;
    position: relative;
    overflow: hidden;
}

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

.delete-loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 16px;
    color: #ffd700;
    z-index: 999;
    background: rgba(0, 0, 0, 0.5);
    padding: 8px 16px;
    border-radius: 4px;
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
        transition: transform 0.2s;

        &:hover {
            transform: scale(1.05);
        }
    }
}
</style>