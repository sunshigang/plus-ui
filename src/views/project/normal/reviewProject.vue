<template>
  <div class="add-content-container">
    <div v-if="showSuccessPopup" class="add-content-wrapper">
      <div class="add-content">
        <div class="back-normal" @click="handleCancel"><img src="../../../assets/images/arrow-left.png" />审批</div>
        <div class="project-info-header">
          <h2 class="main-title">项目信息</h2>
          <el-button type="primary" @click="handleModelReview" class="modelReview">
            <img class="imgModel" src="../../../assets/images/model.png" />三维场景方案审核
          </el-button>
        </div>

        <!-- 基础信息（可折叠） -->
        <div class="basic-info-container">
          <div class="section-title-wrap" @click="toggleBasicInfo">
            <img v-if="basicInfoVisible" class="arrow-icon" src="../../../assets/images/arrow-down.png" />
            <img v-else class="arrow-icon" src="../../../assets/images/arrow-right.png" />
            <div class="section-title-text">基础信息</div>
          </div>
          <div class="section-content" v-if="basicInfoVisible">
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
        </div>

        <!-- 建设信息（可折叠） -->
        <div class="construction-info-container">
          <div class="section-title-wrap" @click="toggleConstructionInfo">
            <img v-if="constructionInfoVisible" class="arrow-icon" src="../../../assets/images/arrow-down.png" />
            <img v-else class="arrow-icon" src="../../../assets/images/arrow-right.png" />
            <div class="section-title-text">建设信息</div>
          </div>
          <div class="section-content" v-if="constructionInfoVisible">
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
                  <el-form-item label="保护区等级" prop="protectionLevel">
                    <el-select v-model="form.protectionLevel" placeholder="请选择保护区等级" disabled>
                      <el-option label="一级保护区" value="一级保护区"></el-option>
                      <el-option label="二级保护区" value="二级保护区"></el-option>
                      <el-option label="三级保护区（非核心景区）" value="三级保护区（非核心景区）"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="项目占用类型" prop="projectType" disabled>
                    <el-select v-model="form.projectType" placeholder="请选择项目占用类型">
                      <el-option label="长期" value="长期"></el-option>
                      <el-option label="临时" value="临时"></el-option>
                    </el-select>
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
                    <transition-group class="upload-file-list el-upload-list el-upload-list--text"
                      name="el-fade-in-linear" tag="ul">
                      <li v-for="(file, index) in locationPlanFileList" :key="file.ossId"
                        class="el-upload-list__item ele-upload-list__item-content">
                        <el-link :href="file.url" :underline="false" target="_blank">
                          <span class="el-icon-document"> {{ file.name }} </span>
                        </el-link>
                      </li>
                      <li v-if="locationPlanFileList.length === 0"
                        class="el-upload-list__item ele-upload-list__item-content empty-file"
                        key="'empty-locationPlan'">
                        <span class="el-icon-info"> 暂无文件 </span>
                      </li>
                    </transition-group>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="专家评审意见" class="custom-label">
                    <transition-group class="upload-file-list el-upload-list el-upload-list--text"
                      name="el-fade-in-linear" tag="ul">
                      <li v-for="(file, index) in expertOpinionsFileList" :key="file.ossId"
                        class="el-upload-list__item ele-upload-list__item-content">
                        <el-link :href="file.url" :underline="false" target="_blank">
                          <span class="el-icon-document"> {{ file.name }} </span>
                        </el-link>
                      </li>
                      <li v-if="expertOpinionsFileList.length === 0"
                        class="el-upload-list__item ele-upload-list__item-content empty-file"
                        key="'empty-expertOpinions'">
                        <span class="el-icon-info"> 暂无文件 </span>
                      </li>
                    </transition-group>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="公示材料" class="custom-label">
                    <transition-group class="upload-file-list el-upload-list el-upload-list--text"
                      name="el-fade-in-linear" tag="ul">
                      <li v-for="(file, index) in meetingMaterialsFileList" :key="file.ossId"
                        class="el-upload-list__item ele-upload-list__item-content">
                        <el-link :href="file.url" :underline="false" target="_blank">
                          <span class="el-icon-document"> {{ file.name }} </span>
                        </el-link>
                      </li>
                      <li v-if="meetingMaterialsFileList.length === 0"
                        class="el-upload-list__item ele-upload-list__item-content empty-file"
                        key="'empty-meetingMaterials'">
                        <span class="el-icon-info"> 暂无文件 </span>
                      </li>
                    </transition-group>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="选址方案核准申报表" class="custom-label">
                    <transition-group class="upload-file-list el-upload-list el-upload-list--text"
                      name="el-fade-in-linear" tag="ul">
                      <li v-for="(file, index) in siteSelectionReportFileList" :key="file.ossId"
                        class="el-upload-list__item ele-upload-list__item-content">
                        <el-link :href="file.url" :underline="false" target="_blank">
                          <span class="el-icon-document">{{ file.name }} </span>
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
                    <transition-group class="upload-file-list el-upload-list el-upload-list--text"
                      name="el-fade-in-linear" tag="ul">
                      <li v-for="(file, index) in approvalDocumentsFileList" :key="file.ossId"
                        class="el-upload-list__item ele-upload-list__item-content">
                        <el-link :href="file.url" :underline="false" target="_blank">
                          <span class="el-icon-document"> {{ file.name }} </span>
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
                    <transition-group class="upload-file-list el-upload-list el-upload-list--text"
                      name="el-fade-in-linear" tag="ul">
                      <li v-for="(file, index) in projectRedLineFileList" :key="file.ossId"
                        class="el-upload-list__item ele-upload-list__item-content">
                        <el-link :href="file.url" :underline="false" target="_blank">
                          <span class="el-icon-document"> {{ file.name }} </span>
                        </el-link>
                      </li>
                      <li v-if="projectRedLineFileList.length === 0"
                        class="el-upload-list__item ele-upload-list__item-content empty-file"
                        key="'empty-projectRedLine'">
                        <span class="el-icon-info"> 暂无文件 </span>
                      </li>
                    </transition-group>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="项目红线矢量数据" class="custom-label">
                <transition-group class="upload-file-list el-upload-list el-upload-list--text" name="el-fade-in-linear"
                  tag="ul">
                  <li v-for="(file, index) in redLineCoordinateFileList" :key="file.ossId"
                    class="el-upload-list__item ele-upload-list__item-content">
                    <el-link :href="file.url" :underline="false" target="_blank">
                      <span class="el-icon-document"> {{ file.name }} </span>
                    </el-link>
                  </li>
                  <li v-if="redLineCoordinateFileList.length === 0"
                    class="el-upload-list__item ele-upload-list__item-content empty-file"
                    key="'empty-redLineCoordinate'">
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
                    <transition-group class="upload-file-list el-upload-list el-upload-list--text"
                      name="el-fade-in-linear" tag="ul">
                      <li v-for="(file, index) in threeDModelFileList" :key="file.ossId"
                        class="el-upload-list__item ele-upload-list__item-content">
                        <el-link :href="file.url" :underline="false" target="_blank">
                          <span class="el-icon-document"> {{ file.name }} </span>
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
        </div>
        <!-- 审批信息（按状态显示） -->
        <div class="project-documents" v-if="showApprovalSection">
          <h3 class="section-title">审批信息</h3>
          <el-form label-width="230px" disabled>
            <!-- 管委会审批信息 -->
            <el-form-item label="管委会审批状态">
              <div class="approval-item">
                <span :class="['status-icon',
                  form.approveRecords[0].gwhApproveResult === '通过' ? 'success' :
                    form.approveRecords[0].gwhApproveResult === '驳回' ? 'error' : 'pending'
                ]">
                  {{
                    form.approveRecords[0].gwhApproveResult === '通过' ? '✓' :
                      form.approveRecords[0].gwhApproveResult === '驳回' ? '✗' : '-'
                  }}
                </span>
                <span class="status-text">
                  {{ form.approveRecords[0].gwhApproveResult || '待审批' }}
                </span>
              </div>
            </el-form-item>

            <el-form-item label="审批时间">
              <span>{{ form.approveRecords[0].gwhApproveTime || '暂无时间' }}</span>
            </el-form-item>

            <el-form-item label="审批反馈">
              <el-input type="textarea" :value="form.approveRecords[0].gwhApprovalReason || '暂无反馈'" :rows="2"
                style="background: #fff;" disabled />
            </el-form-item>

            <el-form-item label="反馈文件">
              <transition-group class="upload-file-list el-upload-list el-upload-list--text" name="el-fade-in-linear"
                tag="ul">
                <li v-for="(file, index) in managementFeedbackFileList" :key="file.ossId"
                  class="el-upload-list__item ele-upload-list__item-content">
                  <el-link :href="file.url" :underline="false" target="_blank">
                    <span class="el-icon-document"> {{ getFileName(file.name) }} </span>
                  </el-link>
                </li>
                <li v-if="managementFeedbackFileList.length === 0" class="el-upload-list__item"
                  key="'empty-managementFeedback'">
                  <span class="el-icon-info"> 暂无反馈文件 </span>
                </li>
              </transition-group>
            </el-form-item>

          </el-form>
        </div>
        <!-- 审核区域 -->
        <div class="audit-section">
          <div class="audit-title">审核</div>
          <el-form ref="auditFormRef" :model="auditForm" label-width="230px">
            <el-form-item label="反馈建议" prop="feedback"
              :rules="[{ required: auditForm.auditResult === '驳回', message: '驳回必须填写反馈建议', trigger: 'blur' }]">
              <el-input v-model="auditForm.approvalReason" type="textarea" :rows="4" placeholder="请输入审核建议（驳回时必须填写）" />
            </el-form-item>
            <el-form-item label="反馈文件">
              <el-upload ref="feedbackFileUploadRef" multiple :action="uploadFileUrl"
                :before-upload="(file) => handleBeforeUpload(file)" :file-list="feedbackFileList" :limit="props.limit"
                :accept="fileAccept" :on-error="handleUploadError" :on-exceed="handleExceed"
                :on-success="handleUploadSuccess" :show-file-list="false" :headers="headers"
                class="upload-file-uploader">
                <el-button type="primary">点击上传</el-button>
              </el-upload>
              <transition-group class="upload-file-list el-upload-list el-upload-list--text" name="el-fade-in-linear"
                tag="ul">
                <li v-for="(file, index) in feedbackFileList" :key="file.ossId"
                  class="el-upload-list__item ele-upload-list__item-content">
                  <el-link :href="file.url" :underline="false" target="_blank">
                    <span class="el-icon-document"> {{ getFileName(file.name) }} </span>
                  </el-link>
                  <div class="ele-upload-list__item-content-action">
                    <el-button type="danger" link @click="handleDeleteUploadFile(index)">删除</el-button>
                  </div>
                </li>
              </transition-group>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="add-footer">
        <el-button @click="handleCancel">稍后处理</el-button>
        <el-button type="danger" @click="handleReject">驳回</el-button>
        <el-button type="primary" @click="handleApprove">通过</el-button>
      </div>
    </div>
    <!-- 成功提交弹窗 -->
    <div v-else class="popup-content-wrapper">
      <div class="popup-content">
        <img v-if="auditForm.auditResult === '通过'" src="../../../assets/images/tick.png" class="success-icon" />
        <img v-else-if="auditForm.auditResult === '驳回'" src="../../../assets/images/no-tick.png" class="success-icon" />
        <div class="success-text">
          <template v-if="auditForm.auditResult === '通过'">
            已通过《{{ form.projectName }}》的申报！
          </template>
          <template v-else-if="auditForm.auditResult === '驳回'">
            已驳回《{{ form.projectName }}》的申报！
          </template>
        </div>
        <div class="button-group">
          <el-button class="btn-back" @click="handleCancel">返回项目列表</el-button>
          <el-button class="btn-view" @click="handleViewDetail">查看填报详情</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getInfo, gwhApprove } from '@/api/project/normal/index'
import { useUserStore } from '@/store/modules/user'
import { getCurrentInstance } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { globalHeaders } from '@/utils/request';
// 组件实例与路由
const { proxy } = getCurrentInstance() || {}
const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const showSuccessPopup = ref(true)
// 折叠状态控制
const basicInfoVisible = ref(true)
const constructionInfoVisible = ref(true)

// 项目信息表单
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
  protectionLevel: '',
  status: undefined,
  projectType: '',
  projectUsage: undefined,
  projectPurpose: undefined,
  createTime: undefined,
  updateTime: undefined,
  projectInvestment: undefined,
  planningBasis: undefined,
  constructionContent: undefined,
  otherExplanations: undefined,
  locationPlan: '',
  expertOpinions: '',
  meetingMaterials: '',
  siteSelectionReport: '',
  approvalDocuments: '',
  projectRedLine: '',
  redLineCoordinate: '',
  threeDModel: '',
  modelCoordinate: undefined,
  modelPreview: undefined,
  majorFlag: true,
  approveRecords: [{
    projectId: '',
    gwhApproveResult: '',
    gwhApproverId: '',
    gwhApproveTime: '',
    gwhApprovalReason: '',
    gwhApprovalAttachment: '',
    lyjApproveResult: '',
    lyjApproverId: '',
    lyjApproveTime: '',
    lyjApprovalReason: '',
    lyjApprovalAttachment: '',
  }]
})

// 文件列表（与viewProject保持一致）
const locationPlanFileList = ref([])
const expertOpinionsFileList = ref([])
const meetingMaterialsFileList = ref([])
const siteSelectionReportFileList = ref([])
const approvalDocumentsFileList = ref([])
const projectRedLineFileList = ref([])
const redLineCoordinateFileList = ref([])
const threeDModelFileList = ref([])
const managementFeedbackFileList = ref([])

// 审核表单数据
const auditForm = reactive({
  auditResult: '', // 审核结果：通过/驳回
  approvalReason: ''     // 反馈意见
})
const showApprovalSection = computed(() => {
  const currentStatus = (form.status || '').trim();
  const validStatuses = ['管委会通过', '管委会驳回', '林业局通过', '林业局驳回'];
  return validStatuses.includes(currentStatus);

})
// 审核文件上传配置
const feedbackFileList = ref([])
const uploadFileUrl = import.meta.env.VITE_APP_BASE_API + '/resource/oss/upload'
const headers = ref(globalHeaders())
const props = {
  limit: 5,
  fileType: ['doc', 'docx', 'xls', 'xlsx', 'pdf', 'zip', 'rar']
}
const fileAccept = props.fileType.map(type => `.${type}`).join(',')

// 折叠/展开控制
const toggleBasicInfo = () => {
  basicInfoVisible.value = !basicInfoVisible.value
}
const toggleConstructionInfo = () => {
  constructionInfoVisible.value = !constructionInfoVisible.value
}

// 文件名处理（修复参数可能为null/undefined的问题）
const getFileName = (name) => {
  // 处理name为null/undefined的情况
  if (!name) return '未知文件名'
  // 处理路径分隔符（兼容windows和unix）
  const separatorIndex = Math.max(name.lastIndexOf('/'), name.lastIndexOf('\\'))
  return separatorIndex > -1 ? name.slice(separatorIndex + 1) : name
}

// 三维场景方案审核
const handleModelReview = () => {
  if (threeDModelFileList.value.length === 0) {
    ElMessage.warning('暂无三维模型文件，无法审核')
    return
  }
  router.push({
    path: '/screen/screen',
    query: {
      id: form.id,
      type: 'normal-review'
    }
  })
}

// 文件上传相关方法（简化参数传递）
const handleBeforeUpload = (file) => {
  const fileExt = file.name.split('.').pop()?.toLowerCase()
  if (!props.fileType.includes(fileExt)) {
    ElMessage.error(`仅支持${props.fileType.join('/')}格式文件`)
    return false
  }
  const isLt500M = file.size / 1024 / 1024 < 500
  if (!isLt500M) {
    ElMessage.error('文件大小不能超过500MB')
    return false
  }
  return true
}

const handleUploadSuccess = (res, file) => {
  if (res.code === 200) {
    feedbackFileList.value.push({
      name: res.data.fileName,
      url: res.data.url,
      ossId: res.data.ossId,
      uid: file.uid
    })
    ElMessage.success('上传成功')
  } else {
    ElMessage.error(res.msg || '上传失败')
  }
}

const handleUploadError = (err) => {
  ElMessage.error(`上传失败：${err.message || '未知错误'}`)
}

const handleExceed = () => {
  ElMessage.warning(`最多只能上传${props.limit}个文件`)
}

const handleDeleteUploadFile = (index) => {
  feedbackFileList.value.splice(index, 1)
}

// 审核表单ref（用于验证）
const auditFormRef = ref(null)

// 审核操作
const handleApprove = () => {
  submitAudit('通过')
}

const handleReject = () => {
  submitAudit('驳回')
}

const submitAudit = async (result) => {
  auditForm.auditResult = result
  // 验证表单（使用实际的表单ref）
  if (!auditFormRef.value) return
  auditFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        await ElMessageBox.confirm(
          `确定要${result === '通过' ? '通过' : '驳回'}该项目吗？`,
          '操作确认',
          { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
        )

        // 构造审核数据
        const auditData = {
          projectId: form.id,
          approveResult: result,
          approvalReason: auditForm.approvalReason,
          approvalAttachment: JSON.stringify(feedbackFileList.value)
        }
        // 调用审核接口
        await gwhApprove(auditData)
        ElMessage.success(`审核${result}成功`)
        showSuccessPopup.value = false
        // router.push('/project/normal')
      } catch (err) {
        if (err !== 'cancel') {
          ElMessage.error(`审核失败：${err.message || '未知错误'}`)
        }
      }
    }
  })
}
const handleViewDetail = () => {
  router.push(`/project/mormal/mormal-view/${route.params.id}`);
}
// 取消操作
const handleCancel = () => {
  router.push('/project/normal')
}
// 新增：解析审批记录（兼容字符串转数组）
const parseApproveRecord = (approveRecordData) => {
  if (!approveRecordData) return [
    {
      projectId: '',
      gwhApproveResult: '',
      gwhApproverId: '',
      gwhApproveTime: '',
      gwhApprovalReason: '',
      gwhApprovalAttachment: '',
      lyjApproveResult: '',
      lyjApproverId: '',
      lyjApproveTime: '',
      lyjApprovalReason: '',
      lyjApprovalAttachment: '',
    }
  ];

  try {
    // 如果是字符串，尝试解析为数组
    const recordList = typeof approveRecordData === 'string'
      ? JSON.parse(approveRecordData)
      : approveRecordData;

    // 确保是数组，且每个元素包含新增字段
    return Array.isArray(recordList)
      ? recordList.map(item => ({
        gwhApproverId: '', // 默认空值（避免字段缺失）
        lyjApproverId: '', // 默认空值
        ...item // 合并原有字段
      }))
      : [recordList]; // 非数组则转为数组
  } catch (error) {
    console.error('解析审批记录失败:', error);
    // 解析失败返回默认结构
    return [
      {
        projectId: '',
        gwhApproveResult: '',
        gwhApproverId: '',
        gwhApproveTime: '',
        gwhApprovalReason: '',
        gwhApprovalAttachment: '',
        lyjApproveResult: '',
        lyjApproverId: '',
        lyjApproveTime: '',
        lyjApprovalReason: '',
        lyjApprovalAttachment: '',
      }
    ];
  }
}
// 加载项目数据
onMounted(async () => {
  const projectId = route.params.id
  if (projectId) {
    await loadProjectData(projectId)
  }
})
const parseFileList = (fileData) => {
  if (!fileData) return [];
  try {
    let list = [];
    // 处理字符串类型（JSON字符串）
    if (typeof fileData === 'string') {
      list = JSON.parse(fileData);
    }
    // 处理数组类型
    else if (Array.isArray(fileData)) {
      list = fileData;
    }
    // 过滤无效文件项（确保包含必要字段）
    return list.filter(item =>
      typeof item === 'object' &&
      item !== null &&
      item.ossId &&
      item.url
    ).map(item => ({
      // 确保文件名存在
      name: item.name || '未知文件',
      url: item.url,
      ossId: item.ossId
    }));
  } catch (error) {
    console.error('解析文件列表失败:', error);
    return [];
  }
}
const loadProjectData = async (projectId) => {
  try {
    const response = await getInfo(projectId)
    const projectData = response.data
    Object.assign(form, projectData)
    form.approveRecord = parseApproveRecord(projectData.approveRecord);
    // 初始化文件列表 - 使用通用解析方法处理JSON字符串
    locationPlanFileList.value = parseFileList(projectData.locationPlan)
    expertOpinionsFileList.value = parseFileList(projectData.expertOpinions)
    meetingMaterialsFileList.value = parseFileList(projectData.meetingMaterials)
    siteSelectionReportFileList.value = parseFileList(projectData.siteSelectionReport)
    approvalDocumentsFileList.value = parseFileList(projectData.approvalDocuments)
    projectRedLineFileList.value = parseFileList(projectData.projectRedLine)
    // 重点处理redLineCoordinate，确保正确解析并显示name
    redLineCoordinateFileList.value = parseFileList(projectData.redLineCoordinate)
    // 处理三维模型文件列表
    threeDModelFileList.value = parseFileList(projectData.threeDModel)
    // 处理审批反馈文件
    const firstRecord = form.approveRecords[0] || {};
    managementFeedbackFileList.value = parseFileList(firstRecord.gwhApprovalAttachment)
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
  height: 100vh;
}

.add-content-wrapper {
  width: 100%;
  height: 100%;
}

.add-content {
  width: 100%;
  max-height: calc(100vh - 60px);
  overflow-y: auto;
}

.popup-content-wrapper {
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.popup-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 27px;
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  height: 96%;
  width: 97%;
  position: absolute;
}

.success-icon {
  width: 80px;
  height: 80px;
}

.success-text {
  font-size: 24px;
  color: #333;
  text-align: center;
}

.button-group {
  display: flex;
  gap: 20px;
  margin-top: 10px;
}

.btn-back {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 8px 24px;
}

.btn-view {
  background-color: white;
  color: #333;
  border: 1px solid #ddd;
  padding: 8px 24px;
}

.back-normal {
  width: 80px;
  height: 30px;
  font-size: 20px;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.back-normal img {
  margin-right: 5px;
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

.audit-section,
.project-basic-info,
.project-documents {
  background-color: #ffffff;
  padding: 6px;
  margin-bottom: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.section-title-wrap {
  display: flex;
  align-items: center;
  /* 垂直居中对齐 */
  cursor: pointer;
  /* 增加鼠标指针提示 */
  padding: 5px 0;
  /* 增加上下内边距，优化点击区域 */
  /* background-color: #ffffff; */
  margin-bottom: 20px;
}

/* 箭头图标样式 */
.arrow-icon {
  width: 16px;
  /* 根据需要调整图标大小 */
  height: 16px;
  margin-right: 10px;
  /* 与文本保持间距 */
  /* 移除不必要的margin-top，避免偏移 */
}

/* 标题文本样式 */
.section-title-text {
  font-size: 19px;
  font-weight: bold;
  color: #1f2329;
  padding-left: 5px;
  line-height: 2;
}

.project-info-header {
  display: flex;
  justify-content: space-between;
  /* 两端对齐 */
  align-items: center;
  /* 垂直居中 */
  margin-bottom: 10px;
  /* 与下方内容保持距离 */
  padding: 0 5px;
  background-color: #ffffff;
  height: 60px
}

.main-title {
  margin: 0;
  /* 清除默认margin，避免影响对齐 */
  font-size: 22px;
  /* 可根据需要调整标题大小 */
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
.audit-title {
  padding: 10px;
  margin-left: 30px;
  font-size: 19px;
  font-weight: bold;
  color: #1f2329;
  line-height: 2;
}

.modelReview {
  /* 确保按钮不被挤压 */
  white-space: nowrap;
}



/* 基础信息容器 */
.basic-info-container {
  background-color: #ffffff;
  /* 白色背景 */
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
  /* 与下方建设信息保持20px间距 */
}

/* 建设信息容器 */
.construction-info-container {
  background-color: #ffffff;
  /* 白色背景 */
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
  /* 与下方区域保持间距 */
}

/* 修复标题文本与内容的间距 */
.section-content {
  margin-top: 10px;
  /* 标题与内容之间的距离 */
}


.modelPreview {
  display: flex;
  align-items: center;
}

.imgModel {
  width: 20px;
  height: 20px;
  margin-right: 5px;
  vertical-align: middle;
}



.add-footer el-button+el-button {
  margin-left: 10px;
}

.operation-group {
  display: flex;
  gap: 15px;
  align-items: center;
  flex-wrap: wrap;
  margin-left: 20px;
}

.operation-group div {
  color: #666;
  font-size: 18px;
}

.upload-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-start;
}

.upload-file-uploader {
  display: inline-block;
  width: auto;
  text-align: left !important;
}

.upload-file-list {
  /* width: 100%; */
  box-sizing: border-box;
  padding-left: 0;
  margin: 0;
  align-self: stretch;
}


.ele-upload-list__item-content {
  display: flex;
  align-items: center;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  width: 100%;
  box-sizing: border-box;
}

.ele-upload-list__item-content .el-link {
  flex: 1;
  /* 占满剩余空间 */
  min-width: 0;
  /* 允许宽度小于内容宽度 */
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: 10px;
  /* 与删除按钮保持距离 */
}

.ele-upload-list__item-content .el-icon-document {
  margin-right: 5px;
  vertical-align: middle;
}

.ele-upload-list__item-content-action {
  flex-shrink: 0;
  /* 不允许收缩 */
  width: 40px;
  /* 固定宽度确保按钮不被挤压 */
  text-align: right;
  /* 按钮右对齐 */
}

.ele-upload-list__item-content-action .el-button {
  padding: 0 5px;
  min-width: auto;
  white-space: nowrap;
  /* 按钮文字不换行 */
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
