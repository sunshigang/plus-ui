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
            <el-button link type="primary" @click="handleHistory(scope.row)">历史版本</el-button>
            <el-button link type="primary" @click="handleUpdate(scope.row)">更新</el-button>
            <el-button link type="primary" @click="handleDownload(scope.row)">下载</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize"
        :total="total" @pagination="getList" />
    </el-card>
    <!-- 新增/更新版本对话框（使用原生el-upload默认文件列表） -->
    <el-dialog v-model="dialog.visible" :title="dialog.title" width="970px" append-to-body>
      <el-form ref="documentFormRef" :model="form" :rules="rules">
        <el-form-item label="文件名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入文件名称" clearable />
        </el-form-item>
        <el-form-item label="上传文件" prop="ossIds">
          <el-upload ref="nativeUploadRef" multiple :action="uploadFileUrl" :before-upload="handleBeforeUpload"
            :file-list="uploadFileList" :limit="15" :on-error="handleUploadError" :on-exceed="handleUploadExceed"
            :on-success="handleUploadSuccess" :on-remove="handleUploadRemove" :show-file-list="true" :headers="headers"
            class="native-upload">
            <el-button type="primary">选取文件</el-button>
            <template #tip>
              <div class="el-upload__tip">
                最多上传15个文件，单个文件不超过500MB |
                {{ dialog.title === '新增规划文件'
                  ? '支持所有文件类型，无格式限制'
                  : `仅支持与原文件一致的格式（${allowedTypesTip}）` }}
              </div>
            </template>
          </el-upload>

          <el-tooltip :content="tooltipContent" effect="dark" :enter-delay="500" class="tooltip-icon">
            <el-icon>
              <QuestionFilled />
            </el-icon>
          </el-tooltip>

          <span class="format-desc">
            {{ dialog.title === '新增规划文件'
              ? '支持所有文件类型，无格式限制'
              : `仅支持与原文件一致的格式（${allowedTypesTip}），上传后自动校验` }}
          </span>
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
import { ref, onMounted, computed, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import {
  documentList as apiDocumentList,
  documentAdd,
  documentUpdate,
  documentDisable
} from '@/api/document/index';
import { DocumentForm, DocumentQuery, DocumentVO } from '@/api/document/types';
import { QuestionFilled } from '@element-plus/icons-vue';
import { ElMessage, UploadInstance, UploadFile, FormInstance, UploadUserFile, UploadStatus, UploadRawFile } from 'element-plus';
import { globalHeaders } from '@/utils/request';
import { getCurrentInstance, ComponentInternalInstance } from 'vue'; // 补充缺失的导入
// 路由初始化
const router = useRouter();
const { proxy } = getCurrentInstance() as ComponentInternalInstance;

// 上传核心配置（原生el-upload）
const uploadFileUrl = import.meta.env.VITE_APP_BASE_API + '/resource/oss/upload';
const headers = ref(globalHeaders());
const nativeUploadRef = ref<UploadInstance | null>(null);

// 扩展UploadFile，兼容Element Plus类型
interface UploadFileExtend extends UploadFile {
  ossId?: string;
  suffix?: string;
  url?: string;
}
// ========== 核心新增：标准化文件后缀的工具函数 ==========
/**
 * 标准化文件后缀（统一为：.后缀名 格式，小写）
 * @param suffix 原始后缀（如：PDF、pdf、.PDF、png 等）
 * @returns 标准化后缀（如：.pdf、.png）
 */
const normalizeFileSuffix = (suffix: string): string => {
  if (!suffix) return '';
  // 1. 转小写 2. 移除前置点（避免重复） 3. 补充前置点
  const pureSuffix = suffix.trim().toLowerCase().replace(/^\./, '');
  return pureSuffix ? `.${pureSuffix}` : '';
};

/**
 * 提取文件后缀并标准化（兼容多后缀文件，如.shp.xml）
 * @param fileName 文件名
 * @returns 标准化后缀（如：.pdf、.shp.xml）
 */
const getFileSuffix = (fileName: string): string => {
  const parts = fileName.split('.');
  console.log("🚀 ~ getFileSuffix ~ parts:", parts)
  let rawSuffix = '';
  // 处理特殊多后缀（如.shp.xml）
  if (parts.length >= 3 && parts[parts.length - 2] === 'shp') {
    rawSuffix = `${parts[parts.length - 2]}.${parts[parts.length - 1]}`;
  } else if (parts.length >= 2) {
    rawSuffix = parts.pop()!;
  }
  // 标准化后缀格式
  return normalizeFileSuffix(rawSuffix);
};
// 状态管理
const uploadFileList = ref<UploadUserFile[]>([] as unknown as UploadUserFile[]);
const form = ref<DocumentForm>({
  id: '',
  name: '',
  urls: '',
  fileSuffix: '',
  disabledFlag: false,
  ossIds: '',
  updateTime: '',
  createTime: ''
});
const originalOssIds = ref<string>('');

const queryParams = ref<DocumentQuery>({
  pageNum: 1,
  pageSize: 10,
  name: '',
  fileSuffix: '',
  updateTime: '',
  disabledFlag: undefined,
});

const rules = ref({
  name: [{ required: true, message: '请输入文件名称', trigger: 'blur' }],
  ossIds: [{ required: true, message: '请上传文件', trigger: 'change' }]
});

// 其他状态
const originalFile = ref<DocumentVO | null>(null);
const planningFileList = ref<DocumentVO[]>([]);
const showTable = ref(true);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<{ id: string; ossIds: string }>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const dialog = ref({
  visible: false,
  title: '' as string
});

const documentFormRef = ref<FormInstance | null>(null);
const queryFormRef = ref<FormInstance | null>(null);

/** 生成唯一UID */
const generateUniqueUid = (prefix = 'file') => {
  return Date.now() + Math.floor(Math.random() * 10000);
};
/** 历史版本跳转 */
const handleHistory = (row: DocumentVO) => {
  router.push({
    name: 'DocumentHistory',
    params: { fileId: row.id },
    query: { fileName: row.name }
  });
};

/** 查询列表 */
const getList = async () => {
  loading.value = true;
  try {
    const response = await apiDocumentList(queryParams.value);
    const resData = response.data || response;
    // 对列表数据的fileSuffix进行标准化处理
    planningFileList.value = Array.isArray(resData.rows)
      ? resData.rows.map(row => ({
        ...row,
        // 标准化接口返回的后缀（如.PDF → .pdf）
        fileSuffix: normalizeFileSuffix(row.fileSuffix || '')
      }))
      : [];
    total.value = resData.total || 0;
  } catch (err) {
    proxy?.$modal.msgError(`查询失败：${(err as Error).message || '未知错误'}`);
  } finally {
    loading.value = false;
    showTable.value = true;
  }
};

/** 取消操作 */
function cancel() {
  dialog.value.visible = false;
  resetForm();
  originalFile.value = null;
  originalOssIds.value = '';
}

/** 重置表单 */
function resetForm() {
  form.value = {
    id: '',
    name: '',
    urls: '',
    fileSuffix: '',
    disabledFlag: false,
    ossIds: '',
    updateTime: '',
    createTime: ''
  };
  documentFormRef.value?.resetFields();
  uploadFileList.value = [] as unknown as UploadUserFile[];
  originalOssIds.value = '';
}

/** 搜索 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置搜索 */
function resetQuery() {
  showTable.value = false;
  queryFormRef.value?.resetFields();
  queryParams.value.name = '';
  queryParams.value.disabledFlag = undefined;
  handleQuery();
}

/** 多选事件 */
function handleSelectionChange(selection: DocumentVO[]) {
  ids.value = selection.map(item => ({
    id: item.id,
    ossIds: item.ossIds || ''
  }));
  single.value = selection.length !== 1;
  multiple.value = !selection.length;
}

/** 新增文件操作 */
const handleFile = () => {
  resetForm();
  dialog.value.visible = true;
  dialog.value.title = '新增规划文件';
  originalFile.value = null;
};

/** 编辑文件 */
const handleUpdate = async (row: DocumentVO) => {
  console.log("🚀 ~ handleUpdate ~ row.fileSuffix:", row.fileSuffix)
  resetForm();
  form.value.id = row.id;
  form.value.name = row.name;
  // 提取并标准化原文件格式（去重、标准化）
  form.value.fileSuffix = row.fileSuffix
    ? Array.from(
      new Set(
        row.fileSuffix.split(',')
          .map(s => normalizeFileSuffix(s)) // 标准化每个后缀
          .filter(Boolean)
      )
    ).join(',')
    : '';
  console.log("🚀 ~ handleUpdate ~ form.value.fileSuffix:", form.value.fileSuffix)
  originalFile.value = { ...row };
  originalOssIds.value = row.ossIds || '';

  // 清空原有数据
  form.value.ossIds = '';
  form.value.urls = '';
  uploadFileList.value = [] as unknown as UploadUserFile[];

  console.log("🚀 编辑更新 - 暂存原ossIds:", originalOssIds.value);
  await nextTick();
  dialog.value.visible = true;
  dialog.value.title = '更新规划文件';
};

/** 允许上传的文件类型 */
const getAllowedFileTypes = computed(() => {
  if (dialog.value.title === '更新规划文件' && form.value.fileSuffix) {
    return Array.from(
      new Set(
        form.value.fileSuffix
          .split(',')
          .map(s => s.trim().replace(/^\./, '').toLowerCase()) // 移除前置点用于校验
          .filter(s => s)
      )
    );
  }
  return [];
});

/** 格式提示文本（Tooltip） */
const tooltipContent = computed(() => {
  if (dialog.value.title === '新增规划文件') {
    return '支持所有文件类型，无格式限制';
  } else {
    const types = allowedTypesTip.value;
    return `支持格式：${types || '无'}`;
  }
});

/** 格式提示文本（上传区域） */
const allowedTypesTip = computed(() => {
  const types = getAllowedFileTypes.value;
  return types.length > 0 ? types.join('、') : '无';
});

/** 上传前校验（新增：限制文件数量≤15） */
const handleBeforeUpload = (rawFile: UploadRawFile) => {
  // 1. 限制上传文件总数≤15
  if (uploadFileList.value.length >= 15) {
    ElMessage.error('最多只能上传 15 个文件，请删除部分文件后再试');
    return false;
  }

  // 2. 校验文件大小（500MB限制）
  const fileSizeMB = rawFile.size / 1024 / 1024;
  if (fileSizeMB > 500) {
    ElMessage.error(`文件大小不能超过 500MB，当前文件大小：${fileSizeMB.toFixed(2)}MB`);
    return false;
  }

  // 3. 校验文件名（不含英文逗号）
  if (rawFile.name.includes(',')) {
    ElMessage.error('文件名不能包含英文逗号');
    return false;
  }

  // 4. 更新模式：校验文件格式（跳过.shp.xml格式）
  if (dialog.value.title === '更新规划文件') {
    const allowedTypes = getAllowedFileTypes.value;
    if (allowedTypes.length > 0) {
     const fileSuffix = getFileSuffix(rawFile.name).replace(/^\./, ''); // 移除前置点用于校验
      // 关键修改：如果是.shp.xml格式，直接跳过校验（允许上传）
      if (fileSuffix === 'shp.xml') {
        proxy?.$modal.loading('正在上传文件，请稍候...');
        return true;
      }
      const isAllowed = allowedTypes.includes(fileSuffix);
      if (!isAllowed) {
        ElMessage.error(`文件格式不正确，请上传${allowedTypes.join('/')}格式的文件`);
        return false;
      }
    }
  }

  proxy?.$modal.loading('正在上传文件，请稍候...');
  return true;
};


/** 上传超出数量限制 */
const handleUploadExceed = () => {
  ElMessage.error('最多只能上传 15 个文件');
};

/** 上传失败处理 */
const handleUploadError = (err: Error, file: UploadFile) => {
  proxy?.$modal.closeLoading();
  ElMessage.error(`文件 ${file.name} 上传失败：${err.message || '未知错误'}`);

  const fileUid = String(file.uid);
  const fileList = uploadFileList.value as unknown as UploadFileExtend[];
  const failIndex = fileList.findIndex(item => String(item.uid) === fileUid);
  if (failIndex > -1) {
    uploadFileList.value.splice(failIndex, 1);
  }
};

/** 上传成功处理（关键修改：标准化fileSuffix） */
const handleUploadSuccess = (res: any, file: UploadFile) => {
  proxy?.$modal.closeLoading();
  if (res.code === 200 && res.data) {
    const filename = res.data.filename || file.name;
    const ossId = res.data.ossId?.trim(); // 去重空格
    const url = res.data.url?.trim();     // 去重空格
    if (!ossId) {
      ElMessage.error(`文件 ${filename} 上传失败：缺少有效ossId`);
      return;
    }

    const fileSuffix = getFileSuffix(filename);

    const successFile: UploadFileExtend = {
      ...file,
      ossId: ossId,
      url: url,
      suffix: fileSuffix,
      response: res,
      status: 'success' as UploadStatus
    };
    console.log("🚀 ~ handleUploadSuccess ~ successFile:", successFile)

    const userFile = successFile as unknown as UploadUserFile;

    const fileList = uploadFileList.value as unknown as UploadFileExtend[];
    const fileUid = String(file.uid);
    const existingIndex = fileList.findIndex(item => String(item.uid) === fileUid);

    if (existingIndex > -1) {
      uploadFileList.value.splice(existingIndex, 1, userFile);
    } else {
      uploadFileList.value.push(userFile);
    }

    // 优化：去重ossId和url，URL拼接为'url1,url2'格式（仅外层单引号）
    const successFiles = uploadFileList.value as unknown as UploadFileExtend[];
    const uniqueOssIds = Array.from(new Set(successFiles.map(item => item.ossId).filter(Boolean))).join(',');
    // 关键修改：URL拼接为'url1,url2'格式（整体包裹单引号，内部逗号分隔）
    const urlArray = Array.from(new Set(successFiles.map(item => item.url).filter(Boolean)));
    const uniqueUrls = urlArray.join(','); // 直接拼接，无单引号
    const uniqueSuffixes = Array.from(new Set(successFiles.map(item => item.suffix).filter(Boolean))).join(',');

    form.value.ossIds = uniqueOssIds;
    form.value.urls = uniqueUrls; // 最终格式：url1,url2,url3
    console.log("🚀 上传成功 - urls:", form.value.urls);
    form.value.fileSuffix = uniqueSuffixes; // 最终存储标准化后的后缀（如：.pdf）
    console.log("🚀 上传成功 - fileSuffix:", form.value.fileSuffix);

    ElMessage.success(`文件 ${filename} 上传成功`);
  } else {
    ElMessage.error(`文件 ${file.name} 上传失败：${res.msg || '未知错误'}`);
    handleUploadRemove(file);
  }
};

/** 移除文件处理 */
const handleUploadRemove = (file: UploadFile) => {
  const extendFile = file as unknown as UploadFileExtend;
  const fileUid = String(extendFile.uid);
  const fileList = uploadFileList.value as unknown as UploadFileExtend[];
  const deleteIndex = fileList.findIndex(item => String(item.uid) === fileUid);

  if (deleteIndex === -1) return;

  // 删除服务器文件
  // if (extendFile.status === 'success' && extendFile.ossId) {
  //   delOss(extendFile.ossId).catch(err => {
  //     console.warn(`删除服务器文件失败：${err.message}`);
  //   });
  // }

  // 从列表中移除
  uploadFileList.value.splice(deleteIndex, 1);

  // 更新form字段
  const successFiles = uploadFileList.value as unknown as UploadFileExtend[];
  const uniqueOssIds = Array.from(new Set(successFiles.map(item => item.ossId).filter(Boolean))).join(',');
  const urlArray = Array.from(new Set(successFiles.map(item => item.url).filter(Boolean)));
  const uniqueUrls = urlArray.join(','); // 无单引号
  const uniqueSuffixes = Array.from(new Set(successFiles.map(item => item.suffix).filter(Boolean))).join(',');

  form.value.ossIds = uniqueOssIds;
  form.value.urls = uniqueUrls;
  form.value.fileSuffix = uniqueSuffixes;
};

/** 获取文件名（处理URL路径） */
const getFileName = (name: string) => {
  if (name.lastIndexOf('/') > -1) {
    return name.slice(name.lastIndexOf('/') + 1);
  }
  return name;
};

/** 提交表单 */
const submitForm = () => {
  documentFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      try {
        const submitData = {
          id: form.value.id,
          ossIds: form.value.ossIds,
          name: form.value.name,
          fileSuffix: form.value.fileSuffix, // 提交标准化后的后缀（如：.pdf）
          urls: form.value.urls,
          disabledFlag: false
        };
        console.log("🚀 提交数据 - final:", submitData);

        if (!form.value.id) {
          await documentAdd(submitData);
        } else {
          await documentUpdate(submitData);
        }
        proxy?.$modal.msgSuccess(`${!form.value.id ? '新增' : '更新'}成功`);
        dialog.value.visible = false;
        await getList();
      } catch (err) {
        proxy?.$modal.msgError(`${!form.value.id ? '新增' : '更新'}失败：${(err as Error).message || '未知错误'}`);
        console.error("🚀 提交失败:", err);
      } finally {
        buttonLoading.value = false;
        originalOssIds.value = '';
      }
    }
  });
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
      ossIdsArray = row.ossIds.split(',').filter((ossId: string) =>
        ossId.trim() && /^\d+$/.test(ossId.trim())
      );
    } else if (Array.isArray(row.ossIds)) {
      ossIdsArray = (row.ossIds as string[]).filter((ossId: string) =>
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

// 挂载查询
onMounted(() => {
  getList();
});
</script>

<style lang="scss" scoped>
.disable-btn-active {
  color: #f19a0e !important;
  cursor: pointer;
}

.disable-btn-disabled {
  color: #c0c4cc !important;
  cursor: not-allowed;
  opacity: 0.6;
}

.native-upload {
  width: 100%;
}

.tooltip-icon {
  margin-top: 2px;
  cursor: help;
  color: #666;
}

.format-desc {
  margin-top: 2px;
  color: #666;
  font-size: 14px;
  white-space: nowrap;
}

.el-upload-list--text {
  margin-top: 8px !important;
}

.el-upload-list__item {
  margin-bottom: 6px !important;
}
</style>