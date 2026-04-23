<template>
    <div class="preview-page">
        <div v-if="isIframeLoading" class="iframe-loading">加载 3D 模型中...</div>
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
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import bus from '@/libs/eventbus'
import TopHeader from '@/components/TopHeader'
import myMask from '@/components/mask'
import bottom from '@/components/bottom'
import { ElMessage, ElAlert } from 'element-plus'
import { getInfo } from '@/api/project/normal/index'
import { useRouter, useRoute } from 'vue-router'
import messageHandler from '@/libs/messageHandler.js'

// 基础配置
const iframeUrl = ref('http://61.164.167.246:46150/')
//const iframeUrl = ref('http://frp5.ccszxc.site:38082/')
const router = useRouter()
const route = useRoute()
// 必须用 computed：路由 query 在 setup 执行时可能尚未就绪，否则 getInfo / 点图层 ID 会错
const projectId = computed(() => String(route.query.id || ''))
const projectType = route.query.type
const isRouteLeaving = ref(false)
const isClicking = ref(false)
const iframeRef = ref(null)
const loadAssetsStatus = ref(''); // 缓存最终状态
// 响应式状态
const isIframeLoading = ref(true)
const projectMajorFlag = ref(false)
const projectThreeDModelOssId = ref('')
const isWebRtcConnected = ref(false)
const loadModelTimer = ref(null)
// 新增：项目状态（用于判断是否删除模型）
const projectStatus = ref('');
const projectName = ref('');
// 新增：核心防重标记 - 确保模型只加载一次
const isModelLoaded = ref(false)
const loadAssetsDebounceTimer = ref(null);
const projectPointLayerId = ref('');
const projectPointCreated = ref(false);
const pendingHighlightModelId = ref('');

// ========== 新增：模型ID防重集合（核心修改） ==========
// 存储已发送给UE加载的模型ID，避免重复加载
const loadedModelIds = ref(new Set());

// ========== 新增：DeleteAssets 回调相关变量 ==========
const deleteAssetsResolve = ref(null); // 存储Promise的resolve函数
const deleteAssetsTimer = ref(null);  // DeleteAssets超时定时器
// ========== /新增 ==========

// 1. 校验项目ID
if (!projectId.value) {
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

const shouldKeepPointIcon = () => {
    if (projectMajorFlag.value === false) {
        return projectStatus.value === "管委会通过";
    }
    return projectStatus.value === "省林业局通过";
};

// 矢量点图层独立 ID（避免与纯数字项目 id / UE 内其它 Actor 冲突）；删除时仍删同一 ID
const getProjectPointId = () => {
    const id = projectId.value;
    return id ? `ProjVec_${id}` : '';
};

const showProjectPointLayers = (pointId) => {
    // 仅打开当前项目矢量点；不要用 ShowVectorLayerWithType + Tag all，
    // 否则会连带显示 UE 内其它 Point 图层，易误判为「本项目坐标错了」。
    sendMsgUE({
        "Command": "ShowVectorLayer",
        "Args": {
            "ID": pointId,
            "Show": true,
            "Type": "Point"
        }
    });
};

const lastProjectPointSig = ref('');
const lastProjectPointAt = ref(0);
const projectPointShowTimers = ref([]);

const createProjectPointIcon = (location, hasValidModel) => {
    const nameEmpty = !String(projectName.value || '').trim();
    if (nameEmpty && String(projectId.value ?? '') === '0') return;

    const pointId = getProjectPointId();
    if (!pointId || !location) return;
    // 与 loadThreeDModel 中相机坐标解析一致：trim + parseFloat + toFixed(6)，避免与 SetCameraMove_Geo 的 X/Y 有细微偏差
    const parts = String(location).split(',').map((coord) => {
        const num = parseFloat(String(coord ?? '').trim());
        return Number.isFinite(num) ? Number.parseFloat(num.toFixed(6)) : NaN;
    });
    const lng = parts[0];
    const lat = parts[1];
    const elev = parts[2];
    // 与 SetCameraMove_Geo 的 targetZ 一致：有模型时用「模型坐标」第三段高度；否则贴地 Z=0（避免写死 5 与相机/模型锚点不一致）
    const zIcon = hasValidModel && Number.isFinite(elev) ? elev : 0;
    if (!Number.isFinite(lng) || !Number.isFinite(lat)) return;
    const sig = `${pointId}|${lng}|${lat}|${zIcon}`;
    const now = Date.now();
    if (sig === lastProjectPointSig.value && now - lastProjectPointAt.value < 800) {
        return;
    }
    lastProjectPointSig.value = sig;
    lastProjectPointAt.value = now;
    projectPointShowTimers.value.forEach(clearTimeout);
    projectPointShowTimers.value = [];

    const pointName = projectName.value || projectId.value || pointId;
    projectPointLayerId.value = pointId;
    sendMsgUE({
        "Command": "CreateVectorLayer_Point",
        "Args": {
            "ID": pointId,
            "Name": pointName,
            "CoordType": 0,
            "Locations": [`${lng},${lat},${zIcon}`],
            "Color": "FFEC00FF"
        }
    });
    showProjectPointLayers(pointId);
    projectPointShowTimers.value.push(
        setTimeout(() => showProjectPointLayers(pointId), 300),
        setTimeout(() => showProjectPointLayers(pointId), 800)
    );
    projectPointCreated.value = true;
};

const deleteProjectPointIcon = () => {
    projectPointShowTimers.value.forEach(clearTimeout);
    projectPointShowTimers.value = [];
    const pointId = projectPointLayerId.value || getProjectPointId();
    if (!pointId) return;
    sendMsgUE({
        "Command": "DeleteVectorLayer",
        "Args": {
            "ID": pointId,
            "Type": "Point"
        }
    });
    projectPointCreated.value = false;
};

// 2. 点击返回按钮（改造：异步等待DeleteAssets完成 + 保留UE场景到最后 + 精准删除判断）
const clickBack = async () => {
    if (isClicking.value) return;
    isClicking.value = true;
    try {
        // 先清掉延迟「显示点」的定时器，否则 DeleteVectorLayer 后仍会 Show，表现为点删不掉
        projectPointShowTimers.value.forEach(clearTimeout);
        projectPointShowTimers.value = [];
        sendMsgUE({
            "Command": "DeleteAssets",
            "Args": { "ID": '2006169021575938049' }
        });
        sendMsgUE({
            "Command": "DeleteAssets",
            "Args": { "ID": '2007975797304672257' }
        });
        // ========== 核心修改：精准判断是否需要删除模型 ==========
        const shouldDeleteModel = () => !shouldKeepPointIcon();

        // 仅当需要删除且模型OSS ID非空时，执行删除操作
        if (shouldDeleteModel() && projectThreeDModelOssId.value) {
            await sendDeleteAssets(projectThreeDModelOssId.value);
        }
        if (shouldDeleteModel()) {
            deleteProjectPointIcon();
        }
        // ========== /核心修改 ==========

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
                    router.push(`/project/major/major-add/${projectId.value}`)
                } else if (projectType == 'major-edit') {
                    router.push(`/project/major/major-edit/${projectId.value}`)
                } else if (projectType == 'major-repeatEdit') {
                    router.push(`/project/major/major-repeat-edit/${projectId.value}`)
                } else if (projectType == 'major-share') {
                    router.push(`/project/major/major-share/${projectId.value}`)
                } else {
                    router.push(`/project/major/major-view/${projectId.value}`)
                }
            } else {
                if (projectType == 'normal-add') {
                    router.push(`/project/normal/normal-add/${projectId.value}`)
                } else if (projectType == 'normal-edit') {
                    router.push(`/project/normal/normal-edit/${projectId.value}`)
                } else if (projectType == 'normal-repeatEdit') {
                    router.push(`/project/normal/normal-repeat-edit/${projectId.value}`)
                } else if (projectType == 'normal-share') {
                    router.push(`/project/normal/normal-share/${projectId.value}`)
                } else {
                    router.push(`/project/normal/normal-view/${projectId.value}`)
                }
            }

            // 跳转后重置状态
            setTimeout(() => {
                isClicking.value = false;
                isRouteLeaving.value = false;
            }, 1000);
        }, 2000);
    } catch (err) {
        ElMessage.error(`返回失败：${err.message}`);
        // 异常时重置防重复点击标记
        isClicking.value = false;
    } finally {
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

// 监听 iframe（player.js）发来的「就绪」消息，收到后再标记连接并发消息（保证顺序：先 UE「延迟1s后再连接」，再父页发消息）
const onUeReady = (e) => {
    if (!iframeRef.value?.contentWindow || e.source !== iframeRef.value.contentWindow) return;
    let data = e.data;
    if (typeof data === 'string') {
        try { data = JSON.parse(data); } catch (_) { return; }
    }
    const isReady =
        data?.type === 'UE_READY' ||
        data?.Command === 'OnUEReady' ||
        (data?.Command === 'OnPingPongMsg' && data?.Args?.ID === 'Pong') ||
        data?.Args?.State === 'WebRTC 已连接 ✅' ||
        data?.State === 'WebRTC 已连接 ✅';
    if (isReady && !isWebRtcConnected.value) {
        console.log('✅ 收到 UE 就绪消息，开始发送指令');
        isWebRtcConnected.value = true;
        clearTimeout(loadModelTimer.value);
        window.removeEventListener('message', onUeReady);
    }
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
                if (pendingHighlightModelId.value) {
                    sendMsgUE({
                        "Command": "ActiveAssetObj",
                        "Args": {
                            "ID": pendingHighlightModelId.value,
                            "Active": true
                        }
                    });
                }
                if (!projectPointCreated.value) {
                    createProjectPointIcon(currentLoadingModel.value?.location, true);
                }
                break;
            case '文件挂载失败':
                isIframeLoading.value = false;
                ElMessage.error('模型PAK文件损坏/与UE版本不兼容，挂载失败！');
                break;
            case 'ID有重复':
                isIframeLoading.value = false;
                ElMessage.warning('模型ID重复，已加载现有模型！');
                if (pendingHighlightModelId.value) {
                    sendMsgUE({
                        "Command": "ActiveAssetObj",
                        "Args": {
                            "ID": pendingHighlightModelId.value,
                            "Active": true
                        }
                    });
                }
                if (!projectPointCreated.value) {
                    createProjectPointIcon(currentLoadingModel.value?.location, true);
                }
                break;
            default:
                // ElMessage.info(`模型加载状态：${finalState || '未知'}`); // 注释掉无关提示
                break;
        }
    }, 500); // 等待500ms，确保拿到最终状态
};

const currentLoadingModel = ref(null);
const sceneInitStarted = ref(false);
const noopOnSwitchCamera = () => {};
const loadThreeDModel = async () => {
    if (!projectId.value || isClicking.value) {
        console.log('📌 项目ID缺失或正在跳转，跳过模型/相机初始化');
        return;
    }
    if (sceneInitStarted.value) {
        console.log('📌 场景/模型初始化已执行过，跳过重复调用');
        return;
    }
    sceneInitStarted.value = true;

    try {
        const response = await getInfo(projectId.value);
        const projectData = response.data;

        // ========== 补充：赋值项目状态和重大项目标记 ==========
        projectMajorFlag.value = projectData.majorFlag || false;
        projectStatus.value = projectData.status || '';
        projectName.value = projectData.projectName || '';
        // ========== /补充 ==========

        // ====== 核心：无论是否有模型，先处理相机定位 ======
        let modelLocation = projectData.modelCoordinate || "120.187549,28.924376,0,0";
        const coords = modelLocation.split(',').map(coord => {
            const num = parseFloat(coord.trim());
            return isNaN(num) ? 0 : num.toFixed(6);
        });
        const [x, y, zRaw] = coords;
        let threeDModel = projectData.threeDModel;
        if (typeof threeDModel === 'string') {
            threeDModel = JSON.parse(threeDModel);
        }
        // 👇 关键修改：判断是否有有效模型，决定是否使用原始Z值
        const hasValidModel = Array.isArray(threeDModel) &&
            threeDModel.length > 0 &&
            threeDModel[0]?.ossId;

        // 如果没有模型，强制 Z = 0（贴近地面）
        const targetZ = hasValidModel ? zRaw : 0;
        const cameraZ = hasValidModel ? 15000 : 18000; // 无模型时拉近一点
        if (isWebRtcConnected.value) {
            sendMsgUE({
                "Command": "SetCameraMove_Geo",
                "Args": {
                    "CoordType": 0,
                    "TargetLocation": `X=${x} Y=${y} Z=${targetZ}`,
                    "CameraLocation": `X=${x} Y=${y} Z=${cameraZ}`,
                    "Duration": 1.0
                }
            });
        } else {
            // 如果 WebRTC 还没连上，等连接后再发（可选）
            const unwatch = watch(isWebRtcConnected, (connected) => {
                if (connected) {
                    sendMsgUE({
                        "Command": "SetCameraMove_Geo",
                        "Args": {
                            "CoordType": 0,
                            "TargetLocation": `X=${x} Y=${y} Z=${targetZ}`,
                            "CameraLocation": `X=${x} Y=${y} Z=${cameraZ}`,
                            "Duration": 1.0
                        }
                    });
                    unwatch(); // 只执行一次
                }
            }, { immediate: false });
        }

        if (!Array.isArray(threeDModel) || threeDModel.length === 0) {
            createProjectPointIcon(modelLocation, false);
            ElMessage.warning('未找到 3D 模型数据');
            isIframeLoading.value = false;
            return; // 没有模型，但相机已定位，正常退出
        }

        const model = threeDModel[0];
        const currentModelId = model.ossId || '';

        // 如果 ossId 为空，也视为“无模型”，不加载
        if (!currentModelId) {
            createProjectPointIcon(modelLocation, false);
            ElMessage.info('模型ID为空，仅定位相机');
            isIframeLoading.value = false;
            return;
        }

        // ========== 防重校验 ==========
        if (loadedModelIds.value.has(currentModelId)) {
            console.log('📌 模型ID已存在，跳过重复加载');
            isIframeLoading.value = false;
            ElMessage.warning('模型ID重复，已加载现有模型！');
            return;
        }

        projectThreeDModelOssId.value = currentModelId;
        pendingHighlightModelId.value = currentModelId;
        let modelUrl = model.url;
        if (modelUrl) {
            modelUrl = modelUrl.replace(/^https?:\/\/[^\/]+\/fangyan\//, '');
        }

        const angle = coords[3] || 0;
        currentLoadingModel.value = {
            id: currentModelId,
            name: modelUrl,
            location: modelLocation
        };

        loadedModelIds.value.add(currentModelId);
        isModelLoaded.value = true;

        // 发送模型加载指令
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
                "OffsetVec": `X=0.0 Y=0.0 Z=${(Number(zRaw) * 100).toFixed(3)}`
            }
        });
        projectPointCreated.value = false;
        // ====== /模型加载 ======

    } catch (err) {
        ElMessage.error(`数据获取失败：${err.message || '未知错误'}`);
        console.error('加载 3D 模型异常：', err);
        isIframeLoading.value = false;
        isModelLoaded.value = false;
        sceneInitStarted.value = false;
    }
};

// 与 screen.vue / player 一致：postMessage 传 JSON 字符串，避免矢量类指令在 UE 侧解析异常
const sendMsgUE = (data) => {
    try {
        const iframe = iframeRef.value;
        if (iframe?.contentWindow) {
            const payload = typeof data === 'string' ? data : JSON.stringify(data);
            iframe.contentWindow.postMessage(payload, '*');
        } else {
            console.warn('UE 页面未就绪，消息发送失败', data);
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
    messageHandler.onCommand('OnSwitchCamera', noopOnSwitchCamera);
    // ========== /新增 ==========

    // 3. 注册事件总线监听
    bus.on('attraction-body-clicked', handleAttractionClick);

    // 4. iframe 加载后不再固定 2s 发消息，改为等 UE（player.js）「延迟1s后再连接」完成并通知父页后再发（保证顺序：先 UE 连接，再父页发消息）
    const startConnectionDelay = () => {
        console.log('✅ iframe加载完成，等待 UE 端「延迟1s后再连接」完成并通知后再发送消息');
        clearTimeout(loadModelTimer.value);
        // 不在这里 setTimeout 标记连接，由 captureWebRtcConnected / UE postMessage / 8s 超时 触发
    };
    const iframe = iframeRef.value;
    if (iframe) {
        iframe.onload = () => startConnectionDelay();
        try {
            if (iframe.contentDocument?.readyState === 'complete') startConnectionDelay();
        } catch (_) {}
    }

    // 4.1 监听 iframe（player.js）发来的「就绪」消息，收到后再标记连接并发消息
    window.addEventListener('message', onUeReady);

    // 5. 监听「连接就绪」状态，触发模型/相机初始化（仅触发一次）
    const unwatch = watch(isWebRtcConnected, (connected) => {
        if (connected) {
            loadThreeDModel();
            unwatch();
        }
    }, { immediate: false });

    // 5.1 同一路径 /screen/preview 仅 query.id 变化时组件不卸载：须重置并重新拉取，否则会沿用上一项目的相机/矢量点
    watch(
        () => route.query.id,
        (id, prev) => {
            if (!id || !isWebRtcConnected.value || isClicking.value) return;
            if (prev === undefined || String(id) === String(prev)) return;
            if (!sceneInitStarted.value) return;
            deleteProjectPointIcon();
            loadedModelIds.value.clear();
            projectPointCreated.value = false;
            isModelLoaded.value = false;
            currentLoadingModel.value = null;
            pendingHighlightModelId.value = '';
            projectThreeDModelOssId.value = '';
            sceneInitStarted.value = false;
            loadThreeDModel();
        }
    );

    // 6. 超时兜底：8 秒内未标记连接则强制标记并加载
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
    window.removeEventListener('message', onUeReady);
    bus.off('attraction-body-clicked', handleAttractionClick);
    messageHandler.offCommand('OnLoadAssets', handleOnLoadAssets);
    // ========== 新增：取消OnDeleteAssets监听 + 清理定时器 ==========
    messageHandler.offCommand('OnDeleteAssets', handleOnDeleteAssets);
    messageHandler.offCommand('OnSwitchCamera', noopOnSwitchCamera);
    clearTimeout(deleteAssetsTimer.value);
    // ========== /新增 ==========
    clearTimeout(loadModelTimer.value); // 清除超时定时器
    isClicking.value = false; // 重置防重复点击标记
    isRouteLeaving.value = false; // 重置iframe显示标记
    isModelLoaded.value = false; // 重置防重标记
    loadedModelIds.value.clear(); // 清空模型ID防重集合
    projectPointCreated.value = false;
    pendingHighlightModelId.value = '';
    sceneInitStarted.value = false;
    projectPointShowTimers.value.forEach(clearTimeout);
    projectPointShowTimers.value = [];
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