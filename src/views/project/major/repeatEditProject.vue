<template>
  <div class="add-content-container" v-if="showSuccessPopup">
    <div class="add-content">
      <div class="back-normal" @click="handleCancel"><img src="../../../assets/images/arrow-left.png" />二次填报</div>
      <el-tabs v-model="activeTab" @tab-change="handleTabChange">
        <!-- 信息填报标签页（可编辑） -->
        <el-tab-pane label="信息填报" name="fill">
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
            <el-form ref="infoFormRef2" :model="form" label-width="230px" :rules="rules">
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

              <!-- 文件上传区域（可删除、重新上传） -->
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="选址方案" prop="locationPlan">
                    <el-upload ref="locationPlanUploadRef" multiple :action="uploadFileUrl"
                      :before-upload="(file) => handleBeforeUpload(file, 'locationPlan')"
                      :file-list="locationPlanFileList" :limit="props.limit" :accept="getFileAccept()"
                      :on-error="(err, file) => handleUploadError(err, file, 'locationPlan')" :on-exceed="handleExceed"
                      :on-success="(res, file) => handleUploadSuccess(res, file, 'locationPlan')"
                      :on-remove="() => handleFileRemove('locationPlan')" :show-file-list="false" :headers="headers"
                      class="upload-file-uploader">
                      <el-button type="primary">点击上传</el-button>
                    </el-upload>
                    <transition-group class="upload-file-list el-upload-list el-upload-list--text"
                      name="el-fade-in-linear" tag="ul">
                      <li v-for="(file, index) in locationPlanFileList" :key="file.ossId"
                        class="el-upload-list__item ele-upload-list__item-content">
                        <el-link :href="`${file.url}`" :underline="false" target="_blank">
                          <span class="el-icon-document"> {{ getFileName(file.name) }} </span>
                        </el-link>
                        <div class="ele-upload-list__item-content-action">
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
                      :on-error="(err, file) => handleUploadError(err, file, 'expertOpinions')"
                      :on-exceed="handleExceed"
                      :on-success="(res, file) => handleUploadSuccess(res, file, 'expertOpinions')"
                      :on-remove="() => handleFileRemove('expertOpinions')" :show-file-list="false" :headers="headers"
                      class="upload-file-uploader">
                      <el-button type="primary">点击上传</el-button>
                    </el-upload>
                    <transition-group class="upload-file-list el-upload-list el-upload-list--text"
                      name="el-fade-in-linear" tag="ul">
                      <li v-for="(file, index) in expertOpinionsFileList" :key="file.ossId"
                        class="el-upload-list__item ele-upload-list__item-content">
                        <el-link :href="`${file.url}`" :underline="false" target="_blank">
                          <span class="el-icon-document"> {{ getFileName(file.name) }} </span>
                        </el-link>
                        <div class="ele-upload-list__item-content-action">
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
                      :on-error="(err, file) => handleUploadError(err, file, 'meetingMaterials')"
                      :on-exceed="handleExceed"
                      :on-success="(res, file) => handleUploadSuccess(res, file, 'meetingMaterials')"
                      :on-remove="() => handleFileRemove('meetingMaterials')" :show-file-list="false" :headers="headers"
                      class="upload-file-uploader">
                      <el-button type="primary">点击上传</el-button>
                    </el-upload>
                    <transition-group class="upload-file-list el-upload-list el-upload-list--text"
                      name="el-fade-in-linear" tag="ul">
                      <li v-for="(file, index) in meetingMaterialsFileList" :key="file.ossId"
                        class="el-upload-list__item ele-upload-list__item-content">
                        <el-link :href="`${file.url}`" :underline="false" target="_blank">
                          <span class="el-icon-document"> {{ getFileName(file.name) }} </span>
                        </el-link>
                        <div class="ele-upload-list__item-content-action">
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
                      :on-remove="() => handleFileRemove('siteSelectionReport')" :show-file-list="false"
                      :headers="headers" class="upload-file-uploader">
                      <el-button type="primary">点击上传</el-button>
                    </el-upload>
                    <transition-group class="upload-file-list el-upload-list el-upload-list--text"
                      name="el-fade-in-linear" tag="ul">
                      <li v-for="(file, index) in siteSelectionReportFileList" :key="file.ossId"
                        class="el-upload-list__item ele-upload-list__item-content">
                        <el-link :href="`${file.url}`" :underline="false" target="_blank">
                          <span class="el-icon-document"> {{ getFileName(file.name) }} </span>
                        </el-link>
                        <div class="ele-upload-list__item-content-action">
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
                      :on-error="(err, file) => handleUploadError(err, file, 'approvalDocuments')"
                      :on-exceed="handleExceed"
                      :on-success="(res, file) => handleUploadSuccess(res, file, 'approvalDocuments')"
                      :show-file-list="false" :headers="headers" class="upload-file-uploader">
                      <el-button type="primary">点击上传</el-button>
                    </el-upload>
                    <transition-group class="upload-file-list el-upload-list el-upload-list--text"
                      name="el-fade-in-linear" tag="ul">
                      <li v-for="(file, index) in approvalDocumentsFileList" :key="file.ossId"
                        class="el-upload-list__item ele-upload-list__item-content">
                        <el-link :href="`${file.url}`" :underline="false" target="_blank">
                          <span class="el-icon-document"> {{ getFileName(file.name) }} </span>
                        </el-link>
                        <div class="ele-upload-list__item-content-action">
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
                      :on-error="(err, file) => handleUploadError(err, file, 'projectRedLine')"
                      :on-exceed="handleExceed"
                      :on-success="(res, file) => handleUploadSuccess(res, file, 'projectRedLine')"
                      :on-remove="() => handleFileRemove('projectRedLine')" :show-file-list="false" :headers="headers"
                      class="upload-file-uploader">
                      <el-button type="primary">点击上传</el-button>
                    </el-upload>
                    <transition-group class="upload-file-list el-upload-list el-upload-list--text"
                      name="el-fade-in-linear" tag="ul">
                      <li v-for="(file, index) in projectRedLineFileList" :key="file.ossId"
                        class="el-upload-list__item ele-upload-list__item-content">
                        <el-link :href="`${file.url}`" :underline="false" target="_blank">
                          <span class="el-icon-document"> {{ getFileName(file.name) }} </span>
                        </el-link>
                        <div class="ele-upload-list__item-content-action">
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
                  :on-success="(res, file) => handleUploadSuccess(res, file, 'redLineCoordinate')"
                  :on-remove="() => handleFileRemove('redLineCoordinate')" :show-file-list="false" :headers="headers"
                  class="upload-file-uploader">
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
                    <div class="ele-upload-list__item-content-action">
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
                      :before-upload="(file) => handleBeforeUpload(file, 'threeDModel')"
                      :file-list="threeDModelFileList" :limit="props.limit" :accept="getFileAccept()"
                      :on-error="(err, file) => handleUploadError(err, file, 'threeDModel')" :on-exceed="handleExceed"
                      :on-success="(res, file) => handleUploadSuccess(res, file, 'threeDModel')"
                      :on-remove="() => handleFileRemove('threeDModel')" :show-file-list="false" :headers="headers"
                      class="upload-file-uploader">
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
                        <el-link :href="`${file.url}`" :underline="false" target="_blank">
                          <span class="el-icon-document"> {{ getFileName(file.name) }} </span>
                        </el-link>
                        <div class="ele-upload-list__item-content-action">
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
        </el-tab-pane>
        <el-tab-pane label="审批反馈" name="feedback">
          <!-- 审批反馈标签页内的项目信息部分 -->
          <div class="project-info">
            <h3 class="section-title">项目信息</h3>

            <!-- 基础信息（自定义折叠） -->
            <div class="custom-collapse-item">
              <div class="custom-collapse-header" @click="toggleBasicInfo">
                <img v-if="basicInfoVisible" class="arrow-icon" src="../../../assets/images/arrow-down.png" />
                <img v-else class="arrow-icon" src="../../../assets/images/arrow-right.png" />
                <span class="collapse-title">基础信息</span>
              </div>
              <div class="custom-collapse-content" v-if="basicInfoVisible">
                <!-- 基础信息内容 -->
                <div class="info-content">
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <div class="info-item">
                        <span class="label">建设活动（建设项目）名称：</span>
                        <span class="value">{{ form.projectName || '暂无' }}</span>
                      </div>
                    </el-col>
                    <el-col :span="12">
                      <div class="info-item">
                        <span class="label">项目代码：</span>
                        <span class="value">{{ form.projectCode || '暂无' }}</span>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <div class="info-item">
                        <span class="label">所属行政区划：</span>
                        <span class="value">{{ form.administrativeRegion || '暂无' }}</span>
                      </div>
                    </el-col>
                    <el-col :span="12">
                      <div class="info-item">
                        <span class="label">涉及风景名胜区名称：</span>
                        <span class="value">{{ form.scenicArea || '暂无' }}</span>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <div class="info-item">
                        <span class="label">单位建设/个人建设：</span>
                        <span class="value">{{ form.applicantType || '暂无' }}</span>
                      </div>
                    </el-col>
                    <el-col :span="12">
                      <div class="info-item">
                        <span class="label">一般/重点项目：</span>
                        <span class="value">{{ form.majorFlag ? '重大项目' : '一般项目' }}</span>
                      </div>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </div>

            <!-- 建设信息（自定义折叠 + 三维预览按钮） -->
            <div class="custom-collapse-item">
              <div class="custom-collapse-header" @click="toggleConstructionInfo">
                <img v-if="constructionInfoVisible" class="arrow-icon" src="../../../assets/images/arrow-down.png" />
                <img v-else class="arrow-icon" src="../../../assets/images/arrow-right.png" />
                <span class="collapse-title">建设信息</span>
                <!-- 三维场景效果预览按钮（与标题同排） -->
                <el-button type="primary" @click="handleModelPreview" class="modelPreview float-right">
                  <img class="imgModel" src="../../../assets/images/model.png" />三维场景效果预览
                </el-button>
              </div>
              <div class="custom-collapse-content" v-if="constructionInfoVisible">
                <!-- 建设信息内容 -->
                <div class="info-content">
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <div class="info-item">
                        <span class="label">建设单位名称：</span>
                        <span class="value">{{ form.constructionUnit || '暂无' }}</span>
                      </div>
                    </el-col>
                    <el-col :span="12">
                      <div class="info-item">
                        <span class="label">组织机构代码：</span>
                        <span class="value">{{ form.organizationCode || '暂无' }}</span>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <div class="info-item">
                        <span class="label">经办人：</span>
                        <span class="value">{{ form.contactPerson || '暂无' }}</span>
                      </div>
                    </el-col>
                    <el-col :span="12">
                      <div class="info-item">
                        <span class="label">经办人联系方式：</span>
                        <span class="value">{{ form.contactPhone || '暂无' }}</span>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <div class="info-item">
                        <span class="label">保护区等级：</span>
                        <span class="value">{{ form.protectionLevel || '暂无' }}</span>
                      </div>
                    </el-col>
                    <el-col :span="12">
                      <div class="info-item">
                        <span class="label">项目占用类型：</span>
                        <span class="value">{{ form.projectType || '暂无' }}</span>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <div class="info-item">
                        <span class="label">项目用途：</span>
                        <span class="value">{{ form.projectUsage || '暂无' }}</span>
                      </div>
                    </el-col>
                    <el-col :span="12">
                      <div class="info-item">
                        <span class="label">拟选位置：</span>
                        <span class="value">{{ form.projectPurpose || '暂无' }}</span>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row :gutter="20">
                    <el-col :span="24">
                      <div class="info-item">
                        <span class="label">建设项目拟投资额（万元）：</span>
                        <span class="value">{{ form.projectInvestment || '暂无' }}</span>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row :gutter="20">
                    <el-col :span="24">
                      <div class="info-item">
                        <span class="label">规划依据：</span>
                        <span class="value">{{ form.planningBasis || '暂无' }}</span>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row :gutter="20">
                    <el-col :span="24">
                      <div class="info-item">
                        <span class="label">建设内容涉及规模：</span>
                        <span class="value">{{ form.constructionContent || '暂无' }}</span>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row :gutter="20">
                    <el-col :span="24">
                      <div class="info-item">
                        <span class="label">其他需要说明的情况：</span>
                        <span class="value">{{ form.otherExplanations || '暂无' }}</span>
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
                            <el-link v-for="file in locationPlanFileList" :key="file.ossId" :href="file.url"
                              :underline="false" target="_blank">
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
                            <el-link v-for="file in expertOpinionsFileList" :key="file.ossId" :href="file.url"
                              :underline="false" target="_blank">
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
                            <el-link v-for="file in meetingMaterialsFileList" :key="file.ossId" :href="file.url"
                              :underline="false" target="_blank">
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
                            <el-link v-for="file in siteSelectionReportFileList" :key="file.ossId" :href="file.url"
                              :underline="false" target="_blank">
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
                            <el-link v-for="file in approvalDocumentsFileList" :key="file.ossId" :href="file.url"
                              :underline="false" target="_blank">
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
                            <el-link v-for="file in projectRedLineFileList" :key="file.ossId" :href="file.url"
                              :underline="false" target="_blank">
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
                        <el-link v-for="file in redLineCoordinateFileList" :key="file.ossId" :href="file.url"
                          :underline="false" target="_blank">
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
                            <el-link v-for="file in threeDModelFileList" :key="file.ossId" :href="file.url"
                              :underline="false" target="_blank">
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
                          <el-input v-model="form.modelCoordinate" disabled />
                          <!-- <template v-if="projectRedLineFileList.length">
                            <el-link v-for="file in projectRedLineFileList" :key="file.ossId" :href="file.url"
                              :underline="false" target="_blank">
                              <span class="el-icon-document"> {{ getFileName(file.name) }} </span>
                            </el-link>
                          </template>
                          <span v-else>暂无</span> -->
                        </div>
                      </div>
                    </el-col>
                  </el-row>
                  <!-- 其他文件列表同理，此处省略重复代码 -->
                </div>
              </div>
            </div>
          </div>
          <!-- 审批信息 -->
          <div class="approval-info">
            <h3 class="section-title">审批信息</h3>
            <!-- 管委会审批 -->
            <div class="approval-item">
              <div class="approval-header">
                <span :class="['status-icon', form.approveRecords[0].gwhApproveResult === '通过' ? 'success' : 'error']">
                  {{ form.approveRecords[0].gwhApproveResult === '通过' ? '✓' : '✗' }}
                </span>
                <span class="approval-title">管委会审核</span>
                <span class="approval-time">审核时间：{{ form.approveRecords[0].gwhApproveTime || '暂无' }}</span>
              </div>
              <div class="approval-content">
                <div class="feedback-item">
                  <span class="label">反馈建议：</span>
                  <span class="value">{{ form.approveRecords[0].gwhApprovalReason || '暂无反馈建议' }}</span>
                </div>
                <div class="feedback-item">
                  <span class="label">反馈文件：</span>
                  <div class="file-list">
                    <template v-if="form.approveRecords[0].gwhApprovalAttachment?.length">
                      <el-link v-for="file in form.approveRecords[0].gwhApprovalAttachment" :key="file.ossId"
                        :href="file.url" :underline="false" target="_blank">
                        <span class="el-icon-document"> {{ getFileName(file.name) }} </span>
                      </el-link>
                    </template>
                    <span v-else>暂无</span>
                  </div>
                </div>
              </div>
            </div>
            <!-- 市林业局审批 -->
            <div class="approval-item" v-if="['林业局通过', '林业局驳回'].includes(form.status)">
              <div class="approval-header">
                <span :class="['status-icon', form.approveRecords[0].lyjApproveResult === '通过' ? 'success' : 'error']">
                  {{ form.approveRecords[0].lyjApproveResult === '通过' ? '✓' : '✗' }}
                </span>
                <span class="approval-title">市林业局审核</span>
                <span class="approval-time">审核时间：{{ form.approveRecords[0].lyjApproveTime || '暂无' }}</span>
              </div>
              <div class="approval-content">
                <div class="feedback-item">
                  <span class="label">反馈建议：</span>
                  <span class="value">{{ form.approveRecords[0].lyjApprovalReason || '暂无反馈建议' }}</span>
                </div>
                <div class="feedback-item">
                  <span class="label">反馈文件：</span>
                  <div class="file-list">
                    <template v-if="form.approveRecords[0].lyjApprovalAttachment?.length">
                      <el-link v-for="file in form.approveRecords[0].lyjApprovalAttachment" :key="file.ossId"
                        :href="file.url" :underline="false" target="_blank">
                        <span class="el-icon-document"> {{ getFileName(file.name) }} </span>
                      </el-link>
                    </template>
                    <span v-else>暂无</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>

      </el-tabs>
    </div>
    <!-- 底部按钮区 -->
    <div class="add-footer">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="warning" @click="resetForm">重置</el-button>
      <el-button type="success" v-hasPermi="['project:project:stage']" @click="temporarilyForm">暂存</el-button>
      <el-button :loading="buttonLoading" type="primary" @click="submitForm">确定</el-button>
    </div>
  </div>
  <div class="add-content-container" v-else>
    <div class="popup-content">
      <img src="../../../assets/images/tick.png" class="success-icon" />
      <div class="success-text">申报信息已成功提交！</div>
      <div class="button-group">
        <el-button class="btn-back" @click="handleCancel">返回项目列表</el-button>
        <el-button class="btn-view" @click="handleViewDetail">查看填报详情</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, getCurrentInstance } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getInfo, stageInfo, submitInfo } from '@/api/project/normal/index';
import { useUserStore } from '@/store/modules/user'
import { propTypes } from '@/utils/propTypes';
import { ElMessage } from 'element-plus'
import { globalHeaders } from '@/utils/request';
const { proxy } = getCurrentInstance() || {}
const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const showSuccessPopup = ref(true)
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

// 标签页状态
const activeTab = ref('fill') // 默认显示“信息填报”
const activeCollapse = ref(['basic']) // 折叠面板默认展开“基础信息”

// 表单引用
const infoFormRef = ref(null)
const infoFormRef2 = ref(null)
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

// 审批反馈折叠状态
const basicInfoVisible = ref(true)
const constructionInfoVisible = ref(false)

// 折叠控制方法
const toggleBasicInfo = () => {
  basicInfoVisible.value = !basicInfoVisible.value
}
const toggleConstructionInfo = () => {
  constructionInfoVisible.value = !constructionInfoVisible.value
}
// 表单验证规则
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

// 文件列表（与editProject一致）
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
// 初始化加载数据
onMounted(async () => {
  const projectId = route.params.id
  if (!projectId) {
    ElMessage.error('缺少项目ID，无法加载数据')
    router.push('/project/major')
    return
  }

  try {
    const response = await getInfo(projectId)
    const projectData = response.data
    // 填充表单数据
    Object.assign(form, projectData)
    // 加载文件列表
    locationPlanFileList.value = parseFileList(projectData.locationPlan)
    expertOpinionsFileList.value = parseFileList(projectData.expertOpinions)
    meetingMaterialsFileList.value = parseFileList(projectData.meetingMaterials)
    siteSelectionReportFileList.value = parseFileList(projectData.siteSelectionReport)
    approvalDocumentsFileList.value = parseFileList(projectData.approvalDocuments)
    projectRedLineFileList.value = parseFileList(projectData.projectRedLine)
    redLineCoordinateFileList.value = parseFileList(projectData.redLineCoordinate)
    threeDModelFileList.value = parseFileList(projectData.threeDModel)
    form.approveRecords[0].gwhApprovalAttachment = parseFileList(projectData.approveRecords[0].gwhApprovalAttachment)
    form.approveRecords[0].lyjApprovalAttachment = parseFileList(projectData.approveRecords[0].lyjApprovalAttachment)
  } catch (err) {
    ElMessage.error('加载项目数据失败：' + (err.message || '未知错误'))
    router.push('/project/major')
  }
})

// 标签页切换事件
const handleTabChange = (tabName) => {
  // 切换到审批反馈时，确保基础信息展开、建设信息关闭
  if (tabName === 'feedback') {
    activeCollapse.value = ['basic']
  }
}

// 上传/文件相关方法（与editProject一致）
const getFileAccept = () => {
  return props.fileType.map(type => `.${type.toLowerCase()}`).join(',')
}
const handleBeforeUpload = (file, type) => {
  const isLtMaxSize = file.size / 1024 / 1024 < props.fileSize
  if (!isLtMaxSize) {
    ElMessage.error(`文件大小不能超过 ${props.fileSize}MB!`)
    return false
  }
  const fileExt = file.name.split('.').pop()?.toLowerCase()
  if (!props.fileType.includes(fileExt)) {
    ElMessage.error(`不支持的文件类型，请上传${props.fileType.join(',')}格式的文件`)
    return false
  }
  return true
}
const handleUploadError = (err, file, type) => {
  ElMessage.error(`上传失败: ${err.message || '未知错误'}`)
}
const handleExceed = (files, fileList) => {
  ElMessage.warning(`每次最多上传 ${props.limit} 个文件`)
}
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
      case 'meetingMaterials':
        meetingMaterialsFileList.value.push(fileItem);
        // 同步更新 form 字段
        form.meetingMaterials = JSON.stringify(meetingMaterialsFileList.value);
        break;
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
    if (type === 'meetingMaterials') {
      infoFormRef2.value.validateField(type)
    }
  } else {
    ElMessage.error(res.msg || '上传失败')
  }
}
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
  // 同步更新 form 字段（空列表时设为空字符串）
  if (type === 'meetingMaterials') {
    form.meetingMaterials = fileList.length > 0 ? JSON.stringify(fileList) : '';
    // 触发第二个表单的字段校验
    infoFormRef2.value.validateField(type)
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

  // 删除后重新校验该字段（触发必填提示）
  infoFormRef2.value.validateField(type)
}
const handleFileRemove = (type) => {
  infoFormRef2.value.validateField(type)
}
const handleDownloadTemplate = (type) => {
  if (type === 'instructions') proxy?.$download.oss('1987829892356124674');
  else if (type === 'polylineTemplate') proxy?.$download.oss('1987829924379635713');
  else if (type === 'polygonTemplate') proxy?.$download.oss('1987829950501761026');
  else if (type === 'threeD') proxy?.$download.oss('1987830717459607554');
}

// 工具方法：获取文件名
const getFileName = (name) => {
  // 处理name为null/undefined的情况
  if (!name) return '未知文件名'
  // 处理路径分隔符（兼容windows和unix）
  const separatorIndex = Math.max(name.lastIndexOf('/'), name.lastIndexOf('\\'))
  return separatorIndex > -1 ? name.slice(separatorIndex + 1) : name
}
// 三维模型预览（与editProject一致）
const handleModelPreview = () => {
  router.push({
    path: '/screen/preview',
    query: {
      id: form.id,
      type: 'major-repeatEdit'
    }
  })
}

// 按钮事件（与editProject一致）
const handleCancel = () => {
  router.push('/project/major')
}
const handleViewDetail = () => {
  router.push(`/project/major/major-view/${route.params.id}`);
}
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
    infoFormRef2.value.clearValidate()
    ElMessage.success('已重置为原始数据')
  } catch (err) {
    ElMessage.error('重置失败：' + (err.message || '未知错误'))
  }
}
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
}
const submitForm = () => {
  infoFormRef.value.validate(async (valid1) => {
    if (!valid1) {
      ElMessage.warning('基础信息填写不符合要求，请检查')
      return
    }
    infoFormRef2.value.validate(async (valid2) => {
      if (valid2) {
        buttonLoading.value = true
        try {
          const { approveRecords, ...formWithoutApprove } = form;
          const submitData = {
            ...formWithoutApprove,
            locationPlan: JSON.stringify(locationPlanFileList.value),
            expertOpinions: JSON.stringify(expertOpinionsFileList.value),
            meetingMaterials: JSON.stringify(meetingMaterialsFileList.value),
            siteSelectionReport: JSON.stringify(siteSelectionReportFileList.value),
            approvalDocuments: JSON.stringify(approvalDocumentsFileList.value),
            projectRedLine: JSON.stringify(projectRedLineFileList.value),
            redLineCoordinate: JSON.stringify(redLineCoordinateFileList.value),
            threeDModel: JSON.stringify(threeDModelFileList.value),
          }
          console.log("🚀 ~ submitForm ~ submitData:", submitData)
          await submitInfo(submitData)
          showSuccessPopup.value = false
        } catch (err) {
          proxy?.$modal.msgError("提交失败：" + (err).message || "未知错误")
        } finally {
          buttonLoading.value = false
        }
      } else {
        ElMessage.warning('建设信息填写不符合要求，请检查文件上传')
      }
    })
  })
}

// 暴露接口

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
  max-height: calc(91vh - 60px);
  overflow-y: auto;
}

::v-deep .el-tabs__item {
  font-size: 16px !important;
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
.project-documents,
.project-info {
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

.info-content {
  padding: 10px 0;
}

.info-item {
  margin-bottom: 10px;
  display: flex;
  align-items: flex-start;
}

.info-item .label {
  min-width: 180px;
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
  margin-top: 10px;
  margin-left: 10px;
}

.status-icon.success {
  background-color: #52c41a;
}

.status-icon.error {
  background-color: #f5222d;
}

/* 审批反馈-审批信息样式 */
.approval-info {
  background-color: #ffffff;
  padding: 20px;
  /* border-radius: 4px; */
  /* box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05); */
}

.approval-item {
  margin-top: 6px;
  margin-bottom: 20px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
  background-color: #fafafa;
}

.approval-content {
  padding: 25px;
}

.approval-title {
  font-weight: 500;
  margin-right: 20px;
}

.approval-time {
  /* color: #666; */
  font-size: 16px;
}


.feedback-item {
  margin-bottom: 10px;
  display: flex;
  align-items: flex-start;
  padding: 8px 12px;
  border-radius: 4px;
}

.feedback-item .label {
  min-width: 100px;
  font-weight: 500;
  /* color: #666; */
}

.feedback-item .value {
  flex: 1;
  /* color: #333; */
}

/* 其他复用样式（与editProject一致） */
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
  font-size: 16px;
}

/* 审批信息样式调整 */
.approval-header .approval-time {
  color: #666;
  font-size: 16px;
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
}

.arrow-icon {
  width: 16px;
  height: 16px;
  margin-right: 5px;
  flex-shrink: 0;
}

.collapse-title {
  font-size: 18px;
  /* 标题字体18px */
  font-weight: 500;
  /* 确保标题靠左，不被其他元素挤压 */
  flex-grow: 1;
  text-align: left;
}

.custom-collapse-content {
  padding: 0 15px 15px;
}

.float-right {
  float: right;
}
</style>
<style>
/* 全局滚动条隐藏（复用） */
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