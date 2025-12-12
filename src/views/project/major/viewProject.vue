<template>
  <div class="add-content-container">
    <div class="add-content">
      <div class="back-normal" @click="cancel"><img src="@/assets/images/arrow-left.png" />查看</div>
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
            <img class="imgModel" src="@/assets/images/model.png" />三维场景效果预览
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
                <el-select v-model="form.protectionLevel" placeholder="请选择涉及到的保护区等级，可多选" multiple disabled>
                  <el-option label="一级保护区" value="一级保护区"></el-option>
                  <el-option label="二级保护区" value="二级保护区"></el-option>
                  <el-option label="三级保护区" value="三级保护区"></el-option>
                  <el-option label="一级保护区（非核心景区）" value="一级保护区（非核心景区）"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="项目占用类型" prop="projectType" disabled>
                <el-select v-model="form.projectType" placeholder="请选择项目占用类型，可多选" multiple disabled>
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
                    class="el-upload-list__item ele-upload-list__item-content empty-file"
                    key="'empty-meetingMaterials'">
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

      <!-- 审批信息（多记录循环展示） -->
      <div class="project-documents" v-if="showApprovalSection && form.approveRecords.length > 0">
        <h3 class="section-title">审批信息</h3>
        <!-- 循环渲染每一条审批记录 -->
        <div v-for="(record, index) in form.approveRecords" :key="record.id || `approval-record-${index}`"
          class="approval-record-item">
          <div class="approval-record-header" v-if="record.gwhApproveResult">
            <span class="approval-record-index">审批记录 {{ index + 1 }}</span>
          </div>

          <!-- 管委会审批信息 -->
          <el-form label-width="230px" disabled class="approval-form" v-if="record.gwhApproveResult">
            <el-form-item label="管委会审批状态">
              <div class="approval-item">
                <span :class="['status-icon',
                  record.gwhApproveResult === '通过' ? 'success' :
                    record.gwhApproveResult === '驳回' ? 'error' : 'pending'
                ]">
                  {{
                    record.gwhApproveResult === '通过' ? '✓' :
                      record.gwhApproveResult === '驳回' ? '✗' : '-'
                  }}
                </span>
                <span class="status-text">
                  {{ record.gwhApproveResult || '待审批' }}
                </span>
              </div>
            </el-form-item>
            <el-form-item label="审批时间">
              <span>{{ record.gwhApproveTime || '暂无时间' }}</span>
            </el-form-item>
            <el-form-item label="审批反馈">
              <el-input type="textarea" :value="record.gwhApprovalReason || '暂无反馈'" :rows="2" style="background: #fff;"
                disabled />
            </el-form-item>
            <el-form-item label="反馈文件">
              <transition-group class="upload-file-list el-upload-list el-upload-list--text" name="el-fade-in-linear"
                tag="ul">
                <li v-for="(file, fileIndex) in parseFileList(record.gwhApprovalAttachment)"
                  :key="file.ossId || fileIndex" class="el-upload-list__item ele-upload-list__item-content">
                  <el-link :href="file.url" :underline="false" target="_blank">
                    <span class="el-icon-document"> {{ getFileName(file.name) }} </span>
                  </el-link>
                </li>
                <li v-if="!record.gwhApprovalAttachment || parseFileList(record.gwhApprovalAttachment).length === 0"
                  class="el-upload-list__item" key="'empty-gwhFeedback-' + index">
                  <span class="el-icon-info"> 暂无反馈文件 </span>
                </li>
              </transition-group>
            </el-form-item>
          </el-form>

          <!-- 市林业局审批信息（有数据才显示） -->
          <el-form label-width="230px" disabled class="approval-form"
            v-if="record.lyjApproveResult || record.lyjApproveTime || record.lyjApprovalReason || record.lyjApprovalAttachment">
            <el-form-item label="市林业局审批状态">
              <div class="approval-item">
                <span :class="['status-icon',
                  record.lyjApproveResult === '通过' ? 'success' :
                    record.lyjApproveResult === '驳回' ? 'error' : 'pending'
                ]">
                  {{
                    record.lyjApproveResult === '通过' ? '✓' :
                      record.lyjApproveResult === '驳回' ? '✗' : '-'
                  }}
                </span>
                <span class="status-text">
                  {{ record.lyjApproveResult || '待审批' }}
                </span>
              </div>
            </el-form-item>
            <el-form-item label="审批时间">
              <span>{{ record.lyjApproveTime || '暂无时间' }}</span>
            </el-form-item>
            <el-form-item label="审批反馈">
              <el-input type="textarea" :value="record.lyjApprovalReason || '暂无反馈'" :rows="2" style="background: #fff;"
                disabled />
            </el-form-item>
            <el-form-item label="反馈文件">
              <transition-group class="upload-file-list el-upload-list el-upload-list--text" name="el-fade-in-linear"
                tag="ul">
                <li v-for="(file, fileIndex) in parseFileList(record.lyjApprovalAttachment)"
                  :key="file.ossId || fileIndex" class="el-upload-list__item ele-upload-list__item-content">
                  <el-link :href="file.url" :underline="false" target="_blank">
                    <span class="el-icon-document"> {{ getFileName(file.name) }} </span>
                  </el-link>
                </li>
                <li v-if="!record.lyjApprovalAttachment || parseFileList(record.lyjApprovalAttachment).length === 0"
                  class="el-upload-list__item" key="'empty-lyjFeedback-' + index">
                  <span class="el-icon-info"> 暂无反馈文件 </span>
                </li>
              </transition-group>
            </el-form-item>
          </el-form>

          <div class="approval-record-divider" v-if="index < form.approveRecords.length - 1"></div>
        </div>
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
  protectionLevel: [],
  status: undefined,
  projectType: [],
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
  approveRecords: [] // 审批记录数组
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

// 计算属性：是否显示审批信息区域
const showApprovalSection = computed(() => {
  const currentStatus = (form.status || '').trim();
  const validStatuses = ['管委会审批中', '管委会通过', '管委会驳回', '林业局通过', '林业局驳回'];
  return validStatuses.includes(currentStatus);

})

// 获取文件名（处理路径）
const getFileName = (name) => {
  if (!name) return '未知文件名'
  const separatorIndex = Math.max(name.lastIndexOf('/'), name.lastIndexOf('\\'))
  return separatorIndex > -1 ? name.slice(separatorIndex + 1) : name
}

// 解析文件列表（支持JSON字符串/数组格式）
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
      name: item.name || '未知文件',
      url: item.url,
      ossId: item.ossId
    }));
  } catch (error) {
    console.error('解析文件列表失败:', error);
    return [];
  }
}

// 三维模型预览
const handleModelPreview = () => {
  router.push({
    path: '/screen/preview',
    query: {
      id: form.id,
      type: 'major-view'
    }
  })
}
const handleDownloadTemplate = (type) => {
  try {
    // 1. 定义模板文件映射：type -> { fileName: 下载后的文件名, filePath: assets内的路径 }
    const templateMap = {
      instructions: {
        fileName: '风景名胜区质检数据填写规则.xlsx',
        filePath: '/风景名胜区质检数据填写规则.xlsx' // 请根据实际文件路径调整
      },
      polylineTemplate: {
        fileName: '线模板.zip',
        filePath: '/线模板.zip' // 请根据实际文件路径调整
      },
      polygonTemplate: {
        fileName: '面模板.zip',
        filePath: '/面模板.zip' // 请根据实际文件路径调整
      },
      threeD: {
        fileName: '方岩景区模型制作标准和案例参考.doc',
        filePath: '/方岩景区模型制作标准和案例参考.doc' // 请根据实际文件路径调整
      }
    };

    // 2. 校验模板类型
    const template = templateMap[type];
    if (!template) {
      ElMessage.warning('无效的模板类型');
      return;
    }

    // 3. Vite中获取assets文件的正确URL（关键：兼容开发/生产环境）
    const fileUrl = new URL(template.filePath, import.meta.url).href;

    // 4. 创建临时a标签触发下载
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = template.fileName; // 设置下载后的文件名
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click(); // 触发点击下载

    // 5. 清理临时标签
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href); // 释放URL对象
    ElMessage.success(`「${template.fileName}」下载成功`);
  } catch (err) {
    ElMessage.error('模板下载失败：' + (err.message || '未知错误'));
    console.error('下载模板异常：', err);
  }
};
// 新增下载前校验 + 错误处理
// const handleDownloadTemplate = async (type) => {
//   if (!proxy?.$download) {
//     ElMessage.error('下载功能初始化失败，请刷新页面重试');
//     return;
//   }
//   try {
//     let ossId = '';
//     switch (type) {
//       case 'instructions': ossId = '1987829892356124674'; break;
//       case 'polylineTemplate': ossId = '1987829924379635713'; break;
//       case 'polygonTemplate': ossId = '1987829950501761026'; break;
//       case 'threeD': ossId = '1987830717459607554'; break;
//       default: ElMessage.warning('无效的模板类型'); return;
//     }
//     await proxy.$download.oss(ossId);
//     ElMessage.success('模板下载成功');
//   } catch (err) {
//     ElMessage.error('模板下载失败：' + (err.message || '未知错误'));
//   }
// };

// 取消按钮
const cancel = () => {
  router.push('/project/major')
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
    Object.assign(form, projectData)
    form.protectionLevel = typeof projectData.protectionLevel === 'string'
      ? projectData.protectionLevel.split(',').filter(Boolean) // 拆分逗号分隔字符串，过滤空值
      : (Array.isArray(projectData.protectionLevel) ? projectData.protectionLevel : []);

    // 项目占用类型：同上
    form.projectType = typeof projectData.projectType === 'string'
      ? projectData.projectType.split(',').filter(Boolean)
      : (Array.isArray(projectData.projectType) ? projectData.projectType : []);
    // 初始化文件列表 - 使用通用解析方法处理JSON字符串
    locationPlanFileList.value = parseFileList(projectData.locationPlan)
    expertOpinionsFileList.value = parseFileList(projectData.expertOpinions)
    meetingMaterialsFileList.value = parseFileList(projectData.meetingMaterials)
    siteSelectionReportFileList.value = parseFileList(projectData.siteSelectionReport)
    approvalDocumentsFileList.value = parseFileList(projectData.approvalDocuments)
    projectRedLineFileList.value = parseFileList(projectData.projectRedLine)
    redLineCoordinateFileList.value = parseFileList(projectData.redLineCoordinate)
    threeDModelFileList.value = parseFileList(projectData.threeDModel)
    // 直接赋值审批记录数组（无需额外解析）
    form.approveRecords = projectData.approveRecords || []
  } catch (err) {
    ElMessage.error('加载项目数据失败：' + (err.message || '未知错误'))
    router.push('/project/major')
  }
}

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
  margin-bottom: 8px;
}

.ele-upload-list__item-content .el-link {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: 10px;
}

.ele-upload-list__item-content .el-icon-document {
  margin-right: 5px;
  vertical-align: middle;
}

.ele-upload-list__item-content-action {
  flex-shrink: 0;
  width: 40px;
  text-align: right;
}

.ele-upload-list__item-content-action .el-button {
  padding: 0 5px;
  min-width: auto;
  white-space: nowrap;
}

.empty-file {
  color: #999;
  padding: 8px 12px;
  border: 1px dashed #e5e7eb;
  border-radius: 4px;
}

/* 审批记录样式 */
.approval-record-item {
  margin-bottom: 24px;
  padding: 16px;
  background-color: #f9f9f9;
  border-radius: 6px;
}

.approval-record-header {
  margin-bottom: 1px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e5e7eb;
}

.approval-record-index {
  font-size: 16px;
  font-weight: 600;
  color: #409eff;
}

.approval-form {
  margin-bottom: 16px;
}

.approval-record-divider {
  height: 1px;
  background-color: #e5e7eb;
  margin: 20px 0;
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