<template>
  <div class="add-content-container">
    <div class="add-content">
      <div class="back-normal" @click="cancel"><img src="../../../assets/images/arrow-left.png" />创建项目</div>
      <!-- 项目基础信息 -->
      <div class="project-basic-info">
        <h3 class="section-title">项目基础信息</h3>
        <el-form ref="infoFormRef" :model="form" label-width="230px" :rules="rules">
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
        <el-form :model="form" label-width="230px">
          <!-- 建设信息表单内容 -->
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
                <el-select v-model="form.protectionLevel" placeholder="请选择涉及到的保护区等级，可多选" multiple>
                  <el-option label="一级保护区" value="一级保护区"></el-option>
                  <el-option label="二级保护区" value="二级保护区"></el-option>
                  <el-option label="三级保护区" value="三级保护区"></el-option>
                  <el-option label="一级保护区（非核心景区）" value="一级保护区（非核心景区）"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="项目占用类型" prop="projectType">
                <el-select v-model="form.projectType" placeholder="请选择项目占用类型，可多选" multiple>
                  <el-option label="长期" value="长期"></el-option>
                  <el-option label="临时" value="临时"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="项目用途" prop="projectUsage">
                <el-input v-model="form.projectUsage"
                  placeholder="请输入项目用途，例如：旅游开发、公路、铁路、机场、水利水电、电力通讯、防灾减灾、公用设施、其他......" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="拟选位置" prop="projectPurpose">
                <el-input v-model="form.projectPurpose" placeholder="请输入拟选位置" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="建设项目拟投资额（万元）" prop="projectInvestment">
            <el-input v-model="form.projectInvestment" placeholder="请输入建设项目总投资额" />
          </el-form-item>
          <el-form-item label="规划依据" prop="planningBasis">
            <el-input v-model="form.planningBasis" type="textarea"
              placeholder="请输入规划依据，如**风景名胜区总体规划**景区详细规划。（没有纳入风景名胜区规划的自然灾害修复、国防建设等特殊类项目，或符合专项规划的交通、店里、通讯等国家或省重点基础建设项目，需说明有关情况）" />
          </el-form-item>
          <el-form-item label="建设内容涉及规模" prop="constructionContent">
            <el-input v-model="form.constructionContent" type="textarea"
              placeholder="请输入涉及的具体建设内容，规模信息包括项目用地面积、线性工程长度及配套设施占地、构筑物规模、建筑限高、停车位指标等，若有涉及新建、改造、保留的情况，应分别注明相关指标" />
          </el-form-item>
          <el-form-item label="其他需要说明的情况" prop="otherExplanations">
            <el-input v-model="form.otherExplanations" type="textarea" placeholder="请输入其他需要说明的情况" />
          </el-form-item>

          <!-- 文件上传区域 -->
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="选址方案" prop="locationPlan">
                <el-upload ref="locationPlanUploadRef" multiple :action="uploadFileUrl"
                  :before-upload="(file) => handleBeforeUpload(file, 'locationPlan')" :file-list="locationPlanFileList"
                  :limit="props.limit" :accept="getFileAccept()"
                  :on-error="(err, file) => handleUploadError(err, file, 'locationPlan')" :on-exceed="handleExceed"
                  :on-success="(res, file) => handleUploadSuccess(res, file, 'locationPlan')" :show-file-list="false"
                  :headers="headers" class="upload-file-uploader" :disabled="props.compDisabled">
                  <el-button type="primary">点击上传</el-button>
                </el-upload>
                <transition-group class="upload-file-list el-upload-list el-upload-list--text" name="el-fade-in-linear"
                  tag="ul">
                  <li v-for="(file, index) in locationPlanFileList" :key="file.ossId"
                    class="el-upload-list__item ele-upload-list__item-content">
                    <el-link :href="`${file.url}`" :underline="false" target="_blank">
                      <span class="el-icon-document"> {{ getFileName(file.name) }} </span>
                    </el-link>
                    <div class="ele-upload-list__item-content-action" v-if="!props.compDisabled">
                      <el-button type="danger" link @click="handleDeleteUploadFile(index, 'locationPlan')">
                        删除
                      </el-button>
                    </div>
                  </li>
                </transition-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="专家评审意见" prop="expertOpinions">
                <el-upload ref="expertOpinionsUploadRef" multiple :action="uploadFileUrl"
                  :before-upload="(file) => handleBeforeUpload(file, 'expertOpinions')"
                  :file-list="expertOpinionsFileList" :limit="props.limit" :accept="getFileAccept()"
                  :on-error="(err, file) => handleUploadError(err, file, 'expertOpinions')" :on-exceed="handleExceed"
                  :on-success="(res, file) => handleUploadSuccess(res, file, 'expertOpinions')" :show-file-list="false"
                  :headers="headers" class="upload-file-uploader" :disabled="props.compDisabled">
                  <el-button type="primary">点击上传</el-button>
                </el-upload>
                <transition-group class="upload-file-list el-upload-list el-upload-list--text" name="el-fade-in-linear"
                  tag="ul">
                  <li v-for="(file, index) in expertOpinionsFileList" :key="file.ossId"
                    class="el-upload-list__item ele-upload-list__item-content">
                    <el-link :href="`${file.url}`" :underline="false" target="_blank">
                      <span class="el-icon-document"> {{ getFileName(file.name) }} </span>
                    </el-link>
                    <div class="ele-upload-list__item-content-action" v-if="!props.compDisabled">
                      <el-button type="danger" link @click="handleDeleteUploadFile(index, 'expertOpinions')">
                        删除
                      </el-button>
                    </div>
                  </li>
                </transition-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="公示材料" prop="meetingMaterials">
                <el-upload ref="meetingMaterialsUploadRef" multiple :action="uploadFileUrl"
                  :before-upload="(file) => handleBeforeUpload(file, 'meetingMaterials')"
                  :file-list="meetingMaterialsFileList" :limit="props.limit" :accept="getFileAccept()"
                  :on-error="(err, file) => handleUploadError(err, file, 'meetingMaterials')" :on-exceed="handleExceed"
                  :on-success="(res, file) => handleUploadSuccess(res, file, 'meetingMaterials')"
                  :show-file-list="false" :headers="headers" class="upload-file-uploader"
                  :disabled="props.compDisabled">
                  <el-button type="primary">点击上传</el-button>
                </el-upload>
                <transition-group class="upload-file-list el-upload-list el-upload-list--text" name="el-fade-in-linear"
                  tag="ul">
                  <li v-for="(file, index) in meetingMaterialsFileList" :key="file.ossId"
                    class="el-upload-list__item ele-upload-list__item-content">
                    <el-link :href="`${file.url}`" :underline="false" target="_blank">
                      <span class="el-icon-document"> {{ getFileName(file.name) }} </span>
                    </el-link>
                    <div class="ele-upload-list__item-content-action" v-if="!props.compDisabled">
                      <el-button type="danger" link @click="handleDeleteUploadFile(index, 'meetingMaterials')">
                        删除
                      </el-button>
                    </div>
                  </li>
                </transition-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="选址方案核准申报表" prop="siteSelectionReport">
                <el-upload ref="siteSelectionReportUploadRef" multiple :action="uploadFileUrl"
                  :before-upload="(file) => handleBeforeUpload(file, 'siteSelectionReport')"
                  :file-list="siteSelectionReportFileList" :limit="props.limit" :accept="getFileAccept()"
                  :on-error="(err, file) => handleUploadError(err, file, 'siteSelectionReport')"
                  :on-exceed="handleExceed"
                  :on-success="(res, file) => handleUploadSuccess(res, file, 'siteSelectionReport')"
                  :show-file-list="false" :headers="headers" class="upload-file-uploader"
                  :disabled="props.compDisabled">
                  <el-button type="primary">点击上传</el-button>
                </el-upload>
                <transition-group class="upload-file-list el-upload-list el-upload-list--text" name="el-fade-in-linear"
                  tag="ul">
                  <li v-for="(file, index) in siteSelectionReportFileList" :key="file.ossId"
                    class="el-upload-list__item ele-upload-list__item-content">
                    <el-link :href="`${file.url}`" :underline="false" target="_blank">
                      <span class="el-icon-document"> {{ getFileName(file.name) }} </span>
                    </el-link>
                    <div class="ele-upload-list__item-content-action" v-if="!props.compDisabled">
                      <el-button type="danger" link @click="handleDeleteUploadFile(index, 'siteSelectionReport')">
                        删除
                      </el-button>
                    </div>
                  </li>
                </transition-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="立项文件" prop="approvalDocuments">
                <el-upload ref="approvalDocumentsUploadRef" multiple :action="uploadFileUrl"
                  :before-upload="(file) => handleBeforeUpload(file, 'approvalDocuments')"
                  :file-list="approvalDocumentsFileList" :limit="props.limit" :accept="getFileAccept()"
                  :on-error="(err, file) => handleUploadError(err, file, 'approvalDocuments')" :on-exceed="handleExceed"
                  :on-success="(res, file) => handleUploadSuccess(res, file, 'approvalDocuments')"
                  :show-file-list="false" :headers="headers" class="upload-file-uploader"
                  :disabled="props.compDisabled">
                  <el-button type="primary">点击上传</el-button>
                </el-upload>
                <transition-group class="upload-file-list el-upload-list el-upload-list--text" name="el-fade-in-linear"
                  tag="ul">
                  <li v-for="(file, index) in approvalDocumentsFileList" :key="file.ossId"
                    class="el-upload-list__item ele-upload-list__item-content">
                    <el-link :href="`${file.url}`" :underline="false" target="_blank">
                      <span class="el-icon-document"> {{ getFileName(file.name) }} </span>
                    </el-link>
                    <div class="ele-upload-list__item-content-action" v-if="!props.compDisabled">
                      <el-button type="danger" link @click="handleDeleteUploadFile(index, 'approvalDocuments')">
                        删除
                      </el-button>
                    </div>
                  </li>
                </transition-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="项目用地红线图" prop="projectRedLine">
                <el-upload ref="projectRedLineUploadRef" multiple :action="uploadFileUrl"
                  :before-upload="(file) => handleBeforeUpload(file, 'projectRedLine')"
                  :file-list="projectRedLineFileList" :limit="props.limit" :accept="getFileAccept()"
                  :on-error="(err, file) => handleUploadError(err, file, 'projectRedLine')" :on-exceed="handleExceed"
                  :on-success="(res, file) => handleUploadSuccess(res, file, 'projectRedLine')" :show-file-list="false"
                  :headers="headers" class="upload-file-uploader" :disabled="props.compDisabled">
                  <el-button type="primary">点击上传</el-button>
                </el-upload>
                <transition-group class="upload-file-list el-upload-list el-upload-list--text" name="el-fade-in-linear"
                  tag="ul">
                  <li v-for="(file, index) in projectRedLineFileList" :key="file.ossId"
                    class="el-upload-list__item ele-upload-list__item-content">
                    <el-link :href="`${file.url}`" :underline="false" target="_blank">
                      <span class="el-icon-document"> {{ getFileName(file.name) }} </span>
                    </el-link>
                    <div class="ele-upload-list__item-content-action" v-if="!props.compDisabled">
                      <el-button type="danger" link @click="handleDeleteUploadFile(index, 'projectRedLine')">
                        删除
                      </el-button>
                    </div>
                  </li>
                </transition-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="项目红线矢量数据" prop="redLineCoordinate">
            <el-upload ref="redLineCoordinateUploadRef" multiple :action="uploadFileUrl"
              :before-upload="(file) => handleBeforeUpload(file, 'redLineCoordinate')"
              :file-list="redLineCoordinateFileList" :limit="props.limit" :accept="getFileAccept()"
              :on-error="(err, file) => handleUploadError(err, file, 'redLineCoordinate')" :on-exceed="handleExceed"
              :on-success="(res, file) => handleUploadSuccess(res, file, 'redLineCoordinate')" :show-file-list="false"
              :headers="headers" class="upload-file-uploader" :disabled="props.compDisabled">
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
                <el-link :href="`${file.url}`" :underline="false" target="_blank">
                  <span class="el-icon-document"> {{ getFileName(file.name) }} </span>
                </el-link>
                <div class="ele-upload-list__item-content-action" v-if="!props.compDisabled">
                  <el-button type="danger" link @click="handleDeleteUploadFile(index, 'redLineCoordinate')">
                    删除
                  </el-button>
                </div>
              </li>
            </transition-group>
          </el-form-item>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="项目三维模型" prop="threeDModel">
                <el-upload ref="threeDModelUploadRef" multiple :action="uploadFileUrl"
                  :before-upload="(file) => handleBeforeUpload(file, 'threeDModel')" :file-list="threeDModelFileList"
                  :limit="props.limit" :accept="getFileAccept()"
                  :on-error="(err, file) => handleUploadError(err, file, 'threeDModel')" :on-exceed="handleExceed"
                  :on-success="(res, file) => handleUploadSuccess(res, file, 'threeDModel')" :show-file-list="false"
                  :headers="headers" class="upload-file-uploader" :disabled="props.compDisabled">
                  <el-button type="primary">点击上传</el-button>
                </el-upload>
                <div class="operation-group">
                  <el-button link type="primary" icon="Download"
                    @click="handleDownloadTemplate('threeD')">模型规范与模板下载</el-button>
                </div>
                <transition-group class="upload-file-list el-upload-list el-upload-list--text" name="el-fade-in-linear"
                  tag="ul">
                  <li v-for="(file, index) in threeDModelFileList" :key="file.ossId"
                    class="el-upload-list__item ele-upload-list__item-content">
                    <el-link :href="`${file.url}`" :underline="false" target="_blank">
                      <span class="el-icon-document"> {{ getFileName(file.name) }} </span>
                    </el-link>
                    <div class="ele-upload-list__item-content-action" v-if="!props.compDisabled">
                      <el-button type="danger" link @click="handleDeleteUploadFile(index, 'threeDModel')">
                        删除
                      </el-button>
                    </div>
                  </li>
                </transition-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="模型坐标" prop="modelCoordinate">
                <el-input v-model="form.modelCoordinate" placeholder="请输入模型坐标格式为：经度,纬度,高度,旋转方向" />
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
      <el-button :loading="buttonLoading" type="primary" @click="submitForm">确定</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import { stageInfo, addInfo } from '@/api/project/normal/index';
import { delOss, listByIds } from '@/api/system/oss';
import { getUserProfile } from '@/api/system/user/index';
import { useUserStore } from '@/store/modules/user'
import { propTypes } from '@/utils/propTypes';
import { globalHeaders } from '@/utils/request';
import { ElMessage } from 'element-plus'
const { proxy } = getCurrentInstance() || {}
const router = useRouter()
// 初始化 Pinia 实例
const userStore = useUserStore()

// 定义组件属性
const props = defineProps({
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

});

// 表单引用
const infoFormRef = ref(null)
// 按钮加载状态
const buttonLoading = ref(false)

// 组件状态
const form = reactive({
  id: undefined,
  projectName: undefined,
  projectCode: undefined,
  administrativeRegion: undefined,
  scenicArea: undefined,
  applicantType: '单位', // 默认单位
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
})

// 表单验证规则
const rules = reactive({
  projectName: [{ required: true, message: '请输入建设项目名称', trigger: 'blur' }],
  administrativeRegion: [{ required: true, message: '请输入所属行政区划', trigger: 'blur' }],
  applicantType: [{ required: true, message: '请选择建设类型', trigger: 'change' }],
  constructionUnit: [{ required: true, message: '请输入建设单位名称', trigger: 'blur' }],
  contactPerson: [{ required: true, message: '请输入经办人', trigger: 'blur' }],
  contactPhone: [{
    required: true,
    message: '请输入经办人联系方式',
    trigger: 'blur'
  }, {
    pattern: /^1[3-9]\d{9}$/,
    message: '请输入正确的手机号码',
    trigger: 'blur'
  }]
})

// 所有文件列表
const locationPlanFileList = ref([])
const expertOpinionsFileList = ref([])
const meetingMaterialsFileList = ref([])
const siteSelectionReportFileList = ref([])
const approvalDocumentsFileList = ref([])
const projectRedLineFileList = ref([])
const redLineCoordinateFileList = ref([])
const threeDModelFileList = ref([])

// 上传相关配置
const uploadFileUrl = import.meta.env.VITE_APP_BASE_API + '/resource/oss/upload'
const headers = ref(globalHeaders())

// 获取文件接受类型
const getFileAccept = () => {
  return props.fileType.map(type => `.${type.toLowerCase()}`).join(',')
}

// 生命周期：初始化时从 Store 读取数据
onMounted(() => {

})

// 上传前置校验
const handleBeforeUpload = (file, type) => {
  // 验证文件大小
  const isLtMaxSize = file.size / 1024 / 1024 < props.fileSize
  if (!isLtMaxSize) {
    ElMessage.error(`文件大小不能超过 ${props.fileSize}MB!`)
    return false
  }

  // 验证文件类型
  const fileExt = file.name.split('.').pop()?.toLowerCase()
  if (!props.fileType.includes(fileExt)) {
    ElMessage.error(`不支持的文件类型，请上传${props.fileType.join(',')}格式的文件`)
    return false
  }

  return true
}
const getFileName = (name) => {
  // 处理name为null/undefined的情况
  if (!name) return '未知文件名'
  // 处理路径分隔符（兼容windows和unix）
  const separatorIndex = Math.max(name.lastIndexOf('/'), name.lastIndexOf('\\'))
  return separatorIndex > -1 ? name.slice(separatorIndex + 1) : name
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
    // 根据类型更新对应文件列表
    const fileItem = {
      name: res.data.fileName,
      url: res.data.url,
      ossId: res.data.ossId
    }

    switch (type) {
      case 'locationPlan':
        locationPlanFileList.value.push(fileItem)
        break
      case 'expertOpinions':
        expertOpinionsFileList.value.push(fileItem)
        break
      case 'meetingMaterials':
        meetingMaterialsFileList.value.push(fileItem)
        break
      case 'siteSelectionReport':
        siteSelectionReportFileList.value.push(fileItem)
        break
      case 'approvalDocuments':
        approvalDocumentsFileList.value.push(fileItem)
        break
      case 'projectRedLine':
        projectRedLineFileList.value.push(fileItem)
        break
      case 'redLineCoordinate':
        redLineCoordinateFileList.value.push(fileItem)
        break
      case 'threeDModel':
        threeDModelFileList.value.push(fileItem)
        form.threeDModel = res.url // 保存三维模型URL
        break
    }
    ElMessage.success('上传成功')
  } else {
    ElMessage.error(res.msg || '上传失败')
  }
}

// 删除上传文件
const handleDeleteUploadFile = (index, type) => {
  switch (type) {
    case 'locationPlan':
      locationPlanFileList.value.splice(index, 1)
      break
    case 'expertOpinions':
      expertOpinionsFileList.value.splice(index, 1)
      break
    case 'meetingMaterials':
      meetingMaterialsFileList.value.splice(index, 1)
      break
    case 'siteSelectionReport':
      siteSelectionReportFileList.value.splice(index, 1)
      break
    case 'approvalDocuments':
      approvalDocumentsFileList.value.splice(index, 1)
      break
    case 'projectRedLine':
      projectRedLineFileList.value.splice(index, 1)
      break
    case 'redLineCoordinate':
      redLineCoordinateFileList.value.splice(index, 1)
      break
    case 'threeDModel':
      threeDModelFileList.value.splice(index, 1)
      if (threeDModelFileList.value.length === 0) {
        form.threeDModel = undefined
      }
      break
  }
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
/** 取消按钮 */
const cancel = async () => {
  router.push('/project/major')
}
/** 重置按钮 */
const resetForm = () => {
  infoFormRef.value?.resetFields()
  // 清空所有文件列表
  locationPlanFileList.value = []
  expertOpinionsFileList.value = []
  meetingMaterialsFileList.value = []
  siteSelectionReportFileList.value = []
  approvalDocumentsFileList.value = []
  projectRedLineFileList.value = []
  redLineCoordinateFileList.value = []
  threeDModelFileList.value = []
  // 重置表单对象
  Object.keys(form).forEach(key => {
    if (key === 'protectionLevel' || key === 'projectType') {
      form[key] = []
    } else if (key !== 'applicantType' && key !== 'majorFlag') {
      form[key] = undefined
    }
  })
}

/** 暂存按钮 */
const temporarilyForm = async () => {
  // 准备提交数据（包含文件信息）
  const submitData = {
    ...form,
    protectionLevel: form.protectionLevel.join(','),
    projectType: form.projectType.join(','),
    // 附加文件列表
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
}

/** 提交按钮 */
const submitForm = () => {
  infoFormRef.value?.validate(async (valid) => {
    if (valid) {
      buttonLoading.value = true
      try {
        // 准备提交数据（包含文件信息）
        const submitData = {
          ...form,
          protectionLevel: form.protectionLevel.join(','),
          projectType: form.projectType.join(','),
          // 附加文件列表
          locationPlan: JSON.stringify(locationPlanFileList.value),
          expertOpinions: JSON.stringify(expertOpinionsFileList.value),
          meetingMaterials: JSON.stringify(meetingMaterialsFileList.value),
          siteSelectionReport: JSON.stringify(siteSelectionReportFileList.value),
          approvalDocuments: JSON.stringify(approvalDocumentsFileList.value),
          projectRedLine: JSON.stringify(projectRedLineFileList.value),
          redLineCoordinate: JSON.stringify(redLineCoordinateFileList.value),
          threeDModel: JSON.stringify(threeDModelFileList.value),
        }
        await addInfo(submitData)
        proxy?.$modal.msgSuccess("提交成功")
        // 提交成功后返回列表页
        router.push('/project/major')
      } catch (err) {
        proxy?.$modal.msgError("提交失败：" + (err).message || "未知错误")
      } finally {
        buttonLoading.value = false
      }
    }
  })
}

// 三维模型预览
const handleModelPreview = () => {
  if (!form.threeDModel && threeDModelFileList.value.length === 0) {
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
  router.push({
    path: '/screen/preview',
    query: {
      id: form.id,
      type: 'major-add'
    }
  })
}

// 暴露组件接口
defineExpose({
  open: (row) => {
    if (row) {
      Object.assign(form, row)
      if (row.locationPlan) locationPlanFileList.value = [...row.locationPlan]
      if (row.expertOpinions) expertOpinionsFileList.value = [...row.expertOpinions]
      if (row.meetingMaterials) meetingMaterialsFileList.value = [...row.meetingMaterials]
      if (row.siteSelectionReport) siteSelectionReportFileList.value = [...row.siteSelectionReport]
      if (row.approvalDocuments) approvalDocumentsFileList.value = [...row.approvalDocuments]
      if (row.projectRedLine) projectRedLineFileList.value = [...row.projectRedLine]
      if (row.redLineCoordinate) redLineCoordinateFileList.value = [...row.redLineCoordinate]
      if (row.threeDModel) threeDModelFileList.value = [...row.threeDModel]
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

.upload-file-list {
  margin-top: 10px;
}

.ele-upload-list__item-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 10px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  margin-bottom: 5px;
}

.ele-upload-list__item-content-action {
  margin-left: 10px;
}

.operation-group {
  margin-top: 10px;
  margin-bottom: 15px;
  display: flex;
  gap: 15px;
  align-items: center;
  flex-wrap: wrap;
}

.operation-group div {
  color: #666;
  font-size: 18px;
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