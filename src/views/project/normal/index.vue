<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter"
      :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="建设活动" prop="projectName">
              <el-input v-model="queryParams.projectName" placeholder="请输入建设活动" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="项目代码" prop="projectCode">
              <el-input v-model="queryParams.projectCode" placeholder="请输入项目代码" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="所属行政区划" prop="administrativeRegion">
              <el-input v-model="queryParams.administrativeRegion" placeholder="请输入所属行政区划" clearable
                @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="涉及风景名胜区名称" prop="scenicArea">
              <el-input v-model="queryParams.scenicArea" placeholder="请输入涉及风景名胜区名称" clearable
                @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="建设单位名称" prop="constructionUnit">
              <el-input v-model="queryParams.constructionUnit" placeholder="请输入建设单位名称" clearable
                @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="组织机构代码" prop="organizationCode">
              <el-input v-model="queryParams.organizationCode" placeholder="请输入组织机构代码" clearable
                @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="经办人" prop="contactPerson">
              <el-input v-model="queryParams.contactPerson" placeholder="请输入经办人" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="经办人联系方式" prop="contactPhone">
              <el-input v-model="queryParams.contactPhone" placeholder="请输入经办人联系方式" clearable
                @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="保护等级等" prop="protectionLevel">
              <el-input v-model="queryParams.protectionLevel" placeholder="请输入保护等级等" clearable
                @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="项目用地" prop="projectPurpose">
              <el-input v-model="queryParams.projectPurpose" placeholder="请输入项目用地" clearable
                @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="建设项目总投资" prop="projectInvestment">
              <el-input v-model="queryParams.projectInvestment" placeholder="请输入建设项目总投资" clearable
                @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="规划依据" prop="planningBasis">
              <el-input v-model="queryParams.planningBasis" placeholder="请输入规划依据" clearable
                @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="其他需要说明的情况" prop="otherExplanations">
              <el-input v-model="queryParams.otherExplanations" placeholder="请输入其他需要说明的情况" clearable
                @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="选址方案URL" prop="locationPlan">
              <el-input v-model="queryParams.locationPlan" placeholder="请输入选址方案URL" clearable
                @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="专家评审意见URL" prop="expertOpinions">
              <el-input v-model="queryParams.expertOpinions" placeholder="请输入专家评审意见URL" clearable
                @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="会议材料URL" prop="meetingMaterials">
              <el-input v-model="queryParams.meetingMaterials" placeholder="请输入会议材料URL" clearable
                @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="选址方案核准申报表URL" prop="siteSelectionReport">
              <el-input v-model="queryParams.siteSelectionReport" placeholder="请输入选址方案核准申报表URL" clearable
                @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="立项文件URL" prop="approvalDocuments">
              <el-input v-model="queryParams.approvalDocuments" placeholder="请输入立项文件URL" clearable
                @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="项目用地红线图URL" prop="projectRedLine">
              <el-input v-model="queryParams.projectRedLine" placeholder="请输入项目用地红线图URL" clearable
                @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="项目红线矢量数据URL" prop="redLineCoordinate">
              <el-input v-model="queryParams.redLineCoordinate" placeholder="请输入项目红线矢量数据URL" clearable
                @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="项目三维模型URL" prop="threeDModel">
              <el-input v-model="queryParams.threeDModel" placeholder="请输入项目三维模型URL" clearable
                @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="模型坐标" prop="modelCoordinate">
              <el-input v-model="queryParams.modelCoordinate" placeholder="请输入模型坐标" clearable
                @keyup.enter="handleQuery" />
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd"
              v-hasPermi="['system:info:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()"
              v-hasPermi="['system:info:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()"
              v-hasPermi="['system:info:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport"
              v-hasPermi="['system:info:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" border :data="infoList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="" align="center" prop="id" v-if="true" />
        <el-table-column label="建设活动" align="center" prop="projectName" />
        <el-table-column label="项目代码" align="center" prop="projectCode" />
        <el-table-column label="所属行政区划" align="center" prop="administrativeRegion" />
        <el-table-column label="涉及风景名胜区名称" align="center" prop="scenicArea" />
        <el-table-column label="单位或个人" align="center" prop="applicantType" />
        <el-table-column label="建设单位名称" align="center" prop="constructionUnit" />
        <el-table-column label="组织机构代码" align="center" prop="organizationCode" />
        <el-table-column label="经办人" align="center" prop="contactPerson" />
        <el-table-column label="经办人联系方式" align="center" prop="contactPhone" />
        <el-table-column label="保护等级等" align="center" prop="protectionLevel" />
        <el-table-column label="项目类型" align="center" prop="projectType" />
        <el-table-column label="项目用地" align="center" prop="projectPurpose" />
        <el-table-column label="建设项目总投资" align="center" prop="projectInvestment" />
        <el-table-column label="规划依据" align="center" prop="planningBasis" />
        <el-table-column label="建设内容涉及规模" align="center" prop="constructionContent" />
        <el-table-column label="其他需要说明的情况" align="center" prop="otherExplanations" />
        <el-table-column label="选址方案URL" align="center" prop="locationPlan" />
        <el-table-column label="专家评审意见URL" align="center" prop="expertOpinions" />
        <el-table-column label="会议材料URL" align="center" prop="meetingMaterials" />
        <el-table-column label="选址方案核准申报表URL" align="center" prop="siteSelectionReport" />
        <el-table-column label="立项文件URL" align="center" prop="approvalDocuments" />
        <el-table-column label="项目用地红线图URL" align="center" prop="projectRedLine" />
        <el-table-column label="项目红线矢量数据URL" align="center" prop="redLineCoordinate" />
        <el-table-column label="项目三维模型URL" align="center" prop="threeDModel" />
        <el-table-column label="模型坐标" align="center" prop="modelCoordinate" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
                v-hasPermi="['system:info:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
                v-hasPermi="['system:info:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改【请填写功能名称】对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="1000px" append-to-body>
      <el-form ref="infoFormRef" :model="form" :rules="rules" label-width="178px">
        <el-form-item label="建设活动" prop="projectName">
          <el-input v-model="form.projectName" placeholder="请输入建设活动" />
        </el-form-item>
        <el-form-item label="项目代码" prop="projectCode">
          <el-input v-model="form.projectCode" placeholder="请输入项目代码" />
        </el-form-item>
        <el-form-item label="所属行政区划" prop="administrativeRegion">
          <el-input v-model="form.administrativeRegion" placeholder="请输入所属行政区划" />
        </el-form-item>
        <el-form-item label="涉及风景名胜区名称" prop="scenicArea">
          <el-input v-model="form.scenicArea" placeholder="请输入涉及风景名胜区名称" />
        </el-form-item>
        <el-form-item label="申请人类型" prop="applicantType">
          <el-radio-group v-model="form.applicantType">
            <el-radio-button label="单位">单位</el-radio-button>
            <el-radio-button label="个人">个人</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="建设单位名称" prop="constructionUnit">
          <el-input v-model="form.constructionUnit" placeholder="请输入建设单位名称" />
        </el-form-item>
        <el-form-item label="组织机构代码" prop="organizationCode">
          <el-input v-model="form.organizationCode" placeholder="请输入组织机构代码" />
        </el-form-item>
        <el-form-item label="经办人" prop="contactPerson">
          <el-input v-model="form.contactPerson" placeholder="请输入经办人" />
        </el-form-item>
        <el-form-item label="经办人联系方式" prop="contactPhone">
          <el-input v-model="form.contactPhone" placeholder="请输入经办人联系方式" />
        </el-form-item>
        <el-form-item label="保护等级等" prop="protectionLevel">
          <el-input v-model="form.protectionLevel" placeholder="请输入保护等级等" />
        </el-form-item>
        <el-form-item label="项目用地" prop="projectPurpose">
          <el-input v-model="form.projectPurpose" placeholder="请输入项目用地" />
        </el-form-item>
        <el-form-item label="建设项目总投资" prop="projectInvestment">
          <el-input v-model="form.projectInvestment" placeholder="请输入建设项目总投资" />
        </el-form-item>
        <el-form-item label="规划依据" prop="planningBasis">
          <el-input v-model="form.planningBasis" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="建设内容涉及规模">
          <editor v-model="form.constructionContent" :min-height="192" />
        </el-form-item>
        <el-form-item label="其他需要说明的情况" prop="otherExplanations">
          <el-input v-model="form.otherExplanations" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="选址方案URL" prop="locationPlan">
          <el-input v-model="form.locationPlan" placeholder="请输入选址方案URL" />
        </el-form-item>
        <el-form-item label="专家评审意见URL" prop="expertOpinions">
          <el-input v-model="form.expertOpinions" placeholder="请输入专家评审意见URL" />
        </el-form-item>
        <el-form-item label="会议材料URL" prop="meetingMaterials">
          <el-input v-model="form.meetingMaterials" placeholder="请输入会议材料URL" />
        </el-form-item>
        <el-form-item label="选址方案核准申报表URL" prop="siteSelectionReport">
          <el-input v-model="form.siteSelectionReport" placeholder="请输入选址方案核准申报表URL" />
        </el-form-item>
        <el-form-item label="立项文件URL" prop="approvalDocuments">
          <el-input v-model="form.approvalDocuments" placeholder="请输入立项文件URL" />
        </el-form-item>
        <el-form-item label="项目用地红线图URL" prop="projectRedLine">
          <el-input v-model="form.projectRedLine" placeholder="请输入项目用地红线图URL" />
        </el-form-item>
        <el-form-item label="项目红线矢量数据URL" prop="redLineCoordinate">
          <el-input v-model="form.redLineCoordinate" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="项目三维模型URL" prop="threeDModel">
          <el-input v-model="form.threeDModel" placeholder="请输入项目三维模型URL" />
        </el-form-item>
        <el-form-item label="模型坐标" prop="modelCoordinate">
          <el-input v-model="form.modelCoordinate" placeholder="请输入模型坐标" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Info" lang="ts">
import { listInfo, getInfo, delInfo, addInfo, updateInfo } from '@/api/project/normal/index';
import { InfoVO, InfoQuery, InfoForm } from '@/api/project/normal/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const infoList = ref<InfoVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const infoFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

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
  projectType: undefined,
  projectPurpose: undefined,
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
  modelCoordinate: undefined
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
    projectType: undefined,
    projectPurpose: undefined,
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
    params: {
    }
  },
  rules: {
    administrativeRegion: [
      { required: true, message: "所属行政区划不能为空", trigger: "blur" }
    ],
    scenicArea: [
      { required: true, message: "涉及风景名胜区名称不能为空", trigger: "blur" }
    ],
    organizationCode: [
      { required: true, message: "组织机构代码不能为空", trigger: "blur" }
    ],
    contactPerson: [
      { required: true, message: "经办人不能为空", trigger: "blur" }
    ],
    protectionLevel: [
      { required: true, message: "保护等级等不能为空", trigger: "blur" }
    ],
    projectType: [
      { required: true, message: "项目类型不能为空", trigger: "change" }
    ],
    projectPurpose: [
      { required: true, message: "项目用地不能为空", trigger: "blur" }
    ],
    projectInvestment: [
      { required: true, message: "建设项目总投资不能为空", trigger: "blur" }
    ],
    planningBasis: [
      { required: true, message: "规划依据不能为空", trigger: "blur" }
    ],
    constructionContent: [
      { required: true, message: "建设内容涉及规模不能为空", trigger: "blur" }
    ],
    otherExplanations: [
      { required: true, message: "其他需要说明的情况不能为空", trigger: "blur" }
    ],
    locationPlan: [
      { required: true, message: "选址方案URL不能为空", trigger: "blur" }
    ],
    expertOpinions: [
      { required: true, message: "专家评审意见URL不能为空", trigger: "blur" }
    ],
    meetingMaterials: [
      { required: true, message: "会议材料URL不能为空", trigger: "blur" }
    ],
    siteSelectionReport: [
      { required: true, message: "选址方案核准申报表URL不能为空", trigger: "blur" }
    ],
    approvalDocuments: [
      { required: true, message: "立项文件URL不能为空", trigger: "blur" }
    ],
    projectRedLine: [
      { required: true, message: "项目用地红线图URL不能为空", trigger: "blur" }
    ],
    redLineCoordinate: [
      { required: true, message: "项目红线矢量数据URL不能为空", trigger: "blur" }
    ],
    threeDModel: [
      { required: true, message: "项目三维模型URL不能为空", trigger: "blur" }
    ],
    modelCoordinate: [
      { required: true, message: "模型坐标不能为空", trigger: "blur" }
    ]
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

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
}

/** 表单重置 */
const reset = () => {
  form.value = { ...initFormData };
  infoFormRef.value?.resetFields();
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  handleQuery();
}

/** 多选框选中数据 */
const handleSelectionChange = (selection: InfoVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加一般项目信息";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: InfoVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getInfo(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改一般项目信息";
}

/** 提交按钮 */
const submitForm = () => {
  infoFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateInfo(form.value).finally(() => buttonLoading.value = false);
      } else {
        await addInfo(form.value).finally(() => buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: InfoVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除【请填写功能名称】编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delInfo(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('system/info/export', {
    ...queryParams.value
  }, `info_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>
<style lang="scss" scoped>
:deep(.el-form--inline .el-form-item__label)  {
  width: 180px !important; // !important 可选，用于覆盖全局样式的优先级
  text-align: right; // 可选：让标签右对齐，避免文字与输入框间距异常
}
</style>
