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

            <!-- 基础信息（自定义折叠） -->
            <div class="custom-collapse-item">
              <div class="custom-collapse-header" @click.stop="toggleBasicInfo(tab.name)">
                <img v-if="collapseVisible[tab.name]?.basic" class="arrow-icon" src="@/assets/images/arrow-down.png" />
                <img v-else class="arrow-icon" src="@/assets/images/arrow-right.png" />
                <span class="collapse-title">基础信息</span>
              </div>
              <div class="custom-collapse-content" v-if="collapseVisible[tab.name]?.basic">
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

            <!-- 建设信息（自定义折叠 + 三维预览按钮） -->
            <div class="custom-collapse-item">
              <div class="custom-collapse-header" @click.stop="toggleConstructionInfo(tab.name)">
                <img v-if="collapseVisible[tab.name]?.construction" class="arrow-icon"
                  src="@/assets/images/arrow-down.png" />
                <img v-else class="arrow-icon" src="@/assets/images/arrow-right.png" />
                <span class="collapse-title">建设信息</span>
                <el-button type="primary" @click.stop="handleModelPreview" class="modelPreview">
                  <img class="imgModel" src="@/assets/images/model.png" />三维场景效果预览
                </el-button>
              </div>
              <div class="custom-collapse-content" v-if="collapseVisible[tab.name]?.construction">
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

                  <!-- 建设信息文件列表 -->
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

          <!-- 审批信息：显示当前标签页对应的审批记录 -->
          <div class="approval-info">
            <h3 class="section-title">审批信息</h3>
            <!-- 有对应审批记录 -->
            <template v-if="form.approveRecords[tab.index]">
              <div class="approval-item">
                <!-- 管委会审批 -->
                <div v-if="form.approveRecords[tab.index].gwhApproveResult !== undefined" class="approval-sub-item">
                  <div class="approval-header"
                    style="padding: 10px 15px; background: #f9f9f9; display: flex; align-items: center;">
                    <span :class="[
                      'status-icon',
                      form.approveRecords[tab.index].gwhApproveResult === '通过' ? 'success' :
                        (form.approveRecords[tab.index].gwhApproveResult ? 'error' : 'pending')
                    ]">
                      {{
                        form.approveRecords[tab.index].gwhApproveResult === '通过' ? '✓' :
                          (form.approveRecords[tab.index].gwhApproveResult ? '✗' : '—')
                      }}
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
                        <template v-if="parseApprovalFile(form.approveRecords[tab.index].gwhApprovalAttachment).length">
                          <el-link
                            v-for="file in parseApprovalFile(form.approveRecords[tab.index].gwhApprovalAttachment)"
                            :key="file.ossId" :href="file.url" :underline="false" target="_blank">
                            <span class="el-icon-document"> {{ getFileName(file.name) }} </span>
                          </el-link>
                        </template>
                        <span v-else>暂无</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 市林业局审批 -->
                <div
                  v-if="form.approveRecords[tab.index].lyjApproveResult !== undefined && ['林业局通过', '林业局驳回'].includes(form.status)"
                  class="approval-sub-item" style="margin-top: 10px;">
                  <div class="approval-header"
                    style="padding: 10px 15px; background: #f9f9f9; display: flex; align-items: center;">
                    <span :class="[
                      'status-icon',
                      form.approveRecords[tab.index].lyjApproveResult === '通过' ? 'success' :
                        (form.approveRecords[tab.index].lyjApproveResult ? 'error' : 'pending')
                    ]">
                      {{
                        form.approveRecords[tab.index].lyjApproveResult === '通过' ? '✓' :
                          (form.approveRecords[tab.index].lyjApproveResult ? '✗' : '—')
                      }}
                    </span>
                    <span class="approval-title">市林业局审核</span>
                    <span class="approval-time">审核时间：{{ form.approveRecords[tab.index].lyjApproveTime || '暂无' }}</span>
                  </div>
                  <div class="approval-content">
                    <div class="feedback-item">
                      <span class="label">反馈建议：</span>
                      <span class="value">{{ form.approveRecords[tab.index].lyjApprovalReason || '暂无反馈建议' }}</span>
                    </div>
                    <div class="feedback-item">
                      <span class="label">反馈文件：</span>
                      <div class="file-list">
                        <template v-if="parseApprovalFile(form.approveRecords[tab.index].lyjApprovalAttachment).length">
                          <el-link
                            v-for="file in parseApprovalFile(form.approveRecords[tab.index].lyjApprovalAttachment)"
                            :key="file.ossId" :href="file.url" :underline="false" target="_blank">
                            <span class="el-icon-document"> {{ getFileName(file.name) }} </span>
                          </el-link>
                        </template>
                        <span v-else>暂无</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <!-- 无对应审批记录 -->
            <div v-else class="no-record-tip" style="text-align: center; padding: 20px; color: #999;">
              暂无审批记录
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

// 核心：根据审批记录数量动态生成标签页配置
const approvalTabs = computed(() => {
  const records = Array.isArray(form.approveRecords) ? form.approveRecords : [];
  // 即使records为空，也至少生成1个标签页（首次）
  const tabCount = records.length === 0 ? 1 : records.length;
  // 中文数字映射（扩展到20次，超过则显示“n次”）
  const cnTimesMap = ['首次', '二次', '三次', '四次', '五次', '六次', '七次', '八次', '九次', '十次'];
  return Array.from({ length: tabCount }, (_, index) => {
    const cnTimes = cnTimesMap[index] || `${index + 1}次`;
    return {
      label: `${cnTimes}审批信息`, // 标签页显示名称（首次审批信息、二次审批信息...）
      name: `fill-${index}`,       // 保持原有name格式，确保兼容性
      index: index                // 对应approveRecords的索引
    };
  });
});

// 激活的标签页（默认第一个）
const activeTab = ref('fill-0');

// 动态折叠状态（每个标签页独立维护）
const collapseVisible = ref({});
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

// 表单引用
const infoFormRef = ref(null);
// 按钮加载状态
const buttonLoading = ref(false);

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
  approveRecords: [], // 审批记录数组
  scenicGroundArea: undefined,
  scenicUndergroundArea: undefined,
  remark: '',
});

// 文件列表
const locationPlanFileList = ref([]);
const expertOpinionsFileList = ref([]);
const meetingMaterialsFileList = ref([]);
const siteSelectionReportFileList = ref([]);
const approvalDocumentsFileList = ref([]);
const projectRedLineFileList = ref([]);
const redLineCoordinateFileList = ref([]);
const threeDModelFileList = ref([]);

const dialog = reactive({
  visible: false,
  title: '',
});

// 切换基础信息折叠状态（接收动态标签页name）
const toggleBasicInfo = (tabName) => {
  if (!tabName || !collapseVisible.value[tabName]) {
    console.warn('无效的标签页标识:', tabName);
    return;
  }
  collapseVisible.value[tabName].basic = !collapseVisible.value[tabName].basic;
};

// 切换建设信息折叠状态（接收动态标签页name）
const toggleConstructionInfo = (tabName) => {
  if (!tabName || !collapseVisible.value[tabName]) {
    console.warn('无效的标签页标识:', tabName);
    return;
  }
  collapseVisible.value[tabName].construction = !collapseVisible.value[tabName].construction;
};

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
};

// 解析审批附件
const parseApprovalFile = (fileData) => {
  if (!fileData) return [];
  try {
    let list = typeof fileData === 'string' ? JSON.parse(fileData) : fileData;
    return Array.isArray(list) ? list.filter(item => item && item.ossId && item.url) : [];
  } catch (e) {
    console.error('解析审批附件失败:', e);
    return [];
  }
};

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
      type: 'major-share'
    }
  });
};

// 标签页切换事件
const handleTabChange = (tabName) => {
  activeTab.value = tabName;
};

// 取消按钮
const cancel = () => {
  router.push('/project/major');
};

// 数据下载
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

// 数据共享
const clickDataShare = async () => {
  try {
    await proxy?.$modal.confirm1('确认共享后最新的项目信息数据将共享至自然保护地审批平台进行最终的审批。');
    buttonLoading.value = true;
    await shareInfo(form.id);
    proxy?.$modal.msgSuccess('数据共享成功');
    form.remark = '已共享'; // 标记为已共享
    dialog.visible = false;
  } catch (err) {
    if (err !== 'cancel') {
      proxy?.$modal.msgError('数据共享失败：' + (err?.message || '未知错误'));
    }
  } finally {
    buttonLoading.value = false;
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
  const projectId = route.params.id;
  if (!projectId) {
    ElMessage.error('缺少项目ID，无法加载数据');
    router.push('/project/major');
    return;
  }

  try {
    const response = await getInfo(projectId);
    const projectData = response.data;
    // 填充表单数据
    Object.assign(form, projectData);
    form.remark = projectData.remark || '';

    // 处理多选字段（字符串转数组）
    form.protectionLevel = typeof projectData.protectionLevel === 'string'
      ? projectData.protectionLevel.split(',').filter(Boolean)
      : (Array.isArray(projectData.protectionLevel) ? projectData.protectionLevel : []);
    form.projectType = typeof projectData.projectType === 'string'
      ? projectData.projectType.split(',').filter(Boolean)
      : (Array.isArray(projectData.projectType) ? projectData.projectType : []);

    // 加载文件列表
    locationPlanFileList.value = parseFileList(projectData.locationPlan);
    expertOpinionsFileList.value = parseFileList(projectData.expertOpinions);
    meetingMaterialsFileList.value = parseFileList(projectData.meetingMaterials);
    siteSelectionReportFileList.value = parseFileList(projectData.siteSelectionReport);
    approvalDocumentsFileList.value = parseFileList(projectData.approvalDocuments);
    projectRedLineFileList.value = parseFileList(projectData.projectRedLine);
    redLineCoordinateFileList.value = parseFileList(projectData.redLineCoordinate);
    threeDModelFileList.value = parseFileList(projectData.threeDModel);

    // 赋值审批记录（确保是数组）
    form.approveRecords = Array.isArray(projectData.approveRecords) ? projectData.approveRecords : [];

    // 初始化折叠状态和激活标签页
    initCollapseState();
    activeTab.value = approvalTabs.value[0]?.name || 'fill-0';
  } catch (err) {
    ElMessage.error('加载项目数据失败：' + (err.message || '未知错误'));
    router.push('/project/major');
  }
});
</script>

<style scoped>
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
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.add-content::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
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

/* 自定义折叠面板样式 */
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
  justify-content: space-between;
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

/* 审批反馈-项目信息样式 */
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

/* 审批反馈-审批信息样式 */
.approval-item {
  margin-bottom: 20px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.approval-sub-item {
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
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
  margin-bottom: 10px;
  display: flex;
  align-items: flex-start;
  background-color: #f5f5f5;
  padding: 8px 12px;
  border-radius: 4px;
}

.feedback-item .label {
  min-width: 100px;
  font-weight: 500;
  color: #666;
}

.feedback-item .value {
  flex: 1;
  color: #333;
}

.no-record-tip {
  text-align: center;
  padding: 20px;
  color: #999;
}

/* 文件链接样式 */
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