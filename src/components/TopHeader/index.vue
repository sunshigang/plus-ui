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
const data = reactive({
    currentTime: "2025.06.01 16:46:00", // 一个空格
});
const sceneRoamingShow = ref(true)
const activeShotId = ref('');
const weatherData = reactive({
    weather: {
        imgPath: '', // 初始为空，避免渲染错误
        temp: 0,
        main: '',
        isShow: true
    }
});
const { currentTime } = toRefs(data);
const { weather } = toRefs(weatherData)
const showLogout = ref(false);
let timer = null; // 存储定时器ID，用于清除


const handleShotClick = (shotId, shotName) => {
    activeShotId.value = shotId; // 更新当前选中的按钮ID（控制样式）
    bus.emit('attraction-body-clicked', shotName); // 发送总线事件，传入镜头名称
};
onMounted(() => {
    bus.on('function-panel-clicked', index => {
        console.log("🚀 ~ index:", index)
        if (index.index === 1) {
            if (index.isSelected) {
                sceneRoamingShow.value = false
            } else {
                sceneRoamingShow.value = true
            }
        } else {
            sceneRoamingShow.value = true
        }
    })
    bus.on('scheme-review-clicked', data => {
        if (data) {
            sceneRoamingShow.value = true
        }
    })
    bus.on('vector-layer-clicked', data => {
        if (data) {
            sceneRoamingShow.value = false
        } else {
            sceneRoamingShow.value = true
        }
    })
    getCurrentTime();
    // 1. 时间更新定时器：赋值给 timer
    timer = setInterval(() => {
        getCurrentTime();
    }, 1000);

    getWeather();
    // 2. 天气更新定时器：建议也用变量存储（可选，避免多个定时器泄漏）
    const weatherTimer = setInterval(() => {
        getWeather();
    }, 86400000); // 24小时更新一次天气

    // 3. 组件卸载时清除天气定时器
    onUnmounted(() => {
        clearInterval(timer); // 清除时间定时器
        clearInterval(weatherTimer); // 清除天气定时器
    });
});

onUnmounted(() => {
    // 清除定时器（使用存储的ID）
    clearInterval(timer);
});
const getCurrentTime = () => {
    // 格式化字符串修改为 "YYYY.MM.DD HH:mm:ss"
    // HH表示24小时制，mm表示分钟，ss表示秒
    data.currentTime = moment().format("YYYY.MM.DD HH:mm:ss");
};
const getWeather = () => {
    //https://api.openweathermap.org/data/2.5/weather?q=Yongkang,cn&appid=660c2c494ed45834972bde2262b50c1b
    const apiKey = '660c2c494ed45834972bde2262b50c1b'
    const apiUrl = `/api/weather/data/2.5/weather?q=Yongkang,cn&appid=${apiKey}`
    axios.get(apiUrl).then(response => {
        const weatherInfo = response.data.weather[0]; // 取数组第一个元素
        weatherData.weather = {
            imgPath: `https://openweathermap.org/img/w/${weatherInfo.icon}.png`,
            temp: Math.round(response.data.main.temp - 272.15), // 转换为摄氏度
            main: weatherInfo.main,
            isShow: true
        };
    });
}
const loginOut = () => {
    // window.localStorage.clear();
    // window.sessionStorage.clear();

    router.push("/");
};


</script>

<style lang="scss">
#top-header {
    width: 100%;
    height: 100px;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 3;

    .time {
        position: absolute;
        left: 300px;
        top: 35px;
        // width: 220px;
        font-family: 'ZCOOL QingKe HuangYou';
        font-weight: 400;
        font-size: 20px;
        color: #FCFCED;
        text-align: left;
        font-style: normal;
        text-transform: none;
        word-spacing: 1em;
    }

    .top-right {
        position: absolute;
        right: 12%;
        top: 36px;
        height: 30px;
        /* 固定高度，与内容高度匹配 */
        font-size: 20px;
        font-weight: 400;
        font-family: 'ZCOOL QingKe HuangYou';
        color: #ffffff;
        display: flex;
        /* 启用Flex布局 */
        align-items: center;
        /* 垂直居中（关键） */
        justify-content: center;
        /* 水平居中（子元素整体居中） */
        gap: 10px;

        /* 子元素之间的间距（替代margin-left） */
        .todayWeatherIcon {
            width: 30px;
            height: 30px;
        }

        /* 移除子元素的margin-left，统一用gap控制间距 */
        .todayWeatherMain,
        .todayWeatherTemp {
            margin: 0;
            /* 清除默认margin */
        }
    }
}





.attractionBody {
    pointer-events: auto;
    position: absolute;
    width: 400px;
    height: 35px;
    left: 76%;
    top: 10%;
    z-index: 2;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    font-size: 17px;

    .mainShot {
        cursor: pointer;
        width: 72px;
        height: 32px;
        background: url(../../static/image/home/lens.png) no-repeat;
        background-size: 100% 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
    }

    .mainShoted {
        background: url(../../static/image/home/lensed.png) no-repeat;
        background-size: 100% 100%;
    }

    .wuFengShot {
        cursor: pointer;
        width: 72px;
        height: 32px;
        background: url(../../static/image/home/lens.png) no-repeat;
        background-size: 100% 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        color: white
    }

    .wuFengShoted {
        background: url(../../static/image/home/lensed.png) no-repeat;
        background-size: 100% 100%;
    }

    .filmShot {
        cursor: pointer;
        width: 120px;
        height: 32px;
        background: url(../../static/image/home/lens.png) no-repeat;
        background-size: 100% 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        color: white
    }

    .filmShoted {
        background: url(../../static/image/home/lensed.png) no-repeat;
        background-size: 100% 100%;
    }

    .huGongShot {
        cursor: pointer;
        width: 72px;
        height: 32px;
        background: url(../../static/image/home/lens.png) no-repeat;
        background-size: 100% 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        color: white
    }

    .huGongShoted {
        background: url(../../static/image/home/lensed.png) no-repeat;
        background-size: 100% 100%;
    }
}
</style>
