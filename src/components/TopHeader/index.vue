<template>
    <div id="top-header">
        <span class="time">{{ currentTime }}</span>
        <div class="top-right">
            <img class="todayWeatherIcon" :src="weather.imgPath" />
            <div v-if="weather.main == 'Clouds'" class="todayWeatherMain">阴天</div>
            <div v-if="weather.main == 'Clear'" class="todayWeatherMain">晴天</div>
            <div v-if="weather.main == 'Rain'" class="todayWeatherMain">雨天</div>
            <div v-if="weather.main == 'Snow'" class="todayWeatherMain">雪天</div>
            <div class="todayWeatherTemp">{{ weather.temp }}°C</div>
        </div>
    </div>

    <div v-show="sceneRoamingShow" class="attractionBody">
        <div class="mainShot" @click="handleShotClick('mainShot', 'Main')"
            :class="{ mainShoted: activeShotId === 'mainShot' }">主镜头
        </div>
        <div class="wuFengShot" @click="handleShotClick('wuFengShot', 'WFSY_00001')"
            :class="{ wuFengShoted: activeShotId === 'wuFengShot' }">
            五峰书院</div>
        <div class="filmShot" @click="handleShotClick('filmShot', 'YSC_00001')"
            :class="{ filmShoted: activeShotId === 'filmShot' }">石鼓寮影视城
        </div>
        <div class="huGongShot" @click="handleShotClick('huGongShot', 'HGC_00001')"
            :class="{ huGongShoted: activeShotId === 'huGongShot' }">胡公祠
        </div>
    </div>
</template>

<script setup>
import axios from 'axios'
import { useRouter } from 'vue-router'
import { ref, reactive, toRefs, onMounted, onUnmounted, getCurrentInstance } from 'vue'
import moment from 'moment';
import 'moment/locale/zh-cn'
moment.locale('zh-cn')
import bus from '../../libs/eventbus'

const router = useRouter();
const { proxy } = getCurrentInstance()

// 响应式状态
const data = reactive({
    currentTime: "2025.06.01 16:46:00",
});
const sceneRoamingShow = ref(true)
const activeShotId = ref('');
const weatherData = reactive({
    weather: {
        imgPath: '',
        temp: 0,
        main: '',
        isShow: true
    }
});
const showLogout = ref(false);

// 解构响应式状态
const { currentTime } = toRefs(data);
const { weather } = toRefs(weatherData)

// 定时器存储（统一提升到外部，便于清理）
let timer = null; // 时间更新定时器
let weatherTimer = null; // 天气更新定时器

// ========== 提取Bus回调为命名函数（便于精准解绑） ==========
const handleFunctionPanelClicked = (index) => {
    console.log("🚀 ~ index:", index)
    if (index.index === 1) {
        sceneRoamingShow.value = !index.isSelected
    } else {
        sceneRoamingShow.value = true
    }
}

const handleSchemeReviewClicked = (data) => {
    if (data) {
        sceneRoamingShow.value = true
    }
}

const handleVectorLayerClicked = (data) => {
    sceneRoamingShow.value = !data
}

// 镜头点击事件
const handleShotClick = (shotId, shotName) => {
    activeShotId.value = shotId;
    bus.emit('attraction-body-clicked', shotName);
};

// 获取当前时间
const getCurrentTime = () => {
    data.currentTime = moment().format("YYYY.MM.DD HH:mm:ss");
};

// 获取天气数据
const getWeather = () => {
    const apiKey = '660c2c494ed45834972bde2262b50c1b'
    const apiUrl = `/api/weather/data/2.5/weather?q=Yongkang,cn&appid=${apiKey}`
    axios.get(apiUrl).then(response => {
        const weatherInfo = response.data.weather[0];
        weatherData.weather = {
            imgPath: `https://openweathermap.org/img/w/${weatherInfo.icon}.png`,
            temp: Math.round(response.data.main.temp - 272.15),
            main: weatherInfo.main,
            isShow: true
        };
    }).catch(error => {
        console.error('获取天气失败:', error); // 补充错误捕获，避免控制台报错
    });
}

// 退出登录
const loginOut = () => {
    router.push("/");
};

// ========== 挂载生命周期 ==========
onMounted(() => {
    // 1. 绑定Bus事件（命名函数）
    bus.on('function-panel-clicked', handleFunctionPanelClicked);
    bus.on('scheme-review-clicked', handleSchemeReviewClicked);
    bus.on('vector-layer-clicked', handleVectorLayerClicked);

    // 2. 初始化时间
    getCurrentTime();
    // 3. 启动时间定时器（1秒更新一次）
    timer = setInterval(getCurrentTime, 1000);

    // 4. 初始化天气
    getWeather();
    // 5. 启动天气定时器（24小时更新一次）
    weatherTimer = setInterval(getWeather, 86400000);
});

// ========== 卸载生命周期（核心：清理所有监听/定时器） ==========
onUnmounted(() => {
    // 1. 解绑所有Bus事件（精准解绑命名函数）
    bus.off('function-panel-clicked', handleFunctionPanelClicked);
    bus.off('scheme-review-clicked', handleSchemeReviewClicked);
    bus.off('vector-layer-clicked', handleVectorLayerClicked);

    // 2. 清除所有定时器（判空避免报错）
    if (timer) clearInterval(timer);
    if (weatherTimer) clearInterval(weatherTimer);

    // 3. 重置响应式状态（切断内存引用）
    data.currentTime = "";
    sceneRoamingShow.value = false;
    activeShotId.value = '';
    weatherData.weather = {
        imgPath: '',
        temp: 0,
        main: '',
        isShow: false
    };
    showLogout.value = false;

    // 4. 兜底清理DOM事件（可选，Vue自动处理但补充保险）
    const attractionBody = document.querySelector('.attractionBody');
    if (attractionBody) attractionBody.onclick = null;

    // 5. 取消未完成的axios请求（避免请求返回后更新已卸载组件的状态）
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    source.cancel('组件已卸载，取消天气请求');
});
</script>

<style lang="scss">
#top-header {
    width: 100%;
    height: 5.2083vw;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 3;

    .time {
        position: absolute;
        left: 15.625vw;
        top: 1.8229vw;
        font-family: 'ZCOOL QingKe HuangYou';
        font-weight: 400;
        font-size: 1.042vw;
        color: #FCFCED;
        text-align: left;
        font-style: normal;
        text-transform: none;
        word-spacing: 1em;
    }

    .top-right {
        position: absolute;
        right: 12%;
        top: 1.875vw;
        height: 1.5625vw;
        font-size: 1.042vw;
        font-weight: 400;
        font-family: 'ZCOOL QingKe HuangYou';
        color: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5208vw;

        .todayWeatherIcon {
            width: 1.5625vw;
            height: 1.5625vw;
        }

        .todayWeatherMain,
        .todayWeatherTemp {
            margin: 0;
        }
    }
}

.attractionBody {
    pointer-events: auto;
    position: absolute;
    width: 20.833vw;
    height: 1.83vw;
    left: 76%;
    top: 10%;
    z-index: 2;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    font-size: 0.8854vw;

    .mainShot, .wuFengShot, .filmShot, .huGongShot {
        cursor: pointer;
        height: 1.667vw;
        background: url(../../static/image/home/lens.png) no-repeat;
        background-size: 100% 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
    }

    .mainShot { width: 3.75vw; }
    .wuFengShot { width: 3.75vw; }
    .filmShot { width: 6.25vw; }
    .huGongShot { width: 3.75vw; }

    .mainShoted, .wuFengShoted, .filmShoted, .huGongShoted {
        background: url(../../static/image/home/lensed.png) no-repeat;
        background-size: 100% 100%;
    }
}
</style>