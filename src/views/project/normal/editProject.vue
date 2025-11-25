<template>
  <div class="add-content-container" v-if="declartionInformation">
    <div class="add-content">
      <div class="back-normal" @click="cancel"><img src="../../../assets/images/arrow-left.png" />信息填报</div>
      <div class="project-basic-info">
        <h3 class="section-title">项目基础信息</h3>
        <el-form ref="infoFormRef" :model="form" label-width="230px" :rules="rules" status-icon>
          <!-- 基础信息字段不变 -->
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="建设活动（建设项目）名称" prop="projectName">
                <el-input v-model="form.projectName" placeholder="请输入建设项目名称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="项目代码" prop="projectCode">
                <el-input v-model="form.projectCode" placeholder="请输入项目代码" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="所属行政区划" prop="administrativeRegion">
                <el-input v-model="form.administrativeRegion" placeholder="请输入所属行政区划" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="涉及风景名胜区名称" prop="scenicArea">
                <el-input v-model="form.scenicArea" placeholder="请输入涉及风景名胜区名称" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="单位建设/个人建设" prop="applicantType">
                <el-radio-group v-model="form.applicantType">
                  <el-radio label="单位">单位</el-radio>
                  <el-radio label="个人">个人</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="一般/重点项目" prop="majorFlag">
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
        <el-form ref="infoFormRef" :model="form" label-width="230px" :rules="rules" status-icon>
          <!-- 建设信息字段不变 -->
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="建设单位名称" prop="constructionUnit">
                <el-input v-model="form.constructionUnit" placeholder="请输入建设单位名称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="组织机构代码" prop="organizationCode">
                <el-input v-model="form.organizationCode" placeholder="请输入组织机构代码" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="经办人" prop="contactPerson">
                <el-input v-model="form.contactPerson" placeholder="请输入经办人" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="经办人联系方式" prop="contactPhone">
                <el-input v-model="form.contactPhone" placeholder="请输入经办人联系方式" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="保护区等级" prop="protectionLevel">
                <el-select v-model="form.protectionLevel" placeholder="请选择保护区等级">
                  <el-option label="一级保护区" value="一级保护区"></el-option>
                  <el-option label="二级保护区" value="二级保护区"></el-option>
                  <el-option label="三级保护区（非核心景区）" value="三级保护区（非核心景区）"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="项目占用类型" prop="projectType">
                <el-select v-model="form.projectType" placeholder="请选择项目占用类型">
                  <el-option label="长期" value="长期"></el-option>
                  <el-option label="临时" value="临时"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="项目用途" prop="projectUsage">
                <el-input v-model="form.projectUsage" placeholder="请输入项目用途" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="拟选位置" prop="projectPurpose">
                <el-input v-model="form.projectPurpose" placeholder="请输入拟选位置" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="建设项目拟投资额（万元）" prop="projectInvestment">
            <el-input v-model="form.projectInvestment" placeholder="请输入建设项目总投资" />
          </el-form-item>
          <el-form-item label="规划依据" prop="planningBasis">
            <el-input v-model="form.planningBasis" type="textarea" placeholder="请输入规划依据" />
          </el-form-item>
          <el-form-item label="建设内容涉及规模" prop="constructionContent">
            <el-input v-model="form.constructionContent" type="textarea" placeholder="请输入建设内容涉及规模" />
          </el-form-item>
          <el-form-item label="其他需要说明的情况" prop="otherExplanations">
            <el-input v-model="form.otherExplanations" type="textarea" placeholder="请输入其他需要说明的情况" />
          </el-form-item>

          <!-- 文件上传区域（添加 ref 和 @change 事件） -->
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="选址方案" prop="locationPlan">
                <div class="upload-container">
                  <el-upload ref="locationPlanUploadRef" multiple :action="uploadFileUrl"
                    :before-upload="(file) => handleBeforeUpload(file, 'locationPlan')"
                    :file-list="locationPlanFileList" :limit="props.limit" :accept="getFileAccept()"
                    :on-error="(err, file) => handleUploadError(err, file, 'locationPlan')" :on-exceed="handleExceed"
                    :on-success="(res, file) => handleUploadSuccess(res, file, 'locationPlan')"
                    :on-remove="() => handleFileRemove('locationPlan')" :show-file-list="false" :headers="headers"
                    class="upload-file-uploader" :disabled="props.compDisabled">
                    <el-button type="primary">点击上传</el-button>
                  </el-upload>
                  <transition-group class="upload-file-list el-upload-list el-upload-list--text"
                    name="el-fade-in-linear" tag="ul">
                    <li v-for="(file, index) in locationPlanFileList"
                      :key="file.ossId || `location-${index}-${file.name}`"
                      class="el-upload-list__item ele-upload-list__item-content">
                      <el-link :href="file.url" :underline="false" target="_blank">
                        <span class="el-icon-document"> {{ getFileName(file.name) }} </span>
                      </el-link>
                      <div class="ele-upload-list__item-content-action" v-if="!props.compDisabled">
                        <el-button type="danger" link @click.stop="handleDeleteUploadFile(index, 'locationPlan')">
                          删除
                        </el-button>
                      </div>
                    </li>
                  </transition-group>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="专家评审意见" prop="expertOpinions">
                <div class="upload-container">
                  <el-upload ref="expertOpinionsUploadRef" multiple :action="uploadFileUrl"
                    :before-upload="(file) => handleBeforeUpload(file, 'expertOpinions')"
                    :file-list="expertOpinionsFileList" :limit="props.limit" :accept="getFileAccept()"
                    :on-error="(err, file) => handleUploadError(err, file, 'expertOpinions')" :on-exceed="handleExceed"
                    :on-success="(res, file) => handleUploadSuccess(res, file, 'expertOpinions')"
                    :on-remove="() => handleFileRemove('expertOpinions')" :show-file-list="false" :headers="headers"
                    class="upload-file-uploader" :disabled="props.compDisabled">
                    <el-button type="primary">点击上传</el-button>
                  </el-upload>
                  <transition-group class="upload-file-list el-upload-list el-upload-list--text"
                    name="el-fade-in-linear" tag="ul">
                    <li v-for="(file, index) in expertOpinionsFileList"
                      :key="file.ossId || `expert-${index}-${file.name}`"
                      class="el-upload-list__item ele-upload-list__item-content">
                      <el-link :href="file.url" :underline="false" target="_blank">
                        <span class="el-icon-document"> {{ getFileName(file.name) }} </span>
                      </el-link>
                      <div class="ele-upload-list__item-content-action" v-if="!props.compDisabled">
                        <el-button type="danger" link @click.stop="handleDeleteUploadFile(index, 'expertOpinions')">
                          删除
                        </el-button>
                      </div>
                    </li>
                  </transition-group>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="公示材料" prop="meetingMaterials">
                <div class="upload-container">
                  <el-upload ref="meetingMaterialsUploadRef" multiple :action="uploadFileUrl"
                    :before-upload="(file) => handleBeforeUpload(file, 'meetingMaterials')"
                    :file-list="meetingMaterialsFileList" :limit="props.limit" :accept="getFileAccept()"
                    :on-error="(err, file) => handleUploadError(err, file, 'meetingMaterials')"
                    :on-exceed="handleExceed"
                    :on-success="(res, file) => handleUploadSuccess(res, file, 'meetingMaterials')"
                    :on-remove="() => handleFileRemove('meetingMaterials')" :show-file-list="false" :headers="headers"
                    class="upload-file-uploader" :disabled="props.compDisabled">
                    <el-button type="primary">点击上传</el-button>
                  </el-upload>
                  <transition-group class="upload-file-list el-upload-list el-upload-list--text"
                    name="el-fade-in-linear" tag="ul">
                    <li v-for="(file, index) in meetingMaterialsFileList" :key="file.ossId"
                      class="el-upload-list__item ele-upload-list__item-content">
                      <el-link :href="file.url" :underline="false" target="_blank">
                        <span class="el-icon-document"> {{ getFileName(file.name) }} </span>
                      </el-link>
                      <div class="ele-upload-list__item-content-action" v-if="!props.compDisabled">
                        <el-button type="danger" link @click="handleDeleteUploadFile(index, 'meetingMaterials')">
                          删除
                        </el-button>
                      </div>
                    </li>
                  </transition-group>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="选址方案核准申报表" prop="siteSelectionReport">
                <div class="upload-container">
                  <el-upload ref="siteSelectionReportUploadRef" multiple :action="uploadFileUrl"
                    :before-upload="(file) => handleBeforeUpload(file, 'siteSelectionReport')"
                    :file-list="siteSelectionReportFileList" :limit="props.limit" :accept="getFileAccept()"
                    :on-error="(err, file) => handleUploadError(err, file, 'siteSelectionReport')"
                    :on-exceed="handleExceed"
                    :on-success="(res, file) => handleUploadSuccess(res, file, 'siteSelectionReport')"
                    :on-remove="() => handleFileRemove('siteSelectionReport')" :show-file-list="false"
                    :headers="headers" class="upload-file-uploader" :disabled="props.compDisabled">
                    <el-button type="primary">点击上传</el-button>
                  </el-upload>
                  <transition-group class="upload-file-list el-upload-list el-upload-list--text"
                    name="el-fade-in-linear" tag="ul">
                    <li v-for="(file, index) in siteSelectionReportFileList" :key="file.ossId"
                      class="el-upload-list__item ele-upload-list__item-content">
                      <el-link :href="file.url" :underline="false" target="_blank">
                        <span class="el-icon-document"> {{ getFileName(file.name) }} </span>
                      </el-link>
                      <div class="ele-upload-list__item-content-action" v-if="!props.compDisabled">
                        <el-button type="danger" link @click="handleDeleteUploadFile(index, 'siteSelectionReport')">
                          删除
                        </el-button>
                      </div>
                    </li>
                  </transition-group>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="立项文件" prop="approvalDocuments">
                <div class="upload-container">
                  <el-upload ref="approvalDocumentsUploadRef" multiple :action="uploadFileUrl"
                    :before-upload="(file) => handleBeforeUpload(file, 'approvalDocuments')"
                    :file-list="approvalDocumentsFileList" :limit="props.limit" :accept="getFileAccept()"
                    :on-error="(err, file) => handleUploadError(err, file, 'approvalDocuments')"
                    :on-exceed="handleExceed"
                    :on-success="(res, file) => handleUploadSuccess(res, file, 'approvalDocuments')"
                    :show-file-list="false" :headers="headers" class="upload-file-uploader"
                    :disabled="props.compDisabled">
                    <el-button type="primary">点击上传</el-button>
                  </el-upload>
                  <transition-group class="upload-file-list el-upload-list el-upload-list--text"
                    name="el-fade-in-linear" tag="ul">
                    <li v-for="(file, index) in approvalDocumentsFileList" :key="file.ossId"
                      class="el-upload-list__item ele-upload-list__item-content">
                      <el-link :href="file.url" :underline="false" target="_blank">
                        <span class="el-icon-document"> {{ getFileName(file.name) }} </span>
                      </el-link>
                      <div class="ele-upload-list__item-content-action" v-if="!props.compDisabled">
                        <el-button type="danger" link @click="handleDeleteUploadFile(index, 'approvalDocuments')">
                          删除
                        </el-button>
                      </div>
                    </li>
                  </transition-group>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="项目用地红线图" prop="projectRedLine">
                <div class="upload-container">
                  <el-upload ref="projectRedLineUploadRef" multiple :action="uploadFileUrl"
                    :before-upload="(file) => handleBeforeUpload(file, 'projectRedLine')"
                    :file-list="projectRedLineFileList" :limit="props.limit" :accept="getFileAccept()"
                    :on-error="(err, file) => handleUploadError(err, file, 'projectRedLine')" :on-exceed="handleExceed"
                    :on-success="(res, file) => handleUploadSuccess(res, file, 'projectRedLine')"
                    :on-remove="() => handleFileRemove('projectRedLine')" :show-file-list="false" :headers="headers"
                    class="upload-file-uploader" :disabled="props.compDisabled">
                    <el-button type="primary">点击上传</el-button>
                  </el-upload>
                  <transition-group class="upload-file-list el-upload-list el-upload-list--text"
                    name="el-fade-in-linear" tag="ul">
                    <li v-for="(file, index) in projectRedLineFileList" :key="file.ossId"
                      class="el-upload-list__item ele-upload-list__item-content">
                      <el-link :href="file.url" :underline="false" target="_blank">
                        <span class="el-icon-document"> {{ getFileName(file.name) }} </span>
                      </el-link>
                      <div class="ele-upload-list__item-content-action" v-if="!props.compDisabled">
                        <el-button type="danger" link @click="handleDeleteUploadFile(index, 'projectRedLine')">
                          删除
                        </el-button>
                      </div>
                    </li>
                  </transition-group>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="项目红线矢量数据" prop="redLineCoordinate">
            <div class="upload-container">
              <el-upload ref="redLineCoordinateUploadRef" multiple :action="uploadFileUrl"
                :before-upload="(file) => handleBeforeUpload(file, 'redLineCoordinate')"
                :file-list="redLineCoordinateFileList" :limit="props.limit" :accept="getFileAccept()"
                :on-error="(err, file) => handleUploadError(err, file, 'redLineCoordinate')" :on-exceed="handleExceed"
                :on-success="(res, file) => handleUploadSuccess(res, file, 'redLineCoordinate')"
                :on-remove="() => handleFileRemove('redLineCoordinate')" :show-file-list="false" :headers="headers"
                class="upload-file-uploader" :disabled="props.compDisabled">
                <el-button type="primary">点击上传</el-button>
              </el-upload>
              <div class="operation-group">
                <el-button link type="primary" @click="handleDownloadTemplate('instructions')">填写说明</el-button>
                <el-button link type="primary" @click="handleDownloadTemplate('polygonTemplate')">面模板下载</el-button>
                <el-button link type="primary" @click="handleDownloadTemplate('polylineTemplate')">线模板下载</el-button>
                <div>（使用前，请删除模板中的实例数据）</div>
              </div>
              <transition-group class="upload-file-list el-upload-list el-upload-list--text" name="el-fade-in-linear"
                tag="ul">
                <li v-for="(file, index) in redLineCoordinateFileList" :key="file.ossId"
                  class="el-upload-list__item ele-upload-list__item-content">
                  <el-link :href="file.url" :underline="false" target="_blank">
                    <span class="el-icon-document"> {{ getFileName(file.name) }} </span>
                  </el-link>
                  <div class="ele-upload-list__item-content-action" v-if="!props.compDisabled">
                    <el-button type="danger" link @click="handleDeleteUploadFile(index, 'redLineCoordinate')">
                      删除
                    </el-button>
                  </div>
                </li>
              </transition-group>
            </div>
          </el-form-item>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="项目三维模型" prop="threeDModel">
                <div class="upload-container">
                  <el-upload ref="threeDModelUploadRef" multiple :action="uploadFileUrl"
                    :before-upload="(file) => handleBeforeUpload(file, 'threeDModel')" :file-list="threeDModelFileList"
                    :limit="props.limit" :accept="getFileAccept()"
                    :on-error="(err, file) => handleUploadError(err, file, 'threeDModel')" :on-exceed="handleExceed"
                    :on-success="(res, file) => handleUploadSuccess(res, file, 'threeDModel')"
                    :on-remove="() => handleFileRemove('threeDModel')" :show-file-list="false" :headers="headers"
                    class="upload-file-uploader" :disabled="props.compDisabled">
                    <el-button type="primary">点击上传</el-button>
                  </el-upload>
                  <div class="operation-group">
                    <el-button link type="primary" icon="Download"
                      @click="handleDownloadTemplate('threeD')">模型规范与模板下载</el-button>
                  </div>
                  <transition-group class="upload-file-list el-upload-list el-upload-list--text"
                    name="el-fade-in-linear" tag="ul">
                    <li v-for="(file, index) in threeDModelFileList" :key="file.ossId"
                      class="el-upload-list__item ele-upload-list__item-content">
                      <el-link :href="file.url" :underline="false" target="_blank">
                        <span class="el-icon-document"> {{ getFileName(file.name) }} </span>
                      </el-link>
                      <div class="ele-upload-list__item-content-action" v-if="!props.compDisabled">
                        <el-button type="danger" link @click="handleDeleteUploadFile(index, 'threeDModel')">
                          删除
                        </el-button>
                      </div>
                    </li>
                  </transition-group>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="模型坐标" prop="modelCoordinate">
                <div class="upload-container">
                  <el-input v-model="form.modelCoordinate" placeholder="请输入模型坐标格式为：经度,纬度,高度,旋转方向" />
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <div class="add-footer">
      <el-button @click="cancel">取消</el-button>
      <el-button type="warning" @click="resetForm">重置</el-button>
      <el-button type="success" v-hasPermi="['project:project:stage']" @click="temporarilyForm">暂存</el-button>
      <el-button :loading="buttonLoading" type="primary" @click="submitForm">提交</el-button>
    </div>
  </div>
  <div class="add-content-container" v-else>
    <div class="popup-content">
      <img src="../../../assets/images/tick.png" class="success-icon" />
      <div class="success-text">申报信息已成功提交！</div>
      <div class="button-group">
        <el-button class="btn-back" @click="handleBackToList">返回项目列表</el-button>
        <el-button class="btn-view" @click="handleViewDetail">查看填报详情</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, getCurrentInstance } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getInfo, stageInfo, submitInfo } from '@/api/project/normal/index';
import { getInfo as getUserInfo } from '@/api/login';
import { delOss, listByIds } from '@/api/system/oss';
import { useUserStore } from '@/store/modules/user'
import { propTypes } from '@/utils/propTypes';
import { ElMessage, ElForm } from 'element-plus'
import { globalHeaders } from '@/utils/request';
const { proxy } = getCurrentInstance() || {}
const router = useRouter()
const route = useRoute()

// 初始化 Pinia 实例
const userStore = useUserStore()
const declartionInformation = ref(true)

// 定义组件属性
const props = defineProps({
  modelValue: {
    type: [String, Object, Array],
    default: () => []
  },
  // 数量限制
  limit: propTypes.number.def(15),
  // 大小限制(MB)
  fileSize: propTypes.number.def(500),
  // 文件类型
  fileType: propTypes.array.def([
    'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'pdf', 'zip', 'rar',
    'dwg', 'dxf', 'jpg', 'jpeg', 'png', 'cpg', 'dbf', 'prj', 'sbn', 'sbx',
    'shp', 'shp.xml', 'shx', 'FBX', 'fbm', 'obj', 'pak'
  ]),
  compDisabled: {
    type: Boolean,
    default: false
  }
});

const currentUserRole = ref('');
// 表单引用（关键：确保是同一个表单实例）
const infoFormRef = ref(null)
// 按钮加载状态
const buttonLoading = ref(false)
const isTemporarilySaved = ref(false)
// 组件状态
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

})

// 文件列表（用于校验是否上传）
const locationPlanFileList = ref([])
const expertOpinionsFileList = ref([])
const meetingMaterialsFileList = ref([])
const siteSelectionReportFileList = ref([])
const approvalDocumentsFileList = ref([])
const projectRedLineFileList = ref([])
const redLineCoordinateFileList = ref([])
const threeDModelFileList = ref([])

// 表单验证规则（核心：添加文件上传自定义校验）
const rules = reactive({
  projectName: [{ required: true, message: '请输入建设项目名称', trigger: 'blur' }],
  administrativeRegion: [{ required: true, message: '请输入所属行政区划', trigger: 'blur' }],
  scenicArea: [{ required: true, message: '请输入涉及风景名胜区名称', trigger: 'blur' }],
  applicantType: [{ required: true, message: '请选择建设类型', trigger: 'change' }],
  constructionUnit: [{ required: true, message: '请输入建设单位名称', trigger: 'blur' }],
  organizationCode: [{ required: true, message: '请输入组织机构代码', trigger: 'blur' }],
  contactPerson: [{ required: true, message: '请输入经办人', trigger: 'blur' }],
  contactPhone: [
    { required: true, message: '请输入经办人联系方式', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  protectionLevel: [{ required: true, message: '请选择保护区等级', trigger: 'change' }],
  projectType: [{ required: true, message: '请选择项目占用类型', trigger: 'change' }],
  projectUsage: [{ required: true, message: '请输入项目用途', trigger: 'blur' }],
  projectPurpose: [{ required: true, message: '请输入拟选位置', trigger: 'blur' }],
  projectInvestment: [
    { required: true, message: '请输入建设项目拟投资额', trigger: 'blur' },
    { pattern: /^[0-9]+(\.[0-9]{1,2})?$/, message: '请输入有效的数字（支持整数或两位小数）', trigger: 'blur' }
  ],
  planningBasis: [{ required: true, message: '请输入规划依据', trigger: 'blur' }],
  constructionContent: [{ required: true, message: '请输入建设内容涉及规模', trigger: 'blur' }],
  // 文件上传字段：自定义校验（确保至少上传一个文件）
  locationPlan: [
    { required: true, message: '请上传选址方案', trigger: ['change', 'blur'] },
    {
      validator: (rule, value, callback) => {
        if (locationPlanFileList.value.length > 0) {
          callback() // 上传了文件，校验通过
        } else {
          callback(new Error('请至少上传一个文件')) // 未上传，校验失败
        }
      },
      trigger: ['change', 'blur']
    }
  ],
  expertOpinions: [
    { required: true, message: '请上传专家评审意见', trigger: ['change', 'blur'] },
    {
      validator: (rule, value, callback) => {
        if (expertOpinionsFileList.value.length > 0) {
          callback()
        } else {
          callback(new Error('请至少上传一个文件'))
        }
      },
      trigger: ['change', 'blur']
    }
  ],
  meetingMaterials: [
    { required: true, message: '请上传公示材料', trigger: ['change', 'blur'] },
    {
      validator: (rule, value, callback) => {
        // 直接校验文件列表长度，无需依赖 form 字段
        if (meetingMaterialsFileList.value.length > 0) {
          callback() // 上传了文件，校验通过
        } else {
          callback(new Error('请至少上传一个文件')) // 未上传，校验失败
        }
      },
      trigger: ['change', 'blur', 'upload-success', 'upload-remove'] // 增加上传相关触发时机
    }
  ],
  siteSelectionReport: [
    { required: true, message: '请上传选址方案核准申报表', trigger: ['change', 'blur'] },
    {
      validator: (rule, value, callback) => {
        if (siteSelectionReportFileList.value.length > 0) {
          callback()
        } else {
          callback(new Error('请至少上传一个文件'))
        }
      },
      trigger: ['change', 'blur']
    }
  ],
  projectRedLine: [
    { required: true, message: '请上传项目用地红线图', trigger: ['change', 'blur'] },
    {
      validator: (rule, value, callback) => {
        if (projectRedLineFileList.value.length > 0) {
          callback()
        } else {
          callback(new Error('请至少上传一个文件'))
        }
      },
      trigger: ['change', 'blur']
    }
  ],
  redLineCoordinate: [
    { required: true, message: '请上传项目红线矢量数据', trigger: ['change', 'blur'] },
    {
      validator: (rule, value, callback) => {
        if (redLineCoordinateFileList.value.length > 0) {
          callback()
        } else {
          callback(new Error('请至少上传一个文件'))
        }
      },
      trigger: ['change', 'blur']
    }
  ],
  threeDModel: [
    { required: true, message: '请上传项目三维模型', trigger: ['change', 'blur'] },
    {
      validator: (rule, value, callback) => {
        if (threeDModelFileList.value.length > 0) {
          callback()
        } else {
          callback(new Error('请至少上传一个文件'))
        }
      },
      trigger: ['change', 'blur']
    }
  ],
  modelCoordinate: [
    { required: true, message: '请输入模型坐标', trigger: 'blur' },
    {
      pattern: /^-?\d+(\.\d+)?,-?\d+(\.\d+)?,-?\d+(\.\d+)?,-?\d+(\.\d+)?$/,
      message: '请输入正确格式（经度,纬度,高度,旋转方向），支持正负小数',
      trigger: 'blur'
    }
  ]
})

// 获取文件名（处理路径）
const getFileName = (name) => {
  if (!name) return '未知文件';
  const lastSlashIndex = Math.max(name.lastIndexOf('/'), name.lastIndexOf('\\'));
  return lastSlashIndex > -1 ? name.slice(lastSlashIndex + 1) : name;
};

// 上传相关配置
const uploadFileUrl = import.meta.env.VITE_APP_BASE_API + '/resource/oss/upload'
const headers = ref(globalHeaders())

// 获取文件接受类型
const getFileAccept = () => {
  return props.fileType.map(type => `.${type.toLowerCase()}`).join(',')
}

// 生命周期：初始化时加载数据
onMounted(async () => {
  const res = await getUserInfo();
  const userRoles = res.data?.roles || [];
  currentUserRole.value = userRoles[0] || '';
  const projectId = route.params.id
  if (!projectId) {
    ElMessage.error('缺少项目ID，无法加载数据')
    router.push('/project/normal')
    return
  }

  try {
    const response = await getInfo(projectId)
    const projectData = response.data
    Object.assign(form, projectData)

    // 解析文件列表
    if (projectData.locationPlan) {
      locationPlanFileList.value = JSON.parse(projectData.locationPlan)
    }
    if (projectData.expertOpinions) {
      expertOpinionsFileList.value = JSON.parse(projectData.expertOpinions)
    }
    if (projectData.meetingMaterials) {
      meetingMaterialsFileList.value = JSON.parse(projectData.meetingMaterials)
    }
    if (projectData.siteSelectionReport) {
      siteSelectionReportFileList.value = JSON.parse(projectData.siteSelectionReport)
    }
    if (projectData.approvalDocuments) {
      approvalDocumentsFileList.value = JSON.parse(projectData.approvalDocuments)
    }
    if (projectData.projectRedLine) {
      projectRedLineFileList.value = JSON.parse(projectData.projectRedLine)
    }
    if (projectData.redLineCoordinate) {
      redLineCoordinateFileList.value = JSON.parse(projectData.redLineCoordinate)
    }
    if (projectData.threeDModel) {
      threeDModelFileList.value = JSON.parse(projectData.threeDModel)
      if (threeDModelFileList.value.length > 0) {
        form.threeDModel = threeDModelFileList.value[0].url
      }
    }
  } catch (err) {
    ElMessage.error('加载项目数据失败：' + (err.message || '未知错误'))
    router.push('/project/normal')
  }
})

// 上传前置校验
const handleBeforeUpload = (file, type) => {
  const fileExt = file.name.split('.').pop()?.toLowerCase() || '';
  // 类型校验
  if (!props.fileType.includes(fileExt)) {
    proxy?.$modal.msgError(`请上传${props.fileType.join('/')}格式文件!`);
    return false;
  }
  // 文件名特殊字符校验
  if (file.name.includes(',')) {
    proxy?.$modal.msgError('文件名不能包含英文逗号!');
    return false;
  }
  // 大小校验
  const isLtMaxSize = file.size / 1024 / 1024 < props.fileSize
  if (!isLtMaxSize) {
    ElMessage.error(`文件大小不能超过 ${props.fileSize}MB!`)
    return false
  }
  return true
}

// 上传错误处理
const handleUploadError = (err, file, type) => {
  ElMessage.error(`上传失败: ${err.message || '未知错误'}`)
}

// 上传超过限制处理
const handleExceed = (files, fileList) => {
  ElMessage.warning(`每次最多上传 ${props.limit} 个文件`)
}

// 上传成功处理
const handleUploadSuccess = (res, file, type) => {
  if (res.code === 200) {
    console.log("🚀 ~ handleUploadSuccess ~ res:", res)
    const fileItem = {
      name: res.data.fileName,
      url: res.data.url,
      ossId: res.data.ossId
    }
    // 添加到对应文件列表
    switch (type) {
      case 'locationPlan': locationPlanFileList.value.push(fileItem); break
      case 'expertOpinions': expertOpinionsFileList.value.push(fileItem); break
      case 'meetingMaterials': meetingMaterialsFileList.value.push(fileItem); break;
      case 'siteSelectionReport': siteSelectionReportFileList.value.push(fileItem); break
      case 'approvalDocuments': approvalDocumentsFileList.value.push(fileItem); break
      case 'projectRedLine': projectRedLineFileList.value.push(fileItem); break
      case 'redLineCoordinate': redLineCoordinateFileList.value.push(fileItem); break
      case 'threeDModel':
        threeDModelFileList.value.push(fileItem);
        form.threeDModel = res.data.url;
        break
    }
    ElMessage.success('上传成功')
  } else {
    ElMessage.error(res.msg || '上传失败')
  }
}

// 删除上传文件（修复：使用 ossId 而非 id）
const handleDeleteUploadFile = async (index, type) => {
  let fileList = []
  let fileId = ''
  // 确定当前操作的文件列表和文件ID
  switch (type) {
    case 'locationPlan':
      fileList = locationPlanFileList.value;
      fileId = fileList[index].ossId;
      break
    case 'expertOpinions':
      fileList = expertOpinionsFileList.value;
      fileId = fileList[index].ossId;
      break
    case 'meetingMaterials':
      fileList = meetingMaterialsFileList.value;
      fileId = fileList[index].ossId;
      break
    case 'siteSelectionReport':
      fileList = siteSelectionReportFileList.value;
      fileId = fileList[index].ossId;
      break
    case 'approvalDocuments':
      fileList = approvalDocumentsFileList.value;
      fileId = fileList[index].ossId;
      break
    case 'projectRedLine':
      fileList = projectRedLineFileList.value;
      fileId = fileList[index].ossId;
      break
    case 'redLineCoordinate':
      fileList = redLineCoordinateFileList.value;
      fileId = fileList[index].ossId;
      break
    case 'threeDModel':
      fileList = threeDModelFileList.value;
      fileId = fileList[index].ossId;
      break
  }

  // 删除文件列表中的项
  fileList.splice(index, 1)
  // 更新三维模型URL
  if (type === 'threeDModel' && threeDModelFileList.value.length === 0) {
    form.threeDModel = ''
  }
  // 调用OSS删除接口
  if (fileId) {
    try {
      await delOss(fileId)
      ElMessage.success('文件删除成功')
    } catch (err) {
      ElMessage.warning('文件删除请求失败，可能需要手动清理')
    }
  }
}

// 文件删除时触发校验（用于ElUpload的on-remove事件）
const handleFileRemove = (type) => {
  infoFormRef.value.validateField(type)
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

// 返回列表
const handleBackToList = () => {
  router.push('/project/normal')
}

// 查看详情
const handleViewDetail = () => {
  router.push(`/project/normal/normal-view/${form.id}`);
}

// 取消
const cancel = () => {
  router.push('/project/normal')
}

// 重置
const resetForm = async () => {
  try {
    const response = await getInfo(form.id)
    const projectData = response.data
    Object.assign(form, projectData)
    // 重置文件列表
    locationPlanFileList.value = projectData.locationPlan ? JSON.parse(projectData.locationPlan) : []
    expertOpinionsFileList.value = projectData.expertOpinions ? JSON.parse(projectData.expertOpinions) : []
    meetingMaterialsFileList.value = projectData.meetingMaterials ? JSON.parse(projectData.meetingMaterials) : []
    siteSelectionReportFileList.value = projectData.siteSelectionReport ? JSON.parse(projectData.siteSelectionReport) : []
    approvalDocumentsFileList.value = projectData.approvalDocuments ? JSON.parse(projectData.approvalDocuments) : []
    projectRedLineFileList.value = projectData.projectRedLine ? JSON.parse(projectData.projectRedLine) : []
    redLineCoordinateFileList.value = projectData.redLineCoordinate ? JSON.parse(projectData.redLineCoordinate) : []
    threeDModelFileList.value = projectData.threeDModel ? JSON.parse(projectData.threeDModel) : []
    // 重置三维模型URL
    form.threeDModel = threeDModelFileList.value.length > 0 ? threeDModelFileList.value[0].url : ''
    // 重置表单校验状态
    infoFormRef.value.clearValidate()
    ElMessage.success('已重置为原始数据')
  } catch (err) {
    ElMessage.error('重置失败：' + (err.message || '未知错误'))
  }
}

/** 暂存按钮（核心：先校验，后接口） */
const temporarilyForm = async () => {
  const submitData = {
    ...form,
    locationPlan: JSON.stringify(locationPlanFileList.value),
    expertOpinions: JSON.stringify(expertOpinionsFileList.value),
    meetingMaterials: JSON.stringify(meetingMaterialsFileList.value),
    siteSelectionReport: JSON.stringify(siteSelectionReportFileList.value),
    approvalDocuments: JSON.stringify(approvalDocumentsFileList.value),
    projectRedLine: JSON.stringify(projectRedLineFileList.value),
    redLineCoordinate: JSON.stringify(redLineCoordinateFileList.value),
    threeDModel: JSON.stringify(threeDModelFileList.value),
  }
  await stageInfo(submitData)
  proxy?.$modal.msgSuccess("暂存成功")
  isTemporarilySaved.value = true
}
/** 提交按钮（核心：先校验，后接口） */
const submitForm = () => {
  infoFormRef.value.validate(async (valid) => {
    console.log("🚀 ~ submitForm ~ valid:", valid)
    if (valid) {
      buttonLoading.value = true
      try {
        const submitData = {
          ...form,
          locationPlan: JSON.stringify(locationPlanFileList.value),
          expertOpinions: JSON.stringify(expertOpinionsFileList.value),
          meetingMaterials: JSON.stringify(meetingMaterialsFileList.value),
          siteSelectionReport: JSON.stringify(siteSelectionReportFileList.value),
          approvalDocuments: JSON.stringify(approvalDocumentsFileList.value),
          projectRedLine: JSON.stringify(projectRedLineFileList.value),
          redLineCoordinate: JSON.stringify(redLineCoordinateFileList.value),
          threeDModel: JSON.stringify(threeDModelFileList.value),
        }
        await submitInfo(submitData)
        declartionInformation.value = false
      } catch (err) {
        proxy?.$modal.msgError("提交失败：" + (err).message || "未知错误")
      } finally {
        buttonLoading.value = false
      }
    } else {
      ElMessage.warning('基础信息填写不符合要求，请检查')
    }

  })
}
// 三维模型预览
const handleModelPreview = () => {
  // 1. 校验三维模型是否上传
  if (threeDModelFileList.value.length === 0) {
    ElMessage.warning('请先上传三维模型文件')
    return
  }

  // 2. 校验模型坐标是否填写且格式正确
  if (!form.modelCoordinate) {
    ElMessage.warning('请输入模型坐标')
    return
  }
  // 复用 rules 中的坐标格式正则（避免重复写正则）
  const coordinateReg = /^-?\d+(\.\d+)?,-?\d+(\.\d+)?,-?\d+(\.\d+)?,-?\d+(\.\d+)?$/
  if (!coordinateReg.test(form.modelCoordinate)) {
    ElMessage.warning('模型坐标格式错误，请输入：经度,纬度,高度,旋转方向（支持正负小数）')
    return
  }

  // 3. 校验是否已暂存
  if (!isTemporarilySaved.value) {
    ElMessage.warning('请先点击「暂存」按钮保存数据后，再进行预览')
    return
  }

  // 所有校验通过，跳转预览页面
  router.push({
    path: '/screen/preview',
    query: {
      id: form.id,
      type: 'normal-edit'
    }
  })
}

</script>

<style scoped>
.add-content-container.v-else {
  display: flex;
  justify-content: center;
  align-items: center;
}

.add-content-container {
  width: 100%;
  padding: 20px;
  background-color: #f6f6f6;
  box-sizing: border-box;
  position: relative;
  min-height: 100vh;
}

.add-content {
  width: 100%;
  max-height: calc(100vh - 60px);
  overflow-y: auto;
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

.operation-group {
  display: flex;
  gap: 15px;
  align-items: center;
  flex-wrap: wrap;
  margin: 0;
  /* 去掉原有上下边距 */
}

.operation-group div {
  color: #666;
  font-size: 14px;
}

.upload-container {
  display: flex;
  flex-direction: row;
  /* 改为横向排列 */
  gap: 10px;
  /* 上传按钮与操作组间距 */
  align-items: center;
  /* 垂直居中对齐 */
  width: 100%;
  flex-wrap: wrap;
  /* 自适应换行 */
}

.upload-file-uploader {
  display: inline-block;
  width: auto;
  text-align: left !important;
}

.upload-file-list {
  width: 100%;
  box-sizing: border-box;
  padding-left: 0;
  margin: 0;
  list-style: none;
}

.ele-upload-list__item-content {
  display: flex;
  align-items: center;
  border: none;
  /* 移除边框 */
  border-radius: 0;
  /* 去掉圆角 */
  width: 100%;
  box-sizing: border-box;
  padding: 0;
  /* 去掉内边距 */
  margin-bottom: 8px;
  /* 仅保留上下文件项间距 */
  gap: 10px;
  /* 文件名与删除按钮间距 */
}

.ele-upload-list__item-content .el-link {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding-right: 0;
  /* 去掉右侧内边距 */
  font-size: 14px;
  /* 统一字体大小 */
}

.ele-upload-list__item-content .el-icon-document {
  margin-right: 5px;
  vertical-align: middle;
}

.ele-upload-list__item-content-action {
  flex-shrink: 0;
  width: auto;
  text-align: right;
}

.ele-upload-list__item-content-action .el-button {
  padding: 0 5px;
  min-width: auto;
  white-space: nowrap;
  font-size: 14px;
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