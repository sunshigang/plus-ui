<template>
    <div id="home">
        <iframe id="iframe" ref="iframeRef" frameborder="0" :src="iframeUrl" style="width: 100%; height: 100%"
            allow="xr-spatial-tracking *" @load="handleIframeLoad"></iframe>
        <!-- <LeafletMap v-else></LeafletMap> -->
        <my-mask>
            <template v-slot:main>
                <top-header></top-header>
                <!-- <left-colum></left-colum>
                <right-colum></right-colum>
                <NotesPopup /> -->
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
const iframeRef = ref(null);
const isIframeLoaded = ref(false);

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
// 搜索2. 简化cultureTypeMessage事件
// 3. 简化attractionTypeMessage事件

onMounted(() => {
    bus.on('attraction-body-clicked', data => {
        sendMsgUE({
            "Command": "SwitchCamera",
            "Args": {
                "ID": data,
                "Duration": 1.0
            }
        });
    });
    bus.on('previewModel', data => {
        const coords = data.modelCoordinate.split(',');
        const x = parseFloat(coords[0]).toFixed(5); // 保留5位小数，和原始数据一致
        const y = parseFloat(coords[1]).toFixed(6); // 保留6位小数，和原始数据一致
        const z = parseFloat(coords[2]).toFixed(3); // 保留3位小数，示例中Z=0.000
        const z1 = (500).toFixed(3);
        const url = data.threeDModel;
        const path = url.replace(/^https?:\/\/[^\/]+\//, ''); // 去掉协议和域名，保留 fangyan/2025/10/27/...
        // 再把fangyan/去掉，变成 2025/10/27/...
        const result = path.replace(/^fangyan\//, '');
        console.log("🚀 ~ result:", result)
        const sendMsg = () => {
            if (isIframeLoaded.value) {
                sendMsgUE({
                    "Command": "LoadAssets",
                    "Args": {
                        "ID": data.id,
                        "Name": result,
                        "State": 0,
                        "Angle": 0,
                        "CoordType": 0,
                        "Location": data.modelCoordinate,
                        "Scale": "2,2,2"
                    }
                });
                sendMsgUE({
                    "Command": "SetCameraMove_Geo",
                    "Args": {
                        "CoordType": 0,
                        "TargetLocation": `X=${x} Y=${y} Z=${z}`,
                        "CameraLocation": `X=${x} Y=${y} Z=${z1}`,
                        "Duration": 1.0
                    }
                });
            } else {
                setTimeout(sendMsg, 100); // 未加载完成则延迟重试
            }
        }
        sendMsg();

    });



});

// 3. 单独定义onUnmounted，统一解绑所有事件（符合Vue规范）
onUnmounted(() => {
    bus.off('previewModel');
    bus.off('attraction-body-clicked');
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
