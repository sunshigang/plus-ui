<template>
  <div class="add-content-container">
    <div class="add-content">
      <div class="back-normal" @click="cancel"><img src="../../../assets/images/arrow-left.png" />查看</div>
      <div class="project-basic-info">
        <h3 class="project-basic-info">项目基础信息</h3>
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
                <transition-group class="upload-file-list el-upload-list el-upload-list--text" name="el-fade-in-linear"
                  tag="ul">
                  <li v-for="(file, index) in locationPlanFileList" :key="file.ossId"
                    class="el-upload-list__item ele-upload-list__item-content">
                    <el-link :href="file.url" :underline="false" target="_blank">
                      <span class="el-icon-document"> {{ file.name }} </span>
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
                  <li v-for="(file, index) in expertOpinionsFileList" :key="file.ossId"
                    class="el-upload-list__item ele-upload-list__item-content">
                    <el-link :href="file.url" :underline="false" target="_blank">
                      <span class="el-icon-document"> {{ file.name }} </span>
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
                  <li v-for="(file, index) in meetingMaterialsFileList" :key="file.ossId"
                    class="el-upload-list__item ele-upload-list__item-content">
                    <el-link :href="file.url" :underline="false" target="_blank">
                      <span class="el-icon-document"> {{ file.name }} </span>
                    </el-link>
                  </li>
                  <li v-if="meetingMaterialsFileList.length === 0"
                    class="el-upload-list__item ele-upload-list__item-content empty-file" key="'empty-meetingMaterials'">
                    <span class="el-icon-info"> 暂无文件 </span>
                  </li>
                </transition-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="选址方案核准申报表" class="custom-label">
                <transition-group class="upload-file-list el-upload-list el-upload-list--text" name="el-fade-in-linear"
                  tag="ul">
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
                <transition-group class="upload-file-list el-upload-list el-upload-list--text" name="el-fade-in-linear"
                  tag="ul">
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
                <transition-group class="upload-file-list el-upload-list el-upload-list--text" name="el-fade-in-linear"
                  tag="ul">
                  <li v-for="(file, index) in projectRedLineFileList" :key="file.ossId"
                    class="el-upload-list__item ele-upload-list__item-content">
                    <el-link :href="file.url" :underline="false" target="_blank">
                      <span class="el-icon-document"> {{ file.name }} </span>
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
              <li v-for="(file, index) in redLineCoordinateFileList" :key="file.ossId"
                class="el-upload-list__item ele-upload-list__item-content">
                <el-link :href="file.url" :underline="false" target="_blank">
                  <span class="el-icon-document"> {{ file.name }} </span>
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

      <!-- 审批信息（按状态显示） -->
      <div class="project-documents" v-if="showApprovalInfo">
        <h3 class="section-title">审批信息</h3>
        <el-form label-width="230px" disabled>
          <!-- 管委会审批信息 -->
          <template v-if="['管委会审批中','管委会通过', '管委会驳回'].includes(form.status)">
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
import { useUserStore } from '@/store/modules/user'
import { getCurrentInstance } from 'vue'
import { ElMessage } from 'element-plus'
import { globalHeaders } from '@/utils/request';
const { proxy } = getCurrentInstance() || {}
const router = useRouter()
const route = useRoute()
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
  majorFlag: false,
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

// 文件列表
const locationPlanFileList = ref([])
const expertOpinionsFileList = ref([])
const meetingMaterialsFileList = ref([])
const siteSelectionReportFileList = ref([])
const approvalDocumentsFileList = ref([])
const projectRedLineFileList = ref([])
const redLineCoordinateFileList = ref([])
const threeDModelFileList = ref([])
const managementFeedbackFileList = ref([]) // 管委会反馈文件

// 计算属性：是否显示审批信息
const showApprovalInfo = computed(() => {
  // 填报中或管委会审批中时不显示审批信息
  return !['填报中'].includes(form.status)
})

// 获取文件名（截断长文件名）
const getFileName = (name) => {
  // 处理name为null/undefined的情况
  if (!name) return '未知文件名'
  // 处理路径分隔符（兼容windows和unix）
  const separatorIndex = Math.max(name.lastIndexOf('/'), name.lastIndexOf('\\'))
  return separatorIndex > -1 ? name.slice(separatorIndex + 1) : name
}

// 三维模型预览
const handleModelPreview = () => {
  router.push({
    path: '/screen/preview',
    query: {
      id: form.id,
      type: 'normal-view'
    }
  })
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
// 加载项目详情
const loadProjectData = async (projectId) => {
  try {
    const response = await getInfo(projectId)
    const projectData = response.data
    Object.assign(form, projectData)
    form.approveRecords = parseApproveRecord(projectData.approveRecords);
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
    form.approveRecords[0].gwhApprovalAttachment = parseFileList(projectData.approveRecords[0].gwhApprovalAttachment)
    form.approveRecords[0].lyjApprovalAttachment = parseFileList(projectData.approveRecords[0].lyjApprovalAttachment)
    form.approveRecords = parseApproveRecord(projectData.approveRecords);
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
  min-height: 100vh;
  padding-bottom: 80px;
}

.add-content {
  width: 100%;
  max-height: calc(100vh - 40px);
  overflow-y: auto;
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
.approval-content {
  padding: 25px;
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