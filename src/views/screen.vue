<template>
    <div class="screen-page">
        <div v-if="isIframeLoading" class="iframe-loading">加载 3D 模型中...</div>
        <iframe v-if="mapSwitch" id="iframe" ref="iframeRef" frameborder="0" :src="iframeUrl"
            style="width: 100%; height: 100%" allow="xr-spatial-tracking *" @load="handleIframeLoad"
            @error="handleIframeError"></iframe>
        <LeafletMap v-else></LeafletMap>
        <my-mask>
            <template v-slot:main>
                <topHeader></topHeader>
                <leftColum></leftColum>
                <rightColum></rightColum>
                <NotesPopup />
                <bottom />
                <mapTitle />
            </template>
        </my-mask>
        <div class="backButton" v-if="!projectData?.shareFlag">
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
import { useRouter, useRoute } from 'vue-router'
import { toRefs, reactive, ref, onMounted, computed, onUnmounted, watch } from 'vue'
import bus from '@/libs/eventbus'
import TopHeader from '@/components/TopHeader'
import myMask from '@/components/mask'
import LeftColum from '@/components/LeftColum'
import RightColum from '@/components/RightColum'
import NotesPopup from '@/components/NotesPopup'
import bottom from '@/components/bottom'
import LeafletMap from '@/components/LeafletMap'
import mapTitle from '@/components/mapTitle'
import { ElMessage } from 'element-plus'
import { getInfo } from '@/api/project/normal/index'
import messageHandler from '@/libs/messageHandler.js' // 引入消息处理器（同preview.vue）

const router = useRouter()
const route = useRoute()

// 新增：模型ID-状态 去重映射（记录已处理的ID+State组合）
const processedAssetStates = ref(new Map());
// 新增：已完成加载的模型ID（生成成功/ID重复则加入，后续忽略）
const completedModelIds = ref(new Set());
// 优化：防抖时间延长至1000ms（适配UE频繁推送）
const loadAssetsDebounceTimer = ref(null);
// 新增：防抖定时器+状态缓存
const loadAssetsStatus = ref(''); // 缓存最终状态
// ===================== 新增核心响应式状态（参考preview.vue） =====================
const isIframeLoading = ref(true) // 加载模型提示显示/隐藏
const isModelLoaded = ref(false) // 模型只加载一次标记
const isWebRtcConnected = ref(false) // WebRTC连接状态
const loadModelTimer = ref(null) // 加载超时兜底定时器
const projectThreeDModelOssId = ref('') // 存储模型OSS ID（用于删除）
const isLeaving = ref(false) // 新增：离开页面标记（修复未定义问题）
// ========== 核心新增：模型ID防重集合 ==========
const loadedModelIds = ref(new Set()); // 存储已加载的模型ID，避免重复加载

// ===================== 原有状态保留 + 新增projectData响应式变量 =====================
const projectIdCheck = ref('')
const projectmMdelCoordinate = ref('')
const projectMajorFlag = ref(false)
const projectThreeDModelList = ref([])
const projectIds = ref('')
const projectData = ref({}); // 新增：存储完整项目数据（用于获取shareFlag）
const projectStatus = ref(null);
// const iframeUrl = "http://127.0.0.1:46150";
const iframeUrl = "http://frp5.ccszxc.site:38082/";
const mapSwitch = ref(true)
const iframeRef = ref(null);
const isIframeLoaded = ref(false);
const splitScreen = ref(false);
const modelData = ref(null);
const coords = ref([]);
const x = ref(0);
const y = ref(0);
const z = ref(0);
const angle = ref(0);
const resultModel = ref('');
const remarkPointId = ref([])
const remarkPolylineId = ref([])
const remarkPolygonId = ref([])
const cultureTypeMap = {
    1: "Culture_YDSM",
    2: "Culture_HG",
    3: "Culture_SY",
    4: "Culture_KZLS"
};
const attractionTypeMap = {
    1: "Scene_Human1",
    2: "Scene_Human2",
    3: "Scene_Human3",
    4: "Scene_Nature1",
    5: "Scene_Nature2",
    6: "Scene_Nature3",
    7: "Scene_XZC",
    8: "Parking"
};
const msgQueue = ref([]);

// ===================== 1. 修复sendMsgUE（兼容WebRTC状态） =====================
const sendMsgUE = (data) => {
    // WebRTC未连接时加入队列
    if (!isWebRtcConnected.value || !mapSwitch.value || !iframeRef.value || !isIframeLoaded.value) {
        console.warn('iframe/WebRTC 未就绪，消息加入队列', data);
        msgQueue.value.push(data);
        return;
    }
    if (msgQueue.value.length > 100) {
        console.warn('消息队列过长，清理部分消息');
        msgQueue.value = msgQueue.value.slice(-50);
    }
    // 发送队列消息
    while (msgQueue.value.length > 0) {
        const queuedData = msgQueue.value.shift();
        try {
            iframeRef.value.contentWindow.postMessage(JSON.stringify(queuedData), "*");
        } catch (error) {
            console.error('发送队列消息失败', error, queuedData);
            msgQueue.value.push(queuedData);
        }
    }
    // 发送当前消息
    try {
        iframeRef.value.contentWindow.postMessage(JSON.stringify(data), "*");
    } catch (error) {
        console.error('发送iframe消息失败', error, data);
        msgQueue.value.push(data);
    }
};

// ===================== 2. WebRTC连接捕获（参考preview.vue） =====================
const captureWebRtcConnected = () => {
    // 方案：监听 UE 发送的 WebRTC 连接消息（替代轮询兜底）
    const webRtcListener = (event) => {
        try {
            const { data } = event;
            // 匹配 UE 发送的 WebRTC 连接成功消息
            if (typeof data === 'string') {
                const parsedData = JSON.parse(data);
                if (parsedData?.State === 'WebRTC 协商失败 ❌') {
                    console.error('❌ WebRTC协商失败');
                    ElMessage.error('3D模型连接失败，请检查网络或刷新页面');
                    isWebRtcConnected.value = false;
                    window.removeEventListener('message', webRtcListener);
                }
                if (parsedData?.State === 'WebRTC 已连接 ✅') {
                    console.log('✅ 真实捕获WebRTC连接成功（UE主动推送）');
                    isWebRtcConnected.value = true;
                    window.removeEventListener('message', webRtcListener); // 移除监听
                }
            } else if (data?.State === 'WebRTC 已连接 ✅') {
                console.log('✅ 真实捕获WebRTC连接成功（UE主动推送）');
                isWebRtcConnected.value = true;
                window.removeEventListener('message', webRtcListener); // 移除监听
            }
        } catch (e) {
            // 解析失败，忽略
        }
    };
    window.addEventListener('message', webRtcListener);

    // 兜底轮询（仅当UE未主动推送时触发，延迟至5秒）
    const pollTimer = setTimeout(() => {
        if (!isWebRtcConnected.value) {
            console.log('✅ 轮询兜底：标记WebRTC连接成功');
            isWebRtcConnected.value = true;
            window.removeEventListener('message', webRtcListener);
        }
    }, 10000); // 延长轮询兜底时间，给UE足够初始化时间

    // 卸载时清理监听和定时器
    onUnmounted(() => {
        window.removeEventListener('message', webRtcListener);
        clearTimeout(pollTimer);
    });
};

// ===================== 3. 处理OnLoadAssets（覆盖所有7种State状态） =====================
const handleOnLoadAssets = (args) => {
    console.log("🔥 接收OnLoadAssets指令：", args);
    const state = args?.State;
    const modelId = projectThreeDModelOssId.value; // 当前加载的模型ID

    // 兜底：无模型ID则直接返回
    if (!modelId) return;

    // 终止条件：该ID已完成加载（生成成功/ID重复），后续消息直接忽略
    if (completedModelIds.value.has(modelId)) {
        console.log(`📌 模型ID[${modelId}]已完成加载，忽略后续OnLoadAssets消息`);
        return;
    }

    // 去重：同一ID+同一State只处理一次
    const stateKey = `${modelId}_${state}`;
    if (processedAssetStates.value.has(stateKey)) {
        console.log(`📌 模型ID[${modelId}]的State[${state}]已处理，跳过`);
        return;
    }
    processedAssetStates.value.set(stateKey, true); // 标记已处理

    loadAssetsStatus.value = state; // 覆盖为最新状态
    // 防抖：延长至1500ms，确保UE推送完所有状态后只处理最后一次
    clearTimeout(loadAssetsDebounceTimer.value);
    loadAssetsDebounceTimer.value = setTimeout(() => {
        const finalState = loadAssetsStatus.value;
        console.log(`✅ 模型ID[${modelId}]最终状态：${finalState}`);

        switch (finalState) {
            case '文件状态：false':
                isIframeLoading.value = false;
                ElMessage.error('MinIO中未找到该模型文件！请检查文件路径/MinIO配置');
                break;
            case '文件状态：true':
                break; // 无需提示
            case '文件下载失败':
                isIframeLoading.value = false;
                ElMessage.error('模型文件下载失败！请检查MinIO网络/文件权限');
                break;
            case '文件下载成功':
                break; // 无需提示
            case '生成成功':
                isIframeLoading.value = false;
                ElMessage.success('3D模型加载成功！');
                completedModelIds.value.add(modelId); // 标记该ID已完成，后续忽略
                break;
            case '文件挂载失败':
                isIframeLoading.value = false;
                ElMessage.error('模型PAK文件损坏/与UE版本不兼容，挂载失败！');
                break;
            case 'ID有重复':
                isIframeLoading.value = false;
                ElMessage.warning('模型ID重复，已加载现有模型！');
                completedModelIds.value.add(modelId); // 标记该ID已完成，后续忽略
                break;
            default:
                // 兜底：若15秒仍未收到最终状态，强制关闭加载提示
                const timeout兜底 = setTimeout(() => {
                    if (isIframeLoading.value) {
                        isIframeLoading.value = false;
                        ElMessage.warning('模型加载状态未知，若未显示请刷新页面');
                    }
                }, 15000);
                break;
        }
    }, 1500); // 延长防抖时间至1.5秒，适配UE频繁推送
};

// ===================== 4. 加载3D模型（核心：新增ID防重逻辑） =====================
const loadThreeDModel = async () => {
    if (projectIdCheck.value === '0') {
        console.log('📌 projectIdCheck为0，不加载模型，保持主镜头');
        isIframeLoading.value = false; // 关闭加载提示
        return;
    }
    // 原有防重判断保留
    if (isModelLoaded.value || !projectIdCheck.value || !isWebRtcConnected.value) {
        console.log('📌 模型加载防重触发，跳过执行');
        isIframeLoading.value = false;
        return;
    }
    const model = projectThreeDModelList.value[0];
    const currentModelId = model.ossId || '';
    if (!currentModelId) {
        ElMessage.error('模型OSS ID为空，无法加载！');
        isIframeLoading.value = false;
        isModelLoaded.value = false; // 重置标记
        return;
    }
    isModelLoaded.value = true; // 标记已加载，防止重复
    console.log('📌 WebRTC已连接，开始加载3D模型（仅执行一次）');

    try {
        if (projectThreeDModelList.value.length === 0) {
            ElMessage.warning('未找到3D模型数据');
            isIframeLoading.value = false;
            return;
        }
        projectThreeDModelOssId.value = currentModelId; // 存储OSS ID用于删除
        // ========== 核心新增：ID重复校验 ==========
        if (loadedModelIds.value.has(currentModelId)) {
            console.log('📌 模型ID已存在，跳过重复加载');
            isIframeLoading.value = false;
            ElMessage.warning('模型ID重复，已加载现有模型！');
            completedModelIds.value.add(currentModelId); // 标记为已完成
            return; // 终止加载逻辑，不发送任何UE指令
        }

        // 处理模型URL
        if (projectIdCheck.value === '0') {
            // projectId为0时，固定使用public文件夹的gelou.pak
            resultModel.value = 'gelou.pak';
        } else if (model?.url) {
            // 其他情况仍解析URL
            const path = model.url.replace(/^https?:\/\/[^\/]+\//, '');
            resultModel.value = path.replace(/^fangyan\//, '');
        } else {
            console.warn('模型数据缺少url字段');
            isIframeLoading.value = false;
            return;
        }
        // 处理坐标
        let modelLocation = projectmMdelCoordinate.value || "120.187549,28.924376,110,2";
        const coordsArr = modelLocation.split(',').map(coord => {
            const num = parseFloat(coord.trim());
            return isNaN(num) ? 0 : num.toFixed(6);
        });
        const [xVal, yVal, zVal, angleVal] = coordsArr;
        x.value = xVal;
        y.value = yVal;
        z.value = zVal;
        angle.value = angleVal;

        // ========== 新增：将ID加入防重集合 ==========
        loadedModelIds.value.add(currentModelId);

        // 发送加载模型指令（延迟500ms，给UE初始化时间）
        setTimeout(() => {
            sendMsgUE({
                "Command": "SetCameraMove_Geo",
                "Args": {
                    "CoordType": 0,
                    "TargetLocation": `X=${xVal} Y=${yVal} Z=${zVal}`,
                    "CameraLocation": `X=${xVal} Y=${yVal} Z=30000.000`,
                    "Duration": 1.0
                }
            });
            sendMsgUE({
                "Command": "LoadAssets",
                "Args": {
                    "ID": currentModelId,
                    "Name": resultModel.value,
                    "State": 1,
                    "Angle": angleVal,
                    "CoordType": 0,
                    "Location": `${xVal},${yVal},0`,
                    "Scale": "1,1,1",
                    "OffsetVec": `X=0.0 Y=0.0 Z=${(Number(zVal) * 100).toFixed(3)}`
                }
            });
        }, 500);
    } catch (err) {
        ElMessage.error(`模型加载失败：${err.message || '未知错误'}`);
        isIframeLoading.value = false;
        isModelLoaded.value = false; // 失败时重置标记
        //加载失败移除ID缓存
        if (projectThreeDModelOssId.value) {
            loadedModelIds.value.delete(projectThreeDModelOssId.value);
            processedAssetStates.value.delete(`${projectThreeDModelOssId.value}_*`); // 清空该ID的状态缓存
        }
    }
};

// ===================== 原有方法保留 + 修复 =====================
const handleIframeLoad = () => {
    isIframeLoaded.value = true;
    console.log('iframe加载完成，可发送消息');
    while (msgQueue.value.length > 0) {
        const queuedData = msgQueue.value.shift();
        iframeRef.value.contentWindow.postMessage(JSON.stringify(queuedData), "*");
    }
};

const handleIframeError = () => {
    console.error('iframe 加载失败，检查 URL 或服务是否正常');
    mapSwitch.value = false;
    isIframeLoading.value = false; // 加载失败关闭提示
};

function transformWKT (wktStr) {
    const cleanStr = wktStr.replace(/\s+/g, ',').replace(/,,+/g, ',').trim();
    const coordArr = cleanStr.split(',');
    const result = [];
    if (coordArr.length < 2 || coordArr.length % 2 !== 0) {
        console.warn('WKT 格式错误，坐标数量需为偶数且至少2个', wktStr);
        return result;
    }
    if (coordArr.length === 2) {
        const pointCoord = `${coordArr[0]},${coordArr[1]},0`;
        result.push(pointCoord);
    } else {
        for (let i = 0; i < coordArr.length; i += 2) {
            if (i + 1 >= coordArr.length) break;
            const lat = coordArr[i];
            const lng = coordArr[i + 1];
            const lineAreaCoord = `${lng},${lat},0`;
            result.push(lineAreaCoord);
        }
    }
    return result;
}

// ===================== 5. 修复function-panel-clicked（去掉index===1的加载模型代码） =====================
bus.on('function-panel-clicked', data => {
    if (data.index === 0) {
        sendMsgUE({
            "Command": "SetCameraMove_Geo",
            "Args": {
                "CoordType": 0,
                "TargetLocation": `X=${x.value} Y=${y.value} Z=${z.value}`,
                "CameraLocation": `X=${x.value} Y=${y.value} Z=30000.000`,
                "Duration": 1.0
            }
        });
        splitScreen.value = false
        const isShow = data.isSelected;
        sendMsgUE({
            "Command": "ShowVectorLayerWithType",
            "Args": { "Show": isShow, "Type": "Area", "Tag": "生态保护红线" }
        });
    } else if (data.index === 1) {
        // 仅保留分屏状态切换和相机切换，移除所有加载模型代码
        splitScreen.value = true;
        if (data.isSelected) {
            sendMsgUE({ "Command": "SwitchSplitScreenState", "Args": { "State": true } });
            sendMsgUE({
                "Command": "SwitchSplitCamera",
                "Args": {
                    "CoordType": 0,
                    "TargetLocation": `X=${x.value} Y=${y.value} Z=${z.value}`,
                    "CameraLocation": `X=${x.value} Y=${y.value} Z=30000.000`,
                    "Duration": 1.0
                }
            });
        } else {
            sendMsgUE({ "Command": "SwitchSplitScreenState", "Args": { "State": false } });
        }
    } else if (data.index === 2) {
        splitScreen.value = false
        console.log("🚀 ~ data:", data)
        if (data.isSelected) {
            bus.on('time-change', year => {
                console.log("🚀 ~ x.value:", x.value)
                console.log("🚀 ~ y.value:", y.value)
                console.log("🚀 ~ z.value:", z.value)
                sendMsgUE({
                    "Command": "SetCameraMove_Geo",
                    "Args": {
                        "CoordType": 0,
                        "TargetLocation": `X=${x.value} Y=${y.value} Z=100`,
                        "CameraLocation": `X=${x.value} Y=${y.value} Z=30000.000`,
                        "Duration": 1.0
                    }
                });
                sendMsgUE({
                    "Command": "SwitchSpaceTime",
                    "Args": {
                        "Type": year.toString()
                    }
                });
            })
        } else {
            sendMsgUE({
                "Command": "SwitchSpaceTime",
                "Args": {
                    "Type": "2025"
                }
            });
        }
    }
});

const clickBack = () => {
    if (isLeaving.value) return; // 防止重复点击
    isLeaving.value = true;
    // 原有清理指令
    sendMsgUE({
        "Command": "StartRoaming",
        "Args": {
            "ID": "场景漫游",
            "State": "Stop"
        }
    });
    sendMsgUE({
        "Command": "ShowVectorLayerWithType",
        "Args": {
            "Show": false,
            "Type": "Line",
            "Tag": "All"
        }
    });
    sendMsgUE({
        "Command": "ShowVectorLayerWithType",
        "Args": {
            "Show": false,
            "Type": "Area",
            "Tag": "All"
        }
    });
    sendMsgUE({
        "Command": "ShowPOIWithType",
        "Args": {
            "Show": false,
            "Type": ["All"]
        }
    });
    remarkPointId.value.forEach(e => {
        sendMsgUE({
            "Command": "ShowVectorLayer",
            "Args": {
                "ID": e,
                "Show": false,
                "Type": "Point"
            }
        });
    });
    remarkPolylineId.value.forEach(e => {
        sendMsgUE({
            "Command": "ShowVectorLayer",
            "Args": {
                "ID": e,
                "Show": false,
                "Type": "Line"
            }
        });
    });
    remarkPolygonId.value.forEach(e => {
        sendMsgUE({
            "Command": "ShowVectorLayer",
            "Args": {
                "ID": e,
                "Show": false,
                "Type": "Area"
            }
        });
    });
    sendMsgUE({
        "Command": "SwitchCamera",
        "Args": {
            "ID": "Main",
            "Duration": 1.0
        }
    });
    sendMsgUE({ "Command": "SwitchSplitScreenState", "Args": { "State": false } });
    sendMsgUE({
        "Command": "SwitchSpaceTime",
        "Args": {
            "Type": "2025"
        }
    });
    // 固定删除默认模型（1991914379260149762）
    sendMsgUE({
        "Command": "DeleteAssets",
        "Args": { "ID": "1991914379260149762" }
    });
    // 核心：精准判断是否删除业务模型
    const shouldDeleteBusinessModel = () => {
        if (projectMajorFlag.value === false) {
            // 非重大项目：仅"管委会通过"不删除，其他状态（含空/其他）都删除
            return projectStatus.value !== "管委会通过";
        } else {
            // 重大项目：仅"林业局通过"不删除，其他状态（含空/其他）都删除
            return projectStatus.value !== "林业局通过";
        }
    };

    // 执行业务模型删除（需确保OSS ID非空）
    if (shouldDeleteBusinessModel() && projectThreeDModelOssId.value) {
        sendMsgUE({
            "Command": "DeleteAssets",
            "Args": { "ID": projectThreeDModelOssId.value }
        });
    }

    // 重置所有状态
    isModelLoaded.value = false;
    isWebRtcConnected.value = false;
    isIframeLoading.value = false;
    loadedModelIds.value.clear();
    processedAssetStates.value.clear();
    completedModelIds.value.clear();
    projectThreeDModelOssId.value = '';
    loadAssetsStatus.value = '';
    clearTimeout(loadAssetsDebounceTimer.value);
    clearTimeout(loadModelTimer.value);



    // 延迟跳转 + 销毁iframe
    setTimeout(() => {
        // 销毁iframe，强制断开UE连接
        if (iframeRef.value) {
            iframeRef.value.src = 'about:blank';
            iframeRef.value = null;
        }
        // 跳转逻辑
        if (projectIdCheck.value == '0') {
            router.push(`/project/major/`)
        } else {
            if (projectMajorFlag.value === false) {
                router.push(`/project/normal/normal-review/${projectIdCheck.value}`)
            } else if (projectMajorFlag.value === true) {
                router.push(`/project/major/major-review/${projectIdCheck.value}`)
            } else {
                console.log("🚀 ~ clickBack ~ projectIdCheck.value:", projectIdCheck.value)
            }
        }
    }, 1000);
};

// ===================== 7. 其他bus监听保留 =====================
let dataWkt = []
bus.on('remarkMessage', data => {
    console.log("🚀 ~ data.id:", data.id)
    dataWkt = transformWKT(data.wkt);
    console.log("🚀 ~ data.dataWkt:", dataWkt)
    if (data.type == 'point') {
        remarkPointId.value.push(data.id)
        if (data.checked) {
            sendMsgUE({
                "Command": "CreateVectorLayer_Point",
                "Args": {
                    "ID": data.id,
                    "Name": data.layerName,
                    "CoordType": 0,
                    "Locations": dataWkt
                }
            });
            sendMsgUE({
                "Command": "ShowVectorLayer",
                "Args": {
                    "ID": data.id,
                    "Show": true,
                    "Type": "Point"
                }
            });
        } else {
            sendMsgUE({
                "Command": "ShowVectorLayer",
                "Args": {
                    "ID": data.id,
                    "Show": false,
                    "Type": "Point"
                }
            });
        }
    } else if (data.type == 'polyline') {
        remarkPolylineId.value.push(data.id)
        if (data.checked) {
            sendMsgUE({
                "Command": "CreateVectorLayer_Line",
                "Args": {
                    "ID": data.id,
                    "Name": data.layerName,
                    "Color": "FF0000FF",
                    "Size": 1.0,
                    "CoordType": 0,
                    "Locations": dataWkt
                }
            });
            sendMsgUE({
                "Command": "ShowVectorLayer",
                "Args": {
                    "ID": data.id,
                    "Show": true,
                    "Type": "Line"
                }
            });
        } else {
            sendMsgUE({
                "Command": "ShowVectorLayer",
                "Args": {
                    "ID": data.id,
                    "Show": false,
                    "Type": "Line"
                }
            });
        }
    } else {
        remarkPolygonId.value.push(data.id)
        if (data.checked) {
            sendMsgUE({
                "Command": "CreateVectorLayer_Area",
                "Args": {
                    "ID": data.id,
                    "Name": data.layerName,
                    "Color": "FFB500FF",
                    "CoordType": 0,
                    "Locations": dataWkt
                }
            });
            sendMsgUE({
                "Command": "ShowVectorLayer",
                "Args": {
                    "ID": data.id,
                    "Show": true,
                    "Type": "Area"
                }
            });
        } else {
            sendMsgUE({
                "Command": "ShowVectorLayer",
                "Args": {
                    "ID": data.id,
                    "Show": false,
                    "Type": "Area"
                }
            });
        }
    }
})

bus.on('cultureTypeMessage', data => {
    const poiType = cultureTypeMap[data.id];
    if (!poiType) return;
    sendMsgUE({
        "Command": "ShowPOIWithType",
        "Args": { "Show": data.checked, "Type": [poiType] }
    });
});

bus.on('layerCheckMessage', data => {
    const ueLayerType = data.layerType === 'Line' ? 'Line' : 'Area';
    sendMsgUE({
        "Command": "ShowVectorLayerWithType",
        "Args": {
            "Show": data.checked,
            "Type": ueLayerType,
            "Tag": data.name
        }
    });
});

bus.on('attractionTypeMessage', data => {
    const poiType = attractionTypeMap[data.id];
    if (!poiType) return;
    sendMsgUE({
        "Command": "ShowPOIWithType",
        "Args": { "Show": data.checked, "Type": [poiType] }
    });
});

bus.on('scene-roaming-clicked', data => {
    console.log('scene-roaming-clicked', data)
    if (data) {
        sendMsgUE({
            "Command": "StartRoaming",
            "Args": {
                "ID": "场景漫游",
                "State": "Start"
            }
        });
    } else {
        sendMsgUE({
            "Command": "StartRoaming",
            "Args": {
                "ID": "场景漫游",
                "State": "Stop"
            }
        });
    }
})

bus.on('attraction-body-clicked', data => {
    sendMsgUE({
        "Command": "SwitchCamera",
        "Args": {
            "ID": data,
            "Duration": 1.0
        }
    });
});

bus.on('vector-layer-clicked', data => {
    mapSwitch.value = !data
});

bus.on('scheme-review-clicked', data => {
    if (data) mapSwitch.value = true
});

bus.on('search-relic', data => {
    const hasParking = data.includes('停车场');
    if (hasParking) {
        sendMsgUE({
            "Command": "FocusPOI",
            "Args": {
                "ID": `ParkingPOI_${data}`,
                "Type": "Parking"
            }
        });
    } else {
        sendMsgUE({
            "Command": "FocusPOI",
            "Args": {
                "ID": `ScenePOI_${data}`,
                "Type": "ALL"
            }
        });
        sendMsgUE({
            "Command": "FocusPOI",
            "Args": {
                "ID": `CulturePOI_${data}`,
                "Type": "ALL"
            }
        });
    }
});

// ===================== 8. 生命周期处理 =====================
onMounted(async () => {
    // 注册OnLoadAssets监听（控制加载提示）
    messageHandler.onCommand('OnLoadAssets', handleOnLoadAssets);

    // 捕获WebRTC连接状态
    captureWebRtcConnected();

    messageHandler.onCommand('OnStartRoaming', () => { });
    messageHandler.onCommand('OnSwitchCamera', () => { });

    // 获取项目数据
    const projectId = route.query.id;
    if (projectId) {
        const response = await getInfo(projectId);
        projectData.value = response.data; // 存储完整项目数据（关键：用于shareFlag）
        console.log("🚀 ~ projectData:", projectData.value)

        // 赋值基础数据
        projectIdCheck.value = projectData.value.id;
        projectmMdelCoordinate.value = projectData.value.modelCoordinate || '';
        projectMajorFlag.value = projectData.value.majorFlag;
        projectStatus.value = projectData.value.status;
        projectThreeDModelList.value = JSON.parse(projectData.value.threeDModel || '[]');

        // 处理坐标
        if (projectmMdelCoordinate.value) {
            coords.value = projectmMdelCoordinate.value.split(',').map(coord => {
                const num = parseFloat(coord);
                return isNaN(num) ? 0 : num.toFixed(6);
            });
            [x.value, y.value, z.value, angle.value = 0] = coords.value;
        }

        // 初始化模型数据
        if (projectThreeDModelList.value.length > 0) {
            modelData.value = projectThreeDModelList.value[0];
            if (modelData.value?.url) {
                const path = modelData.value.url.replace(/^https?:\/\/[^\/]+\//, '');
                resultModel.value = path.replace(/^fangyan\//, '');
            } else {
                console.warn('模型数据缺少url字段');
                resultModel.value = '';
            }
        } else {
            console.warn('暂无三维模型数据');
            modelData.value = null;
            resultModel.value = '';
            isIframeLoading.value = false; // 无模型关闭加载提示
        }
    } else {
        // 无项目ID时的默认配置
        projectIdCheck.value = '0';
        projectmMdelCoordinate.value = '120.187622,28.923433,2,0';
        coords.value = projectmMdelCoordinate.value.split(',').map(coord => {
            const num = parseFloat(coord);
            return isNaN(num) ? 0 : num.toFixed(6);
        });
        [x.value, y.value, z.value, angle.value = 0] = coords.value;
        projectMajorFlag.value = false;
        projectThreeDModelList.value = [];
        modelData.value = null;
        resultModel.value = '';
        isIframeLoading.value = false;
    }

    // 监听WebRTC连接状态，连接成功后加载模型（仅一次）
    const unwatch = watch(isWebRtcConnected, (connected) => {
        if (connected) {
            loadThreeDModel();
            unwatch(); // 取消监听，防止重复触发
        }
    }, { immediate: false });

    // 超时兜底：8秒未连接则强制加载
    clearTimeout(loadModelTimer.value);
    loadModelTimer.value = setTimeout(() => {
        if (!isWebRtcConnected.value) {
            console.warn('⚠️ WebRTC连接超时，强制加载模型');
            isWebRtcConnected.value = true;
            loadThreeDModel();
        }
    }, 8000);
});

onUnmounted(() => {
    clearTimeout(loadAssetsDebounceTimer.value);
    // 清理所有bus监听
    bus.off('cultureTypeMessage');
    bus.off('attractionTypeMessage');
    bus.off('scene-roaming-clicked');
    bus.off('time-change');
    bus.off('function-panel-clicked');
    bus.off('remarkMessage');
    bus.off('layerCheckMessage');
    bus.off('attraction-body-clicked');
    bus.off('vector-layer-clicked');
    bus.off('scheme-review-clicked');
    bus.off('search-relic');

    // 清理定时器和消息处理器
    clearTimeout(loadModelTimer.value);
    messageHandler.offCommand('OnLoadAssets', handleOnLoadAssets);
    messageHandler.offCommand('OnStartRoaming', () => { });
    messageHandler.offCommand('OnSwitchCamera', () => { });

    // 重置所有响应式状态
    isLeaving.value = false;
    isModelLoaded.value = false;
    isWebRtcConnected.value = false;
    isIframeLoading.value = true;
    isIframeLoaded.value = false;
    projectThreeDModelOssId.value = '';
    loadedModelIds.value.clear();
    processedAssetStates.value.clear();
    completedModelIds.value.clear();
    loadAssetsStatus.value = '';
    msgQueue.value = [];

    // 销毁iframe
    if (iframeRef.value) {
        iframeRef.value.src = 'about:blank';
        iframeRef.value = null;
    }
});
</script>
<style lang="scss" scoped>
.screen-page {
    width: 100%;
    height: 99.8vh;
    background: url(../../../static/image/map/map.png) no-repeat;
    background-size: 100% 100%;
    position: relative;
    overflow: hidden;
}

/* 加载提示样式 */
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