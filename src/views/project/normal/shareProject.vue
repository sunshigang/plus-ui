<template>
  <div class="add-content-container">
    <div class="add-content">
      <div class="back-normal" @click="cancel"><img src="@/assets/images/arrow-left.png" />数据共享</div>
      <!-- 动态生成审批标签页 -->
      <el-tabs v-model="activeTab" @tab-change="handleTabChange">
        <el-tab-pane v-for="tab in approvalTabs" :key="tab.name" :name="tab.name">
          <template #label>
            <span class="tab-label-wrapper">
              <img :src="activeTab === tab.name ? approvaled : approval" class="tab-status-icon" alt="审批状态"
                style="width:14px; height:13px;" />
              {{ tab.label }}
            </span>
          </template>
          <div class="project-info">
            <h3 class="section-title">项目信息</h3>

            <!-- 基础信息（自定义折叠）：添加可选链?. 防止undefined -->
            <div class="custom-collapse-item">
              <div class="custom-collapse-header" @click="toggleBasicInfo()">
                <img v-if="collapseVisible[activeTab]?.basic" class="arrow-icon" src="@/assets/images/arrow-down.png" />
                <img v-else class="arrow-icon" src="@/assets/images/arrow-right.png" />
                <span class="collapse-title">基础信息</span>
              </div>
              <div class="custom-collapse-content" v-if="collapseVisible[activeTab]?.basic">
                <!-- 基础信息内容 -->
                <div class="info-content">
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <div class="info-item">
                        <span class="label">建设活动（建设项目）名称：</span>
                        <span class="value">{{ currentTabSnapshot.projectName || '暂无' }}</span>
                      </div>
                    </el-col>
                    <el-col :span="12">
                      <div class="info-item">
                        <span class="label">项目代码：</span>
                        <span class="value">{{ currentTabSnapshot.projectCode || '暂无' }}</span>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <div class="info-item">
                        <span class="label">所属行政区划：</span>
                        <span class="value">{{ currentTabSnapshot.administrativeRegion || '暂无' }}</span>
                      </div>
                    </el-col>
                    <el-col :span="12">
                      <div class="info-item">
                        <span class="label">涉及风景名胜区名称：</span>
                        <span class="value">{{ currentTabSnapshot.scenicArea || '暂无' }}</span>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <div class="info-item">
                        <span class="label">单位建设/个人建设：</span>
                        <span class="value">{{ currentTabSnapshot.applicantType || '暂无' }}</span>
                      </div>
                    </el-col>
                    <el-col :span="12">
                      <div class="info-item">
                        <span class="label">一般/重点项目：</span>
                        <span class="value">{{ currentTabSnapshot.majorFlag ? '重大项目' : '一般项目' }}</span>
                      </div>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </div>

            <!-- 建设信息（自定义折叠 + 三维预览按钮）：添加可选链?. 防止undefined -->
            <div class="custom-collapse-item">
              <div class="custom-collapse-header" @click="toggleConstructionInfo()">
                <img v-if="collapseVisible[activeTab]?.construction" class="arrow-icon"
                  src="@/assets/images/arrow-down.png" />
                <img v-else class="arrow-icon" src="@/assets/images/arrow-right.png" />
                <span class="collapse-title">建设信息</span>
                <!-- 三维场景效果预览按钮（与标题同排） -->
                <el-button type="primary" @click="handleModelPreview" class="modelPreview float-right">
                  <img class="imgModel" src="@/assets/images/model.png" />三维场景效果预览
                </el-button>
              </div>
              <div class="custom-collapse-content" v-if="collapseVisible[activeTab]?.construction">
                <!-- 建设信息内容 -->
                <div class="info-content">
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <div class="info-item">
                        <span class="label">建设单位名称：</span>
                        <span class="value">{{ currentTabSnapshot.constructionUnit || '暂无' }}</span>
                      </div>
                    </el-col>
                    <el-col :span="12">
                      <div class="info-item">
                        <span class="label">组织机构代码：</span>
                        <span class="value">{{ currentTabSnapshot.organizationCode || '暂无' }}</span>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <div class="info-item">
                        <span class="label">经办人：</span>
                        <span class="value">{{ currentTabSnapshot.contactPerson || '暂无' }}</span>
                      </div>
                    </el-col>
                    <el-col :span="12">
                      <div class="info-item">
                        <span class="label">经办人联系方式：</span>
                        <span class="value">{{ currentTabSnapshot.contactPhone || '暂无' }}</span>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <div class="info-item">
                        <span class="label">保护区等级：</span>
                        <span class="value">{{ formatMultiSelectValue(currentTabSnapshot.protectionLevel) }}</span>
                      </div>
                    </el-col>
                    <el-col :span="12">
                      <div class="info-item">
                        <span class="label">项目占用类型：</span>
                        <span class="value">{{ formatMultiSelectValue(currentTabSnapshot.projectType) }}</span>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <div class="info-item">
                        <span class="label">涉及风景区地上建筑面积(㎡)：</span>
                        <span class="value">{{ currentTabSnapshot.scenicGroundArea || '暂无' }}</span>
                      </div>
                    </el-col>
                    <el-col :span="12">
                      <div class="info-item">
                        <span class="label">涉及风景区地下建筑面积(㎡)：</span>
                        <span class="value">{{ currentTabSnapshot.scenicUndergroundArea || '暂无' }}</span>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <div class="info-item">
                        <span class="label">项目用途：</span>
                        <span class="value">{{ currentTabSnapshot.projectUsage || '暂无' }}</span>
                      </div>
                    </el-col>
                    <el-col :span="12">
                      <div class="info-item">
                        <span class="label">拟选位置：</span>
                        <span class="value">{{ currentTabSnapshot.projectPurpose || '暂无' }}</span>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row :gutter="20">
                    <el-col :span="24">
                      <div class="info-item">
                        <span class="label">建设项目拟投资额（万元）：</span>
                        <span class="value">{{ currentTabSnapshot.projectInvestment || '暂无' }}</span>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row :gutter="20">
                    <el-col :span="24">
                      <div class="info-item">
                        <span class="label">规划依据：</span>
                        <span class="value">{{ currentTabSnapshot.planningBasis || '暂无' }}</span>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row :gutter="20">
                    <el-col :span="24">
                      <div class="info-item">
                        <span class="label">建设内容涉及规模：</span>
                        <span class="value">{{ currentTabSnapshot.constructionContent || '暂无' }}</span>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row :gutter="20">
                    <el-col :span="24">
                      <div class="info-item">
                        <span class="label">其他需要说明的情况：</span>
                        <span class="value">{{ currentTabSnapshot.otherExplanations || '暂无' }}</span>
                      </div>
                    </el-col>
                  </el-row>

                  <!-- 建设信息文件列表（不可操作） -->
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <div class="info-item">
                        <span class="label">选址方案：</span>
                        <div class="file-list">
                          <template v-if="locationPlanFileList.length">
                            <el-link v-for="file in currentTabSnapshot.locationPlanFileList" :key="file.ossId"
                              :href="file.url" :underline="false" target="_blank">
                              <span class="el-icon-document"> {{ getFileName(file.name) }} </span>
                            </el-link>
                          </template>
                          <span v-else>暂无</span>
                        </div>
                      </div>
                    </el-col>
                    <el-col :span="12">
                      <div class="info-item">
                        <span class="label">专家评审意见：</span>
                        <div class="file-list">
                          <template v-if="expertOpinionsFileList.length">
                            <el-link v-for="file in currentTabSnapshot.expertOpinionsFileList" :key="file.ossId"
                              :href="file.url" :underline="false" target="_blank">
                              <span class="el-icon-document"> {{ getFileName(file.name) }} </span>
                            </el-link>
                          </template>
                          <span v-else>暂无</span>
                        </div>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <div class="info-item">
                        <span class="label">公示材料：</span>
                        <div class="file-list">
                          <template v-if="meetingMaterialsFileList.length">
                            <el-link v-for="file in currentTabSnapshot.meetingMaterialsFileList" :key="file.ossId"
                              :href="file.url" :underline="false" target="_blank">
                              <span class="el-icon-document"> {{ getFileName(file.name) }} </span>
                            </el-link>
                          </template>
                          <span v-else>暂无</span>
                        </div>
                      </div>
                    </el-col>
                    <el-col :span="12">
                      <div class="info-item">
                        <span class="label">选址方案核准申报表：</span>
                        <div class="file-list">
                          <template v-if="siteSelectionReportFileList.length">
                            <el-link v-for="file in currentTabSnapshot.siteSelectionReportFileList" :key="file.ossId"
                              :href="file.url" :underline="false" target="_blank">
                              <span class="el-icon-document"> {{ getFileName(file.name) }} </span>
                            </el-link>
                          </template>
                          <span v-else>暂无</span>
                        </div>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <div class="info-item">
                        <span class="label">立项文件：</span>
                        <div class="file-list">
                          <template v-if="approvalDocumentsFileList.length">
                            <el-link v-for="file in currentTabSnapshot.approvalDocumentsFileList" :key="file.ossId"
                              :href="file.url" :underline="false" target="_blank">
                              <span class="el-icon-document"> {{ getFileName(file.name) }} </span>
                            </el-link>
                          </template>
                          <span v-else>暂无</span>
                        </div>
                      </div>
                    </el-col>
                    <el-col :span="12">
                      <div class="info-item">
                        <span class="label">项目用地红线图：</span>
                        <div class="file-list">
                          <template v-if="projectRedLineFileList.length">
                            <el-link v-for="file in currentTabSnapshot.projectRedLineFileList" :key="file.ossId"
                              :href="file.url" :underline="false" target="_blank">
                              <span class="el-icon-document"> {{ getFileName(file.name) }} </span>
                            </el-link>
                          </template>
                          <span v-else>暂无</span>
                        </div>
                      </div>
                    </el-col>
                  </el-row>
                  <div class="info-item">
                    <span class="label">项目红线矢量数据：</span>
                    <div class="file-list">
                      <template v-if="redLineCoordinateFileList.length">
                        <el-link v-for="file in currentTabSnapshot.redLineCoordinateFileList" :key="file.ossId"
                          :href="file.url" :underline="false" target="_blank">
                          <span class="el-icon-document"> {{ getFileName(file.name) }} </span>
                        </el-link>
                      </template>
                      <span v-else>暂无</span>
                    </div>
                  </div>
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <div class="info-item">
                        <span class="label">项目三维模型：</span>
                        <div class="file-list">
                          <template v-if="threeDModelFileList.length">
                            <el-link v-for="file in currentTabSnapshot.threeDModelFileList" :key="file.ossId"
                              :href="file.url" :underline="false" target="_blank">
                              <span class="el-icon-document"> {{ getFileName(file.name) }} </span>
                            </el-link>
                          </template>
                          <span v-else>暂无</span>
                        </div>
                      </div>
                    </el-col>
                    <el-col :span="12">
                      <div class="info-item">
                        <span class="label">模型坐标：</span>
                        <div class="file-list">
                          <el-input v-model="currentTabSnapshot.modelCoordinate" disabled />
                        </div>
                      </div>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </div>
          </div>

          <!-- 审批信息：显示当前标签页对应索引的审批记录 -->
          <div class="approval-info">
            <h3 class="section-title">审批信息</h3>
            <!-- 有对应审批记录 -->
            <div v-if="form.approveRecords && form.approveRecords[tab.index]" class="approval-item">
              <div class="approval-header">
                <span
                  :class="['status-icon', form.approveRecords[tab.index].gwhApproveResult === '通过' ? 'success' : (form.approveRecords[tab.index].gwhApproveResult ? 'error' : 'pending')]">
                  {{ form.approveRecords[tab.index].gwhApproveResult === '通过' ? '✓' : (form.approveRecords[tab.index].gwhApproveResult ? '✗' : '—') }}
                </span>
                <span class="approval-title">管委会审核</span>
                <span class="approval-time">审核时间：{{ form.approveRecords[tab.index].gwhApproveTime || '暂无' }}</span>
              </div>
              <div class="approval-content">
                <div class="feedback-item">
                  <span class="label">反馈建议：</span>
                  <span class="value">{{ form.approveRecords[tab.index].gwhApprovalReason || '暂无反馈建议' }}</span>
                </div>
                <div class="feedback-item">
                  <span class="label">反馈文件：</span>
                  <div class="file-list">
                    <template v-if="parseFileList(form.approveRecords[tab.index].gwhApprovalAttachment).length">
                      <el-link v-for="file in parseFileList(form.approveRecords[tab.index].gwhApprovalAttachment)"
                        :key="file.ossId" :href="file.url" :underline="false" target="_blank">
                        <span class="el-icon-document"> {{ getFileName(file.name) }} </span>
                      </el-link>
                    </template>
                    <span v-else>暂无</span>
                  </div>
                </div>
              </div>
            </div>
            <!-- 无对应审批记录的提示 -->
            <div v-else class="approval-item">
              <div class="approval-header">
                <span class="status-icon pending">—</span>
                <span class="approval-title">管委会审核（{{ tab.cnTime }}）</span>
                <span class="approval-time">审核时间：暂无</span>
              </div>
              <div class="approval-content">
                <div class="feedback-item">
                  <span class="label">反馈建议：</span>
                  <span class="value">暂无{{ tab.cnTime }}审批记录</span>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 底部按钮区 -->
    <div class="add-footer">
      <el-button @click="cancel">取消</el-button>
      <el-button type="warning" v-hasPermi="['project:project:share']" @click="clickDataDownload">数据下载</el-button>
      <el-button type="success" v-hasPermi="['project:project:share']" @click="clickDataShare"
        :disabled="form.remark !== ''" :class="{ 'disabled-btn': form.remark !== '' }">
        {{ form.remark !== '' ? '已共享' : '数据共享' }}
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, getCurrentInstance, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getInfo, shareInfo } from '@/api/project/normal/index';
import { propTypes } from '@/utils/propTypes';
import { ElMessage } from 'element-plus'
const { proxy } = getCurrentInstance() || {}
const router = useRouter()
const route = useRoute()
import approval from '@/assets/images/approval.png'
import approvaled from '@/assets/images/approvaled.png'
// 组件属性
const props = defineProps({
  limit: propTypes.number.def(15),
  fileSize: propTypes.number.def(500),
  fileType: propTypes.array.def([
    'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'pdf', 'zip', 'rar',
    'dwg', 'dxf', 'jpg', 'jpeg', 'png', 'cpg', 'dbf', 'prj', 'sbn', 'sbx',
    'shp', 'shp.xml', 'shx', 'FBX', 'fbm', 'obj', 'pak'
  ]),
});

// 格式化多选值为中文逗号分隔
const formatMultiSelectValue = (value) => {
  if (!value || !Array.isArray(value) || value.length === 0) {
    return '暂无';
  }
  return value.join('，');
};

// 中文数字映射（扩展到10次，超过则显示"n次"）
const cnTimesMap = ['首次', '二次', '三次', '四次', '五次', '六次', '七次', '八次', '九次', '十次'];

// 核心：根据approveRecords长度动态生成标签页配置
const approvalTabs = computed(() => {
  const recordLength = Array.isArray(form.approveRecords) ? form.approveRecords.length : 0;
  // 至少生成1个标签页（首次）
  const tabCount = recordLength === 0 ? 1 : recordLength;
  return Array.from({ length: tabCount }, (_, index) => {
    const cnTime = cnTimesMap[index] || `${index + 1}次`;
    return {
      name: `tab-${index}`,       // 标签页唯一标识（tab-0、tab-1...）
      label: `${cnTime}审批信息`, // 标签页显示名称（首次审批信息、二次审批信息...）
      index: index,               // 对应approveRecords的索引
      cnTime: cnTime              // 中文次数（首次、二次...），用于页面显示
    };
  });
});

// 标签页状态：初始值设为第一个标签页（tab-0），避免空值
const activeTab = ref('tab-0');

// 动态折叠状态：初始化默认值（防止首次渲染undefined）
const collapseVisible = ref({
  'tab-0': { // 默认初始化第一个标签页的折叠状态
    basic: true,
    construction: false
  }
});

// 初始化折叠状态
const initCollapseState = () => {
  const newState = {};
  approvalTabs.value.forEach(tab => {
    newState[tab.name] = {
      basic: true,       // 基础信息默认展开
      construction: false // 建设信息默认收起
    };
  });
  collapseVisible.value = newState;
};

// 按钮加载状态
const buttonLoading = ref(false)

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
  majorFlag: false,
  approveRecords: [], // 审批记录数组
  scenicGroundArea: undefined,
  scenicUndergroundArea: undefined,
  remark: '',
})

const dialog = reactive({
  visible: false,
  title: '',
});

// 折叠控制方法：添加容错，防止访问undefined
const toggleBasicInfo = () => {
  const currentTabState = collapseVisible.value[activeTab.value];
  if (!currentTabState) return;
  currentTabState.basic = !currentTabState.basic;
};

const toggleConstructionInfo = () => {
  const currentTabState = collapseVisible.value[activeTab.value];
  if (!currentTabState) return;
  currentTabState.construction = !currentTabState.construction;
};

// 文件列表
const locationPlanFileList = ref([])
const expertOpinionsFileList = ref([])
const meetingMaterialsFileList = ref([])
const siteSelectionReportFileList = ref([])
const approvalDocumentsFileList = ref([])
const projectRedLineFileList = ref([])
const redLineCoordinateFileList = ref([])
const threeDModelFileList = ref([])

// 解析文件列表
const parseFileList = (fileData) => {
  if (!fileData) return [];
  try {
    let list = [];
    if (typeof fileData === 'string') {
      list = JSON.parse(fileData);
    } else if (Array.isArray(fileData)) {
      list = fileData;
    }
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

// 标签页切换事件
const handleTabChange = (tabName) => {
  activeTab.value = tabName;
  // 切换标签页时，若该标签页无折叠状态，初始化默认状态
  if (!collapseVisible.value[tabName]) {
    collapseVisible.value[tabName] = {
      basic: true,
      construction: false
    };
  }
};

function parseJsonField (str) {
  if (!str || str === '[]') return [];
  try {
    return typeof str === 'string' ? JSON.parse(str) : str;
  } catch (e) {
    console.warn('JSON parse failed:', str, e);
    return [];
  }
}
const currentTabSnapshot = computed(() => {
  const tabIndex = approvalTabs.value.findIndex(tab => tab.name === activeTab.value);
  const record = form.approveRecords?.[tabIndex];

  // 如果没有对应的审批记录或 projectInfoDetail，返回空对象（显示“暂无”）
  if (!record?.projectInfoDetail) {
    return {
      projectName: null,
      projectCode: null,
      administrativeRegion: null,
      scenicArea: null,
      applicantType: null,
      majorFlag: false,
      constructionUnit: null,
      organizationCode: null,
      contactPerson: null,
      contactPhone: null,
      protectionLevel: [],
      projectType: [],
      scenicGroundArea: null,
      scenicUndergroundArea: null,
      projectUsage: null,
      projectPurpose: null,
      projectInvestment: null,
      planningBasis: null,
      constructionContent: null,
      otherExplanations: null,
      modelCoordinate: null,

      // 文件列表为空
      locationPlanFiles: [],
      siteSelectionReportFiles: [],
      projectRedLineFiles: [],
      expertOpinionsFiles: [],
      meetingMaterialsFiles: [],
      approvalDocumentsFiles: [],
      threeDModelFiles: [],
      redLineCoordinateFiles: [],
    };
  }

  const detail = record.projectInfoDetail;

  // 处理多选字段
  const protectionLevel = typeof detail.protectionLevel === 'string'
    ? detail.protectionLevel.split(',').filter(Boolean)
    : Array.isArray(detail.protectionLevel) ? detail.protectionLevel : [];

  const projectType = typeof detail.projectType === 'string'
    ? detail.projectType.split(',').filter(Boolean)
    : Array.isArray(detail.projectType) ? detail.projectType : [];

  // 解析文件字段
  const locationPlanFiles = parseJsonField(detail.locationPlan);
  const siteSelectionReportFiles = parseJsonField(detail.siteSelectionReport);
  const projectRedLineFiles = parseJsonField(detail.projectRedLine);
  const expertOpinionsFiles = parseJsonField(detail.expertOpinions);
  const meetingMaterialsFiles = parseJsonField(detail.meetingMaterials);
  const approvalDocumentsFiles = parseJsonField(detail.approvalDocuments);
  const threeDModelFiles = parseJsonField(detail.threeDModel);
  const redLineCoordinateFiles = parseJsonField(detail.redLineCoordinate);

  return {
    ...detail,
    protectionLevel,
    projectType,
    majorFlag: Boolean(detail.majorFlag),
    projectInvestment: detail.projectInvestment ?? null,

    // 文件列表
    locationPlanFileList: locationPlanFiles,
    expertOpinionsFileList: expertOpinionsFiles,
    meetingMaterialsFileList: meetingMaterialsFiles,
    siteSelectionReportFileList: siteSelectionReportFiles,
    approvalDocumentsFileList: approvalDocumentsFiles,
    projectRedLineFileList: projectRedLineFiles,
    redLineCoordinateFileList: redLineCoordinateFiles,
    threeDModelFileList: threeDModelFiles,
  };
});
// 初始化加载数据
onMounted(async () => {
  const projectId = route.params.id
  if (!projectId) {
    ElMessage.error('缺少项目ID，无法加载数据')
    router.push('/project/normal')
    return
  }

  try {
    const response = await getInfo(projectId)
    const projectData = response.data
    // 填充表单数据
    Object.assign(form, projectData)
    form.remark = projectData.remark || '';

    // 处理多选字段（字符串转数组）
    form.protectionLevel = typeof projectData.protectionLevel === 'string'
      ? projectData.protectionLevel.split(',').filter(Boolean)
      : (Array.isArray(projectData.protectionLevel) ? projectData.protectionLevel : []);
    form.projectType = typeof projectData.projectType === 'string'
      ? projectData.projectType.split(',').filter(Boolean)
      : (Array.isArray(projectData.projectType) ? projectData.projectType : []);

    // 加载文件列表
    locationPlanFileList.value = parseFileList(projectData.locationPlan)
    expertOpinionsFileList.value = parseFileList(projectData.expertOpinions)
    meetingMaterialsFileList.value = parseFileList(projectData.meetingMaterials)
    siteSelectionReportFileList.value = parseFileList(projectData.siteSelectionReport)
    approvalDocumentsFileList.value = parseFileList(projectData.approvalDocuments)
    projectRedLineFileList.value = parseFileList(projectData.projectRedLine)
    redLineCoordinateFileList.value = parseFileList(projectData.redLineCoordinate)
    threeDModelFileList.value = parseFileList(projectData.threeDModel)

    // 赋值审批记录数组（确保是数组）
    form.approveRecords = Array.isArray(projectData.approveRecords) ? projectData.approveRecords : [];

    // 初始化折叠状态和激活标签页
    initCollapseState();
    // 确保激活的标签页是审批列表的第一个
    activeTab.value = approvalTabs.value[0]?.name || 'tab-0';
  } catch (err) {
    ElMessage.error('加载项目数据失败：' + (err.message || '未知错误'))
    router.push('/project/normal')
  }
})

// 获取文件名（去除路径）
const getFileName = (name) => {
  if (!name) return '未知文件名';
  const separatorIndex = Math.max(name.lastIndexOf('/'), name.lastIndexOf('\\'));
  return separatorIndex > -1 ? name.slice(separatorIndex + 1) : name;
};

// 三维模型预览
const handleModelPreview = () => {
  router.push({
    path: '/screen/preview',
    query: {
      id: form.id,
      type: 'normal-share'
    }
  });
};

// 按钮事件
const cancel = () => {
  router.push('/project/normal');
};

const clickDataDownload = async () => {
  try {
    proxy?.$modal.loading('正在打包下载数据，请稍候...');
    const exportUrl = `/project/download/${form.id}`;
    await proxy?.download(exportUrl, {}, `info_${new Date().getTime()}.zip`);
    proxy?.$modal.closeLoading();
    proxy?.$modal.msgSuccess('数据下载成功');
  } catch (err) {
    ElMessage.error('下载失败：' + (err.message || '未知错误'));
  }
};

const clickDataShare = async () => {
  try {
    await proxy?.$modal.confirm1('确认共享后最新的项目信息数据将共享至自然保护地审批平台进行最终的审批。');
    buttonLoading.value = true;
    await shareInfo(form.id);
    proxy?.$modal.msgSuccess('数据共享成功');
    form.remark = '已共享';
    dialog.visible = false;
  } catch (err) {
    if (err !== 'cancel') {
      proxy?.$modal.msgError('数据共享失败：' + (err?.message || '未知错误'));
    }
  } finally {
    buttonLoading.value = false;
  }
};
</script>

<style scoped>
.tab-label-wrapper {
  display: flex;
  align-items: center;
  height: 100%;
}

.tab-status-icon {
  width: 16px;
  height: 16px;
  margin-right: 6px;
  vertical-align: middle;
}

:deep(.disabled-btn) {
  background-color: #e6f7ef !important;
  color: #52c41a !important;
  border-color: #b7eb8f !important;
  cursor: not-allowed !important;
  opacity: 0.8;
}

:deep(.el-button--success.is-disabled:hover) {
  background-color: #e6f7ef !important;
  color: #52c41a !important;
  border-color: #b7eb8f !important;
}

.add-content-container {
  width: 100%;
  padding: 20px;
  background-color: #f6f6f6;
  box-sizing: border-box;
  position: relative;
  min-height: 100vh;
  padding-bottom: 80px;
  font-size: 16px;
}

.add-content {
  width: 100%;
  max-height: calc(100vh - 40px);
  overflow-y: auto;
}

.back-normal {
  width: 110px;
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

.project-info,
.approval-info {
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
  margin-bottom: 15px;
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

.custom-collapse-item {
  background-color: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  margin-bottom: 10px;
}

.custom-collapse-header {
  display: flex;
  align-items: center;
  padding: 12px 15px;
  cursor: pointer;
}

.arrow-icon {
  width: 16px;
  height: 16px;
  margin-right: 5px;
  flex-shrink: 0;
}

.collapse-title {
  font-size: 18px;
  font-weight: 500;
  flex-grow: 1;
  text-align: left;
  font-family: 'SourceHanSansCN-Regular';
}

.custom-collapse-content {
  padding: 0 15px 15px;
}

.float-right {
  float: right;
}

.info-content {
  padding: 10px 0;
}

.info-item {
  margin-bottom: 10px;
  display: flex;
  align-items: flex-start;
}

.info-item .label {
  min-width: 240px;
  font-weight: 500;
  color: #666;
}

.info-item .value {
  flex: 1;
  color: #333;
}

.file-list {
  flex: 1;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.inline-file-list {
  flex: 1;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.approval-info {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.approval-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.approval-item {
  margin-bottom: 20px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.approval-header {
  padding: 12px 15px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e5e7eb;
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
  font-size: 14px;
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

.approval-title {
  font-weight: 500;
  margin-right: 20px;
}

.approval-time {
  color: #666;
  font-size: 16px;
}

.approval-content {
  padding: 15px;
}

.feedback-item {
  background-color: #f5f5f5;
  padding: 8px 12px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.feedback-item .label {
  min-width: 100px;
  font-weight: 500;
  color: #666;
  flex-shrink: 0;
}

.feedback-item .value {
  flex: 1;
  color: #333;
}

.info-item .file-list :deep(.el-link) {
  color: #409eff !important;
  text-decoration: none !important;
  display: inline-block;
  padding: 2px 6px;
  border-radius: 2px;
  transition: background-color 0.2s ease;
}

.info-item .file-list :deep(.el-link:hover) {
  background-color: rgba(64, 158, 255, 0.2) !important;
}

.info-item .file-list :deep(.el-icon-document) {
  color: #409eff !important;
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