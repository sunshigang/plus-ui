<template>
  <div class="p-2">
    <!-- 搜索区域 -->
    <div v-show="showSearch" class="mb-[10px]">
      <el-card shadow="hover">
        <el-form ref="queryFormRef" :model="queryParams" :inline="true">
          <el-form-item label="文件名称" prop="name" label-width="80px">
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
            <el-button v-hasPermi="['document:planningFile:download']" type="success" plain icon="Download"
              :disabled="multiple" @click="handleBatchDownload()">
              批量下载
            </el-button>
          </el-col>
          <right-toolbar v-model:show-search="showSearch" @query-table="getList"></right-toolbar>
        </el-row>
      </template>
      <!-- 表格 -->
      <el-table v-if="showTable" v-loading="loading" :data="planningFileList" border
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="文件名" align="center" prop="name" :show-overflow-tooltip="true" />
        <el-table-column label="文件类型" align="center" prop="fileSuffix" :show-overflow-tooltip="true" />
        <el-table-column label="更新时间" align="center" prop="updateTime" width="220">
          <template #default="scope">
            <span>{{ proxy.parseTime(scope.row.updateTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <!-- 历史版本按钮：改为路由跳转 -->
            <el-button link type="primary" @click="handleHistory(scope.row)">历史版本</el-button>
            <el-button link type="primary" @click="handleUpdate(scope.row)">更新</el-button>
            <el-button link type="primary" @click="handleDownload(scope.row)">下载</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize"
        :total="total" @pagination="getList" />
    </el-card>

    <!-- 新增/更新版本对话框（保留原功能） -->
    <el-dialog v-model="dialog.visible" :title="dialog.title" width="970px" append-to-body>
      <el-form ref="documentFormRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="文件名称" prop="name" hidden>
          <el-input v-model="form.name" placeholder="自动填充文件名" />
        </el-form-item>
        <el-form-item label="上传文件" prop="ossIds">
          <FileUpload v-model="form.ossIds" :disabled="false" @update:modelValue="handleFileUploadChange"
            :fileType="getAllowedFileTypes" />
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
  </div>
</template>

<script setup name="DocumentPlanningFile" lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { useRouter } from 'vue-router'; // 导入路由
import { listByIds } from '@/api/system/oss';
import FileUpload from '@/components/FileUpload/index.vue';
import { delOss } from '@/api/system/oss';
import {
  documentList as apiDocumentList,
  documentAdd,
  documentUpdate,
  documentDisable
} from '@/api/document/index';
import { DocumentForm, DocumentQuery, DocumentVO } from '@/api/document/types';

const router = useRouter(); // 初始化路由
const { proxy } = getCurrentInstance() as ComponentInternalInstance;

// ===== 移除所有历史版本相关的响应式数据 =====
// （删除 historyDialog、historyQuery、historyList、selectedHistoryIds 等）

// 保留原页面其他响应式数据
interface DialogOption {
  visible: boolean;
  title: string;
}
interface PageData<T, Q> {
  form: T;
  queryParams: Q;
  rules: Record<string, any[]>;
}
const originalFile = ref<DocumentVO | null>(null);
const formFiles = ref<any[]>([]);
const planningFileList = ref<DocumentVO[]>([]);
const showTable = ref(true);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<{ id: string; ossIds: string }>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});
const documentFormRef = ref<ElFormInstance>();
const queryFormRef = ref<ElFormInstance>();

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
  rules: {
    ossIds: [{ required: true, message: '请上传文件', trigger: 'change' }]
  }
});
const { queryParams, form, rules } = toRefs(data);
/** 历史版本按钮：改为路由跳转（核心修改） */
const handleHistory = (row: DocumentVO) => {
  // 跳转到独立历史版本页面，携带fileId参数
  router.push({
    name: 'DocumentHistory', // 对应路由名称
    params: { fileId: row.id }, // 传递文件ID
    query: { fileName: row.name } // 传递文件名（用于页面标题）
  });
};

// 其他方法（getList、handleQuery、submitForm、handleDownload等）保持不变
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
  originalFile.value = null;
}

/** 表单重置 */
function reset() {
  form.value = { ...initFormData };
  documentFormRef.value?.resetFields();
  form.value.ossIds = '';
  formFiles.value = [];
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
  ids.value = selection.map(item => ({
    id: item.id,
    ossIds: item.ossIds || ''
  }));
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
      } finally {
        buttonLoading.value = false;
      }
    }
  });
};

/** 编辑操作（回显数据） */
const handleUpdate = async (row: DocumentVO) => {
  reset();
  form.value.id = row.id;
  form.value.ossIds = '';
  form.value.name = row.name; // 回显原文件名
  form.value.fileSuffix = row.fileSuffix; // 回显原文件类型
  form.value.urls = row.urls; // 回显原文件URL
  formFiles.value = [];
  originalFile.value = row;

  // 可选：回显原文件列表（如果需要在更新时显示已上传文件）
  if (row.ossIds) {
    const res = await listByIds(row.ossIds);
    if (res.data && res.data.length > 0) {
      formFiles.value = res.data.map((file: any) => ({
        name: file.originalName,
        url: file.url,
        ossId: String(file.ossId),
        suffix: file.originalName.split('.').pop() || ''
      }));
    }
  }

  dialog.visible = true;
  dialog.title = '更新规划文件';
};

const getAllowedFileTypes = computed(() => {
  // 更新模式：原文件有后缀限制时
  if (dialog.title === '更新规划文件' && originalFile.value?.fileSuffix) {
    const fileSuffix = originalFile.value.fileSuffix;
    // 处理后缀：去重、兼容大小写、保留原始格式（带点和不带点都支持）
    const suffixes = Array.from(new Set(
      fileSuffix.split(',')
        .map(suffix => suffix.trim())
        .filter(suffix => suffix)
    ));

    // 生成支持的文件类型数组：包含 带点/不带点 + 大小写 组合（确保文件选择器能识别）
    const supportedTypes = suffixes.flatMap(suffix => {
      const pureSuffix = suffix.startsWith('.') ? suffix.slice(1) : suffix;
      return [
        pureSuffix.toLowerCase(),
        pureSuffix.toUpperCase(),
        `.${pureSuffix.toLowerCase()}`,
        `.${pureSuffix.toUpperCase()}`
      ];
    });

    // 补充默认支持的相关格式（避免仅限制单个后缀导致文件无法识别）
    const defaultRelatedTypes = [
      'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'pdf', 'zip', 'rar',
      'dwg', 'DWG', 'dxf', 'DXF', 'jpg', 'jpeg', 'png', 'cpg', 'CPG', 'dbf',
      'prj', 'sbn', 'sbx', 'shp', 'shp.xml', 'xml', 'shx', 'FBX', 'fbx', 'obj'
    ];

    // 合并去重：确保既限制原文件类型，又支持相关常用格式
    return Array.from(new Set([...supportedTypes, ...defaultRelatedTypes]));
  }

  // 新增模式：默认支持所有规划文件类型
  return [
    'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'pdf', 'zip', 'rar',
    'dwg', 'DWG', 'dxf', 'DXF', 'jpg', 'jpeg', 'png', 'cpg', 'CPG', 'dbf',
    'prj', 'sbn', 'sbx', 'shp', 'shp.xml', 'xml', 'shx', 'FBX', 'fbx', 'obj'
  ];
});

const handleFileUploadChange = (newOssIds: string) => {
  form.value.ossIds = newOssIds;
  if (newOssIds) {
    listByIds(newOssIds).then(res => {
      if (res.data && res.data.length > 0) {
        formFiles.value = res.data.map((file: any) => ({
          name: file.originalName,
          url: file.url,
          ossId: String(file.ossId),
          suffix: file.originalName.split('.').pop() || ''
        }));
        const allSuffixes = formFiles.value.map(file => file.suffix).filter(Boolean);
        form.value.fileSuffix = allSuffixes.join(',');
        const fileName = formFiles.value[0].name;
        form.value.name = getFileNameWithoutSuffix(fileName);
        form.value.urls = formFiles.value.map(file => file.url).join(',');
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
  const disableIds = row?.id ? [row.id] : ids.value.map(item => item.id);
  if (!disableIds.length) {
    proxy?.$modal.msgError('请选择需要停用的数据');
    return;
  }
  await proxy?.$modal.confirm(`请确认是否停用选中的${disableIds.length}个规划文件，停用后相关数据信息将不再三维场景中展示。`);
  loading.value = true;
  try {
    await documentDisable(disableIds);
    if (row) {
      row.disabledFlag = !row.disabledFlag;
    } else {
      planningFileList.value.forEach(item => {
        if (disableIds.includes(item.id)) {
          item.disabledFlag = true;
        }
      });
    }
    getList();
    proxy?.$modal.msgSuccess('停用成功');
  } catch (err) {
    proxy?.$modal.msgError(`停用失败：${(err as Error).message || '未知错误'}`);
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
  const allOssIds: string[] = [];
  ids.value.forEach(item => {
    if (item.ossIds) {
      const ossIdsArray = item.ossIds.split(',')
        .map(id => id.trim())
        .filter(id => id && /^\d+$/.test(id));
      allOssIds.push(...ossIdsArray);
    }
  });
  if (allOssIds.length === 0) {
    proxy?.$modal.msgError('选中的文件中无有效可下载资源');
    return;
  }
  let successCount = 0;
  let failCount = 0;
  const failIds: string[] = [];
  for (const ossId of allOssIds) {
    try {
      await proxy?.$download.oss(ossId);
      successCount++;
    } catch (err) {
      failCount++;
      failIds.push(ossId);
    }
  }
  const resultMsg = `下载完成！成功：${successCount}个，失败：${failCount}个${failCount > 0 ? `（失败ID：${failIds.join(',')}）` : ''}`;
  failCount === 0 ? proxy?.$modal.msgSuccess(resultMsg) : proxy?.$modal.msgWarning(resultMsg);
};

/** 下载文件 */
const handleDownload = async (row: DocumentVO) => {
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

// 监听ossIds变化
watch(
  () => form.value.ossIds,
  async (ossIds) => {
    if (ossIds) {
      const res = await listByIds(ossIds);
      if (res.data && res.data.length > 0) {
        formFiles.value = res.data.map((file: any) => ({
          name: file.originalName,
          url: file.url,
          ossId: file.ossId,
          suffix: file.originalName.split('.').pop() || ''
        }));
        const allSuffixes = formFiles.value.map(file => file.suffix).filter(Boolean);
        form.value.fileSuffix = allSuffixes.join(',');
        form.value.name = getFileNameWithoutSuffix(formFiles.value[0].name);
        form.value.urls = formFiles.value.map(file => file.url).join(',');
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
/* 保留原样式，删除历史版本弹窗相关样式 */
.disable-btn-active {
  color: #f19a0e !important;
  cursor: pointer;
}

.disable-btn-disabled {
  color: #c0c4cc !important;
  cursor: not-allowed;
  opacity: 0.6;
}
</style>