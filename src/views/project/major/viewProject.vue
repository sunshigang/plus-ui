<template>
  <div class="add-content-container">
    <div class="add-content"
      :class="{ 'admin-view': currentUserRole === 'superadmin' || currentUserRole === 'sysadmin' }">
      <div class="back-normal" @click="cancel">
        <img
          src="@/assets/images/arrow-left.png" />{{ currentUserRole === 'superadmin' || currentUserRole === 'sysadmin' ? '详情查看' : '查看' }}
      </div>
      <div v-if="currentUserRole === 'superadmin' || currentUserRole === 'sysadmin'">
        <!-- 核心修改：动态生成标签页 -->
        <el-tabs v-model="activeTab" @tab-change="handleTabChange">
          <el-tab-pane v-for="tab in tabList" :key="tab.name" :name="tab.name">
            <template #label>
            <span class="tab-label-wrapper">
              <img :src="activeTab === tab.name ? approvaled : approval" class="tab-status-icon" alt="审批状态" style="width:14px; height:13px;" />
              {{ tab.label }}
            </span>
          </template>
            <div class="project-info">
              <h3 class="section-title">项目信息</h3>
              <!-- 基础信息折叠面板 -->
              <div class="custom-collapse-item">
                <div class="custom-collapse-header" @click.stop="toggleBasicInfo(tab.name)">
                  <div>
                    <img v-if="collapseVisible[tab.name]?.basic" class="arrow-icon"
                      src="@/assets/images/arrow-down.png" />
                    <img v-else class="arrow-icon" src="@/assets/images/arrow-right.png" />
                    <span class="collapse-title">基础信息</span>
                  </div>
                </div>
                <div class="custom-collapse-content" v-if="collapseVisible[tab.name]?.basic">
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

              <!-- 建设信息折叠面板（含三维预览） -->
              <div class="custom-collapse-item">
                <div class="custom-collapse-header" @click.stop="toggleConstructionInfo(tab.name)">
                  <div>
                    <img v-if="collapseVisible[tab.name]?.construction" class="arrow-icon"
                      src="@/assets/images/arrow-down.png" />
                    <img v-else class="arrow-icon" src="@/assets/images/arrow-right.png" />
                    <span class="collapse-title">建设信息</span>
                  </div>
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
                          <span class="value">{{ formatMultiSelectValue(form.protectionLevel) }}</span>
                        </div>
                      </el-col>
                      <el-col :span="12">
                        <div class="info-item">
                          <span class="label">项目占用类型：</span>
                          <span class="value">{{ formatMultiSelectValue(form.projectType) }}</span>
                        </div>
                      </el-col>
                    </el-row>
                    <el-row :gutter="20">
                      <el-col :span="12">
                        <div class="info-item">
                          <span class="label">涉及风景区地上建筑面积(㎡)：</span>
                          <span class="value">{{ form.scenicGroundArea || '暂无' }}</span>
                        </div>
                      </el-col>
                      <el-col :span="12">
                        <div class="info-item">
                          <span class="label">涉及风景区地下建筑面积(㎡)：</span>
                          <span class="value">{{ form.scenicUndergroundArea || '暂无' }}</span>
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

                    <!-- 文件列表部分 -->
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
                      <div class="operation-group">
                        <el-button link type="primary" @click="handleDownloadTemplate('instructions')">填写说明</el-button>
                        <el-button link type="primary"
                          @click="handleDownloadTemplate('polygonTemplate')">面模板下载</el-button>
                        <el-button link type="primary"
                          @click="handleDownloadTemplate('polylineTemplate')">线模板下载</el-button>
                        <div>（使用前，请删除模板中的实例数据）</div>
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
                          <div class="operation-group">
                            <el-button link type="primary" icon="Download"
                              @click="handleDownloadTemplate('threeD')">模型规范与模板下载</el-button>
                          </div>
                        </div>
                      </el-col>
                      <el-col :span="12">
                        <div class="info-item">
                          <span class="label">模型坐标：</span>
                          <span class="value">{{ form.modelCoordinate || '暂无' }}</span>
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
              <template v-if="form.approveRecords && form.approveRecords[tab.index]">
                <div class="approval-item">
                  <!-- 管委会审批 -->
                  <div v-if="form.approveRecords[tab.index].gwhApproveResult" class="approval-sub-item">
                    <div class="approval-header"
                      style="padding: 10px 15px; background: #f9f9f9; display: flex; align-items: center">
                      <span :class="[
                        'status-icon',
                        form.approveRecords[tab.index].gwhApproveResult === '通过' ? 'success' : form.approveRecords[tab.index].gwhApproveResult ? 'error' : 'pending'
                      ]">
                        {{ form.approveRecords[tab.index].gwhApproveResult === '通过' ? '✓' : form.approveRecords[tab.index].gwhApproveResult ? '✗' : '—' }}
                      </span>
                      <span class="approval-title">管委会审核（{{ tab.label.replace('审批信息', '') }}）</span>
                      <span class="approval-time">审核时间：{{ form.approveRecords[tab.index].gwhApproveTime || '暂无'
                      }}</span>
                    </div>
                    <div class="approval-content">
                      <div class="feedback-item">
                        <span class="label">反馈建议：</span>
                        <span class="value">{{ form.approveRecords[tab.index].gwhApprovalReason || '暂无反馈建议' }}</span>
                      </div>
                      <div class="feedback-item">
                        <span class="label">反馈文件：</span>
                        <div class="file-list">
                          <template
                            v-if="parseApprovalFile(form.approveRecords[tab.index].gwhApprovalAttachment).length">
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
                    v-if="form.approveRecords[tab.index].lyjApproveResult && ['林业局通过', '林业局驳回'].includes(form.status)"
                    class="approval-sub-item" style="margin-top: 10px">
                    <div class="approval-header"
                      style="padding: 10px 15px; background: #f9f9f9; display: flex; align-items: center">
                      <span :class="[
                        'status-icon',
                        form.approveRecords[tab.index].lyjApproveResult === '通过' ? 'success' : form.approveRecords[tab.index].lyjApproveResult ? 'error' : 'pending'
                      ]">
                        {{ form.approveRecords[tab.index].lyjApproveResult === '通过' ? '✓' : form.approveRecords[tab.index].lyjApproveResult ? '✗' : '—' }}
                      </span>
                      <span class="approval-title">市林业局审核（{{ tab.label.replace('审批信息', '') }}）</span>
                      <span class="approval-time">审核时间：{{ form.approveRecords[tab.index].lyjApproveTime || '暂无'
                      }}</span>
                    </div>
                    <div class="approval-content">
                      <div class="feedback-item">
                        <span class="label">反馈建议：</span>
                        <span class="value">{{ form.approveRecords[tab.index].lyjApprovalReason || '暂无反馈建议' }}</span>
                      </div>
                      <div class="feedback-item">
                        <span class="label">反馈文件：</span>
                        <div class="file-list">
                          <template
                            v-if="parseApprovalFile(form.approveRecords[tab.index].lyjApprovalAttachment).length">
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
              <div v-else class="no-record-tip" style="text-align: center; padding: 20px; color: #999">
                暂无{{ tab.label.replace('审批信息', '') }}审批记录
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div v-else>
        <!-- 非管理员视图：保持原有逻辑不变 -->
        <div class="project-basic-info">
          <h3>项目基础信息</h3>
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
          <el-form :model="form" label-width="230px">
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
                <el-form-item label="涉及风景区地上建筑面积(㎡)">
                  <el-input v-model="form.scenicGroundArea" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="涉及风景区地下建筑面积(㎡)">
                  <el-input v-model="form.scenicUndergroundArea" disabled />
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
                  <transition-group class="upload-file-list el-upload-list el-upload-list--text"
                    name="el-fade-in-linear" tag="ul">
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
                  <transition-group class="upload-file-list el-upload-list el-upload-list--text"
                    name="el-fade-in-linear" tag="ul">
                    <li v-for="(file, index) in expertOpinionsFileList" :key="file.ossId"
                      class="el-upload-list__item ele-upload-list__item-content">
                      <el-link :href="file.url" :underline="false" target="_blank">
                        <span class="el-icon-document"> {{ file.name }} </span>
                      </el-link>
                    </li>
                    <li v-if="expertOpinionsFileList.length === 0"
                      class="el-upload-list__item ele-upload-list__item-content empty-file"
                      key="'empty-expertOpinions'">
                      <span class="el-icon-info"> 暂无文件 </span>
                    </li>
                  </transition-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="公示材料" class="custom-label">
                  <transition-group class="upload-file-list el-upload-list el-upload-list--text"
                    name="el-fade-in-linear" tag="ul">
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
                  <transition-group class="upload-file-list el-upload-list el-upload-list--text"
                    name="el-fade-in-linear" tag="ul">
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
                  <transition-group class="upload-file-list el-upload-list el-upload-list--text"
                    name="el-fade-in-linear" tag="ul">
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
                  <transition-group class="upload-file-list el-upload-list el-upload-list--text"
                    name="el-fade-in-linear" tag="ul">
                    <li v-for="(file, index) in projectRedLineFileList" :key="file.ossId"
                      class="el-upload-list__item ele-upload-list__item-content">
                      <el-link :href="file.url" :underline="false" target="_blank">
                        <span class="el-icon-document"> {{ file.name }} </span>
                      </el-link>
                    </li>
                    <li v-if="projectRedLineFileList.length === 0"
                      class="el-upload-list__item ele-upload-list__item-content empty-file"
                      key="'empty-projectRedLine'">
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
                  <transition-group class="upload-file-list el-upload-list el-upload-list--text"
                    name="el-fade-in-linear" tag="ul">
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
        <div class="project-documents" v-if="showApprovalSection && !!form.approveRecords?.[0]?.gwhApproveResult">
          <h3 class="section-title">审批信息</h3>
          <div v-for="(record, index) in displayApprovalRecord" :key="record.id || `approval-record-${index}`"
            class="approval-record-item">
            <el-form label-width="230px" disabled class="approval-form" v-if="record.gwhApproveResult">
              <el-form-item label="管委会审批状态">
                <div class="approval-item">
                  <span :class="[
                    'status-icon',
                    record.gwhApproveResult === '通过' ? 'success' : record.gwhApproveResult === '驳回' ? 'error' : 'pending'
                  ]">
                    {{ record.gwhApproveResult === '通过' ? '✓' : record.gwhApproveResult === '驳回' ? '✗' : '-' }}
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
                <el-input type="textarea" :value="record.gwhApprovalReason || '暂无反馈'" :rows="2" style="background: #fff"
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

            <el-form label-width="230px" disabled class="approval-form"
              v-if="record.lyjApproveResult || record.lyjApproveTime || record.lyjApprovalReason || record.lyjApprovalAttachment">
              <el-form-item label="市林业局审批状态">
                <div class="approval-item">
                  <span :class="[
                    'status-icon',
                    record.lyjApproveResult === '通过' ? 'success' : record.lyjApproveResult === '驳回' ? 'error' : 'pending'
                  ]">
                    {{ record.lyjApproveResult === '通过' ? '✓' : record.lyjApproveResult === '驳回' ? '✗' : '-' }}
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
                <el-input type="textarea" :value="record.lyjApprovalReason || '暂无反馈'" :rows="2" style="background: #fff"
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
          </div>
        </div>
      </div>
    </div>
    <div class="add-footer">
      <el-button @click="cancel">取消</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { getInfo } from '@/api/project/normal/index';
import { useUserStore } from '@/store/modules/user';
import { getCurrentInstance } from 'vue';
import { ElMessage } from 'element-plus';
import { getInfo as userGetInfo } from '@/api/login';
import approval from '@/assets/images/approval.png'
import approvaled from '@/assets/images/approvaled.png'
const { proxy } = getCurrentInstance() || {};
const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

// ========== 核心修改1：动态标签页配置 ==========
// 动态生成标签页列表（根据approveRecords长度）
const tabList = computed(() => {
  const records = Array.isArray(form.approveRecords) ? form.approveRecords : [];
  // 核心调整：即使records为空，也至少生成1个标签页（首次）
  const tabCount = records.length === 0 ? 1 : records.length;
  // 中文数字映射（扩展到更多次数，支持1-20次，超过则显示“n次”）
  const cnTimesMap = ['首次', '二次', '三次', '四次', '五次', '六次', '七次', '八次', '九次', '十次'];
  return Array.from({ length: tabCount }, (_, index) => {
    const cnTimes = cnTimesMap[index] || `${index + 1}次`;
    return {
      name: `approval-${index + 1}`, // 标签页唯一标识（如approval-1、approval-2）
      label: `${cnTimes}审批信息`,    // 标签页显示名称
      index: index                   // 对应approveRecords的索引
    };
  });
});

// 激活的标签页（默认第一个）
const activeTab = ref('approval-1');

// 折叠面板可见性（动态适配所有标签页）
const collapseVisible = ref({});

// 初始化折叠面板状态
const initCollapseVisible = () => {
  const records = Array.isArray(form.approveRecords) ? form.approveRecords : [];
  const tabCount = records.length === 0 ? 1 : records.length;
  const newCollapse = {};
  Array.from({ length: tabCount }, (_, index) => {
    const tabName = `approval-${index + 1}`;
    newCollapse[tabName] = {
      basic: true,        // 默认展开基础信息
      construction: false // 默认收起建设信息
    };
  });
  collapseVisible.value = newCollapse;
};

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
  approveRecords: [],
  scenicGroundArea: undefined,
  scenicUndergroundArea: undefined
});
const currentUserRole = ref('');

// 文件列表
const locationPlanFileList = ref([]);
const expertOpinionsFileList = ref([]);
const meetingMaterialsFileList = ref([]);
const siteSelectionReportFileList = ref([]);
const approvalDocumentsFileList = ref([]);
const projectRedLineFileList = ref([]);
const redLineCoordinateFileList = ref([]);
const threeDModelFileList = ref([]);

// 格式化多选值为中文逗号分隔
const formatMultiSelectValue = (value) => {
  if (!value || !Array.isArray(value) || value.length === 0) {
    return '暂无';
  }
  return value.join('，');
};

// ========== 核心修改2：适配动态标签页的折叠面板切换方法 ==========
const toggleBasicInfo = (tabName) => {
  if (!tabName || !collapseVisible.value[tabName]) return;
  collapseVisible.value[tabName].basic = !collapseVisible.value[tabName].basic;
};

const toggleConstructionInfo = (tabName) => {
  if (!tabName || !collapseVisible.value[tabName]) return;
  collapseVisible.value[tabName].construction = !collapseVisible.value[tabName].construction;
};

// 解析审批附件
const parseApprovalFile = (fileData) => {
  if (!fileData) return [];
  try {
    let list = typeof fileData === 'string' ? JSON.parse(fileData) : fileData;
    return Array.isArray(list) ? list.filter((item) => item && item.ossId && item.url) : [];
  } catch (e) {
    console.error('解析审批附件失败:', e);
    return [];
  }
};

// 计算属性：是否显示审批信息区域
const showApprovalSection = computed(() => {
  const currentStatus = (form.status || '').trim();
  const validStatuses = ['管委会审批中', '管委会通过', '管委会驳回', '林业局通过', '林业局驳回'];
  return validStatuses.includes(currentStatus);
});

// 计算属性 - 筛选需要显示的审批记录（单条：原记录/最后一条）
const displayApprovalRecord = computed(() => {
  const approvalRecords = Array.isArray(form.approveRecords) ? form.approveRecords : [];
  if (approvalRecords.length === 0) {
    return [];
  } else if (approvalRecords.length === 1) {
    return [approvalRecords[0]];
  } else {
    return [approvalRecords[approvalRecords.length - 1]];
  }
});

// 获取文件名（处理路径）
const getFileName = (name) => {
  if (!name) return '未知文件名';
  const separatorIndex = Math.max(name.lastIndexOf('/'), name.lastIndexOf('\\'));
  return separatorIndex > -1 ? name.slice(separatorIndex + 1) : name;
};

// 解析文件列表（支持JSON字符串/数组格式）
const parseFileList = (fileData) => {
  if (!fileData) return [];
  try {
    let list = [];
    if (typeof fileData === 'string') {
      list = JSON.parse(fileData);
    } else if (Array.isArray(fileData)) {
      list = fileData;
    }
    return list
      .filter((item) => typeof item === 'object' && item !== null && item.ossId && item.url)
      .map((item) => ({
        name: item.name || '未知文件',
        url: item.url,
        ossId: item.ossId
      }));
  } catch (error) {
    console.error('解析文件列表失败:', error);
    return [];
  }
};

// 标签页切换
const handleTabChange = (tabName) => {
  activeTab.value = tabName;
};

// 三维模型预览
const handleModelPreview = () => {
  router.push({
    path: '/screen/preview',
    query: {
      id: form.id,
      type: 'major-view'
    }
  });
};

// 下载模板
const handleDownloadTemplate = (type) => {
  try {
    const templateMap = {
      instructions: {
        fileName: '风景名胜区质检数据填写规则.xlsx',
        filePath: '/风景名胜区质检数据填写规则.xlsx'
      },
      polylineTemplate: {
        fileName: '线模板.zip',
        filePath: '/线模板.zip'
      },
      polygonTemplate: {
        fileName: '面模板.zip',
        filePath: '/面模板.zip'
      },
      threeD: {
        fileName: '模型制作标准和案例.zip',
        filePath: '/模型制作标准和案例.zip'
      }
    };

    const template = templateMap[type];
    if (!template) {
      ElMessage.warning('无效的模板类型');
      return;
    }

    const fileUrl = new URL(template.filePath, import.meta.url).href;
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = template.fileName;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    ElMessage.success(`「${template.fileName}」下载成功`);
  } catch (err) {
    ElMessage.error('模板下载失败：' + (err.message || '未知错误'));
    console.error('下载模板异常：', err);
  }
};

// 取消按钮
const cancel = () => {
  router.push('/project/major');
};

// 初始化加载数据
onMounted(async () => {
  const userData = await userGetInfo();
  currentUserRole.value = userData.data?.roles?.[0] || '';
  const projectId = route.params.id;
  if (projectId) {
    await loadProjectData(projectId);
  }
});

// ========== 核心修改3：加载数据后初始化折叠面板 ==========
const loadProjectData = async (projectId) => {
  try {
    const response = await getInfo(projectId);
    const projectData = response.data;
    Object.assign(form, projectData);

    // 处理多选值
    form.protectionLevel =
      typeof projectData.protectionLevel === 'string'
        ? projectData.protectionLevel.split(',').filter(Boolean)
        : Array.isArray(projectData.protectionLevel)
          ? projectData.protectionLevel
          : [];
    form.projectType =
      typeof projectData.projectType === 'string'
        ? projectData.projectType.split(',').filter(Boolean)
        : Array.isArray(projectData.projectType)
          ? projectData.projectType
          : [];

    // 初始化文件列表
    locationPlanFileList.value = parseFileList(projectData.locationPlan);
    expertOpinionsFileList.value = parseFileList(projectData.expertOpinions);
    meetingMaterialsFileList.value = parseFileList(projectData.meetingMaterials);
    siteSelectionReportFileList.value = parseFileList(projectData.siteSelectionReport);
    approvalDocumentsFileList.value = parseFileList(projectData.approvalDocuments);
    projectRedLineFileList.value = parseFileList(projectData.projectRedLine);
    redLineCoordinateFileList.value = parseFileList(projectData.redLineCoordinate);
    threeDModelFileList.value = parseFileList(projectData.threeDModel);

    // 赋值审批记录
    form.approveRecords = projectData.approveRecords || [];

    // 初始化折叠面板状态（核心修改）
    initCollapseVisible();

    // 激活第一个标签页
    if (tabList.value.length > 0) {
      activeTab.value = tabList.value[0].name;
    }
  } catch (err) {
    ElMessage.error('加载项目数据失败：' + (err.message || '未知错误'));
    router.push('/project/major');
  }
};
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
  width: 120px;
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
  margin-right: 50px;

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

.ele-upload-list__item-content:not(.empty-file) :deep(.el-link) {
  color: #409eff !important;
  text-decoration: none !important;
  display: inline-block;
  transition: background-color 0.2s ease;
  width: 100%;
  box-sizing: border-box;
}

.ele-upload-list__item-content:not(.empty-file) :deep(.el-link:hover) {
  background-color: rgba(64, 158, 255, 0.2) !important;
}

.ele-upload-list__item-content:not(.empty-file) :deep(.el-icon-document) {
  color: #409eff !important;
}

/* ============ 新增：superadmin/sysadmin角色专属样式（和shareProject.vue对齐） ============ */
.admin-view {
  --primary-color: #409eff;
  --border-color: #e5e7eb;
  --bg-color-white: #ffffff;
  --bg-color-light: #f9f9f9;
  --text-color-main: #1f2329;
  --text-color-secondary: #666666;
  --text-color-placeholder: #999999;
}

/* 标签页样式 */
.admin-view :deep(.el-tabs) {
  --el-tabs-header-text-color: var(--text-color-secondary);
  --el-tabs-active-text-color: var(--primary-color);
  --el-tabs-border-color: var(--border-color);
  --el-tabs-header-item-hover-color: var(--primary-color);
}

.admin-view :deep(.el-tabs__header) {
  /* margin: 0 0 20px 0;
  padding-bottom: 10px; */
  border-bottom: 1px solid var(--border-color);
}

.admin-view :deep(.el-tabs__item) {
  font-size: 16px;
  padding: 0 20px;
  height: 40px;
  line-height: 40px;
}

/* 折叠面板样式 */
.admin-view .custom-collapse-item {
  background: var(--bg-color-white);
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  margin-bottom: 16px;
  overflow: hidden;
}

.admin-view .custom-collapse-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  background: var(--bg-color-light);
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.admin-view .custom-collapse-header:hover {
  background: rgba(64, 158, 255, 0.05);
}

.admin-view .arrow-icon {
  width: 16px;
  height: 16px;
  transition: transform 0.2s ease;
}

.admin-view .collapse-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-color-main);
  margin-left: 10px;
  font-family: 'SourceHanSansCN-Regular';
}

.admin-view .custom-collapse-content {
  padding: 20px;
  border-top: 1px solid var(--border-color);
}

/* 项目信息容器样式 */
.admin-view .project-info {
  background: var(--bg-color-white);
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
}

.admin-view .info-content {
  width: 100%;
}

.admin-view .info-item {
  margin-bottom: 16px;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
}

.admin-view .info-item .label {
  width: 240px;
  flex-shrink: 0;
  color: var(--text-color-secondary);
  font-weight: 500;
  line-height: 1.5;
}

.admin-view .info-item .value {
  flex: 1;
  color: var(--text-color-main);
  line-height: 1.5;
  word-break: break-all;
}

.admin-view .file-list {
  /* flex: 1; */
  flex-direction: column;
  gap: 8px;
}

/* 审批信息样式 */
.admin-view .approval-info {
  background: var(--bg-color-white);
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.admin-view .approval-item {
  background: var(--bg-color-light);
  border-radius: 4px;
  margin-bottom: 16px;
  overflow: hidden;
}

.admin-view .approval-sub-item {
  background: var(--bg-color-light);
  border-radius: 4px;
  overflow: hidden;
}

.admin-view .approval-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px !important;
  background: #f0f2f5 !important;
  font-weight: 500;
}

.admin-view .approval-title {
  color: var(--text-color-main);
}

.admin-view .approval-time {
  color: var(--text-color-secondary);
  font-size: 16px;
}

.admin-view .approval-content {
  padding: 16px 20px;
}

.admin-view .feedback-item {
  margin-bottom: 12px;
  display: flex;
}

.admin-view .feedback-item:last-child {
  margin-bottom: 0;
}

.admin-view .no-record-tip {
  padding: 30px 0;
  color: var(--text-color-placeholder);
  font-size: 14px;
}

/* 三维预览按钮样式统一 */
.admin-view .modelPreview {
  padding: 6px 12px;
  font-size: 14px;
  height: auto;
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