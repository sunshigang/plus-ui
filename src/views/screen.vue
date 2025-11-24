<template>
    <div class="screen-page">
        <iframe v-if="mapSwitch" id="iframe" ref="iframeRef" frameborder="0" :src="iframeUrl"
            style="width: 100%; height: 100%" allow="xr-spatial-tracking *" @load="handleIframeLoad"
            @error="handleIframeError"></iframe>
        <LeafletMap v-else></LeafletMap>
        <my-mask>
            <template v-slot:main>
                <top-header></top-header>
                <left-colum></left-colum>
                <right-colum></right-colum>
                <NotesPopup />
                <bottom />
                <mapTitle />
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
import { useRouter, useRoute } from 'vue-router'

import { toRefs, reactive, ref, onMounted, computed, onUnmounted } from 'vue'
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
const router = useRouter()
const route = useRoute()
// 接收路由参数
const projectIdCheck = ref('')
const projectmMdelCoordinate = ref('')
const projectMajorFlag = ref(false)
const projectThreeDModel = ref('')

const iframeUrl = "http://127.0.0.1:46150/";
const mapSwitch = ref(true)
const iframeRef = ref(null);
const isIframeLoaded = ref(false);
const splitScreen = ref(false);

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
// iframe加载完成后标记状态
const handleIframeLoad = () => {
    isIframeLoaded.value = true;
    console.log('iframe加载完成，可发送消息');
    // 发送队列中残留的消息
    while (msgQueue.value.length > 0) {
        const queuedData = msgQueue.value.shift();
        iframeRef.value.contentWindow.postMessage(JSON.stringify(queuedData), "*");
    }
};
/* 三维协议消息发送 */
const sendMsgUE = (data) => {
    // 关键修复：iframe隐藏时加入队列（原代码漏了这步）
    if (!mapSwitch.value || !iframeRef.value || !isIframeLoaded.value) {
        console.warn('iframe 未就绪，消息加入队列', data);
        msgQueue.value.push(data);
        return;
    }
    if (msgQueue.value.length > 100) {
        console.warn('消息队列过长，清理部分消息');
        msgQueue.value = msgQueue.value.slice(-50);
    }
    // 发送队列中残留的消息
    while (msgQueue.value.length > 0) {
        const queuedData = msgQueue.value.shift();
        iframeRef.value.contentWindow.postMessage(JSON.stringify(queuedData), "*");
    }
    // 发送当前消息
    try {
        iframeRef.value.contentWindow.postMessage(JSON.stringify(data), "*");
    } catch (error) {
        console.error('发送iframe消息失败', error, data);
        msgQueue.value.push(data); // 失败时重新入队
    }
};
const handleIframeError = () => {
    console.error('iframe 加载失败，检查 URL 或服务是否正常');
    // 可选：自动切换到 LeafletMap
    mapSwitch.value = false;
};
/**
 * 接送其他页面发送UE消息
 */
//备注信息弹窗
function transformWKT (wktStr) {
    // 1. 清理 WKT 字符串（处理空格、多余逗号，避免格式干扰）
    const cleanStr = wktStr.replace(/\s+/g, ',').replace(/,,+/g, ',').trim();
    const coordArr = cleanStr.split(',');
    const result = [];

    // 2. 校验坐标数组长度（至少2个元素，且为偶数，确保格式合法）
    if (coordArr.length < 2 || coordArr.length % 2 !== 0) {
        console.warn('WKT 格式错误，坐标数量需为偶数且至少2个', wktStr);
        return result;
    }

    // 3. 区分处理：2个元素是点，≥4个元素是线/面
    if (coordArr.length === 2) {
        // 点类型：直接拼接 ",0"（原始格式已为“经度,纬度”）
        const pointCoord = `${coordArr[0]},${coordArr[1]},0`;
        result.push(pointCoord);
    } else {
        // 线/面类型：循环交换“纬度,经度”为“经度,纬度”，再拼接 ",0"
        for (let i = 0; i < coordArr.length; i += 2) {
            if (i + 1 >= coordArr.length) break; // 避免数组越界
            const lat = coordArr[i];     // 原始第1项：纬度
            const lng = coordArr[i + 1]; // 原始第2项：经度
            const lineAreaCoord = `${lng},${lat},0`;
            result.push(lineAreaCoord);
        }
    }

    return result;
}
let dataWkt = []
bus.on('remarkMessage', data => {
    console.log("🚀 ~ data.wkt:", data.wkt)
    dataWkt = transformWKT(data.wkt);
    console.log("🚀 ~ data.dataWkt:", dataWkt)
    if (data.type == 'point') {
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
        if (data.checked) {
            sendMsgUE({
                "Command": "CreateVectorLayer_Line",
                "Args": {
                    "ID": data.id,
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
        if (data.checked) {
            sendMsgUE({
                "Command": "CreateVectorLayer_Area",
                "Args": {
                    "ID": data.id,
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

// 2. 简化cultureTypeMessage事件
bus.on('cultureTypeMessage', data => {
    const poiType = cultureTypeMap[data.id];
    if (!poiType) return; // 无效ID直接返回
    sendMsgUE({
        "Command": "ShowPOIWithType",
        "Args": { "Show": data.checked, "Type": [poiType] }
    });
});
bus.on('layerCheckMessage', data => {
    // 映射图层类型：line → Line，area → Area（匹配 UE 命令要求的 Type）
    const ueLayerType = data.layerType === 'Line' ? 'Line' : 'Area';

    // 发送与点数据格式对齐的 UE 命令
    sendMsgUE({
        "Command": "ShowVectorLayerWithType",
        "Args": {
            "Show": data.checked,    // 显示/隐藏状态（与点数据一致）
            "Type": ueLayerType,     // 线/面类型（正确映射）
            "Tag": data.name         // 图层名称（与点数据的 Type 逻辑一致）
        }
    });
});
// 3. 简化attractionTypeMessage事件
bus.on('attractionTypeMessage', data => {
    const poiType = attractionTypeMap[data.id];
    if (!poiType) return; // 无效ID直接返回
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
    console.log('attraction-body-clicked', data)
    sendMsgUE({
        "Command": "SwitchCamera",
        "Args": {
            "ID": data,
            "Duration": 1.0
        }
    });
});
const handleVectorLayer = (data) => {
    mapSwitch.value = !data
};
const handleSchemeReview = (data) => {
    if (data) mapSwitch.value = true
};
const handleSearchRelic = (data) => {
    const hasParking = data.includes('停车场');
    if (hasParking) {
        sendMsgUE({
            "Command": "FocusPOI",
            "Args": {
                "ID": `ParkingPOI_${data}`, // 假设停车场对应ScenePOI前缀
                "Type": "Parking"
            }
        });
    } else {
        // 不包含时，发送原有两个命令
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
};
const coords = projectmMdelCoordinate.value.split(',').map(coord => parseFloat(coord).toFixed(6));
const [x, y, z, angle = 0] = coords; // 角度默认0
let modelData = JSON.parse(projectThreeDModel.value)[0];
const path = modelData.url.replace(/^https?:\/\/[^\/]+\//, '');
const resultModel = path.replace(/^fangyan\//, '');
const handleFunctionPanel = (data) => {
    if (data.index === 0) {
        sendMsgUE({
            "Command": "SetCameraMove_Geo",
            "Args": {
                "CoordType": 0,
                "TargetLocation": `X=${x} Y=${y} Z=${z}`,
                "CameraLocation": `X=${x} Y=${y} Z=15000.000`, // 固定高度
                "Duration": 1.0
            }
        });
        splitScreen.value = false
        const isShow = data.isSelected;
        if (data.isSelected) {
            sendMsgUE({
                "Command": "ShowVectorLayerWithType",
                "Args": { "Show": isShow, "Type": "Area", "Tag": "生态保护红线" }
            });
        } else {
            sendMsgUE({
                "Command": "ShowVectorLayerWithType",
                "Args": { "Show": isShow, "Type": "Area", "Tag": "生态保护红线" }
            });
        }
    } else if (data.index === 1) {
        // 分屏比对逻辑（核心修改：读取项目预览信息）
        splitScreen.value = true;
        if (data.isSelected) {
            sendMsgUE({
                "Command": "LoadAssets",
                "Args": {
                    "ID": modelData.ossId, // 使用解析出的ossId
                    "Name": resultModel,
                    "State": 0,
                    "Angle": angle,
                    "CoordType": 0,
                    "Location": `${x},${y},${z}`,
                    "Scale": "1,1,1"
                }
            });
            sendMsgUE({ "Command": "SwitchSplitScreenState", "Args": { "State": true } });
            sendMsgUE({
                "Command": "SwitchAssetsState",
                "Args": {
                    "IDs": modelData.ossId, // 关联项目ID
                    "State": 1
                }
            });
            sendMsgUE({
                "Command": "GetAllAssets",
            });
        } else {
            // 关闭分屏（不变）
            sendMsgUE({ "Command": "SwitchSplitScreenState", "Args": { "State": false } });
            // sendMsgUE({
            //     "Command": "DeleteAssets",
            //     "Args": {
            //         "ID":  modelData.ossId
            //     }
            // });
        }
    } else if (data.index === 2) {
        splitScreen.value = false
        if (data.isSelected) {
            bus.on('time-change', year => {
                sendMsgUE({
                    "Command": "SetCameraMove_Geo",
                    "Args": {
                        "CoordType": 0,
                        "TargetLocation": `X=${x} Y=${y} Z=${z}`,
                        "CameraLocation": `X=${x} Y=${y} Z=15000.000`, // 固定高度
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
};
const clickBack = () => {
    sendMsgUE({
        "Command": "SwitchCamera",
        "Args": {
            "ID": "Main",
            "Duration": 1.0
        }
    });
    setTimeout(() => {
        if (projectMajorFlag.value === false) {
            router.push(`/project/normal/normal-review/${projectIdCheck.value}`)
        } else if (projectMajorFlag.value === true) {
            router.push(`/project/major/major-review/${projectIdCheck.value}`)
        }
    }, 1000);
};
onMounted(async () => {
    sendMsgUE({
        "Command": "SwitchCamera",
        "Args": {
            "ID": "Main",
            "Duration": 1.0
        }
    });
    const projectId = route.query.id;
    if (!projectId) {
        ElMessage.error('缺少项目ID');
        return;
    } try {
        const response = await getInfo(projectId);
        const projectData = response.data;
        projectIdCheck.value = projectData.id;
        projectmMdelCoordinate.value = projectData.modelCoordinate;
        projectMajorFlag.value = projectData.majorFlag;
        projectThreeDModel.value = projectData.threeDModel;
        // 2. 仅在onMounted中绑定事件
        bus.on('vector-layer-clicked', handleVectorLayer);
        bus.on('scheme-review-clicked', handleSchemeReview);
        bus.on('search-relic', handleSearchRelic);
        bus.on('function-panel-clicked', handleFunctionPanel);
    } catch (err) {
        ElMessage.error('数据获取失败：' + (err.message || '未知错误'));
    } finally {
    }
});

// 3. 单独定义onUnmounted，统一解绑所有事件（符合Vue规范）
onUnmounted(() => {
    bus.off('vector-layer-clicked', handleVectorLayer);
    bus.off('scheme-review-clicked', handleSchemeReview);
    bus.off('search-relic', handleSearchRelic);
    bus.off('cultureTypeMessage'); // 简化事件无需命名函数，直接off
    bus.off('attractionTypeMessage');
    bus.off('scene-roaming-clicked');
    bus.off('function-panel-clicked', handleFunctionPanel);
});

</script>
<style lang="scss" scoped>
.screen-page {
    width: 100%;
    height: 99.8vh;
    background: url(../../../static/image/map/map.png) no-repeat;
    background-size: 100% 100%;
}

.backButton {
    z-index: 2;
    pointer-events: auto;
    position: absolute;
    left: 50%; // 与time-column一致，左边缘先对齐屏幕50%处
    transform: translateX(-180px); // 再向左移动半个宽度180px，实现水平居中
    bottom: 40px;
    width: 360px;
    height: 99px;
    display: flex;
    justify-content: center;
    align-content: center;

    /* 通用线条样式 */
    .back-line {
        display: flex;
        align-items: center;
        height: 100%;
    }

    /* 左侧线条：从右向左排列 */
    .left-line {
        flex-direction: row-reverse;
        margin-right: 60px;
        /* 与按钮间距 */

        /* 虚线通用样式 */
        .dash-line {
            background: repeating-linear-gradient(to right, #ffd700, #ffd700 2px, transparent 2px, transparent 3px);
            height: 1px;
        }

        /* 实心圆 */
        .solid-circle {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background-color: #ffd700;
            margin: 0 3px;
        }

        /* 空心圆 */
        .hollow-circle {
            width: 13px;
            height: 13px;
            border-radius: 50%;
            border: 2px solid #ffd700;
            background-color: transparent;
            margin: 0 3px;
        }

        /* 左侧各段虚线长度 */
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

    /* 右侧线条：从左向右排列 */
    .right-line {
        flex-direction: row;
        margin-left: 10px;
        /* 与按钮间距 */

        /* 虚线通用样式（与左侧一致） */
        .dash-line {
            background: repeating-linear-gradient(to right, #ffd700, #ffd700 2px, transparent 2px, transparent 3px);
            height: 1px;
        }

        /* 实心圆（与左侧一致） */
        .solid-circle {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background-color: #ffd700;
            margin: 0 3px;
        }

        /* 空心圆（与左侧一致） */
        .hollow-circle {
            width: 13px;
            height: 13px;
            border-radius: 50%;
            border: 2px solid #ffd700;
            background-color: transparent;
            margin: 0 3px;
        }

        /* 右侧各段虚线长度（与左侧对称） */
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
