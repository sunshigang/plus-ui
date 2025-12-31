<template>
  <div class="add-content-container" v-if="declartionInformation">
    <div class="add-content">
      <div class="back-normal" @click="cancel"><img src="@/assets/images/arrow-left.png" />信息填报</div>
      <div class="project-basic-info">
        <h3 class="section-title">项目基础信息</h3>
        <el-form ref="basicFormRef" :model="form" label-width="240px" :rules="rules" status-icon>
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
            <img class="imgModel" src="@/assets/images/model.png" />三维场景效果预览
          </el-button>
        </div>
        <el-form ref="infoFormRef" :model="form" label-width="240px" :rules="rules" status-icon>
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
              <el-form-item label="涉及风景区地上建筑面积(㎡)" prop="scenicGroundArea">
                <el-input v-model="form.scenicGroundArea" placeholder="请输入风景区地上建筑面积" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="涉及风景区地下建筑面积(㎡)" prop="scenicUndergroundArea">
                <el-input v-model="form.scenicUndergroundArea" placeholder="请输入风景区地下建筑面积" />
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
              <el-upload ref="redLineCoordinateUploadRef" multiple :action="redLineUploadUrl"
                :before-upload="(file) => handleBeforeUpload(file, 'redLineCoordinate')"
                :file-list="redLineCoordinateFileList" :limit="props.limit" accept=".zip"
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
                    class="upload-file-uploader" :disabled="props.compDisabled"
                    :on-progress="(progressEvent, file) => handleUploadProgress(progressEvent, file, 'threeDModel')">
                    <el-button type="primary">点击上传</el-button>
                  </el-upload>
                  <div class="operation-group">
                    <el-button link type="primary" icon="Download"
                      @click="handleDownloadTemplate('threeD')">模型规范与模板下载</el-button>
                  </div>
                  <!-- 三维模型上传进度条 -->
                  <div v-for="(item, index) in threeDModelUploadProgress" :key="`progress-${index}-${item.fileName}`"
                    class="upload-progress-container">
                    <div class="progress-file-name">{{ item.fileName }}<span v-if="item.progressText"
                        class="progress-text">{{ item.progressText }}</span></div>
                    <el-progress :percentage="item.progress" :status="item.status" :stroke-width="6"
                      class="upload-progress-bar" />
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
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="800px" center class="validation-dialog"
      destroy-on-close>
      <div class="validation-content">
        <!-- 验证通过提示 -->
        <div v-if="dialogErrors.length === 0" class="success-tip">
          ✅ 数据验证通过，无错误信息
        </div>
        <!-- 验证失败错误列表 -->
        <div v-else class="error-list">
          <div v-for="(error, index) in dialogErrors" :key="index" class="error-item">
            {{ index + 1 }}. 报错字段【{{ error.fieldName || '未知字段' }}】报错信息：{{ error.errorMessage }}
          </div>
        </div>
      </div>
    </el-dialog>
    <div class="add-footer">
      <el-button @click="cancel">取消</el-button>
      <el-button type="warning" @click="resetForm">重置</el-button>
      <el-button type="success" v-hasPermi="['project:project:stage']" @click="temporarilyForm">暂存</el-button>
      <el-button :loading="buttonLoading" type="primary" @click="submitForm">提交</el-button>
    </div>
  </div>
  <div class="add-content-container" v-else>
    <div class="popup-content">
      <img src="@/assets/images/tick.png" class="success-icon" />
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
// 三维模型上传进度条状态管理
const threeDModelUploadProgress = ref([])
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
  compDisabled: {
    type: Boolean,
    default: false
  }
});
// ========== 新增：SHP验证弹窗相关数据 ==========
const dialogVisible = ref(false) // 弹窗显隐
const dialogTitle = ref('')      // 弹窗标题
const dialogErrors = ref([])     // 验证错误列表
// ==============================================
const basicFormRef = ref(null)
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
  applicantType: '单位',
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
  majorFlag: false,
  scenicGroundArea: undefined,
  scenicUndergroundArea: undefined,
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
// 项目用途白名单（严格匹配你的要求）
const projectUsageWhiteList = [
  '公路', '铁路', '机场', '水利水电', '电力通讯', '油气管网',
  '科技、教育', '公用设施', '乡村道路', '保障性住房或移民搬迁',
  '农民自建基本生产生活房舍', '商业服务业', '物流仓储', '旅游开发',
  '养殖', '滑雪场', '林业生产经营、科研科普服务设施', '其他'
]
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
    {
      pattern: /^(1[3-9]\d{9}|0\d{2,3}-\d{7,8})$/,
      message: '请输入正确的手机号码或固话（如010-12345678）',
      trigger: 'blur'
    }
  ],
  protectionLevel: [{ required: true, message: '请选择保护区等级', trigger: 'change' }],
  projectType: [{ required: true, message: '请选择项目占用类型', trigger: 'change' }],
  scenicGroundArea: [
    { required: true, message: '请输入风景区地上建筑面积', trigger: 'blur' },
    {
      pattern: /^\d+(\.\d+)?$/, // 支持正整数/正小数（面积不能为负）
      message: '请输入有效的数字（支持整数或小数）',
      trigger: 'blur'
    }
  ],
  scenicUndergroundArea: [
    { required: true, message: '请输入风景区地下建筑面积', trigger: 'blur' },
    {
      pattern: /^\d+(\.\d+)?$/, // 支持正整数/正小数（面积不能为负）
      message: '请输入有效的数字（支持整数或小数）',
      trigger: 'blur'
    }
  ],
  projectUsage: [
    { required: true, message: '请输入项目用途', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        // 去除首尾空格后判断是否在白名单中
        const inputValue = value ? value.trim() : ''
        if (inputValue && !projectUsageWhiteList.includes(inputValue)) {
          callback(new Error(
            '项目用途只能输入：公路、铁路、机场、水利水电、电力通讯、油气管网、科技、教育、公用设施、乡村道路、保障性住房或移民搬迁、农民自建基本生产生活房舍、商业服务业、物流仓储、旅游开发、养殖、滑雪场、林业生产经营、科研科普服务设施、其他'
          ))
        } else {
          callback()
        }
      },
      trigger: ['blur', 'change']
    }],
  projectPurpose: [{ required: true, message: '请输入拟选位置', trigger: 'blur' }],
  projectInvestment: [
    { required: true, message: '请输入建设项目拟投资额', trigger: 'blur' },
    { pattern: /^\d+(\.\d+)?$/, message: '请输入有效的数字（支持整数或小数，金额不能为负）', trigger: 'blur' }
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
      trigger: ['change', 'blur'] // 增加上传相关触发时机
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
const redLineUploadUrl = import.meta.env.VITE_APP_BASE_API + '/resource/oss/uploadShp'
const headers = computed(() => globalHeaders())

// 获取文件接受类型
const getFileAccept = () => {
  return props.fileType.map(type => `.${type.toLowerCase()}`).join(',')
}

// 生命周期：初始化时加载数据
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
    Object.assign(form, projectData)
    form.protectionLevel = projectData.protectionLevel ? (Array.isArray(projectData.protectionLevel) ? projectData.protectionLevel : projectData.protectionLevel.split(',').filter(Boolean)) : []
    form.projectType = projectData.projectType ? (Array.isArray(projectData.projectType) ? projectData.projectType : projectData.projectType.split(',').filter(Boolean)) : []
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
        // 优化：清空旧进度条，重新初始化（避免重复）
        threeDModelUploadProgress.value = []
        threeDModelFileList.value.forEach(file => {
          threeDModelUploadProgress.value.push({
            fileName: getFileName(file.name),
            progress: 100,
            status: 'success',
            fileId: file.ossId,
            progressText: ''
          })
        })
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
  // 核心修改3：单独校验项目红线矢量数据仅允许zip格式
  if (type === 'redLineCoordinate') {
    const fileExt = file.name.split('.').pop()?.toLowerCase()
    if (fileExt !== 'zip') {
      ElMessage.error('项目红线矢量数据仅支持上传ZIP格式文件！')
      return false
    }
    return true // 跳过通用类型校验
  }
  if (type === 'threeDModel') {
    const fileName = getFileName(file.name)
    // 防止重复添加
    const exists = threeDModelUploadProgress.value.some(item => item.fileName === fileName)
    if (!exists) {
      threeDModelUploadProgress.value.push({
        fileName,
        progress: 0,
        status: undefined, // 上传中
        fileId: '',
        fileObj: file, // 保存文件对象，用于后续匹配
        progressText: '（上传中...）' // 初始化进度文本
      })
    }
  }
  return true
}

// 上传错误处理
const handleUploadError = (err, file, type) => {
  // 针对SHP上传的错误弹窗处理
  if (type === 'redLineCoordinate') {
    dialogTitle.value = 'SHP数据上传失败'
    dialogErrors.value = [{ fieldName: '上传流程', errorMessage: err.message || '上传过程中发生网络/服务器错误' }]
    dialogVisible.value = true // 强制显示弹窗
  }
  ElMessage.error(`上传失败: ${err.message || '未知错误'}`)
  // 三维模型上传失败时更新进度条状态
  if (type === 'threeDModel') {
    const fileName = getFileName(file.name)
    const existingIndex = threeDModelUploadProgress.value.findIndex(
      item => item.fileName === fileName
    )

    if (existingIndex > -1) {
      threeDModelUploadProgress.value[existingIndex] = {
        ...threeDModelUploadProgress.value[existingIndex],
        status: 'exception',
        fileObj: null
      }
    }
  }
}
const handleUploadProgress = (progressEvent, file, type) => {
  if (type !== 'threeDModel') return // 只处理三维模型上传进度
  const percent = Math.round((progressEvent.loaded / progressEvent.total) * 100)
  const fileName = getFileName(file.name)

  // 查找当前文件的进度记录
  const existingIndex = threeDModelUploadProgress.value.findIndex(
    item => item.fileName === fileName
  )
  if (existingIndex > -1) {
    const status = undefined // 始终使用合法的空状态
    const progressText = percent === 100
      ? '（服务器处理中...）'
      : '（上传中...）'
    threeDModelUploadProgress.value[existingIndex] = {
      ...threeDModelUploadProgress.value[existingIndex],
      progress: percent,
      status,
      progressText
    }
  }
}
// 上传超过限制处理
const handleExceed = (files, fileList) => {
  ElMessage.warning(`每次最多上传 ${props.limit} 个文件`)
}

// 上传成功处理
const handleUploadSuccess = (res, file, type) => {
  // 优先处理SHP（redLineCoordinate）类型的验证逻辑
  if (type === 'redLineCoordinate') {
    try {
      const validationResult = res.data?.validationResult || {}
      dialogTitle.value = validationResult.message || 'SHP数据验证结果'
      dialogErrors.value = validationResult.fieldErrors || []
      dialogVisible.value = true
      // 只有验证通过（无错误）且后端返回了资源信息，才添加到文件列表
      if (res.code === 200 && dialogErrors.value.length === 0) {
        const fileItem = {
          // 兜底：后端未返回fileName时用前端上传的文件名
          name: res.data.fileName || file.name,
          url: res.data.url || '',
          ossId: res.data.ossId || ''
        }
        redLineCoordinateFileList.value.push(fileItem)
        ElMessage.success('SHP文件上传并验证通过')
      } else {
        // 验证失败：不添加到文件列表，仅提示
        ElMessage.warning('SHP数据验证失败，请查看弹窗详情')
      }
    } catch (err) { // 捕获解析错误
      console.error('redLineCoordinate上传解析失败：', err);
      ElMessage.error('SHP数据解析失败：' + err.message);
      dialogTitle.value = '解析失败';
      dialogErrors.value = [{ fieldName: 'redLineCoordinate', errorMessage: err.message }];
      dialogVisible.value = true;
    }
    return // 终止后续通用逻辑
  }
  // 通用上传成功逻辑（其他文件类型）
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
        // 更新进度条状态为成功
        const fileName = getFileName(file.name)
        const progressIndex = threeDModelUploadProgress.value.findIndex(
          item => item.fileName === fileName || item.fileObj === file
        )
        if (progressIndex > -1) {
          threeDModelUploadProgress.value[progressIndex] = {
            fileName,
            progress: 100,
            status: 'success',
            fileId: res.data.ossId,
            fileObj: null, // 释放文件对象引用
            progressText: '' // 清空提示文本
          }
        }
        break
    }
    ElMessage.success('上传成功')
    if (basicFormRef.value) basicFormRef.value.validateField(type);
    if (infoFormRef.value) infoFormRef.value.validateField(type);
  } else {
    if (type === 'threeDModel') {
      const fileName = getFileName(file.name)
      const progressIndex = threeDModelUploadProgress.value.findIndex(
        item => item.fileName === fileName || item.fileObj === file
      )
      if (progressIndex > -1) {
        threeDModelUploadProgress.value[progressIndex] = {
          ...threeDModelUploadProgress.value[progressIndex],
          status: 'exception',
          fileObj: null,
          progressText: '' // 清空提示文本
        }
      }
    }
    ElMessage.error(res.msg || '上传失败')
  }
}

// 删除上传文件（修复：使用 ossId 而非 id）
const handleDeleteUploadFile = async (index, type) => {
  let fileList = []
  let fileId = ''
  let fileName = ''
  // 确定当前操作的文件列表和文件ID
  switch (type) {
    case 'locationPlan':
      fileList = locationPlanFileList.value;
      fileId = fileList[index]?.ossId;
      break
    case 'expertOpinions':
      fileList = expertOpinionsFileList.value;
      fileId = fileList[index]?.ossId;
      break
    case 'meetingMaterials':
      fileList = meetingMaterialsFileList.value;
      fileId = fileList[index]?.ossId;
      break
    case 'siteSelectionReport':
      fileList = siteSelectionReportFileList.value;
      fileId = fileList[index]?.ossId;
      break
    case 'approvalDocuments':
      fileList = approvalDocumentsFileList.value;
      fileId = fileList[index]?.ossId;
      break
    case 'projectRedLine':
      fileList = projectRedLineFileList.value;
      fileId = fileList[index]?.ossId;
      break
    case 'redLineCoordinate':
      fileList = redLineCoordinateFileList.value;
      fileId = fileList[index]?.ossId;
      break
    case 'threeDModel':
      fileList = threeDModelFileList.value;
      fileId = fileList[index]?.ossId;
      fileName = getFileName(fileList[index].name);
      // 移除对应的进度条（多重匹配确保准确）
      const progressIndex = threeDModelUploadProgress.value.findIndex(
        item => item.fileId === fileId || item.fileName === fileName
      )
      if (progressIndex > -1) {
        threeDModelUploadProgress.value.splice(progressIndex, 1)
      }
      break
  }
  if (fileList.length > index) {
    fileList.splice(index, 1);
  }
  if (fileId) {
    try {
      await delOss(fileId)
      ElMessage.success('文件删除成功')
    } catch (err) {
      ElMessage.warning('文件删除请求失败，可能需要手动清理')
    }
  }

  // 更新三维模型URL
  if (type === 'threeDModel' && threeDModelFileList.value.length === 0) {
    form.threeDModel = ''
  }
  if (basicFormRef.value) basicFormRef.value.validateField(type);
  if (infoFormRef.value) infoFormRef.value.validateField(type);
}

// 文件删除时触发校验（用于ElUpload的on-remove事件）
const handleFileRemove = (type) => {
  basicFormRef.value?.validateField(type)
  infoFormRef.value?.validateField(type)
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
// 下载模板
// const handleDownloadTemplate = (type) => {
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
//     proxy.$download.oss(ossId);
//   } catch (err) {
//     ElMessage.error('模板下载失败：' + (err.message || '未知错误'));
//   }
// };
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
    // ========== 重置多选字段为数组格式 ==========
    form.protectionLevel = projectData.protectionLevel
      ? (Array.isArray(projectData.protectionLevel)
        ? projectData.protectionLevel
        : projectData.protectionLevel.split(',').filter(Boolean)
      )
      : []
    form.projectType = projectData.projectType
      ? (Array.isArray(projectData.projectType)
        ? projectData.projectType
        : projectData.projectType.split(',').filter(Boolean)
      )
      : []
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
    threeDModelUploadProgress.value = threeDModelFileList.value.map(file => ({
      fileName: getFileName(file.name),
      progress: 100,
      status: 'success',
      fileId: file.ossId,
      progressText: ''
    }))
    basicFormRef.value?.clearValidate()
    infoFormRef.value?.clearValidate()
    ElMessage.success('已重置为原始数据')
  } catch (err) {
    ElMessage.error('重置失败：' + (err.message || '未知错误'))
  }
}

/** 暂存按钮 */
const temporarilyForm = async () => {
  const submitData = {
    ...form,
    protectionLevel: form.protectionLevel.join(','),
    projectType: form.projectType.join(','),
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
  basicFormRef.value.validate(async (basicValid) => {
    if (!basicValid) {
      ElMessage.warning('基础信息填写不符合要求，请检查');
      return;
    }
    infoFormRef.value.validate(async (valid) => {
      if (valid) {
        buttonLoading.value = true
        try {
          const submitData = {
            ...form,
            protectionLevel: form.protectionLevel.join(','),
            projectType: form.projectType.join(','),
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
          ElMessage.success('申报信息提交成功！');
          declartionInformation.value = false
        } catch (err) {
          proxy?.$modal.msgError("提交失败：" + (err).message || "未知错误")
        } finally {
          buttonLoading.value = false
        }
      } else {
        ElMessage.warning('建设信息填写不符合要求，请检查')
      }
    })
  })
}
// 三维模型预览
const handleModelPreview = () => {
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
  const isProcessing = threeDModelUploadProgress.value.some(item =>
    item.progress < 100 || (item.progressText?.includes('服务器处理中') ?? false)
  )
  if (isProcessing) {
    ElMessage.warning('模型文件正在上传或处理中，请等待完成后再预览')
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
.add-content-container {
  width: 100%;
  padding: 20px;
  background-color: #f6f6f6;
  box-sizing: border-box;
  position: relative;
  min-height: 91vh;
}

.add-content {
  width: 100%;
  max-height: calc(100vh - 60px);
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.add-content::-webkit-scrollbar {
  display: none;
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
}

.modelPreview .imgModel {
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
  margin: 0;
  /* 去掉原有上下边距 */
}

.operation-group div {
  color: #666;
  font-size: 14px;
}

.upload-progress-container {
  width: 50%;
  display: flex;
  gap: 6px;
}

.progress-file-name {
  font-size: 14px;
  color: #666;
  width: 70%;
}

.progress-text {
  font-size: 12px;
  color: #999;
  width: 70%;
}

.upload-progress-bar {
  width: 100% !important;
  --el-progress-text-color: #666;
  --el-progress-success-color: #67c23a;
  --el-progress-exception-color: #f56c6c;
}

:deep(.el-progress-bar) {
  width: 100% !important;
}

:deep(.el-progress__text) {
  flex: none !important;
  width: auto !important;
  margin-left: 8px !important;
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

/* ========== 新增：SHP验证弹窗样式 ========== */
.validation-dialog {
  --el-dialog-width: 800px !important;
}

/* 弹窗主体高度控制（总高600px = 标题栏~100px + 内容区500px） */
.validation-dialog :deep(.el-dialog__body) {
  height: 500px;
  padding: 24px;
  overflow-y: auto;
  /* 错误多的时候滚动 */
  box-sizing: border-box;
}

.validation-content {
  width: 100%;
  height: 100%;
}

.success-tip {
  font-size: 16px;
  color: #67c23a;
  text-align: center;
  margin-top: 40px;
}

.error-list {
  width: 100%;
}

.error-item {
  font-size: 14px;
  color: #f56c6c;
  margin-bottom: 12px;
  padding: 12px 16px;
  background-color: #fef0f0;
  border-radius: 4px;
  border-left: 4px solid #f56c6c;
}

.error-item .field-name {
  font-weight: bold;
  color: #e64942;
}

/* ========================================== */
</style>
