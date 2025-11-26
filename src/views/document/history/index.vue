<template>
  <div class="history-container">
    <div class="history-content">
      <div class="back-normal" @click="handleBack"><img src="../../../assets/images/arrow-left.png" />创建项目</div>
      <div class="page-header mb-6 flex justify-between items-center">
        <h2 class="text-xl font-bold">《{{ fileName }}》历史版本</h2>
      </div>
      <div class="history-filter mb-6">
        <el-form :model="historyQuery" inline>
          <el-form-item label="时间范围" label-width="80px">
            <el-date-picker v-model="historyQuery.startTime" type="datetime" placeholder="开始时间"
              @update:model-value="getHistoryList" />
            <span class="mx-2">至</span>
            <el-date-picker v-model="historyQuery.endTime" type="datetime" placeholder="结束时间"
              @update:model-value="getHistoryList" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="Search" @click="getHistoryList">查询</el-button>
            <el-button icon="Refresh" @click="resetHistoryQuery">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="history-file-info mb-6 flex justify-between items-center">
        <span class="text-gray-700">当前文件：{{ fileName }}</span>
        <el-button type="success" icon="Download" :disabled="selectedHistoryIds.length === 0"
          @click="handleHistoryBatchDownload">
          批量下载选中版本
        </el-button>
      </div>
      <div class="history-table">
        <el-table v-loading="historyLoading" :data="historyList" border
          @selection-change="handleHistorySelectionChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="文件名" align="center" show-overflow-tooltip>
            <template #default="scope">
              {{ scope.row.name || `未命名_版本${scope.row.versionId}` }}
            </template>
          </el-table-column>
          <el-table-column label="文件类型" align="center">
            <template #default="scope">
              {{ scope.row.versionSuffix }}
            </template>
          </el-table-column>
          <el-table-column label="更新时间" align="center" width="280">
            <template #default="scope">
              {{ proxy.parseTime(scope.row.updateTime, '{y}-{m}-{d} {h}:{i}:{s}') }}
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="320">
            <template #default="scope">
              <el-button link type="primary" icon="Download" size="small"
                @click="handleDownload(scope.row)">下载</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="history-pagination mt-6 text-right">
        <el-pagination v-show="historyQuery.total > 0" v-model:current-page="historyQuery.pageNum"
          v-model:page-size="historyQuery.pageSize" :total="historyQuery.total" @size-change="getHistoryList"
          @current-change="getHistoryList" layout="total, sizes, prev, pager, next, jumper" />
      </div>
    </div>
    <div class="history-footer">
      <el-button @click="handleBack">取消</el-button>

    </div>
  </div>
</template>

<script setup name="DocumentHistory" lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { documentHistory } from '@/api/document/index';
import { DocumentVO } from '@/api/document/types';

const router = useRouter();
const route = useRoute();
const { proxy } = getCurrentInstance() as ComponentInternalInstance;

// 接收路由参数（fileId：文件ID，fileName：文件名称）
const fileId = ref<string>(route.params.fileId as string);
const fileName = ref<string>(route.query.fileName as string);

// 历史版本查询参数
const historyQuery = reactive({
  startTime: '',   // 开始时间
  endTime: '',     // 结束时间
  pageNum: 1,      // 当前页码
  pageSize: 10,    // 每页条数
  total: 0,        // 总条数
  fileId: fileId.value // 关联的主文件ID
});

// 历史版本数据与状态（新增customName字段存储拼接后的名称）
interface HistoryVO {
  versionId: string;
  fileId: string;
  versionUrls: string;
  versionSuffix: string;
  updateTime: string;
  name: string;
  ossIds?: string | string[];
  customName?: string; // 新增：存储fileName拼接的版本名称
}
const historyList = ref<HistoryVO[]>([]); // 历史版本列表
const historyLoading = ref(false);        // 表格加载状态
const selectedHistoryIds = ref<Array<{ versionId: string; ossIds: string | string[] }>>([]); // 选中的历史版本

/** 页面挂载时加载历史版本数据 */
onMounted(() => {
  getHistoryList();
});

/** 获取历史版本列表（核心修改：匹配fileId并替换名称） */
const getHistoryList = async () => {
  historyLoading.value = true;
  try {
    const res = await documentHistory(historyQuery.fileId);
    const rawData = res.data || [];
    // 直接赋值，name字段由接口返回（存储用户输入的名称）
    historyList.value = rawData.map((item: any) => ({
      ...item,
      ossIds: item.ossIds
        ? typeof item.ossIds === 'string'
          ? item.ossIds.split(',').filter((id: string) => id.trim() && /^\d+$/.test(id.trim()))
          : item.ossIds
        : []
    })) as HistoryVO[];
    historyQuery.total = historyList.value.length;
  } catch (err) {
    proxy?.$modal.msgError(`加载历史版本失败：${(err as Error).message || '未知错误'}`);
  } finally {
    historyLoading.value = false;
  }
};
/** 重置历史版本查询参数 */
const resetHistoryQuery = () => {
  historyQuery.startTime = '';
  historyQuery.endTime = '';
  historyQuery.pageNum = 1;
  getHistoryList();
};

/** 历史版本表格选中事件 */
const handleHistorySelectionChange = (selection: HistoryVO[]) => {
  selectedHistoryIds.value = selection.map(item => ({
    versionId: item.versionId,
    ossIds: item.ossIds || []
  }));
};

/** 下载单个历史版本文件 */
const handleDownload = async (row: HistoryVO) => {
  let ossIdsArray: string[] = [];
  if (row.ossIds) {
    if (typeof row.ossIds === 'string') {
      ossIdsArray = row.ossIds.split(',').filter(ossId =>
        ossId.trim() && /^\d+$/.test(ossId.trim())
      );
    } else if (Array.isArray(row.ossIds)) {
      ossIdsArray = row.ossIds.filter(ossId =>
        typeof ossId === 'string' && ossId.trim() && /^\d+$/.test(ossId.trim())
      );
    }
  }
  if (ossIdsArray.length === 0) {
    proxy?.$modal.msgError('无有效文件可下载');
    return;
  }
  proxy?.$modal.msg(`开始下载${ossIdsArray.length}个文件，请耐心等待...`);
  let successCount = 0;
  let failCount = 0;
  const failOssIds: string[] = [];
  for (const [index, ossId] of ossIdsArray.entries()) {
    try {
      await proxy?.$download.oss(ossId.trim());
      successCount++;
    } catch (err) {
      failCount++;
      failOssIds.push(ossId);
    }
  }
  const resultMsg = `下载完成！成功：${successCount}个，失败：${failCount}个${failCount > 0 ? `（失败ossId：${failOssIds.join(',')}）` : ''}`;
  failCount === 0 ? proxy?.$modal.msgSuccess(resultMsg) : proxy?.$modal.msgWarning(resultMsg);
};

/** 批量下载选中的历史版本 */
const handleHistoryBatchDownload = async () => {
  if (selectedHistoryIds.value.length === 0) {
    proxy?.$modal.msgError('请选择需要下载的历史版本');
    return;
  }
  await proxy?.$modal.confirm(`是否确认下载选中的${selectedHistoryIds.value.length}个历史版本？`);

  // 遍历选中的历史版本，下载所有有效文件
  selectedHistoryIds.value.forEach(item => {
    let ossIdsArray: string[] = [];
    if (item.ossIds) {
      if (typeof item.ossIds === 'string') {
        ossIdsArray = item.ossIds.split(',').filter(id => id.trim() && /^\d+$/.test(id.trim()));
      } else if (Array.isArray(item.ossIds)) {
        ossIdsArray = item.ossIds.filter(id => typeof id === 'string' && id.trim() && /^\d+$/.test(id.trim()));
      }
    }
    ossIdsArray.forEach(ossId => {
      proxy?.$download.oss(ossId);
    });
  });

  proxy?.$modal.msgSuccess('历史版本下载请求已提交');
};

/** 返回按钮：跳转回原页面 */
const handleBack = () => {
  router.push('/document/data'); // 回退到数字化更新列表页面
};
</script>

<style lang="scss" scoped>
.history-container {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  position: relative;
  min-height: 96vh;
  padding-bottom: 80px;
}

.history-content {
  width: 100%;
  max-height: calc(100vh - 40px);
  overflow-y: auto;
}

.history-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  background-color: #f6f6f6;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  text-align: right;
  box-sizing: border-box;
  z-index: 10;
}

.page-header {
  margin-bottom: 20px;
}

.history-filter {
  margin-bottom: 16px;
}

.history-file-info {
  margin-bottom: 16px;
  color: #666;
}

.history-table {
  margin-bottom: 30px;
}

.history-pagination {
  margin-left:1700px;
  text-align: right;
}

.mx-2 {
  margin: 0 8px;
}

.flex {
  display: flex;
}

.justify-between {
  justify-content: space-between;
}

.align-center {
  align-items: center;
}

.text-gray-700 {
  color: #333;
}

.text-right {
  text-align: right;
}

.mb-6 {
  margin-bottom: 24px;
}

.mt-6 {
  margin-top: 30px;
}

.text-xl {
  font-size: 1.25rem;
}

.font-bold {
  font-weight: 600;
}

.add-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  background-color: #f6f6f6;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  text-align: right;
  box-sizing: border-box;
  z-index: 10;
}
.back-normal {
  width: 110px;
  height: 30px;
  font-size: 20px;
  display: flex;
  align-items: center;
  cursor: pointer;
}
</style>
<style>
body {
  overflow: auto;
  scrollbar-width: none !important;
  -ms-overflow-style: none !important;
}

body::-webkit-scrollbar {
  display: none !important;
  /* Chrome/Safari */
  width: 0 !important;
  height: 0 !important;
}

* {
  scrollbar-width: none !important;
  -ms-overflow-style: none !important;
}

*::-webkit-scrollbar {
  display: none !important;
  width: 0 !important;
  height: 0 !important;
}
</style>