<template>
  <div class="app-container home">
    <!-- 第一行：柱状图 + 饼状图 -->
    <el-row :gutter="20" class="chart-row">
      <el-col :sm="24" :lg="12" class="chart-col">
        <h2>柱状图（月度销售额对比）</h2>
        <div ref="barChartRef" class="chart-container"></div>
      </el-col>
      <el-col :sm="24" :lg="12" class="chart-col">
        <h2>饼状图（产品销售占比）</h2>
        <div ref="pieChartRef" class="chart-container"></div>
      </el-col>
    </el-row>
    <el-divider />
    <!-- 第二行：折线图 + 水球图 -->
    <el-row :gutter="20" class="chart-row">
      <el-col :sm="24" :lg="12" class="chart-col">
        <h2>折线图（年度销量趋势）</h2>
        <!-- 修复：使用独立ref - lineChartRef -->
        <div ref="lineChartRef" class="chart-container"></div>
      </el-col>
      <el-col :sm="24" :lg="12" class="chart-col">
        <h2>水球图（目标完成率）</h2>
        <!-- 修复：使用独立ref - liquidChartRef -->
        <div ref="liquidChartRef" class="chart-container"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup name="Index" lang="ts">
import { onMounted, ref } from 'vue';
import * as echarts from 'echarts';
// 注意：水球图需要单独引入echarts-liquidfill插件
import 'echarts-liquidfill';

// 1. 定义4个独立的ref，避免DOM引用冲突（核心修复点）
const barChartRef = ref<HTMLDivElement>(null); // 柱状图
const pieChartRef = ref<HTMLDivElement>(null); // 饼状图
const lineChartRef = ref<HTMLDivElement>(null); // 折线图
const liquidChartRef = ref<HTMLDivElement>(null); // 水球图

// 2. 初始化柱状图（复用原有逻辑，保持不变）
const initBarChart = () => {
  if (!barChartRef.value) return;
  const barChart = echarts.init(barChartRef.value);
  const option = {
    title: { text: '月度销售额统计', left: 'center' },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { data: ['实际销售额', '目标销售额'], bottom: 10 },
    grid: { left: '3%', right: '4%', bottom: '15%', top: '15%', containLabel: true },
    xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'] },
    yAxis: { type: 'value', name: '销售额 (万元)', axisLabel: { formatter: '{value}' } },
    series: [
      {
        name: '实际销售额',
        type: 'bar',
        data: [120, 190, 130, 150, 200, 250, 220, 280, 270, 300, 320, 380],
        itemStyle: { color: '#409EFF' },
        emphasis: { itemStyle: { color: '#6AA1FF' } }
      },
      {
        name: '目标销售额',
        type: 'bar',
        data: [150, 180, 160, 190, 220, 240, 260, 290, 300, 330, 350, 400],
        itemStyle: { color: '#67C23A' },
        emphasis: { itemStyle: { color: '#85CE61' } }
      }
    ]
  };
  barChart.setOption(option);
  window.addEventListener('resize', () => barChart.resize());
};

// 3. 初始化饼状图（复用原有逻辑，保持不变）
const initPieChart = () => {
  if (!pieChartRef.value) return;
  const pieChart = echarts.init(pieChartRef.value);
  const option = {
    title: { text: '产品销售占比', left: 'center' },
    tooltip: { trigger: 'item' },
    legend: { orient: 'vertical', left: 'left', bottom: 10 },
    series: [
      {
        name: '销售占比',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
        label: { show: false, position: 'center' },
        emphasis: { label: { show: true, fontSize: 18, fontWeight: 'bold' } },
        labelLine: { show: false },
        data: [
          { value: 35, name: '电子产品' },
          { value: 25, name: '服装鞋帽' },
          { value: 15, name: '家居用品' },
          { value: 10, name: '美妆个护' },
          { value: 15, name: '食品饮料' }
        ]
      }
    ]
  };
  pieChart.setOption(option);
  window.addEventListener('resize', () => pieChart.resize());
};

// 4. 新增：初始化折线图（年度销量趋势分析）
const initLineChart = () => {
  if (!lineChartRef.value) return;
  const lineChart = echarts.init(lineChartRef.value);
  const option = {
    title: { text: '年度产品销量趋势', left: 'center' },
    tooltip: { trigger: 'axis' }, // 折线图默认触发方式
    legend: { data: ['A产品', 'B产品', 'C产品'], bottom: 10 },
    grid: { left: '3%', right: '4%', bottom: '15%', top: '15%', containLabel: true },
    xAxis: {
      type: 'category',
      boundaryGap: false, // 折线图常用：取消坐标轴留白
      data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
    },
    yAxis: { type: 'value', name: '销量 (件)' },
    series: [
      {
        name: 'A产品',
        type: 'line',
        data: [1200, 1320, 1010, 1340, 900, 1300, 1430, 1650, 1770, 1890, 2010, 2100],
        smooth: true, // 平滑折线
        lineStyle: { width: 3, color: '#409EFF' },
        itemStyle: { color: '#409EFF', borderWidth: 2 }
      },
      {
        name: 'B产品',
        type: 'line',
        data: [820, 932, 901, 934, 1290, 1330, 1320, 1540, 1620, 1580, 1720, 1850],
        smooth: true,
        lineStyle: { width: 3, color: '#E6A23C' },
        itemStyle: { color: '#E6A23C', borderWidth: 2 }
      },
      {
        name: 'C产品',
        type: 'line',
        data: [520, 632, 701, 634, 890, 930, 1020, 1140, 1220, 1380, 1420, 1550],
        smooth: true,
        lineStyle: { width: 3, color: '#67C23A' },
        itemStyle: { color: '#67C23A', borderWidth: 2 }
      }
    ]
  };
  lineChart.setOption(option);
  window.addEventListener('resize', () => lineChart.resize());
};

// 5. 新增：初始化水球图（目标完成率，需依赖echarts-liquidfill）
const initLiquidChart = () => {
  if (!liquidChartRef.value) return;
  const liquidChart = echarts.init(liquidChartRef.value);
  const option = {
    title: { text: '年度目标完成率', left: 'center' },
    series: [
      {
        type: 'liquidFill', // 水球图类型（需插件支持）
        name: '完成率',
        data: [0.85], // 核心数据：85%（范围0-1）
        radius: '70%', // 水球大小
        center: ['50%', '50%'], // 水球居中
        label: {
          show: true,
          fontSize: 36,
          fontWeight: 'bold',
          color: '#333',
          formatter: ({ value }) => `${(value * 100).toFixed(0)}%` // 显示百分比
        },
        // 水球样式配置
        color: [{
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: '#409EFF' },
            { offset: 1, color: '#6AA1FF' }
          ]
        }],
        outline: {
          show: true,
          borderDistance: 5,
          itemStyle: {
            borderWidth: 3,
            borderColor: '#409EFF',
            shadowBlur: 10,
            shadowColor: 'rgba(64, 158, 255, 0.3)'
          }
        }
      }
    ]
  };
  liquidChart.setOption(option);
  window.addEventListener('resize', () => liquidChart.resize());
};

// 6. 组件挂载后，初始化所有图表（新增折线图、水球图初始化）
onMounted(() => {
  initBarChart();
  initPieChart();
  initLineChart(); // 新增
  initLiquidChart(); // 新增
});

// 保留原有跳转方法
const goTarget = (url: string) => {
  window.open(url, '_blank'); // 修复：原__blank是错误写法，正确为_blank
};
</script>

<style lang="scss" scoped>
.home {
  padding: 20px; // 增加外层padding，避免图表贴边

  .chart-row {
    margin-bottom: 30px; // 行与行之间的间距
  }

  .chart-col {
    padding-left: 10px !important; // 覆盖原内联样式，统一间距
    padding-right: 10px !important;
  }

  h2 {
    margin-top: 0;
    margin-bottom: 16px;
    font-size: 22px;
    font-weight: 500;
    color: #333;
  }

  .chart-container {
    width: 100%;
    height: 400px;
    border-radius: 8px; // 优化圆角
    box-shadow: 0 2px 16px 0 rgba(0, 0, 0, 0.08); // 优化阴影
    background-color: #fff;
    padding: 16px;
    box-sizing: border-box;
  }

  // 以下为原有样式，保持不变
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
    list-style-type: none;
  }

  font-family: 'open sans',
  'Helvetica Neue',
  Helvetica,
  Arial,
  sans-serif;
  font-size: 13px;
  color: #676a6c;
  overflow-x: hidden;

  h4 {
    margin-top: 0;
  }
}
</style>
