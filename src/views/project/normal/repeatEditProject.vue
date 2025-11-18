<template>
  <div class="add-content-container">
    <div class="add-content">
      <!-- 标签页：信息填报 / 审批反馈 -->
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
                    <el-input v-model="form.protectionLevel" placeholder="请输入保护等级" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="项目占用类型" prop="projectType">
                    <el-input v-model="form.projectType" placeholder="请输入项目占用类型" />
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
                      :before-upload="(file) => handleBeforeUpload(file, 'locationPlan')" :file-list="locationPlanFileList"
                      :limit="props.limit" :accept="getFileAccept()"
                      :on-error="(err, file) => handleUploadError(err, file, 'locationPlan')" :on-exceed="handleExceed"
                      :on-success="(res, file) => handleUploadSuccess(res, file, 'locationPlan')" :show-file-list="false"
                      :headers="headers" class="upload-file-uploader">
                      <el-button type="primary">点击上传</el-button>
                    </el-upload>
                    <transition-group class="upload-file-list el-upload-list el-upload-list--text" name="el-fade-in-linear"
                      tag="ul">
                      <li v-for="(file, index) in locationPlanFileList" :key="file.uid"
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
                      :on-error="(err, file) => handleUploadError(err, file, 'expertOpinions')" :on-exceed="handleExceed"
                      :on-success="(res, file) => handleUploadSuccess(res, file, 'expertOpinions')" :show-file-list="false"
                      :headers="headers" class="upload-file-uploader">
                      <el-button type="primary">点击上传</el-button>
                    </el-upload>
                    <transition-group class="upload-file-list el-upload-list el-upload-list--text" name="el-fade-in-linear"
                      tag="ul">
                      <li v-for="(file, index) in expertOpinionsFileList" :key="file.uid"
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
                  <el-form-item label="公示材料" prop="publicMaterial">
                    <el-upload ref="publicMaterialUploadRef" multiple :action="uploadFileUrl"
                      :before-upload="(file) => handleBeforeUpload(file, 'publicMaterial')"
                      :file-list="publicMaterialFileList" :limit="props.limit" :accept="getFileAccept()"
                      :on-error="(err, file) => handleUploadError(err, file, 'publicMaterial')" :on-exceed="handleExceed"
                      :on-success="(res, file) => handleUploadSuccess(res, file, 'publicMaterial')" :show-file-list="false"
                      :headers="headers" class="upload-file-uploader">
                      <el-button type="primary">点击上传</el-button>
                    </el-upload>
                    <transition-group class="upload-file-list el-upload-list el-upload-list--text" name="el-fade-in-linear"
                      tag="ul">
                      <li v-for="(file, index) in publicMaterialFileList" :key="file.uid"
                        class="el-upload-list__item ele-upload-list__item-content">
                        <el-link :href="`${file.url}`" :underline="false" target="_blank">
                          <span class="el-icon-document"> {{ getFileName(file.name) }} </span>
                        </el-link>
                        <div class="ele-upload-list__item-content-action">
                          <el-button type="danger" link @click="handleDeleteUploadFile(index, 'publicMaterial')">
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
                      :show-file-list="false" :headers="headers" class="upload-file-uploader">
                      <el-button type="primary">点击上传</el-button>
                    </el-upload>
                    <transition-group class="upload-file-list el-upload-list el-upload-list--text" name="el-fade-in-linear"
                      tag="ul">
                      <li v-for="(file, index) in siteSelectionReportFileList" :key="file.uid"
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
                      :on-error="(err, file) => handleUploadError(err, file, 'approvalDocuments')" :on-exceed="handleExceed"
                      :on-success="(res, file) => handleUploadSuccess(res, file, 'approvalDocuments')"
                      :show-file-list="false" :headers="headers" class="upload-file-uploader">
                      <el-button type="primary">点击上传</el-button>
                    </el-upload>
                    <transition-group class="upload-file-list el-upload-list el-upload-list--text" name="el-fade-in-linear"
                      tag="ul">
                      <li v-for="(file, index) in approvalDocumentsFileList" :key="file.uid"
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
                      :on-error="(err, file) => handleUploadError(err, file, 'projectRedLine')" :on-exceed="handleExceed"
                      :on-success="(res, file) => handleUploadSuccess(res, file, 'projectRedLine')" :show-file-list="false"
                      :headers="headers" class="upload-file-uploader">
                      <el-button type="primary">点击上传</el-button>
                    </el-upload>
                    <transition-group class="upload-file-list el-upload-list el-upload-list--text" name="el-fade-in-linear"
                      tag="ul">
                      <li v-for="(file, index) in projectRedLineFileList" :key="file.uid"
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
                  :on-success="(res, file) => handleUploadSuccess(res, file, 'redLineCoordinate')" :show-file-list="false"
                  :headers="headers" class="upload-file-uploader">
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
                  <li v-for="(file, index) in redLineCoordinateFileList" :key="file.uid"
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
                      :before-upload="(file) => handleBeforeUpload(file, 'threeDModel')" :file-list="threeDModelFileList"
                      :limit="props.limit" :accept="getFileAccept()"
                      :on-error="(err, file) => handleUploadError(err, file, 'threeDModel')" :on-exceed="handleExceed"
                      :on-success="(res, file) => handleUploadSuccess(res, file, 'threeDModel')" :show-file-list="false"
                      :headers="headers" class="upload-file-uploader">
                      <el-button type="primary">点击上传</el-button>
                    </el-upload>
                    <div class="operation-group">
                      <el-button link type="primary" icon="Download"
                        @click="handleDownloadTemplate('threeD')">模型规范与模板下载</el-button>
                    </div>
                    <transition-group class="upload-file-list el-upload-list el-upload-list--text" name="el-fade-in-linear"
                      tag="ul">
                      <li v-for="(file, index) in threeDModelFileList" :key="file.uid"
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

        <!-- 审批反馈标签页（不可编辑，可展开/隐藏） -->
        <el-tab-pane label="审批反馈" name="feedback">
          <!-- 项目信息（基础+建设，可展开/隐藏） -->
          <div class="project-info">
            <h3 class="section-title">项目信息</h3>
            <!-- 基础信息（默认展开） -->
            <el-collapse v-model="activeCollapse" accordion>
              <el-collapse-item title="基础信息" name="basic">
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
              </el-collapse-item>

              <!-- 建设信息（默认关闭） -->
              <el-collapse-item title="建设信息" name="construction">
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
                            <el-link v-for="file in locationPlanFileList" :key="file.uid" :href="file.url" :underline="false" target="_blank">
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
                            <el-link v-for="file in expertOpinionsFileList" :key="file.uid" :href="file.url" :underline="false" target="_blank">
                              <span class="el-icon-document"> {{ getFileName(file.name) }} </span>
                            </el-link>
                          </template>
                          <span v-else>暂无</span>
                        </div>
                      </div>
                    </el-col>
                  </el-row>
                  <!-- 其他文件列表同理，此处省略重复代码 -->
                </div>
              </el-collapse-item>
            </el-collapse>

            <!-- 三维场景效果预览（始终显示） -->
            <div class="model-preview-btn">
              <el-button type="primary" @click="handleModelPreview" class="modelPreview">
                <img class="imgModel" src="../../../assets/images/model.png" />三维场景效果预览
              </el-button>
            </div>

            <!-- 审批信息 -->
            <div class="approval-info">
              <h3 class="section-title">审批信息</h3>
              <!-- 管委会审批 -->
              <div class="approval-item">
                <div class="approval-header">
                  <span :class="['status-icon', approveRecord.gwhApproveResult === '通过' ? 'success' : 'error']">
                    {{ approveRecord.gwhApproveResult === '通过' ? '✓' : '✗' }}
                  </span>
                  <span class="approval-title">管委会审核</span>
                  <span class="approval-time">审核时间：{{ approveRecord.gwhApproveTime || '暂无' }}</span>
                </div>
                <div class="approval-content">
                  <div class="feedback-item">
                    <span class="label">反馈建议：</span>
                    <span class="value">{{ approveRecord.gwhApprovalReason || '暂无' }}</span>
                  </div>
                  <div class="feedback-item">
                    <span class="label">反馈文件：</span>
                    <div class="file-list">
                      <template v-if="approveRecord.gwhApprovalAttachment?.length">
                        <el-link v-for="file in approveRecord.gwhApprovalAttachment" :key="file.uid" :href="file.url" :underline="false" target="_blank">
                          <span class="el-icon-document"> {{ getFileName(file.name) }} </span>
                        </el-link>
                      </template>
                      <span v-else>暂无</span>
                    </div>
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
      <el-button @click="cancel">取消</el-button>
      <el-button type="warning" @click="resetForm">重置</el-button>
      <el-button type="success" v-hasPermi="['project:project:stage']" @click="temporarilyForm">暂存</el-button>
      <el-button :loading="buttonLoading" type="primary" @click="submitForm">确定</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, getCurrentInstance } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getInfo, stageInfo, submitInfo } from '@/api/project/normal/index';
import { useMajorProjectStore } from '@/store/modules/majorProject'
import { useUserStore } from '@/store/modules/user'
import { propTypes } from '@/utils/propTypes';
import { ElMessage } from 'element-plus'

const { proxy } = getCurrentInstance() || {}
const router = useRouter()
const route = useRoute()
const majorProjectStore = useMajorProjectStore()
const userStore = useUserStore()

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
  protectionLevel: undefined,
  projectType: undefined,
  projectUsage: undefined,
  projectPurpose: undefined,
  projectInvestment: undefined,
  planningBasis: undefined,
  constructionContent: undefined,
  otherExplanations: undefined,
  modelCoordinate: undefined,
  majorFlag: false,
})

// 审批反馈数据
const approveRecord = reactive({
  gwhApproveResult: '', // 管委会审批结果（通过/驳回）
  gwhApproveTime: '',   // 审批时间
  gwhApprovalReason: '',// 反馈建议
  gwhApprovalAttachment: [] // 反馈文件
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

// 文件列表（与editProject一致）
const locationPlanFileList = ref([])
const expertOpinionsFileList = ref([])
const publicMaterialFileList = ref([])
const siteSelectionReportFileList = ref([])
const approvalDocumentsFileList = ref([])
const projectRedLineFileList = ref([])
const redLineCoordinateFileList = ref([])
const threeDModelFileList = ref([])

// 上传相关配置
const uploadFileUrl = import.meta.env.VITE_APP_BASE_API + '/common/upload'
const headers = reactive({
  Authorization: 'Bearer ' + userStore.token
})

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
    // 填充审批反馈数据
    Object.assign(approveRecord, projectData.approveRecord || {})
    // 加载文件列表
    locationPlanFileList.value = projectData.locationPlan ? [...projectData.locationPlan] : []
    expertOpinionsFileList.value = projectData.expertOpinions ? [...projectData.expertOpinions] : []
    publicMaterialFileList.value = projectData.publicMaterial ? [...projectData.publicMaterial] : []
    siteSelectionReportFileList.value = projectData.siteSelectionReport ? [...projectData.siteSelectionReport] : []
    approvalDocumentsFileList.value = projectData.approvalDocuments ? [...projectData.approvalDocuments] : []
    projectRedLineFileList.value = projectData.projectRedLine ? [...projectData.projectRedLine] : []
    redLineCoordinateFileList.value = projectData.redLineCoordinate ? [...projectData.redLineCoordinate] : []
    threeDModelFileList.value = projectData.threeDModel ? [...projectData.threeDModel] : []
  } catch (err) {
    ElMessage.error('加载项目数据失败：' + (err.message || '未知错误'))
    router.push('/project/normal')
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
    const fileItem = { name: file.name, url: res.url, uid: file.uid, id: res.id }
    switch (type) {
      case 'locationPlan': locationPlanFileList.value.push(fileItem); break
      case 'expertOpinions': expertOpinionsFileList.value.push(fileItem); break
      case 'publicMaterial': publicMaterialFileList.value.push(fileItem); break
      case 'siteSelectionReport': siteSelectionReportFileList.value.push(fileItem); break
      case 'approvalDocuments': approvalDocumentsFileList.value.push(fileItem); break
      case 'projectRedLine': projectRedLineFileList.value.push(fileItem); break
      case 'redLineCoordinate': redLineCoordinateFileList.value.push(fileItem); break
      case 'threeDModel': threeDModelFileList.value.push(fileItem); break
    }
    ElMessage.success('上传成功')
  } else {
    ElMessage.error(res.msg || '上传失败')
  }
}
const handleDeleteUploadFile = (index, type) => {
  switch (type) {
    case 'locationPlan': locationPlanFileList.value.splice(index, 1); break
    case 'expertOpinions': expertOpinionsFileList.value.splice(index, 1); break
    case 'publicMaterial': publicMaterialFileList.value.splice(index, 1); break
    case 'siteSelectionReport': siteSelectionReportFileList.value.splice(index, 1); break
    case 'approvalDocuments': approvalDocumentsFileList.value.splice(index, 1); break
    case 'projectRedLine': projectRedLineFileList.value.splice(index, 1); break
    case 'redLineCoordinate': redLineCoordinateFileList.value.splice(index, 1); break
    case 'threeDModel': threeDModelFileList.value.splice(index, 1); break
  }
}
const handleDownloadTemplate = (type) => {
  if (type === 'instructions') proxy?.$download.oss('1987829892356124674');
  else if (type === 'polylineTemplate') proxy?.$download.oss('1987829924379635713');
  else if (type === 'polygonTemplate') proxy?.$download.oss('1987829950501761026');
  else if (type === 'threeD') proxy?.$download.oss('1987830717459607554');
}

// 工具方法：获取文件名
const getFileName = (name) => {
  if (name.lastIndexOf('/') > -1) return name.slice(name.lastIndexOf('/') + 1);
  return name;
}

// 三维模型预览（与editProject一致）
const handleModelPreview = () => {
  if (!threeDModelFileList.value.length) {
    ElMessage.warning('请先上传三维模型文件')
    return
  }
  majorProjectStore.savePreviewProjectInfo({
    id: form.id,
    threeDModel: threeDModelFileList.value[0].url,
    modelCoordinate: form.modelCoordinate,
    type: 'project'
  })
  router.push('/preview')
}

// 按钮事件（与editProject一致）
const cancel = () => {
  router.push('/project/normal')
}
const resetForm = async () => {
  try {
    const response = await getInfo(form.id)
    const projectData = response.data
    Object.assign(form, projectData)
    locationPlanFileList.value = projectData.locationPlan ? [...projectData.locationPlan] : []
    expertOpinionsFileList.value = projectData.expertOpinions ? [...projectData.expertOpinions] : []
    publicMaterialFileList.value = projectData.publicMaterial ? [...projectData.publicMaterial] : []
    siteSelectionReportFileList.value = projectData.siteSelectionReport ? [...projectData.siteSelectionReport] : []
    approvalDocumentsFileList.value = projectData.approvalDocuments ? [...projectData.approvalDocuments] : []
    projectRedLineFileList.value = projectData.projectRedLine ? [...projectData.projectRedLine] : []
    redLineCoordinateFileList.value = projectData.redLineCoordinate ? [...projectData.redLineCoordinate] : []
    threeDModelFileList.value = projectData.threeDModel ? [...projectData.threeDModel] : []
    ElMessage.success('已重置为原始数据')
  } catch (err) {
    ElMessage.error('重置失败：' + (err.message || '未知错误'))
  }
}
const temporarilyForm = () => {
  infoFormRef.value?.validate(async (valid) => {
    if (valid) {
      buttonLoading.value = true
      try {
        const submitData = {
          ...form,
          locationPlan: locationPlanFileList.value,
          expertOpinions: expertOpinionsFileList.value,
          publicMaterial: publicMaterialFileList.value,
          siteSelectionReport: siteSelectionReportFileList.value,
          approvalDocuments: approvalDocumentsFileList.value,
          projectRedLine: projectRedLineFileList.value,
          redLineCoordinate: redLineCoordinateFileList.value,
          threeDModel: threeDModelFileList.value,
        }
        await stageInfo(submitData)
        proxy?.$modal.msgSuccess("暂存成功")
      } catch (err) {
        proxy?.$modal.msgError("暂存失败：" + (err.message || "未知错误"))
      } finally {
        buttonLoading.value = false
      }
    }
  })
}
const submitForm = () => {
  infoFormRef.value?.validate(async (valid) => {
    if (valid) {
      buttonLoading.value = true
      try {
        const submitData = {
          ...form,
          locationPlan: locationPlanFileList.value,
          expertOpinions: expertOpinionsFileList.value,
          publicMaterial: publicMaterialFileList.value,
          siteSelectionReport: siteSelectionReportFileList.value,
          approvalDocuments: approvalDocumentsFileList.value,
          projectRedLine: projectRedLineFileList.value,
          redLineCoordinate: redLineCoordinateFileList.value,
          threeDModel: threeDModelFileList.value,
        }
        await submitInfo(submitData)
        proxy?.$modal.msgSuccess("提交成功")
        router.push('/project/normal')
      } catch (err) {
        proxy?.$modal.msgError("提交失败：" + (err.message || "未知错误"))
      } finally {
        buttonLoading.value = false
      }
    }
  })
}

// 暴露接口
defineExpose({
  open: (row) => {
    if (row) {
      Object.assign(form, row)
      Object.assign(approveRecord, row.approveRecord || {})
      locationPlanFileList.value = row.locationPlan ? [...row.locationPlan] : []
      expertOpinionsFileList.value = row.expertOpinions ? [...row.expertOpinions] : []
      publicMaterialFileList.value = row.publicMaterial ? [...row.publicMaterial] : []
      siteSelectionReportFileList.value = row.siteSelectionReport ? [...row.siteSelectionReport] : []
      approvalDocumentsFileList.value = row.approvalDocuments ? [...row.approvalDocuments] : []
      projectRedLineFileList.value = row.projectRedLine ? [...row.projectRedLine] : []
      redLineCoordinateFileList.value = row.redLineCoordinate ? [...row.redLineCoordinate] : []
      threeDModelFileList.value = row.threeDModel ? [...row.threeDModel] : []
    }
  }
})
</script>

<style scoped>
/* 复用editProject的基础样式，新增审批反馈相关样式 */
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

/* 审批反馈-审批信息样式 */
.approval-info {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}
.approval-item {
  margin-bottom: 20px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}
.approval-header {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e5e7eb;
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
.approval-title {
  font-weight: 500;
  margin-right: 20px;
}
.approval-time {
  color: #666;
  font-size: 14px;
}
.approval-content {
  padding: 15px;
}
.feedback-item {
  margin-bottom: 10px;
  display: flex;
  align-items: flex-start;
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
  font-size: 14px;
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