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
                range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
                :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"></el-date-picker>
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd('major-add')"
              v-hasPermi="['project:project:add']">创建项目</el-button>
          </el-col>
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
        <el-table-column label="建设项目名称" align="center" prop="projectName" width="180" />
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
        <el-table-column fixed="right" label="操作"  width="280">
          <template #default="scope">
            <el-button link type="primary" @click="handleUpdate(scope.row)" v-hasPermi="['project:project:edit']"
              v-if="scope.row.status === '填报中'">
              信息填报
            </el-button>
            <el-button link type="primary" @click="handleUpdate(scope.row)" v-hasPermi="['project:project:edit']"
              v-if="['管委会驳回', '林业局驳回'].includes(scope.row.status)">
              二次填报
            </el-button>
            <el-button link type="primary" @click="handleAudit(scope.row)" v-hasPermi="['project:project:gwhApprove']"
              v-if="scope.row.status === '管委会审批中'">
              审核
            </el-button>
            <el-button link type="primary" @click="handleAudit(scope.row)" v-hasPermi="['project:project:lyjApprove']"
              v-if="scope.row.status === '管委会通过'">
              审核
            </el-button>
            <el-button link type="primary" @click="handleShare(scope.row)" v-hasPermi="['project:project:share']" v-if="scope.row.status === '林业局通过'">
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
import { getInfo as getUserInfo } from '@/api/login';
import { InfoVO, InfoQuery, InfoForm } from '@/api/project/normal/types';
import { propTypes } from '@/utils/propTypes';
import { globalHeaders } from '@/utils/request';
const router = useRouter()
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const dateRangeCreateTime = ref<[string, string]>(['', '']);
const infoList = ref<InfoVO[]>([]);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<string>('');
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const currentUserRole = ref<string>('');

// 状态颜色映射：返回对应Hex颜色值
const getStatusColor = (status: string) => {
  switch (status) {
    case '填报中':
      return '#1890ff'; // 蓝色
    case '管委会审批中':
      return '#faad14'; // 橙色
    case '管委会通过':
    case '林业局通过':
    case '已通过':
      return '#62c232'; // 绿色
    case '管委会驳回':
    case '林业局驳回':
      return '#ff4d4f'; // 红色
    default:
      return '#bfbfbf'; // 默认灰色（应对未定义状态）
  }
};
const handleAudit = (row: InfoVO) => {
  router.push(`/project/major/major-review/${row.id}`);
};
const fileUploadRef = ref<ElUploadInstance>();
const queryFormRef = ref<ElFormInstance>();
const infoFormRef = ref<ElFormInstance>();
const baseUrl = import.meta.env.VITE_APP_BASE_API;
const uploadFileUrl = ref(baseUrl + '/resource/oss/upload');
const headers = ref(globalHeaders());
const fileList = ref<any[]>([]);
const props = defineProps({
  modelValue: {
    type: [String, Object, Array],
    default: () => []
  },
  // 数量限制
  limit: propTypes.number.def(15),
  // 大小限制(MB)
  fileSize: propTypes.number.def(500),
  // 文件类型, 例如['png', 'jpg', 'jpeg']
  fileType: propTypes.array.def(['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'pdf', 'zip', 'rar', 'dwg', 'dxf', 'jpg', 'jpeg', 'png', 'cpg', 'dbf', 'prj', 'sbn', 'sbx', 'shp', 'shp.xml', 'shx', 'FBX', 'fbm', 'obj', 'pak']),
  // 是否显示提示
  isShowTip: propTypes.bool.def(true),
});
const emit = defineEmits(['update:modelValue']);
watch(
  () => props.modelValue,
  async (val) => {
    fileList.value = []; // 先重置，避免残留旧数据
    if (!val) return; // 若val为null/undefined，直接返回
    let list: any[] = [];
    // 3. 处理文件列表，生成唯一uid
    let temp = 1;
    fileList.value = list.map((item) => ({
      name: item.name || '未知文件名',
      url: item.url || '',
      ossId: item.ossId || '',
      uid: item.uid || new Date().getTime() + temp++ // 确保uid唯一
    }));
  },
  { deep: true, immediate: true }
);
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
  majorFlag: true,
  approveRecord: {
    gwhApprovalAttachment: undefined, // 管委会审批反馈文件
    gwhApprovalReason: undefined,// 管委会审批反馈
    gwhApproveResult: undefined,// 管委会审批状态
    gwhApproveTime: undefined,// 管委会审批时间
    lyjApprovalAttachment: undefined,// 市林业局审核反馈文件
    lyjApprovalReason: undefined,// 市林业局审核反馈
    lyjApproveResult: undefined,// 市林业局审核状态
    lyjApproveTime: undefined,// 市林业局审核时间
  },
}
const data = reactive<PageData<InfoForm, InfoQuery>>({
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
    projectType: undefined,
    createTimeFrom: undefined,
    createTimeTo: undefined,
    majorFlag: true,
    // params: {
    // }
  },
  rules: {
    projectName: [
      { required: true, message: "建设项目名称不能为空", trigger: "blur" }
    ],
    administrativeRegion: [
      { required: true, message: "所属行政区划不能为空", trigger: "blur" }
    ],
    scenicArea: [
      { required: true, message: "涉及风景名胜区名称不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询【请填写功能名称】列表 */
const getList = async () => {
  loading.value = true;
  const res = await listInfo(queryParams.value);
  infoList.value = res.rows;
  total.value = res.total;
  loading.value = false;
}
/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  // 同步日期范围到查询参数
  if (dateRangeCreateTime.value[0] && dateRangeCreateTime.value[1]) {
    queryParams.value.createTimeFrom = dateRangeCreateTime.value[0];
    queryParams.value.createTimeTo = dateRangeCreateTime.value[1];
  } else {
    delete queryParams.value.createTimeFrom;
    delete queryParams.value.createTimeTo;
  }
  getList();
};

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  dateRangeCreateTime.value = ['', ''];
  handleQuery();
};

/** 多选框选中数据 */
const handleSelectionChange = (selection: InfoVO[]) => {
  const selectedIds = selection.map(item => item.id);
  ids.value = selectedIds.join(',');
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}
const handleAdd = async (data: string) => {
  form.value = { ...initFormData };
  await nextTick();
  router.push(`/project/major/${data}`);
};
const handleView = (row: InfoVO) => {
  router.push(`/project/major/major-view/${row.id}`);
};

const handleUpdate = (row: InfoVO) => {
  const isRejectStatus = ['管委会驳回', '林业局驳回'].includes(row.status);
  router.push(`/project/major/${isRejectStatus ? 'major-repeat-edit' : 'major-edit'}/${row.id}`);
};

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
/** 导出按钮操作 */
const handleExport = async () => {
  const exportUrl = `project/download/${ids.value}`;
  await proxy?.download(
    exportUrl,
    {},
    `info_${new Date().getTime()}.zip`
  );
}
const handleShare = async (row: InfoVO) => {
  router.push(`/project/major/major-share/${row.id}`);
};
onMounted(async () => { // 保留async关键字
  try {
    const res = await getUserInfo();
    const userRoles = res.data?.roles || [];
    currentUserRole.value = userRoles[0] || '';
    console.log("🚀 ~ currentUserRole.value:", currentUserRole.value)
    getList();
  } catch (err) {
    console.error('获取用户信息失败：', err);
    // 即使获取失败，仍尝试加载列表（可选）
    getList();
  }
});
</script>
<style lang="scss" scoped>
:deep(.el-form--inline .el-form-item__label) {
  width: 180px !important; // !important 可选，用于覆盖全局样式的优先级
  text-align: right; // 可选：让标签右对齐，避免文字与输入框间距异常
}

// 响应式调整
@media (max-width: 768px) {
  .el-row {
    .el-col {
      &:span-12 {
        width: 100% !important;
      }
    }
  }
}

.status-dot {
  // 已通过内联样式控制核心属性，此处可补充兼容性样式（可选）
  vertical-align: middle !important;
}

.status-text {
  vertical-align: middle !important;
}

// 操作栏按钮间距调整（可选，避免按钮过于拥挤）
:deep(.el-table-column__content .el-button) {
  margin: 0 4px;
}
</style>
