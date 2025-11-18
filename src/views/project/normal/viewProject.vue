<template>
  <div class="add-content-container">
    <div class="add-content">
      <!-- 项目基础信息 -->
      <div class="project-basic-info">
        <h3 class="section-title">项目基础信息</h3>
        <el-form :model="form" label-width="230px" disabled>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="建设活动（建设项目）名称">
                <el-input v-model="form.projectName" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="项目代码">
                <el-input v-model="form.projectCode" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="所属行政区划">
                <el-input v-model="form.administrativeRegion" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="涉及风景名胜区名称">
                <el-input v-model="form.scenicArea" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="单位建设/个人建设">
                <el-radio-group v-model="form.applicantType" disabled>
                  <el-radio label="单位">单位</el-radio>
                  <el-radio label="个人">个人</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="一般/重点项目">
                <el-radio-group v-model="form.majorFlag" disabled>
                  <el-radio :label="false">一般项目</el-radio>
                  <el-radio :label="true">重大项目</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <!-- 建设信息 -->
      <div class="project-documents">
        <div class="section-header">
          <h3 class="section-title">建设信息</h3>
          <el-button type="primary" @click="handleModelPreview" class="modelPreview">
            <img class="imgModel" src="../../../assets/images/model.png" />三维场景效果预览
          </el-button>
        </div>
        <el-form :model="form" label-width="230px" disabled>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="建设单位名称">
                <el-input v-model="form.constructionUnit" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="组织机构代码">
                <el-input v-model="form.organizationCode" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="经办人">
                <el-input v-model="form.contactPerson" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="经办人联系方式">
                <el-input v-model="form.contactPhone" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="保护区等级">
                <el-input v-model="form.protectionLevel" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="项目占用类型">
                <el-input v-model="form.projectType" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="项目用途">
                <el-input v-model="form.projectUsage" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="拟选位置">
                <el-input v-model="form.projectPurpose" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="建设项目拟投资额（万元）">
            <el-input v-model="form.projectInvestment" disabled />
          </el-form-item>
          <el-form-item label="规划依据">
            <el-input v-model="form.planningBasis" type="textarea" disabled />
          </el-form-item>
          <el-form-item label="建设内容涉及规模">
            <el-input v-model="form.constructionContent" type="textarea" disabled />
          </el-form-item>
          <el-form-item label="其他需要说明的情况">
            <el-input v-model="form.otherExplanations" type="textarea" disabled />
          </el-form-item>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="选址方案" class="custom-label">
                <transition-group class="upload-file-list el-upload-list el-upload-list--text" name="el-fade-in-linear"
                  tag="ul">
                  <li v-for="(file, index) in locationPlanFileList" :key="file.uid"
                    class="el-upload-list__item ele-upload-list__item-content">
                    <el-link :href="`${file.url}`" :underline="false" target="_blank">
                      <span class="el-icon-document"> {{ getFileName(file.name) }} </span>
                    </el-link>
                  </li>
                  <li v-if="locationPlanFileList.length === 0"
                    class="el-upload-list__item ele-upload-list__item-content empty-file" key="'empty-locationPlan'">
                    <span class="el-icon-info"> 暂无文件 </span>
                  </li>
                </transition-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="专家评审意见" class="custom-label">
                <transition-group class="upload-file-list el-upload-list el-upload-list--text" name="el-fade-in-linear"
                  tag="ul">
                  <li v-for="(file, index) in expertOpinionsFileList" :key="file.uid"
                    class="el-upload-list__item ele-upload-list__item-content">
                    <el-link :href="`${file.url}`" :underline="false" target="_blank">
                      <span class="el-icon-document"> {{ getFileName(file.name) }} </span>
                    </el-link>
                  </li>
                  <li v-if="expertOpinionsFileList.length === 0"
                    class="el-upload-list__item ele-upload-list__item-content empty-file" key="'empty-expertOpinions'">
                    <span class="el-icon-info"> 暂无文件 </span>
                  </li>
                </transition-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="公示材料" class="custom-label">
                <transition-group class="upload-file-list el-upload-list el-upload-list--text" name="el-fade-in-linear"
                  tag="ul">
                  <li v-for="(file, index) in publicMaterialFileList" :key="file.uid"
                    class="el-upload-list__item ele-upload-list__item-content">
                    <el-link :href="`${file.url}`" :underline="false" target="_blank">
                      <span class="el-icon-document"> {{ getFileName(file.name) }} </span>
                    </el-link>
                  </li>
                  <li v-if="publicMaterialFileList.length === 0"
                    class="el-upload-list__item ele-upload-list__item-content empty-file" key="'empty-publicMaterial'">
                    <span class="el-icon-info"> 暂无文件 </span>
                  </li>
                </transition-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="选址方案核准申报表" class="custom-label">
                <transition-group class="upload-file-list el-upload-list el-upload-list--text" name="el-fade-in-linear"
                  tag="ul">
                  <li v-for="(file, index) in siteSelectionReportFileList" :key="file.uid"
                    class="el-upload-list__item ele-upload-list__item-content">
                    <el-link :href="`${file.url}`" :underline="false" target="_blank">
                      <span class="el-icon-document"> {{ getFileName(file.name) }} </span>
                    </el-link>
                  </li>
                  <li v-if="siteSelectionReportFileList.length === 0"
                    class="el-upload-list__item ele-upload-list__item-content empty-file"
                    key="'empty-siteSelectionReport'">
                    <span class="el-icon-info"> 暂无文件 </span>
                  </li>
                </transition-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="立项文件" class="custom-label">
                <transition-group class="upload-file-list el-upload-list el-upload-list--text" name="el-fade-in-linear"
                  tag="ul">
                  <li v-for="(file, index) in approvalDocumentsFileList" :key="file.uid"
                    class="el-upload-list__item ele-upload-list__item-content">
                    <el-link :href="`${file.url}`" :underline="false" target="_blank">
                      <span class="el-icon-document"> {{ getFileName(file.name) }} </span>
                    </el-link>
                  </li>
                  <li v-if="approvalDocumentsFileList.length === 0"
                    class="el-upload-list__item ele-upload-list__item-content empty-file"
                    key="'empty-approvalDocuments'">
                    <span class="el-icon-info"> 暂无文件 </span>
                  </li>
                </transition-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="项目用地红线图" class="custom-label">
                <transition-group class="upload-file-list el-upload-list el-upload-list--text" name="el-fade-in-linear"
                  tag="ul">
                  <li v-for="(file, index) in projectRedLineFileList" :key="file.uid"
                    class="el-upload-list__item ele-upload-list__item-content">
                    <el-link :href="`${file.url}`" :underline="false" target="_blank">
                      <span class="el-icon-document"> {{ getFileName(file.name) }} </span>
                    </el-link>
                  </li>
                  <li v-if="projectRedLineFileList.length === 0"
                    class="el-upload-list__item ele-upload-list__item-content empty-file" key="'empty-projectRedLine'">
                    <span class="el-icon-info"> 暂无文件 </span>
                  </li>
                </transition-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="项目红线矢量数据" class="custom-label">
            <transition-group class="upload-file-list el-upload-list el-upload-list--text" name="el-fade-in-linear"
              tag="ul">
              <li v-for="(file, index) in redLineCoordinateFileList" :key="file.uid"
                class="el-upload-list__item ele-upload-list__item-content">
                <el-link :href="`${file.url}`" :underline="false" target="_blank">
                  <span class="el-icon-document"> {{ getFileName(file.name) }} </span>
                </el-link>
              </li>
              <li v-if="redLineCoordinateFileList.length === 0"
                class="el-upload-list__item ele-upload-list__item-content empty-file" key="'empty-redLineCoordinate'">
                <span class="el-icon-info"> 暂无文件 </span>
              </li>
            </transition-group>
            <div class="operation-group">
              <el-button link type="primary" @click="handleDownloadTemplate('instructions')">填写说明</el-button>
              <el-button link type="primary" @click="handleDownloadTemplate('polygonTemplate')">面模板下载</el-button>
              <el-button link type="primary" @click="handleDownloadTemplate('polylineTemplate')">线模板下载</el-button>
              <div>（使用前，请删除模板中的实例数据）</div>
            </div>
          </el-form-item>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="项目三维模型" class="custom-label">
                <transition-group class="upload-file-list el-upload-list el-upload-list--text" name="el-fade-in-linear"
                  tag="ul">
                  <li v-for="(file, index) in threeDModelFileList" :key="file.uid"
                    class="el-upload-list__item ele-upload-list__item-content">
                    <el-link :href="`${file.url}`" :underline="false" target="_blank">
                      <span class="el-icon-document"> {{ getFileName(file.name) }} </span>
                    </el-link>
                  </li>
                  <li v-if="threeDModelFileList.length === 0" :key="'empty-threeDModel'"
                    class="el-upload-list__item ele-upload-list__item-content empty-file">
                    <span class="el-icon-info"> 暂无文件 </span>
                  </li>
                </transition-group>
                <div class="operation-group">
                  <el-button link type="primary" icon="Download"
                    @click="handleDownloadTemplate('threeD')">模型规范与模板下载</el-button>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="模型坐标">
                <el-input v-model="form.modelCoordinate" disabled />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <!-- 审批信息（按状态显示） -->
      <div class="project-documents" v-if="showApprovalInfo">
        <h3 class="section-title">审批信息</h3>
        <el-form label-width="230px" disabled>
          <!-- 管委会审批信息 -->
          <template v-if="['管委会通过', '管委会驳回'].includes(form.status)">
            <el-form-item label="管委会审批状态">
              <div class="approval-item">
                <span :class="['status-icon',
                  form.approveRecord?.gwhApproveResult === '通过' ? 'success' :
                    form.approveRecord?.gwhApproveResult === '驳回' ? 'error' : 'pending'
                ]">
                  {{
                    form.approveRecord?.gwhApproveResult === '通过' ? '✓' :
                      form.approveRecord?.gwhApproveResult === '驳回' ? '✗' : '-'
                  }}
                </span>
                <span class="status-text">
                  {{ form.approveRecord?.gwhApproveResult || '待审批' }}
                </span>
              </div>
            </el-form-item>

            <el-form-item label="审批时间">
              <span>{{ form.approveRecord?.gwhApproveTime || '暂无时间' }}</span>
            </el-form-item>

            <el-form-item label="审批反馈">
              <el-input type="textarea" :value="form.approveRecord?.gwhApprovalReason || '暂无反馈'" :rows="2"
                style="background: #fff;" disabled />
            </el-form-item>

            <el-form-item label="反馈文件">
              <transition-group class="upload-file-list el-upload-list el-upload-list--text" name="el-fade-in-linear"
                tag="ul">
                <li v-for="(file, index) in managementFeedbackFileList" :key="file.uid"
                  class="el-upload-list__item ele-upload-list__item-content">
                  <el-link :href="`${file.url}`" :underline="false" target="_blank">
                    <span class="el-icon-document"> {{ getFileName(file.name) }} </span>
                  </el-link>
                </li>
                <li v-if="managementFeedbackFileList.length === 0" class="el-upload-list__item"
                  key="'empty-managementFeedback'">
                  <span class="el-icon-info"> 暂无反馈文件 </span>
                </li>
              </transition-group>
            </el-form-item>
          </template>
        </el-form>
      </div>
    </div>

    <!-- 底部按钮区 -->
    <div class="add-footer">
      <el-button @click="cancel">取消</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getInfo } from '@/api/project/normal/index'
import { useMajorProjectStore } from '@/store/modules/majorProject'
import { useUserStore } from '@/store/modules/user'
import { getCurrentInstance } from 'vue'
import { ElMessage } from 'element-plus'

const { proxy } = getCurrentInstance() || {}
const router = useRouter()
const route = useRoute()
const majorProjectStore = useMajorProjectStore()
const userStore = useUserStore()

// 表单数据
const form = reactive({
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
  projectInvestment: undefined,
  planningBasis: undefined,
  constructionContent: undefined,
  otherExplanations: undefined,
  modelCoordinate: undefined,
  majorFlag: false,
  approveRecord: {
    gwhApprovalAttachment: '', // 管委会审批反馈文件
    gwhApprovalReason: '',     // 管委会审批反馈
    gwhApproveResult: '',      // 管委会审批状态
    gwhApproveTime: ''         // 管委会审批时间
  }
})

// 文件列表
const locationPlanFileList = ref([])
const expertOpinionsFileList = ref([])
const publicMaterialFileList = ref([])
const siteSelectionReportFileList = ref([])
const approvalDocumentsFileList = ref([])
const projectRedLineFileList = ref([])
const redLineCoordinateFileList = ref([])
const threeDModelFileList = ref([])
const managementFeedbackFileList = ref([]) // 管委会反馈文件

// 计算属性：是否显示审批信息
const showApprovalInfo = computed(() => {
  // 填报中或管委会审批中时不显示审批信息
  return !['填报中', '管委会审批中'].includes(form.status)
})

// 获取文件名（截断长文件名）
const getFileName = (name) => {
  if (name.lastIndexOf('/') > -1) {
    return name.slice(name.lastIndexOf('/') + 1);
  } else {
    return name;
  }
}

// 三维模型预览
const handleModelPreview = () => {
  console.log("🚀 ~ handleModelPreview ~ form:", form)
  majorProjectStore.savePreviewProjectInfo({
    id: form.id,
    threeDModel: form.threeDModel || threeDModelFileList.value,
    modelCoordinate: form.modelCoordinate,
    type: '一般项目'
  })
  // router.push('/screen/preview')
}

// 下载模板
const handleDownloadTemplate = (type) => {
  if (type === 'instructions') {
    proxy?.$download.oss('1987829892356124674');
  } else if (type === 'polylineTemplate') {
    proxy?.$download.oss('1987829924379635713');
  } else if (type === 'polygonTemplate') {
    proxy?.$download.oss('1987829950501761026');
  } else if (type === 'threeD') {
    proxy?.$download.oss('1987830717459607554');
  }
}

// 取消按钮
const cancel = () => {
  router.push('/project/normal')
}

// 初始化加载数据
onMounted(async () => {
  const projectId = route.params.id
  if (projectId) {
    await loadProjectData(projectId)
  }
})

// 加载项目详情
const loadProjectData = async (projectId) => {
  try {
    const response = await getInfo(projectId)
    const projectData = response.data
    console.log("🚀 ~ loadProjectData ~ projectData:", projectData)
    Object.assign(form, projectData)

    // 初始化文件列表
    locationPlanFileList.value = projectData.locationPlan ? [...projectData.locationPlan] : []
    expertOpinionsFileList.value = projectData.expertOpinions ? [...projectData.expertOpinions] : []
    publicMaterialFileList.value = projectData.publicMaterial ? [...projectData.publicMaterial] : []
    siteSelectionReportFileList.value = projectData.siteSelectionReport ? [...projectData.siteSelectionReport] : []
    approvalDocumentsFileList.value = projectData.approvalDocuments ? [...projectData.approvalDocuments] : []
    projectRedLineFileList.value = projectData.projectRedLine ? [...projectData.projectRedLine] : []
    redLineCoordinateFileList.value = projectData.redLineCoordinate ? [...projectData.redLineCoordinate] : []
    threeDModelFileList.value = projectData.threeDModel ? [...projectData.threeDModel] : []
    console.log("🚀 ~ loadProjectData ~ threeDModelFileList.value:", threeDModelFileList.value)
    managementFeedbackFileList.value = projectData.approveRecord?.gwhApprovalAttachment
      ? [...projectData.approveRecord.gwhApprovalAttachment]
      : []
  } catch (err) {
    ElMessage.error('加载项目数据失败：' + (err.message || '未知错误'))
    router.push('/project/normal')
  }
}

// 暴露接口供父组件调用
defineExpose({
  open: async (row) => {
    if (row?.id) {
      await loadProjectData(row.id)
    }
  }
})
</script>

<style scoped>
.add-content-container {
  width: 100%;
  padding: 20px;
  background-color: #f6f6f6;
  box-sizing: border-box;
  position: relative;
  min-height: 100vh;
  padding-bottom: 80px;
}

.add-content {
  width: 100%;
  max-height: calc(100vh - 40px);
  overflow-y: auto;
}

.add-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  /* 与容器内边距保持一致 */
  padding: 20px;
  background-color: #f6f6f6;
  /* 与容器背景一致，避免透明穿透 */
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  /* 顶部阴影，区分内容区 */
  text-align: right;
  box-sizing: border-box;
  /* 确保padding不会撑大宽度 */
  z-index: 10;
}

.project-basic-info,
.project-documents {
  background-color: #ffffff;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.section-title {
  font-size: 19px;
  font-weight: bold;
  color: #1f2329;
  padding-left: 5px;
  border-left: 3px solid #409eff;
}

.modelPreview {
  display: flex;
  align-items: center;

  .imgModel {
    width: 20px;
    height: 20px;
    margin-right: 5px;
    vertical-align: middle;
  }
}

.add-footer el-button+el-button {
  margin-left: 10px;
}

.upload-file-list {
  margin-top: 10px;
}

.ele-upload-list__item-content {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 2px 10px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  margin-top: -10px;
  /* min-height: 36px; */
}

.empty-file .el-icon-info {
  margin-right: 5px;
}

.ele-upload-list__item-content .el-icon-document {
  margin-right: 5px;
  width: 16px;
  text-align: center;
}

.operation-group {
  margin-top: -5px;
  /* margin-bottom: 15px; */
  display: flex;
  gap: 15px;
  align-items: center;
  flex-wrap: wrap;
}

.operation-group div {
  color: #666;
  font-size: 14px;
}

/* 审批信息样式 */
.approval-item {
  display: flex;
  align-items: center;
}

.status-icon {
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  text-align: center;
  line-height: 20px;
  margin-right: 8px;
  color: white;
  font-weight: bold;
}

.status-icon.success {
  background-color: #52c41a;
}

.status-icon.error {
  background-color: #f5222d;
}

.status-icon.pending {
  background-color: #faad14;
}

.status-text {
  font-size: 16px;
}

.custom-label :v-deep(.el-form-item__label) {
  margin-top: 10px !important;
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