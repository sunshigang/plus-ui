<template>
  <div class="app-container home">
    <el-row :gutter="20">
      <el-col :sm="24" :lg="12" style="padding-left: 1px">
        <h2>规划管理应用系统</h2>
        <h3>方岩风景名胜区简介</h3>
        <p>
          方岩风景名胜区，是以丹崖翠谷、绝壁洞穴、奇峰峭壁、飞瀑碧潭为风景资源特色，书院文化和胡公信仰为文化特色；以生态保护、科普教育、观光体验和休闲度假为主要功能的国家级风景名胜区。方岩风景名胜区共有景源 86 处，其中一级景源
          13 处，二级景源 32
          处，三级景源41处。主要景点有大坑、方岩、寿山谷、大寮、石鼓寮、胡公祠、五峰书院、驻霞峰、母子樟、南岩、小坑、鸡鸣峰、公岩、桃花峰、覆釜峰、瀑布峰、固厚峰、小寮、罗汉古洞、千人坑、胡公读书堂、飞崖洞、狮峰、婆岩、烧焦岩、试剑石、五峰双桐、龙湫瀑、天墨水瀑、桃花珠瀑、泉石膏盲、云谷洞、石马坑、五云洞、鸳鸯瀑、石钟、石笋、金鼓洞、石鼓、五色洞等景观资源点缀其间，构成了方岩风景名胜区独特的自然风光。
        </p>
        <h3>景源分布情况统计</h3>
        <div ref="sourcePie" class="chart-container"></div>
        <h3>资源分级保护</h3>
        <p>
          一级保护区面积共计34.06km2（其中方岩片区面积27.88km2，五指岩片区面积6.18km2），占风景区总面积比例
          23.16%，自然保护核心区、各游览区范围及周边地区。二级保护区面积共计53.06km2（其中方岩片区面积35.07km2，五指岩片区面积17.99km2），占风景区总面积比例
          36.07%。三级保护区面积共计59.96km2（其中方岩片区面积35.63km2，五指岩片区面积24.33km2），占风景区总面积比例 40.77%。
        </p>
        <div ref="protectionPie" class="chart-container"></div>
      </el-col>

      <el-col :sm="24" :lg="12" style="padding-left: 20px">
        <h3>国土空间规划</h3>
        <p style="margin-top: 10px; font-size: 12px; color: #666;">
          数据说明：表格展示了各类用地的现状与规划面积及占比，总面积保持147.08km²不变
        </p>
        <div ref="landUseBar" class="chart-container"></div>
        <h3>主要景点轮播图</h3>
        <el-carousel ref="carouselRef" :interval="3000" autoplay class="carousel-container">
          <el-carousel-item v-for="(item, index) in carouselImages" :key="index" class="carousel-item">
            <span class="carousel-text">{{ item.alt }}</span>
            <img :src="item.url" :alt="item.alt" class="carousel-img">
          </el-carousel-item>
        </el-carousel>


      </el-col>
    </el-row>
    <el-divider />
  </div>
</template>

<script setup name="Index" lang="ts">
import { onMounted, ref } from 'vue';
import * as echarts from 'echarts';
import fangyan1 from '../assets/images/fangyan-1.jpg';
import fangyan2 from '../assets/images/fangyan-2.jpg';
import fangyan3 from '../assets/images/fangyan-3.jpg';
import fangyan4 from '../assets/images/fangyan-4.jpg';
import fangyan5 from '../assets/images/fangyan-5.jpg';
import fangyan6 from '../assets/images/fangyan-6.jpg';
import fangyan7 from '../assets/images/fangyan-7.jpg';
import fangyan8 from '../assets/images/fangyan-8.jpg';
import fangyan9 from '../assets/images/fangyan-9.jpg';
import fangyan10 from '../assets/images/fangyan-10.jpg';
import fangyan11 from '../assets/images/fangyan-11.jpg';
import fangyan12 from '../assets/images/fangyan-12.jpg';
// 图表容器引用
const sourcePie = ref<HTMLDivElement>(null);
const protectionPie = ref<HTMLDivElement>(null);
const landUseBar = ref<HTMLDivElement>(null); // 新增柱状图容器
const carouselRef = ref<InstanceType<typeof import('element-plus')['ElCarousel']>>(); // 轮播图引用

const carouselImages = ref([
  { url: fangyan1, alt: '方岩风景名胜区-赫灵' },
  { url: fangyan2, alt: '方岩风景名胜区-天下粮仓' },
  { url: fangyan3, alt: '方岩风景名胜区-丹霞赤壁' },
  { url: fangyan4, alt: '方岩风景名胜区-悬空寺' },
  { url: fangyan5, alt: '方岩风景名胜区-胡公祠' },
  { url: fangyan6, alt: '方岩风景名胜区-五峰书院' },
  { url: fangyan7, alt: '方岩风景名胜区-天下粮仓' },
  { url: fangyan8, alt: '方岩风景名胜区-悬空寺' },
  { url: fangyan9, alt: '方岩风景名胜区-广慈寺' },
  { url: fangyan10, alt: '方岩风景名胜区-半天长廊' },
  { url: fangyan11, alt: '方岩风景名胜区-天下粮仓' },
  { url: fangyan12, alt: '方岩风景名胜区-南岩景区' },

]);
// 初始化景源分布饼图
const initSourcePie = () => {
  if (!sourcePie.value) return;

  const chart = echarts.init(sourcePie.value);

  // 景源细分数据：一级/二级/三级，每级包含自然和人文景源数量
  const sourceData = [
    { level: '一级景源', natural: 8, cultural: 5, total: 13 },
    { level: '二级景源', natural: 23, cultural: 9, total: 32 },
    { level: '三级景源', natural: 27, cultural: 14, total: 41 }
  ];

  // 配置项（柱状图）
  const option = {
    title: {
      text: '景源分布情况（按自然/人文分类）',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (params: any[]) => {
        const level = params[0].name;
        const natural = params[0].value;
        const cultural = params[1].value;
        const total = sourceData.find(item => item.level === level)?.total || 0;
        return `
          <div>${level}</div>
          <div>自然景源：${natural} 处</div>
          <div>人文景源：${cultural} 处</div>
          <div>合计：${total} 处</div>
        `;
      }
    },
    legend: {
      data: ['自然景源', '人文景源'],
      top: 30 // 图例位置
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: sourceData.map(item => item.level), // x轴为景源等级
      axisLabel: {
        fontSize: 14
      }
    },
    yAxis: {
      type: 'value',
      name: '数量（处）',
      nameLocation: 'middle',
      nameGap: 30,
      minInterval: 1 // y轴刻度为整数（数量不能为小数）
    },
    series: [
      {
        name: '自然景源',
        type: 'bar',
        data: sourceData.map(item => item.natural),
        itemStyle: { color: '#409EFF' }, // 蓝色：自然景源
        barWidth: '15%'
      },
      {
        name: '人文景源',
        type: 'bar',
        data: sourceData.map(item => item.cultural),
        itemStyle: { color: '#F56C6C' }, // 红色：人文景源
        barWidth: '15%'
      }
    ]
  };

  chart.setOption(option);

  // 响应窗口大小变化
  window.addEventListener('resize', () => {
    chart.resize();
  });
};

// 初始化资源分级保护饼图
const initProtectionPie = () => {
  if (!protectionPie.value) return;

  const chart = echarts.init(protectionPie.value);

  // 保护分级数据
  const data = [
    { name: '一级保护区', value: 34.06 },
    { name: '二级保护区', value: 53.06 },
    { name: '三级保护区', value: 59.96 }
  ];

  // 配置项
  const option = {
    title: {
      text: '资源分级保护面积',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} km² ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: ['一级保护区', '二级保护区', '三级保护区']
    },
    series: [
      {
        name: '保护区等级',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 18,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: data
      }
    ]
  };

  chart.setOption(option);

  // 响应窗口大小变化
  window.addEventListener('resize', () => {
    chart.resize();
  });
};
const initLandUseBar = () => {
  if (!landUseBar.value) return;
  const chart = echarts.init(landUseBar.value);

  // 国土空间规划数据
  const landUseData = [
    { name: '风景游赏用地', currentArea: 6.00, currentRatio: 4.06, planArea: 10.93, planRatio: 7.43 },
    { name: '旅游服务设施用地', currentArea: 0.04, currentRatio: 0.03, planArea: 0.63, planRatio: 0.43 },
    { name: '居民社会用地', currentArea: 2.00, currentRatio: 1.36, planArea: 1.50, planRatio: 1.02 },
    { name: '交通与工程用地', currentArea: 1.98, currentRatio: 1.35, planArea: 2.50, planRatio: 1.70 },
    { name: '林地', currentArea: 107.84, currentRatio: 73.32, planArea: 103.13, planRatio: 70.12 },
    { name: '园地', currentArea: 5.07, currentRatio: 3.45, planArea: 4.93, planRatio: 3.35 },
    { name: '耕地', currentArea: 10.79, currentRatio: 7.34, planArea: 10.38, planRatio: 7.05 },
    { name: '草地', currentArea: 2.19, currentRatio: 1.49, planArea: 2.10, planRatio: 1.43 },
    { name: '水域', currentArea: 11.10, currentRatio: 7.55, planArea: 10.98, planRatio: 7.47 },
    { name: '滞留用地', currentArea: 0.07, currentRatio: 0.05, planArea: 0, planRatio: 0 }
  ];

  // 配置项
  const option = {
    title: { text: '国土空间规划用地面积对比', left: 'center' },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (params: any[]) => {
        const name = params[0].name;
        const current = params[0].value;
        const currentRatio = landUseData.find(item => item.name === name)?.currentRatio || 0;
        const plan = params[1].value;
        const planRatio = landUseData.find(item => item.name === name)?.planRatio || 0;
        return `
          <div>${name}</div>
          <div>现状：${current} km² (${currentRatio}%)</div>
          <div>规划：${plan} km² (${planRatio}%)</div>
        `;
      }
    },
    legend: { data: ['现状', '规划'], top: 30 },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      data: landUseData.map(item => item.name),
      axisLabel: {
        interval: 0,
        rotate: 30, // 文字倾斜30度，避免重叠
        fontSize: 12
      }
    },
    yAxis: {
      type: 'value',
      name: '面积 (km²)',
      nameLocation: 'middle',
      nameGap: 30
    },
    series: [
      {
        name: '现状',
        type: 'bar',
        data: landUseData.map(item => item.currentArea),
        itemStyle: { color: '#409EFF' }, // 蓝色：现状
        barWidth: '30%'
      },
      {
        name: '规划',
        type: 'bar',
        data: landUseData.map(item => item.planArea),
        itemStyle: { color: '#67C23A' }, // 绿色：规划
        barWidth: '30%'
      }
    ]
  };

  chart.setOption(option);
  // 响应窗口大小变化
  window.addEventListener('resize', () => chart.resize());
};

// 页面挂载后初始化图表
onMounted(() => {
  initSourcePie();
  initProtectionPie();
  initLandUseBar(); // 新增柱状图初始化
});
const goTarget = (url: string) => {
  window.open(url, '__blank');
};
</script>

<style lang="scss" scoped>
.home {
  blockquote {
    padding: 10px 20px;
    margin: 0 0 20px;
    font-size: 17.5px;
    border-left: 5px solid #eee;
  }

  hr {
    margin-top: 20px;
    margin-bottom: 20px;
    border: 0;
    border-top: 1px solid #eee;
  }

  .col-item {
    margin-bottom: 20px;
  }

  ul {
    padding: 0;
    margin: 0;
  }

  font-family: 'open sans',
  'Helvetica Neue',
  Helvetica,
  Arial,
  sans-serif;
  font-size: 13px;
  color: #676a6c;
  overflow-x: hidden;

  ul {
    list-style-type: none;
  }

  h4 {
    margin-top: 0px;
  }

  h2 {
    margin-top: 0px;
    font-size: 26px;
    font-weight: 100;
  }

  p {
    margin-top: 10px;

    b {
      font-weight: 700;
    }
  }

  .update-log {
    ol {
      display: block;
      list-style-type: decimal;
      margin-block-start: 1em;
      margin-block-end: 1em;
      margin-inline-start: 0;
      margin-inline-end: 0;
      padding-inline-start: 40px;
    }
  }
}

// 图表容器样式
.chart-container {
  width: 100%;
  height: 300px;
  margin-top: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 10px;
  box-sizing: border-box;
}

.carousel-container {
  width: 100%;
  height: 500px; // 容器高度固定
  margin-top: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;
  padding: 0 !important; // 移除可能的内边距

  // 穿透修改 Element 轮播组件的内部容器样式
  ::v-deep .el-carousel__container {
    height: 100% !important; // 让轮播内部容器占满高度
  }
}

// 轮播项样式
.carousel-item {
  width: 100% !important;
  height: 100% !important; // 轮播项占满容器
}

// 图片样式优化
.carousel-img {
  width: 100%;
  height: 100%;
  object-fit: cover; // 图片覆盖容器，保持比例裁剪
  object-position: center; // 图片居中显示（避免裁剪到关键内容）
  display: block;
}
.carousel-text {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  color: #409eff;
}
</style>
