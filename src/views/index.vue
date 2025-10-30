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
        <h3>风景名胜资源类型</h3>
        <div ref="resourceTypeBar" class="chart-container"></div>
      </el-col>

      <el-col :sm="24" :lg="12" style="padding-left: 20px">
        <h3>国土空间规划</h3>
        <p style="margin-top: 10px; font-size: 12px; color: #666;">
          数据说明：表格展示了各类用地的现状与规划面积及占比，总面积保持147.08km²不变
        </p>
        <div ref="landUseBar" class="chart-container"></div>
        <h3>方岩国家级风景名胜区游客规模预测一览表</h3>
        <div ref="touristLine" class="chart-container"></div>
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
import { onMounted, ref, nextTick } from 'vue';
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
const touristLine = ref<HTMLDivElement>(null);
const carouselRef = ref<InstanceType<typeof import('element-plus')['ElCarousel']>>(); // 轮播图引用
const resourceTypeBar = ref<HTMLDivElement>(null);
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

  // 资源分级保护数据（区分方岩片区和五指岩片区）
  const protectionData = [
    {
      name: '一级保护区',
      value: 34.06,    // 总面积（km²）
      ratio: 23.16,    // 占比（%）
      itemStyle: { color: '#d58592' } // 指定颜色
    },
    {
      name: '二级保护区',
      value: 53.06,
      ratio: 36.07,
      itemStyle: { color: '#e5e36c' } // 指定颜色
    },
    {
      name: '三级保护区',
      value: 59.96,
      ratio: 40.77,
      itemStyle: { color: '#9195c2' } // 指定颜色
    }
  ];

  // 柱状图配置项
  const option = {
    title: {
      text: '方岩景区资源分级保护面积占比', // 标题调整为“占比”，更贴合饼图
      left: 'center',
      textStyle: { fontSize: 16 }
    },
    tooltip: {
      trigger: 'item', // 饼图用item触发tooltip
      formatter: (params: any) => {
        // 自定义tooltip内容：名称 + 面积 + 占比
        return `
          <div>${params.name}</div>
          <div>面积：${params.value} km²</div>
          <div>占比：${params.data.ratio}%</div>
        `;
      }
    },
    legend: {
      orient: 'horizontal', // 水平排列图例
      bottom: 10, // 图例放在底部，避免遮挡饼图
      data: protectionData.map(item => item.name),
      textStyle: { fontSize: 14 }
    },
    series: [
      {
        name: '保护区面积（km²）',
        type: 'pie', // 图表类型改为饼图
        radius: ['40%', '70%'], // 环形饼图（内半径40%，外半径70%，更美观）
        center: ['50%', '47%'], // 饼图居中显示
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 8, // 饼图扇区添加圆角，提升视觉效果
          borderColor: '#fff', // 扇区间添加白色边框，区分更清晰
          borderWidth: 2
        },
        label: {
          show: false, // 隐藏默认标签（避免文字拥挤）
          position: 'center'
        },
        emphasis: {
          label: {
            show: true, // 鼠标 hover 时显示标签
            fontSize: 16,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false // 隐藏标签连接线（环形饼图无需连接线）
        },
        data: protectionData // 传入处理后的饼图数据
      }
    ]
  };

  chart.setOption(option);
  // 响应窗口大小变化
  window.addEventListener('resize', () => chart.resize());
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
        itemStyle: { color: '#20e3ff' }, // 蓝色：现状
        barWidth: '30%'
      },
      {
        name: '规划',
        type: 'bar',
        data: landUseData.map(item => item.planArea),
        itemStyle: { color: '#c0da75' }, // 绿色：规划
        barWidth: '30%'
      }
    ]
  };

  chart.setOption(option);
  // 响应窗口大小变化
  window.addEventListener('resize', () => chart.resize());
};
const initResourceTypeBar = () => {
  if (!resourceTypeBar.value) return;
  const chart = echarts.init(resourceTypeBar.value);

  // 按需求定义5个景区的「自然/人文+等级」景源数据
  const resourceTypeData = [
    {
      name: '方岩丹霞景区',
      natural1: 5,  // 一级自然景源
      natural2: 11, // 二级自然景源
      natural3: 22, // 三级自然景源
      cultural1: 2, // 一级人文景源
      cultural2: 7, // 二级人文景源
      cultural3: 5  // 三级人文景源
    },
    {
      name: '灵岩山湖景区',
      natural1: 0,
      natural2: 6,
      natural3: 0,
      cultural1: 1,
      cultural2: 2,
      cultural3: 1
    },
    {
      name: '方山山林景区',
      natural1: 1,
      natural2: 0,
      natural3: 0,
      cultural1: 2,
      cultural2: 0,
      cultural3: 4
    },
    {
      name: '五指九泄景区',
      natural1: 2,
      natural2: 3,
      natural3: 2,
      cultural1: 0,
      cultural2: 0,
      cultural3: 0
    },
    {
      name: '太平湖景区',
      natural1: 0,
      natural2: 3,
      natural3: 3,
      cultural1: 0,
      cultural2: 0,
      cultural3: 4
    }
  ];

  // 柱状图配置项
  const option = {
    title: {
      text: '各景区风景名胜资源类型分布（自然/人文）',
      left: 'center',
      textStyle: { fontSize: 16 }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (params: any[]) => {
        const scenicName = params[0].name;
        // 关键修改：添加 "as any" 类型断言，跳过TS属性检查
        const dataMap = resourceTypeData.find(item => item.name === scenicName) as any;
        return `
      <div>${scenicName}</div>
      <div>一级自然景源：${dataMap.natural1} 处</div>
      <div>二级自然景源：${dataMap.natural2} 处</div>
      <div>三级自然景源：${dataMap.natural3} 处</div>
      <div>一级人文景源：${dataMap.cultural1} 处</div>
      <div>二级人文景源：${dataMap.cultural2} 处</div>
      <div>三级人文景源：${dataMap.cultural3} 处</div>
    `;
      }
    },
    legend: {
      // 图例按“自然+等级”“人文+等级”分组，便于区分
      data: [
        '一级自然景源', '二级自然景源', '三级自然景源',
        '一级人文景源', '二级人文景源', '三级人文景源'
      ],
      top: 30,
      textStyle: { fontSize: 12 }, // 缩小图例文字，避免换行
      formatter: (name) => {
        // 图例文字换行处理，确保排版整齐
        return name.length > 6 ? `${name.slice(0, 6)}\n${name.slice(6)}` : name;
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: resourceTypeData.map(item => item.name),
      axisLabel: {
        interval: 0,
        fontSize: 12,
      }
    },
    yAxis: {
      type: 'value',
      name: '景源数量（处）',
      nameLocation: 'middle',
      nameGap: 30,
      minInterval: 1 // 景源数量为整数，避免小数刻度
    },
    series: [
      // 自然景源组（用蓝色系区分）
      {
        name: '一级自然景源',
        type: 'bar',
        data: resourceTypeData.map(item => item.natural1),
        itemStyle: { color: '#409EFF' },
        barWidth: '12%' // 缩小柱子宽度，避免6组柱子拥挤
      },
      {
        name: '二级自然景源',
        type: 'bar',
        data: resourceTypeData.map(item => item.natural2),
        itemStyle: { color: '#66b1ff' },
        barWidth: '12%'
      },
      {
        name: '三级自然景源',
        type: 'bar',
        data: resourceTypeData.map(item => item.natural3),
        itemStyle: { color: '#99cfff' },
        barWidth: '12%'
      },
      // 人文景源组（用红色系区分）
      {
        name: '一级人文景源',
        type: 'bar',
        data: resourceTypeData.map(item => item.cultural1),
        itemStyle: { color: '#F56C6C' },
        barWidth: '12%'
      },
      {
        name: '二级人文景源',
        type: 'bar',
        data: resourceTypeData.map(item => item.cultural2),
        itemStyle: { color: '#ff8787' },
        barWidth: '12%'
      },
      {
        name: '三级人文景源',
        type: 'bar',
        data: resourceTypeData.map(item => item.cultural3),
        itemStyle: { color: '#ffb8b8' },
        barWidth: '12%'
      }
    ]
  };

  chart.setOption(option);
  // 响应窗口大小变化
  window.addEventListener('resize', () => chart.resize());
};
const initTouristLine = () => {
  if (!touristLine.value) return;
  const chart = echarts.init(touristLine.value);

  // 游客规模预测数据（严格对应需求中的年份、基数、合计）
  const touristData = [
    { year: '2023', base: 77.6, total: 85.36, growth: 10 },
    { year: '2024', base: 85.36, total: 93.90, growth: 10 },
    { year: '2025', base: 93.90, total: 103.29, growth: 10 },
    { year: '2026', base: 103.29, total: 111.55, growth: 8 },
    { year: '2027', base: 111.55, total: 120.47, growth: 8 },
    { year: '2028', base: 120.47, total: 130.11, growth: 8 },
    { year: '2029', base: 130.11, total: 140.52, growth: 8 },
    { year: '2030', base: 140.52, total: 151.76, growth: 8 },
    { year: '2031', base: 151.76, total: 156.32, growth: 3 },
    { year: '2032', base: 156.32, total: 161.00, growth: 3 },
    { year: '2033', base: 161.00, total: 165.83, growth: 3 },
    { year: '2034', base: 165.83, total: 170.81, growth: 3 },
    { year: '2035', base: 170.81, total: 175.93, growth: 3 }
  ];

  // 折线图配置项
  const option = {
    title: {
      text: '方岩国家级风景名胜区游客规模预测（2023-2035）',
      left: 'center',
      textStyle: { fontSize: 16 }
    },
    tooltip: {
      trigger: 'axis', // 按坐标轴触发，同时显示同一年的所有数据
      axisPointer: { type: 'line' }, // 显示轴线指示器，便于定位年份
      formatter: (params: any[]) => {
        // 自定义tooltip：显示年份、基数、增长率、合计
        const year = params[0].name;
        const base = params[0].value;
        const total = params[1].value;
        const growth = touristData.find(item => item.year === year)?.growth || 0;
        return `
          <div>${year}年游客规模</div>
          <div>基数：${base} 万人</div>
          <div>增长率：${growth}%</div>
          <div>合计：${total} 万人</div>
        `;
      }
    },
    legend: {
      data: ['基数（万人）', '合计（万人）'], // 仅展示核心数据的图例
      top: 30,
      textStyle: { fontSize: 14 }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: touristData.map(item => item.year), // 横轴为年份
      axisLabel: {
        interval: 0, // 强制显示所有年份
        fontSize: 12,
      },
      axisLine: { onZero: false } // 取消轴线与0点对齐，更美观
    },
    yAxis: {
      type: 'value',
      name: '游客数量（万人）',
      nameLocation: 'middle',
      nameGap: 35,
      min: 70, // 纵轴最小值设为70，缩小数据差距，更易观察趋势
      max: 180, // 纵轴最大值设为180，预留一定空间
      axisLabel: {
        formatter: '{value}' // 直接显示数值，无需额外单位（图例已标注）
      }
    },
    series: [
      {
        name: '基数（万人）',
        type: 'line',
        data: touristData.map(item => item.base),
        symbol: 'circle', // 标记点为圆形
        symbolSize: 6, // 标记点大小
        lineStyle: { color: '#409EFF', width: 2 }, // 蓝色线条，宽度2px
        itemStyle: { color: '#409EFF' }, // 标记点颜色与线条一致
        smooth: true // 线条平滑处理，更美观
      },
      {
        name: '合计（万人）',
        type: 'line',
        data: touristData.map(item => item.total),
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: { color: '#F56C6C', width: 2 }, // 红色线条，宽度2px
        itemStyle: { color: '#F56C6C' },
        smooth: true
      }
    ]
  };

  chart.setOption(option);
  // 响应窗口大小变化
  window.addEventListener('resize', () => chart.resize());
};
// 页面挂载后初始化图表
onMounted(() => {
  nextTick(() => {
    // 二次校验 DOM 存在，避免初始化空元素
    if (sourcePie.value) initSourcePie();
    if (protectionPie.value) initProtectionPie();
    if (landUseBar.value) initLandUseBar();
    if (resourceTypeBar.value) initResourceTypeBar();
    if (touristLine.value) initTouristLine();
  });
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
.chart-container {
  width: 100%; // 宽度占满父容器
  min-width: 300px; // 最小宽度兜底，避免过窄
  height: 300px; // 固定高度，确保初始化时有高度
  min-height: 200px; // 最小高度兜底
  margin-top: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 10px;
  box-sizing: border-box;
  display: block; // 确保是块级元素，避免 inline 导致尺寸异常
}
// 图表容器样式
.carousel-container {
  width: 100%;
  height: 500px;
  margin-top: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;
  padding: 0 !important;
  position: relative;

  // 关键：深度选择器覆盖 Element 轮播内部容器样式
  :deep(.el-carousel__container) {
    height: 100% !important; // 强制内部容器占满外层
    width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  // 关键：覆盖轮播项内部的滑动容器
  :deep(.el-carousel__item) {
    height: 100% !important;
    width: 100% !important;
    display: flex !important; // 确保子元素能继承高度
    align-items: stretch !important; // 拉伸子元素填充满
  }
}

// 轮播项样式
.carousel-item {
  width: 100% !important;
  height: 100% !important;
  padding: 0 !important;
  margin: 0 !important;
  display: block; // 清除默认inline样式
}

// 图片样式优化
.carousel-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100% !important;
  height: 100% !important;
  object-fit: cover;
  object-position: center;
  display: block;
  border: none !important; // 清除可能的默认边框
}

.carousel-text {
  position: absolute; // 文本也绝对定位，放在图片上方
  top: 10px; // 距离顶部10px
  left: 50%;
  transform: translateX(-50%); // 水平居中
  font-size: 16px;
  color: #fff; // 改为白色，与图片形成对比
  background: rgba(0, 0, 0, 0.5); // 加半透明背景，提升可读性
  padding: 4px 12px;
  border-radius: 4px;
  z-index: 10; // 确保文本在图片上方
}
</style>
