<template>
  <div class="p-2">
    <!-- 搜索区域调整 -->
    <div v-show="showSearch" class="mb-[10px]">
      <el-card shadow="hover">
        <el-form ref="queryFormRef" :model="queryParams" :inline="true">
          <el-form-item label="文件名称" prop="name">
            <el-input v-model="queryParams.name" placeholder="请输入" clearable @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="search" @click="handleQuery">查询</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>

    <el-card shadow="hover">
      <template #header>
        <el-row :gutter="10" class="mb8">
          <el-col :span="2">
            <el-button v-hasPermi="['document:planningFile:upload']" type="primary" plain icon="Upload"
              @click="handleFile">新增规划文件</el-button>
          </el-col>
          <el-col :span="2">
            <el-button v-hasPermi="['document:planningFile:disable']" type="danger" plain icon="Stop"
              :disabled="multiple" @click="handleDisable()">
              批量停用
            </el-button>
          </el-col>
          <el-col :span="2">
            <el-button v-hasPermi="['document:planningFile:download']" type="success" plain icon="Download"
              :disabled="multiple" @click="handleBatchDownload()">
              批量下载
            </el-button>
          </el-col>
          <el-col :span="2">
            <el-button v-hasPermi="['document:planningFile:share']" type="success" plain icon="Share"
              @click="handleDataShare()">
              数据共享
            </el-button>
          </el-col>
          <right-toolbar v-model:show-search="showSearch" @query-table="getList"></right-toolbar>
        </el-row>
      </template>

      <!-- 表格字段调整 -->
      <el-table v-if="showTable" v-loading="loading" :data="planningFileList" border
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="文件名" align="center" prop="name" :show-overflow-tooltip="true" />
        <el-table-column label="文件类型" align="center" prop="fileSuffix" :show-overflow-tooltip="true" />
        <el-table-column label="更新时间" align="center" prop="updateTime" width="180">
          <template #default="scope">
            <span>{{ proxy.parseTime(scope.row.updateTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-button v-hasPermi="['document:planningFile:history']" link type="primary"
              @click="handleHistory(scope.row)">历史版本</el-button>
            <el-button v-hasPermi="['document:planningFile:update']" link type="primary"
              @click="handleUpdate(scope.row)">更新</el-button>
            <el-button v-hasPermi="['document:planningFile:download']" link type="primary"
              @click="handleDownload(scope.row)">下载</el-button>
            <el-button v-hasPermi="['document:planningFile:disable']" link
              :type="scope.row.disabledFlag ? '' : 'danger'" :class="{
                'disable-btn-active': !scope.row.disabledFlag,
                'disable-btn-disabled': scope.row.disabledFlag
              }" :disabled="scope.row.disabledFlag" @click="handleDisable(scope.row)">
              {{ scope.row.disabledFlag ? '已停用' : '停用' }} <!-- 动态显示按钮文字 -->
            </el-button>
            <!-- <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"></el-button>
            </el-tooltip> -->
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize"
        :total="total" @pagination="getList" />
    </el-card>

    <!-- 新增/更新版本对话框 -->
    <el-dialog v-model="dialog.visible" :title="dialog.title" width="870px" append-to-body>
      <el-form ref="documentFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="文件名称" prop="name" hidden>
          <el-input v-model="form.name" placeholder="自动填充文件名" />
        </el-form-item>
        <!-- 替换原文件路径输入框为FileUpload组件 -->
        <el-form-item label="上传文件" prop="ossIds">
          <FileUpload v-model="form.ossIds" :disabled="false" @update:modelValue="handleFileUploadChange" />
        </el-form-item>
        <el-form-item label="文件类型" prop="fileSuffix" hidden>
          <el-input v-model="form.fileSuffix" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog :title="`《${historyDialog.fileName}》历史版本`" v-model="historyDialog.visible" width="1800px" append-to-body
      :close-on-click-modal="false">
      <div class="history-content">
        <!-- 1. 时间筛选区域（参考示例的搜索栏格式） -->
        <div class="history-filter mb-6">
          <el-form :model="historyQuery" inline>
            <el-form-item label="时间范围">
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

        <!-- 2. 文件名称与批量下载按钮（参考示例的信息展示区） -->
        <div class="history-file-info mb-6 flex justify-between items-center">
          <span class="text-gray-700">当前文件：{{ historyDialog.fileName }}</span>
          <el-button type="success" icon="Download" :disabled="selectedHistoryIds.length === 0"
            @click="handleHistoryBatchDownload">
            批量下载选中版本
          </el-button>
        </div>

        <!-- 3. 历史版本表格（核心内容区） -->
        <div class="history-table">
          <el-table v-loading="historyLoading" :data="historyList" border
            @selection-change="handleHistorySelectionChange">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="文件名" align="center" show-overflow-tooltip>
              <template #default="scope">
                {{ scope.row.name || `历史版本${scope.row.versionId}` }}
              </template>
            </el-table-column>
            <el-table-column label="文件类型" align="center">
              <template #default="scope">
                {{ scope.row.versionSuffix }}
              </template>
            </el-table-column>
            <el-table-column label="更新时间" align="center" width="180">
              <template #default="scope">
                {{ proxy.parseTime(scope.row.versionCreateTime, '{y}-{m}-{d} {h}:{i}:{s}') }}
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="180">
              <template #default="scope">
                <!-- 下载操作 -->
                <el-tooltip content="下载该版本" placement="top">
                  <el-button link type="primary" icon="Download" size="small"
                    @click="proxy.$download.oss(scope.row.versionId)" />
                </el-tooltip>
                <!-- 停用操作 -->
                <el-tooltip content="停用该版本" placement="top">
                  <el-button link type="danger" icon="Stop" size="small"
                    @click="handleHistoryDisable(scope.row.versionId)" />
                </el-tooltip>

              </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- 4. 分页组件（参考示例的分页格式） -->
        <div class="history-pagination mt-6 text-right">
          <el-pagination v-show="historyQuery.total > 0" v-model:current-page="historyQuery.pageNum"
            v-model:page-size="historyQuery.pageSize" :total="historyQuery.total" @size-change="getHistoryList"
            @current-change="getHistoryList" layout="total, sizes, prev, pager, next, jumper" />
        </div>
      </div>

      <!-- 弹窗底部按钮（仅保留关闭） -->
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="historyDialog.visible = false">关闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script setup name="DocumentPlanningFile" lang="ts">
import { ref, onMounted, watch, VNode } from 'vue';
import { listByIds } from '@/api/system/oss';
import FileUpload from '@/components/FileUpload/index.vue';
import { listOss, delOss } from '@/api/system/oss';
import { OssForm, OssQuery, OssVO } from '@/api/system/oss/types';
// 导入新接口和类型
import {
  documentList as apiDocumentList,
  documentAdd, // 新增导入
  documentUpdate,
  documentDisable,
  documentHistory
} from '@/api/document/index';
import { DocumentForm, DocumentQuery, DocumentVO } from '@/api/document/types';

const router = useRouter();
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
interface DialogOption {
  visible: boolean;
  title: string;
}
interface PageData<T, Q> {
  form: T;
  queryParams: Q;
  rules: Record<string, any[]>;
}
const historyDialog = reactive({
  visible: false, // 弹窗显示状态
  fileName: ''    // 当前查看的主文件名称（用于标题和信息展示）
});
// 1. 新增：存储多文件信息（用于回显和提交）
const formFiles = ref<any[]>([]); // 存储所有上传文件的详细信息
// 新增：历史版本查询参数（时间筛选、分页）
const historyQuery = reactive({
  startTime: '',   // 开始时间
  endTime: '',     // 结束时间
  pageNum: 1,      // 当前页码
  pageSize: 10,    // 每页条数
  total: 0,        // 总条数
  fileId: ''       // 关联的主文件ID（用于调用接口）
});

// 新增：历史版本数据与状态
interface HistoryVO { // 匹配接口返回的历史版本结构
  versionId: string;
  fileId: string;
  versionUrls: string;
  versionSuffix: string;
  versionCreateTime: string;
  name?: string;
}
const historyList = ref<HistoryVO[]>([]); // 历史版本列表
const historyLoading = ref(false);        // 表格加载状态
const selectedHistoryIds = ref<Array<string>>([]); // 选中的历史版本ID

// 替换ossList为documentList，类型改为DocumentVO
const planningFileList = ref<DocumentVO[]>([]);
const showTable = ref(true);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const type = ref(0);

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});
/** 删除按钮操作 */
const handleDelete = async (row?: OssVO) => {
  await proxy?.$modal.confirm('是否确认删文件名为"' + row.name + '"的数据项?');
  const ossIdsArray = row.ossIds ? row.ossIds.split(',') : [];
  loading.value = true;
  await delOss(ossIdsArray).finally(() => (loading.value = false));
  await getList();
  proxy?.$modal.msgSuccess('删除成功');
};
// 替换表单引用名
const documentFormRef = ref<ElFormInstance>();
const queryFormRef = ref<ElFormInstance>();

// 初始化表单数据（适配DocumentForm）
const initFormData: DocumentForm = {
  id: '',
  name: '',
  urls: '',
  fileSuffix: '',
  disabledFlag: false,
  ossIds: '',
  updateTime: '',
  createTime: ''
};
const data = reactive<PageData<DocumentForm, DocumentQuery>>({
  form: { ...initFormData },
  // 查询参数替换为DocumentQuery
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    name: '',
    fileSuffix: '',
    updateTime: '',
    disabledFlag: undefined,
    orderByColumn: 'updateTime',
    isAsc: 'descending'
  },
  // 表单校验规则
  rules: {
    ossIds: [{ required: true, message: '请上传文件', trigger: 'change' }]
  }
});
const { queryParams, form, rules } = toRefs(data);

/** 查询项目规划成果归档列表 */
const getList = async () => {
  loading.value = true;
  const response = await apiDocumentList(queryParams.value);
  const resData = response.data || response;
  console.log("🚀 ~ getList ~ resData:", resData)
  planningFileList.value = Array.isArray(resData.rows) ? resData.rows : [];
  console.log("🚀 ~ getList ~ planningFileList.value:", planningFileList.value)
  total.value = resData.total || 0;
  loading.value = false;
  showTable.value = true;
};

/** 取消按钮操作 */
function cancel() {
  dialog.visible = false;
  reset();
}

/** 表单重置 */
function reset() {
  form.value = { ...initFormData };
  documentFormRef.value?.resetFields();
  form.value.ossIds = '';
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  showTable.value = false;
  queryFormRef.value?.resetFields();
  queryParams.value.name = '';
  queryParams.value.disabledFlag = undefined;
  handleQuery();
}

/** 表格多选选中事件 */
function handleSelectionChange(selection: DocumentVO[]) {
  ids.value = selection.map(item => item.id);
  single.value = selection.length !== 1;
  multiple.value = !selection.length;
}

/** 上传文件按钮操作 */
const handleFile = () => {
  reset();
  dialog.visible = true;
  dialog.title = '新增规划文件';
};
const getFileNameWithoutSuffix = (fileName: string) => {
  const lastDotIndex = fileName.lastIndexOf('.');
  return lastDotIndex !== -1 ? fileName.slice(0, lastDotIndex) : fileName;
};
/** 提交表单（新增/更新版本） */
const submitForm = () => {
  documentFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      try {
        const submitData = {
          id: form.value.id,
          ossIds: form.value.ossIds,
          name: form.value.name,
          fileSuffix: form.value.fileSuffix,
          urls: form.value.urls,
          disabledFlag: false
        };
        console.log("修复后提交参数：", submitData);
        // 新增/更新接口调用
        if (!form.value.id) {
          await documentAdd(submitData);
        } else {
          await documentUpdate(submitData);
        }
        proxy?.$modal.msgSuccess(`${!form.value.id ? '新增' : '更新'}成功`);
        dialog.visible = false;
        await getList();
      } catch (err) {
        proxy?.$modal.msgError(`${!form.value.id ? '新增' : '更新'}失败：${(err as Error).message || '未知错误'}`);
        console.error("提交失败详情：", err);
      } finally {
        buttonLoading.value = false;
      }
    }
  });

};
/** 编辑操作（回显数据） */
const handleUpdate = async (row: DocumentVO) => {
  reset();
  form.value = { ...row };
  formFiles.value = [];

  if (row.ossIds) {
    const res = await listByIds(row.ossIds);
    if (res.data && res.data.length > 0) {
      // 仅取第一个文件回显（避免多文件拼接）
      const firstFile = res.data[0];
      formFiles.value = [{
        name: firstFile.originalName,
        url: firstFile.url,
        ossId: firstFile.ossId,
        suffix: firstFile.originalName.split('.').pop() || ''
      }];
      // 回显所有后缀（从文件信息中提取，而非直接用row.fileSuffix）
      const allSuffixes = formFiles.value.map(file => file.suffix).filter(Boolean);
      form.value.fileSuffix = allSuffixes.join(',');
      // 文件名：取第一个文件的无后缀名称
      form.value.name = getFileNameWithoutSuffix(formFiles.value[0].name);
      // URLs：所有文件URL拼接
      form.value.urls = formFiles.value.map(file => file.url).join(',');
      // ossIds：所有文件ID拼接（保持原有格式）
      form.value.ossIds = formFiles.value.map(file => file.ossId).join(',');
    }
  }

  dialog.visible = true;
  dialog.title = '更新规划文件';
};
// 新增：文件上传/删除后触发（同步表单并刷新列表）
const handleFileUploadChange = (newOssIds: string) => {
  console.log("🚀 ~ handleFileUploadChange ~ newOssIds:", newOssIds)
  form.value.ossIds = newOssIds;
  // 立即同步表单其他字段（无需等待watch触发）
  if (newOssIds) {
    listByIds(newOssIds).then(res => {
      if (res.data && res.data.length > 0) {
        console.log("🚀 ~ handleFileUploadChange ~ formFiles.value:", formFiles.value)
        formFiles.value = res.data.map((file: any) => ({
          name: file.originalName,
          url: file.url,
          ossId: String(file.ossId),
          suffix: file.originalName.split('.').pop() || ''
        }));
        // 收集所有文件的后缀（去重，可选）
        const allSuffixes = formFiles.value.map(file => file.suffix).filter(Boolean);
        // 表单存储：数组转字符串（逗号分隔，适配接口存储）
        form.value.fileSuffix = allSuffixes.join(',');
        // 文件名：取第一个文件的无后缀名称（保持原有逻辑，可按需调整）
        const fileName = formFiles.value[0].name;
        form.value.name = getFileNameWithoutSuffix(fileName);
        //  urls：存储所有文件URL（逗号分隔）
        form.value.urls = formFiles.value.map(file => file.url).join(',');

        console.log("🚀 ~ 所有文件后缀:", allSuffixes);
        console.log("🚀 ~ 存储的后缀字符串:", form.value.fileSuffix);
      }
    });
  } else {
    formFiles.value = [];
    form.value.name = '';
    form.value.fileSuffix = '';
    form.value.urls = '';
  }
};
/** 批量停用 */
const handleDisable = async (row?: DocumentVO) => {
  console.log("🚀 ~ handleDisable ~ row:", row)
  const disableIds = row?.id ? [row.id] : ids.value; // 单个/多个ID统一处理为数组
  if (!disableIds.length) {
    proxy?.$modal.msgError('请选择需要停用的数据');
    return;
  }
  await proxy?.$modal.confirm(`请确认是否停用此规划文件，停用后相关数据信息将不再三维场景中展示。`);
  loading.value = true;
  try {
    await documentDisable(disableIds);

    // 手动更新表格数据的 disabledFlag（无需重新请求接口，提升体验）
    if (row) {
      row.disabledFlag = !row.disabledFlag; // 单个行状态反转
    } else {
      planningFileList.value.forEach(item => {
        if (disableIds.includes(item.id)) {
          item.disabledFlag = true; // 批量停用，统一设为 true
        }
      });
    }
    getList();
  } catch (err) {
    proxy?.$modal.msgError(`失败：${(err as Error).message || '未知错误'}`);
  } finally {
    loading.value = false;
  }
};

/** 批量下载 */
const handleBatchDownload = async () => {
  if (ids.value.length === 0) {
    proxy?.$modal.msgError('请选择需要下载的文件');
    return;
  }
  await proxy?.$modal.confirm(`是否确认下载选中的${ids.value.length}个文件？`);
  // 循环调用单文件下载接口
  ids.value.forEach(id => {
    proxy?.$download.oss(id); // 复用单个下载逻辑
  });
  proxy?.$modal.msgSuccess('下载请求已提交，文件将陆续下载');
};
/** 数据共享 */
const handleDataShare = async () => {
  await proxy?.$modal.confirm(`是否确认共享选中的数据？`);
  // 调用数据共享接口
  // await documentDataShare(ids.value);
  proxy?.$modal.msgSuccess('共享成功');
};

/** 查看历史版本 */
/** 查看历史版本（新增时间筛选、批量下载、操作列） */
const getHistoryList = async () => {
  historyLoading.value = true;
  const res = await documentHistory(historyQuery.fileId);
  const rawData = res.data || [];
  historyList.value = historyList.value = rawData as HistoryVO[];
  historyQuery.total = historyList.value.length;
  historyLoading.value = false;
};
const resetHistoryQuery = () => {
  historyQuery.startTime = ''; // 全局变量，加.value
  historyQuery.endTime = ''; // 全局变量，加.value
  historyQuery.pageNum = 1; // 全局变量，加.value
  getHistoryList();
};
const handleHistory = async (row: DocumentVO) => {
  historyDialog.visible = true;
  historyDialog.fileName = row.name;
  historyQuery.fileId = row.id;
  historyQuery.pageNum = 1; // 重置页码
  historyQuery.startTime = '';
  historyQuery.endTime = '';
  await getHistoryList(); // 重新加载数据
};
// 新增：历史版本表格选中事件（记录选中的版本ID）
const handleHistorySelectionChange = (selection: HistoryVO[]) => {
  selectedHistoryIds.value = selection.map(item => item.versionId);
};

// 新增：历史版本批量下载（复用原有逻辑）
const handleHistoryBatchDownload = async () => {
  if (selectedHistoryIds.value.length === 0) {
    proxy?.$modal.msgError('请选择需要下载的历史版本');
    return;
  }
  await proxy?.$modal.confirm(`是否确认下载选中的${selectedHistoryIds.value.length}个历史版本？`);
  selectedHistoryIds.value.forEach(id => proxy.$download.oss(id));
  proxy?.$modal.msgSuccess('历史版本下载请求已提交');
};

// 新增：单个历史版本停用（复用原有逻辑）
const handleHistoryDisable = async (historyId: string) => {
  await proxy?.$modal.confirm('是否确认停用该历史版本？');
  await documentDisable([historyId]);
  proxy?.$modal.msgSuccess('历史版本停用成功');
  getHistoryList(); // 停用后刷新列表
};

/** 下载文件 */
/** 下载文件（修复批量下载报错） */
const handleDownload = async (row: DocumentVO) => {
  // 1. 校验并转换 ossIds 为数组（过滤空值和无效项）
  const ossIdsArray = row.ossIds
    ? row.ossIds.split(',').filter(ossId => ossId.trim() && /^\d+$/.test(ossId.trim()))
    : [];

  if (ossIdsArray.length === 0) {
    proxy?.$modal.msgError('无有效文件可下载');
    return;
  }

  // 2. 提示用户开始下载
  proxy?.$modal.msg(`开始下载${ossIdsArray.length}个文件，请耐心等待...`);

  // 3. 串行下载（逐个下载，避免并发压力）
  let successCount = 0;
  let failCount = 0;
  const failOssIds: string[] = [];

  for (const [index, ossId] of ossIdsArray.entries()) {
    try {
      console.log(`正在下载第${index + 1}个文件，ossId:`, ossId);
      // 逐个下载，等待前一个完成再执行下一个
      await proxy?.$download.oss(ossId.trim());
      successCount++;
    } catch (err) {
      failCount++;
      failOssIds.push(ossId);
      console.error(`第${index + 1}个文件下载失败，ossId:${ossId}，错误：`, err);
      // 单个文件失败仅日志提示，不中断整体下载
    }
  }

  // 4. 下载完成后汇总结果
  const resultMsg = `下载完成！成功：${successCount}个，失败：${failCount}个${failCount > 0 ? `（失败ossId：${failOssIds.join(',')}）` : ''
    }`;

  if (failCount === 0) {
    proxy?.$modal.msgSuccess(resultMsg);
  } else {
    proxy?.$modal.msgWarning(resultMsg + '\n失败文件可尝试重新下载或联系管理员');
  }
};
// 监听ossIds变化，自动提取文件后缀和URL
watch(
  () => form.value.ossIds,
  async (ossIds) => {
    if (ossIds) {
      const res = await listByIds(ossIds);
      if (res.data && res.data.length > 0) {
        console.log("🚀 ~ formFiles.value:", formFiles.value)
        formFiles.value = res.data.map((file: any) => ({
          name: file.originalName,
          url: file.url,
          ossId: file.ossId,
          suffix: file.originalName.split('.').pop() || ''
        }));
        // 收集所有后缀并存储
        const allSuffixes = formFiles.value.map(file => file.suffix).filter(Boolean);
        form.value.fileSuffix = allSuffixes.join(',');
        // 文件名和URL同步
        form.value.name = getFileNameWithoutSuffix(formFiles.value[0].name);
        form.value.urls = formFiles.value.map(file => file.url).join(',');

        console.log("🚀 ~ watch 所有文件后缀:", allSuffixes);
      }
    } else {
      formFiles.value = [];
      form.value.name = '';
      form.value.fileSuffix = '';
      form.value.urls = '';
    }
  },
  { immediate: true }
);
// 页面挂载时查询列表
onMounted(() => {
  getList();
});
</script>
<style lang="scss" scoped>
/* 历史版本弹窗样式 */
.history-content {
  padding: 10px 0;
}

.history-filter {
  margin-bottom: 16px;
}

.history-file-info {
  margin-bottom: 16px;
  color: #666;
}

.history-table {
  margin-bottom: 16px;
}

.history-pagination {
  text-align: right;
  margin-top: 16px;
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
  margin-top: 24px;
}

.block {
  display: block;
}

.mb-1 {
  margin-bottom: 4px;
}

.disable-btn-active {
  color: #f19a0e !important;
  cursor: pointer;
}

/* 停用状态：不可点击，颜色灰色 */
.disable-btn-disabled {
  color: #c0c4cc !important;
  cursor: not-allowed;
  opacity: 0.6;
}
</style>