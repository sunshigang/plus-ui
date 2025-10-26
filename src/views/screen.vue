<template>
    <div id="home">
        <iframe v-if="mapSwitch" id="iframe" ref="iframeRef" frameborder="0" :src="iframeUrl"
            style="width: 100%; height: 100%" allow="xr-spatial-tracking *" @load="handleIframeLoad"></iframe>
        <LeafletMap v-else></LeafletMap>
        <my-mask>
            <template v-slot:main>
                <top-header></top-header>
                <left-colum></left-colum>
                <right-colum></right-colum>
                <NotesPopup />
                <bottom />
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
const iframeUrl = "http://127.0.0.1:46150/";
const mapSwitch = ref(true)
const iframeRef = ref(null);
const isIframeLoaded = ref(false);
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
// iframe加载完成后标记状态
const handleIframeLoad = () => {
    isIframeLoaded.value = true;
    console.log('iframe加载完成，可发送消息');
};
/* 三维协议消息发送 */
const sendMsgUE = (data) => {
    if (!iframeRef.value) {
        console.warn('iframe尚未加载或已被移除，无法发送消息', data);
        return;
    }
    if (!isIframeLoaded.value) {
        console.warn('iframe内容未加载完成，延迟发送消息', data);
        // 延迟100ms重试（可根据实际调整）
        setTimeout(() => sendMsgUE(data), 100);
        return;
    }
    try {
        iframeRef.value.contentWindow.postMessage(data, "*");
    } catch (error) {
        console.error('发送iframe消息失败（可能是跨域问题）', error, data);
    }
};
/**
 * 接送其他页面发送UE消息
 */
//备注信息弹窗
function convertCoordinates (coordsArray) {
    return coordsArray.map(coord => `${coord[1]},${coord[0]},0`);
}
bus.on('add-note', data => {
    console.log("🚀 ~ data:", data.wkt)

    if (data.type == 'point') {
        const wktStr = `${data.wkt[0]},${data.wkt[1]},0`;
        sendMsgUE({
            "Command": "CreateVectorLayer_Point",
            "Args": {
                "ID": data.id,
                "Name": data.layerName,
                "CoordType": 0,
                "Locations": [wktStr]
            }
        });
    } else if (data.type == 'polyline') {
        //data.wkt=[ [28.9273970470134, 120.18830537796022],[28.926134052715568, 120.18957674503328],[28.92570209574455, 120.18750071525575],[28.926833631383644, 120.1869320869446]]
        data.wkt = convertCoordinates(data.wkt);
        sendMsgUE({
            "Command": "CreateVectorLayer_Line",
            "Args": {
                "ID": data.id,
                "Color": "FF0000FF",
                "Size": 1.0,
                "CoordType": 0,
                "Locations": data.wkt
            }
        });
    } else {
        data.wkt = convertCoordinates(data.wkt);
        sendMsgUE({
            "Command": "CreateVectorLayer_Area",
            "Args": {
                "ID": data.id,
                "Color": "FFB500FF",
                "CoordType": 0,
                "Locations": data.wkt
            }
        });
    }
})
bus.on('remarkMessage', data => {
    console.log("🚀 ~ data:", data)
    if (data.type == 'point') {
        if (data.checked) {
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
// 搜索
bus.on('search-relic', data => {
    console.log('search-relic', data)
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
            "Command": "ShowVectorLayer",
            "Args": {
                "ID": "Area1",
                "Show": true,
                "Type": "Area"
            }
        });
        sendMsgUE({
            "Command": "ShowVectorLayer",
            "Args": {
                "ID": "Line1",
                "Show": true,
                "Type": "Line"
            }
        });
        sendMsgUE({
            "Command": "ShowVectorLayer",
            "Args": {
                "ID": "Point1",
                "Show": true,
                "Type": "Point"
            }
        });
    } else {
        sendMsgUE({
            "Command": "ShowVectorLayer",
            "Args": {
                "ID": "Area1",
                "Show": false,
                "Type": "Area"
            }
        });
        sendMsgUE({
            "Command": "ShowVectorLayer",
            "Args": {
                "ID": "Line1",
                "Show": false,
                "Type": "Line"
            }
        });
        sendMsgUE({
            "Command": "ShowVectorLayer",
            "Args": {
                "ID": "Point1",
                "Show": false,
                "Type": "Point"
            }
        });
    }
})
const handleVectorLayer = (data) => {
    mapSwitch.value = !data
};
const handleSchemeReview = (data) => {
    if (data) mapSwitch.value = true
};
const handleMessage = (e) => {
    console.log(e.data)
};
const handleSearchRelic = (data) => {
    console.log('search-relic', data)
};
const handleFunctionPanel = (data) => {
    if (data.index === 0) {
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
        // 加载并下载模型到场景
        // sendMsgUE({
        //     "Command": "LoadAssets",
        //     "Args": {
        //         "ID": "Assets1",
        //         "Name": "gelou.pak",
        //         "State": 0,
        //         "Angle": 0,
        //         "CoordType": 0,
        //         "Location": "120.18821,28.923133,0",
        //         "Scale": "1,1,1"
        //     }
        // });
        if (data.isSelected) {
            sendMsgUE({
                "Command": "SwitchSplitScreenState",
                "Args": {
                    "State": true
                }
            });
        } else {
            sendMsgUE({
                "Command": "SwitchSplitScreenState",
                "Args": {
                    "State": false
                }
            });
        }
    } else if (data.index === 2) {
        if (data.isSelected) {
            sendMsgUE({
                "Command": "SwitchSpaceTime",
                "Args": {
                    "Type": "2025"
                }
            });
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
    window.addEventListener('message', handleMessage);
    // 初始化发送主镜头指令
    sendMsgUE({
        "Command": "SwitchCamera",
        "Args": { "ID": "Main", "Duration": 1.0 }
    });



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
    window.removeEventListener('message', handleMessage);
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
