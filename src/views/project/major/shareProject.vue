<template>
  <div class="add-content-container">
    <div class="add-content">
      <div class="back-normal" @click="cancel"><img src="../../../assets/images/arrow-left.png" />数据共享</div>
      <el-tabs v-model="activeTab" @tab-change="handleTabChange">
        <!-- 信息填报标签页（可编辑） -->
        <el-tab-pane label="首次审批信息" name="fill">
          <!-- 项目基础信息 -->
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
                      <el-link v-for="file in form.approveRecords[0].gwhApprovalAttachment" :key="file.ossId" :href="file.url"
                        :underline="false" target="_blank">
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
                      <el-link v-for="file in form.approveRecords[0].lyjApprovalAttachment" :key="file.ossId" :href="file.url"
                        :underline="false" target="_blank">
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
        <el-tab-pane label="二次审批信息" name="feedback">
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
                      <el-link v-for="file in form.approveRecords[0].gwhApprovalAttachment" :key="file.ossId" :href="file.url"
                        :underline="false" target="_blank">
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
                      <el-link v-for="file in form.approveRecords[0].lyjApprovalAttachment" :key="file.ossId" :href="file.url"
                        :underline="false" target="_blank">
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
      <el-button @click="cancel">取消</el-button>
      <el-button type="warning" @click="clickDataDownload">数据下载</el-button>
      <el-button type="success" v-hasPermi="['project:project:stage']" @click="clickDataShare">数据共享</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, getCurrentInstance } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getInfo, stageInfo, submitInfo } from '@/api/project/normal/index';
import { propTypes } from '@/utils/propTypes';
import { ElMessage } from 'element-plus'
const { proxy } = getCurrentInstance() || {}
const router = useRouter()
const route = useRoute()
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
const activeTab = ref('feedback') // 默认显示“信息填报”
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
const dialog = reactive({
  visible: false,
  title: '',
});
// 审批反馈数据
const approveRecord = reactive({
  gwhApproveResult: '', // 管委会审批结果（通过/驳回）
  gwhApproveTime: '',   // 审批时间
  gwhApprovalReason: '',// 反馈建议
  gwhApprovalAttachment: [], // 反馈文件
  lyjApproveResult: '', // 管委会审批结果（通过/驳回）
  lyjApproveTime: '',   // 审批时间
  lyjApprovalReason: '',// 反馈建议
  lyjApprovalAttachment: [] // 反馈文件
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
// 文件列表（与editProject一致）
const locationPlanFileList = ref([])
const expertOpinionsFileList = ref([])
const meetingMaterialsFileList = ref([])
const siteSelectionReportFileList = ref([])
const approvalDocumentsFileList = ref([])
const projectRedLineFileList = ref([])
const redLineCoordinateFileList = ref([])
const threeDModelFileList = ref([])
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
    console.log("🚀 ~ projectData:", projectData)
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
      type:'major-share'
    }
  })
}

// 按钮事件（与editProject一致）
const cancel = () => {
  router.push('/project/major')
}
const clickDataDownload = async () => {
  try {
    proxy?.$modal.loading('正在打包下载数据，请稍候...');
    const exportUrl = `project/download/${form.id}`;
    await proxy?.download(exportUrl, {}, `info_${new Date().getTime()}.zip`);
    proxy?.$modal.closeLoading();
    proxy?.$modal.msgSuccess('数据下载成功');
  } catch (err) {
    ElMessage.error('重置失败：' + (err.message || '未知错误'))
  }
}

const clickDataShare = async () => {
  try {
    await proxy?.$modal.confirm1('确认共享后最新的项目信息数据将共享至自然保护地审批平台进行最终的审批。');
    buttonLoading.value = true;
    // 调用数据共享接口（替换为实际共享接口）
    // await shareInfo(form.value.id);
    proxy?.$modal.msgSuccess('数据共享成功');
    dialog.visible = false;
  } catch (err) {
    if (err !== 'cancel') {
      proxy?.$modal.msgError('数据共享失败：' + (err).message || '未知错误');
    }
  } finally {
    buttonLoading.value = false;
  }
}
// 暴露接口

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

/* 审批信息样式调整 */
.approval-header .approval-time {
  color: #666;
  font-size: 16px;
}

.feedback-item {
  background-color: #f5f5f5;
  /* 反馈建议/文件背景改为灰色 */
  padding: 8px 12px;
  border-radius: 4px;
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



.feedback-item {
  background-color: #f5f5f5;
  /* 反馈建议/文件背景改为灰色 */
  padding: 8px 12px;
  border-radius: 4px;
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