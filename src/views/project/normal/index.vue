<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter"
      :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="建设项目名称" prop="projectName">
              <el-input v-model="queryParams.projectName" placeholder="请输入建设项目名称" clearable
                @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="项目代码" prop="projectCode">
              <el-input v-model="queryParams.projectCode" placeholder="请输入项目代码" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="创建时间" style="width: 420px">
              <el-date-picker v-model="dateRangeCreateTime" value-format="YYYY-MM-DD HH:mm:ss" type="daterange"
                range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
            </el-form-item>
            <el-form-item label="所属行政区划" prop="administrativeRegion">
              <el-input v-model="queryParams.administrativeRegion" placeholder="请输入所属行政区划" clearable
                @keyup.enter="handleQuery" />
            </el-form-item>
            <!-- <el-form-item label="涉及风景名胜区名称" prop="scenicArea">
              <el-input v-model="queryParams.scenicArea" placeholder="请输入涉及风景名胜区名称" clearable
                @keyup.enter="handleQuery" />
            </el-form-item> -->
            <el-form-item label="建设单位名称" prop="constructionUnit">
              <el-input v-model="queryParams.constructionUnit" placeholder="请输入建设单位名称" clearable
                @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="组织机构代码" prop="organizationCode">
              <el-input v-model="queryParams.organizationCode" placeholder="请输入组织机构代码" clearable
                @keyup.enter="handleQuery" />
            </el-form-item>
            <!-- <el-form-item label="经办人" prop="contactPerson">
              <el-input v-model="queryParams.contactPerson" placeholder="请输入经办人" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="经办人联系方式" prop="contactPhone">
              <el-input v-model="queryParams.contactPhone" placeholder="请输入经办人联系方式" clearable
                @keyup.enter="handleQuery" />
            </el-form-item> -->
            <el-form-item label="保护等级" prop="protectionLevel">
              <el-input v-model="queryParams.protectionLevel" placeholder="请输入保护等级" clearable
                @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-select v-model="queryParams.status" placeholder="请选择状态" clearable @keyup.enter="handleQuery">
                <el-option label="填报中" value="填报中"></el-option>
                <el-option label="管委会审批中" value="管委会审批中"></el-option>
                <el-option label="管委会通过" value="管委会通过"></el-option>
                <el-option label="管委会驳回" value="管委会驳回"></el-option>
                <el-option label="林业局通过" value="林业局通过"></el-option>
                <el-option label="林业局驳回" value="林业局驳回"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
              <el-button icon="Refresh" @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </transition>

    <el-card shadow="never">
      <template #header>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" plain icon="Plus" @click="handleAdd('normal-add')"
              v-hasPermi="['project:project:add']">创建项目</el-button>
          </el-col>
          <!-- <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdateBatch"
              v-hasPermi="['project:project:edit']">修改项目</el-button>
          </el-col> -->
          <!-- <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDeleteBatch"
              v-hasPermi="['project:project:remove']">删除项目</el-button>
          </el-col> -->
          <el-col :span="1.5">
            <el-button type="primary" plain icon="Download" @click="handleExport"
              v-hasPermi="['project:project:export']">批量数据下载</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" border :data="infoList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <!-- <el-table-column label="序号" align="center" prop="id" width="180" /> -->
        <el-table-column label="建设项目名称" align="center" prop="projectName" width="150" />
        <el-table-column label="项目代码" align="center" prop="projectCode" width="150" />
        <el-table-column label="所属行政区划" align="center" prop="administrativeRegion" />
        <el-table-column label="涉及风景名胜区名称" align="center" prop="scenicArea" width="150" />
        <el-table-column label="单位或个人" align="center" prop="applicantType" />
        <el-table-column label="状态" align="center" prop="status" width="150">
          <template #default="scope">
            <span class="status-dot"
              :style="{ backgroundColor: getStatusColor(scope.row.status), display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', marginRight: '6px', verticalAlign: 'middle' }"></span>
            <span class="status-text" :style="{ verticalAlign: 'middle' }">{{ scope.row.status }}</span>
          </template>
        </el-table-column>
        <el-table-column label="项目类型" align="center" prop="projectType" />
        <el-table-column label="项目用途" align="center" prop="projectUsage" />
        <el-table-column label="建设单位名称" align="center" prop="constructionUnit" width="150" />
        <el-table-column label="组织机构代码" align="center" prop="organizationCode" width="150" />
        <el-table-column label="拟选位置" align="center" prop="projectPurpose" width="150" />
        <el-table-column label="保护区等级" align="center" prop="protectionLevel" />
        <el-table-column label="创建时间" align="center" prop="createTime" width="120">
          <template #default="scope">
            {{ scope.row.createTime ? scope.row.createTime.slice(0, 10) : '' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="280">
          <template #default="scope">
            <el-button link type="primary" @click="handleUpdate(scope.row)" v-hasPermi="['project:project:edit']"
              v-if="scope.row.status === '填报中'">
              信息填报
            </el-button>
            <el-button link type="primary" @click="handleAudit(scope.row)" v-hasPermi="['project:project:gwhApprove']"
              v-if="scope.row.status === '管委会审批中'">
              审核</el-button>
            <el-button link type="primary" @click="handleUpdate(scope.row)" v-hasPermi="['project:project:edit']"
              v-if="scope.row.status === '管委会驳回'">
              二次填报
            </el-button>
            <el-button link type="primary" @click="handleShare(scope.row)" v-hasPermi="['project:project:share']"
              v-if="scope.row.status === '管委会通过'">
              数据共享
            </el-button>
            <el-button link type="primary" @click="handleView(scope.row)" v-hasPermi="['project:project:query']">
              查看
            </el-button>
            <el-button link type="danger" @click="handleDelete(scope.row)" v-hasPermi="['project:project:remove']">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
  </div>
</template>

<script setup name="Info" lang="ts">
import { useRouter } from 'vue-router'
import { ref, onMounted, nextTick } from 'vue';
import { listInfo, delInfo } from '@/api/project/normal/index';
import { InfoVO, InfoQuery, InfoForm } from '@/api/project/normal/types';
import { reactive, toRefs, getCurrentInstance } from 'vue';
const router = useRouter()
const { proxy } = getCurrentInstance() as ComponentInternalInstance;

// 核心响应式变量
const dateRangeCreateTime = ref<[string, string]>(['', '']);
const infoList = ref<InfoVO[]>([]);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<string>('');
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
// 状态颜色映射
const getStatusColor = (status: string) => {
  const statusMap: Record<string, string> = {
    '填报中': '#1890ff',
    '管委会审批中': '#faad14',
    '管委会通过': '#62c232',
    '林业局通过': '#62c232',
    '已通过': '#62c232',
    '管委会驳回': '#ff4d4f',
    '林业局驳回': '#ff4d4f'
  };
  return statusMap[status] || '#bfbfbf';
};

// 表单数据
const queryFormRef = ref<any>(null);
const initFormData: InfoForm = {
  id: undefined,
  projectName: undefined,
  projectCode: undefined,
  administrativeRegion: undefined,
  scenicArea: undefined,
  applicantType: undefined,
  constructionUnit: undefined,
  organizationCode: undefined,
  contactPerson: undefined,
  contactPhone: undefined,
  protectionLevel: undefined,
  status: undefined,
  projectType: undefined,
  projectUsage: undefined,
  projectPurpose: undefined,
  createTime: undefined,
  updateTime: undefined,
  projectInvestment: undefined,
  planningBasis: undefined,
  constructionContent: undefined,
  otherExplanations: undefined,
  locationPlan: undefined,
  expertOpinions: undefined,
  meetingMaterials: undefined,
  siteSelectionReport: undefined,
  approvalDocuments: undefined,
  projectRedLine: undefined,
  redLineCoordinate: undefined,
  threeDModel: undefined,
  modelCoordinate: undefined,
  modelPreview: undefined,
  majorFlag: false,
};

// 分页查询参数
const data = reactive<{
  form: InfoForm;
  queryParams: InfoQuery;
  rules: Record<string, any[]>;
}>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    projectName: undefined,
    projectCode: undefined,
    administrativeRegion: undefined,
    scenicArea: undefined,
    applicantType: undefined,
    constructionUnit: undefined,
    organizationCode: undefined,
    contactPerson: undefined,
    contactPhone: undefined,
    protectionLevel: undefined,
    status: undefined,
    createTimeFrom: undefined,
    createTimeTo: undefined,
    majorFlag: false,
  },
  rules: {
    projectName: [{ required: true, message: "建设项目名称不能为空", trigger: "blur" }],
    administrativeRegion: [{ required: true, message: "所属行政区划不能为空", trigger: "blur" }],
    scenicArea: [{ required: true, message: "涉及风景名胜区名称不能为空", trigger: "blur" }],
  }
});

const { queryParams, form } = toRefs(data);

/** 查询列表 */
const getList = async () => {
  loading.value = true;
  try {
    const res = await listInfo(queryParams.value);
    infoList.value = res.rows;
    total.value = res.total;
  } catch (err) {
    console.error('获取列表失败:', err);
  } finally {
    loading.value = false;
  }
};

/** 搜索操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  if (dateRangeCreateTime.value[0] && dateRangeCreateTime.value[1]) {
    queryParams.value.createTimeFrom = dateRangeCreateTime.value[0];
    queryParams.value.createTimeTo = dateRangeCreateTime.value[1];
  } else {
    delete queryParams.value.createTimeFrom;
    delete queryParams.value.createTimeTo;
  }
  getList();
};

/** 重置搜索 */
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  dateRangeCreateTime.value = ['', ''];
  handleQuery();
};

/** 选择项变化 */
const handleSelectionChange = (selection: InfoVO[]) => {
  const selectedIds = selection.map(item => item.id);
  ids.value = selectedIds.join(',');
  single.value = selection.length !== 1;
  multiple.value = !selection.length;
};

/** 新增项目 */
const handleAdd = async (data: string) => {
  form.value = { ...initFormData };
  await nextTick();
  router.push(`/project/normal/${data}`);
};

/** 查看项目 */
const handleView = (row: InfoVO) => {
  router.push(`/project/normal/normal-view/${row.id}`);
};

/** 数据共享 */
const handleShare = async (row: InfoVO) => {
  router.push(`/project/normal/normal-share/${row.id}`);
};

/** 编辑项目 */
const handleUpdate = (row: InfoVO) => {
  const isRejectStatus = ['管委会驳回', '林业局驳回'].includes(row.status);
  router.push(`/project/normal/${isRejectStatus ? 'normal-repeat-edit' : 'normal-edit'}/${row.id}`);
};

/** 批量编辑（表格头部按钮） */
const handleUpdateBatch = () => {
  // 从选中项中取第一个进行编辑
  const firstId = ids.value.split(',')[0];
  if (firstId) {
    const firstRow = infoList.value.find(item => item.id === firstId);
    if (firstRow) handleUpdate(firstRow);
  }
};

/** 删除项目 */
const handleDelete = async (row: InfoVO) => {
  try {
    await proxy?.$modal.confirm('是否确认删除建设项目？');
    await delInfo(row.id);
    proxy?.$modal.msgSuccess("删除成功");
    getList();
  } catch (err) {
    if (err !== 'cancel') {
      proxy?.$modal.msgError("删除失败：" + (err as Error).message || "未知错误");
    }
  }
};

/** 批量删除（表格头部按钮） */
const handleDeleteBatch = async () => {
  if (!ids.value) return;
  try {
    await proxy?.$modal.confirm('是否确认删除选中的建设项目？');
    await delInfo(ids.value);
    proxy?.$modal.msgSuccess("删除成功");
    getList();
  } catch (err) {
    if (err !== 'cancel') {
      proxy?.$modal.msgError("删除失败：" + (err as Error).message || "未知错误");
    }
  }
};

/** 导出项目 */
const handleExport = () => {
  if (!ids.value) {
    proxy?.$modal.msgWarning('请先选择要导出的项目');
    return;
  }
  const exportUrl = `${import.meta.env.VITE_APP_BASE_API}/project/download/${ids.value}`;
  proxy?.download(exportUrl, {}, `info_${new Date().getTime()}.zip`);
};

/** 审核项目 */
const handleAudit = (row: InfoVO) => {
  router.push(`/project/normal/normal-review/${row.id}`);
};

onMounted(async () => {
  try {
    await getList(); // 加await确保loading状态正确
  } catch (err) {
    console.error('获取项目列表失败：', err);
  }
});
</script>

<style lang="scss" scoped>
// 搜索表单标签样式调整
:deep(.el-form--inline .el-form-item__label) {
  width: 180px !important;
  text-align: right;
}

// 状态标签样式
.status-dot,
.status-text {
  vertical-align: middle !important;
}

// 表格操作按钮间距
:deep(.el-table-column__content .el-button) {
  margin: 0 2px;
  max-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

// 响应式布局调整
@media (max-width: 768px) {
  :deep(.el-row .el-col) {
    &:span-12 {
      width: 100% !important;
    }
  }
}
</style>