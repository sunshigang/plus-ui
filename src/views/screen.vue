<template>
    <div id="home">
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
                <mapTitle  />
            </template>
        </my-mask>
    </div>
</template>

<script setup>
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
    if (!mapSwitch.value) {
        console.warn('iframe 已隐藏，消息加入队列', data);
        msgQueue.value.push(data); // 加入队列
        return;
    }
    if (!iframeRef.value) {
        console.warn('iframe 已隐藏，无法发送消息', data);
        msgQueue.value.push(data); // 加入队列
        return;
    }
    if (!iframeRef.value) {
        console.warn('iframe尚未加载或已被移除，无法发送消息', data);
        return;
    }
    if (!isIframeLoaded.value) {
        console.warn('iframe内容未加载完成，延迟发送消息', data);
        msgQueue.value.push(data); // 加入队列
        // 延迟100ms重试（可根据实际调整）
        // setTimeout(() => sendMsgUE(data), 100);
        return;
    }
    while (msgQueue.value.length > 0) {
        const queuedData = msgQueue.value.shift();
        iframeRef.value.contentWindow.postMessage(JSON.stringify(queuedData), "*");
    }
    try {
        iframeRef.value.contentWindow.postMessage(JSON.stringify(data), "*");
    } catch (error) {
        console.error('发送iframe消息失败（可能是跨域问题）', error, data);
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
        sendMsgUE({
            "Command": "OnStartRoaming",
            "Args": {
                "ID": "场景漫游",
                "State": "Start"
            }
        });
    } else {
        sendMsgUE({
            "Command": "OnStartRoaming",
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
const handleFunctionPanel = (data) => {
    if (data.index === 0) {
        splitScreen.value = false
        if (data.isSelected) {
            sendMsgUE({
                "Command": "ShowPOIWithType",
                "Args": {
                    "Show": true,
                    "Type": ["All"]
                }
            });
        } else {
            sendMsgUE({
                "Command": "ShowPOIWithType",
                "Args": {
                    "Show": false,
                    "Type": ["All"]
                }
            });
        }
    } else if (data.index === 1) {
        splitScreen.value = true
        if (data.isSelected) {
            sendMsgUE({
                "Command": "SwitchSplitScreenState",
                "Args": {
                    "State": true
                }
            });
            bus.on('dragIcon:screenRatio', data => {
                console.log("🚀 ~ handleFunctionPanel ~ data:", data)
                sendMsgUE({
                    "Command": "SwitchSplitScreenRatio",
                    "Args": {
                        "Ratio": data
                    }
                });
            })
        } else {
            sendMsgUE({
                "Command": "SwitchSplitScreenState",
                "Args": {
                    "State": false
                }
            });
        }
    } else if (data.index === 2) {
        splitScreen.value = false
        if (data.isSelected) {
            bus.on('time-change', year => {
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

onMounted(() => {
    // 2. 仅在onMounted中绑定事件
    bus.on('vector-layer-clicked', handleVectorLayer);
    bus.on('scheme-review-clicked', handleSchemeReview);
    bus.on('search-relic', handleSearchRelic);
    bus.on('function-panel-clicked', handleFunctionPanel);




});

// 3. 单独定义onUnmounted，统一解绑所有事件（符合Vue规范）
onUnmounted(() => {
    bus.off('vector-layer-clicked', handleVectorLayer);
    bus.off('scheme-review-clicked', handleSchemeReview);
    bus.off('search-relic', handleSearchRelic);
    bus.off('cultureTypeMessage'); // 简化事件无需命名函数，直接off
    bus.off('attractionTypeMessage');
    // bus.off('scene-roaming-clicked');
    bus.off('function-panel-clicked', handleFunctionPanel);
});

</script>
<style lang="scss" scoped>
#home {
    width: 100%;
    height: 100vh;
    background: url(../../../static/image/map/map.png) no-repeat;
    background-size: 100% 100%;
}
</style>
