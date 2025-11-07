<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter"
      :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="建设项目名称" prop="projectName">
              <el-input v-model="queryParams.projectName" placeholder="请输入建设项目名称" clearable
                @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="项目代码" prop="projectCode">
              <el-input v-model="queryParams.projectCode" placeholder="请输入项目代码" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="创建时间" style="width: 420px">
              <el-date-picker v-model="dateRangeCreateTime" value-format="YYYY-MM-DD HH:mm:ss" type="daterange"
                range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
                :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"></el-date-picker>
            </el-form-item>
            <el-form-item label="所属行政区划" prop="administrativeRegion">
              <el-input v-model="queryParams.administrativeRegion" placeholder="请输入所属行政区划" clearable
                @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="涉及风景名胜区名称" prop="scenicArea">
              <el-input v-model="queryParams.scenicArea" placeholder="请输入涉及风景名胜区名称" clearable
                @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="建设单位名称" prop="constructionUnit">
              <el-input v-model="queryParams.constructionUnit" placeholder="请输入建设单位名称" clearable
                @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="组织机构代码" prop="organizationCode">
              <el-input v-model="queryParams.organizationCode" placeholder="请输入组织机构代码" clearable
                @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="经办人" prop="contactPerson">
              <el-input v-model="queryParams.contactPerson" placeholder="请输入经办人" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="经办人联系方式" prop="contactPhone">
              <el-input v-model="queryParams.contactPhone" placeholder="请输入经办人联系方式" clearable
                @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="保护等级" prop="protectionLevel">
              <el-input v-model="queryParams.protectionLevel" placeholder="请输入保护等级" clearable
                @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-select v-model="queryParams.status" placeholder="请选择状态" clearable @keyup.enter="handleQuery">
                <el-option label="填报中" value="填报中"></el-option>
                <el-option label="管委会审批中" value="管委会审批中"></el-option>
                <el-option label="管委会通过" value="管委会通过"></el-option>
                <el-option label="管委会驳回" value="管委会驳回"></el-option>
                <el-option label="林业局通过" value="林业局通过"></el-option>
                <el-option label="林业局驳回" value="林业局驳回"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
              <el-button icon="Refresh" @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </transition>

    <el-card shadow="never">
      <template #header>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" plain icon="Plus" @click="handleAdd"
              v-hasPermi="['project:project:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()"
              v-hasPermi="['sproject:project:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()"
              v-hasPermi="['project:project:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport"
              v-hasPermi="['project:project:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" border :data="infoList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="" align="center" prop="id" v-if="false" />
        <el-table-column label="建设项目名称" align="center" prop="projectName" width="150" />
        <el-table-column label="项目代码" align="center" prop="projectCode" width="150" />
        <el-table-column label="所属行政区划" align="center" prop="administrativeRegion" />
        <el-table-column label="涉及风景名胜区名称" align="center" prop="scenicArea" width="150" />
        <el-table-column label="单位或个人" align="center" prop="applicantType" />
        <el-table-column label="状态" align="center" prop="status" width="150">
          <template #default="scope">
            <!-- 彩色圆点：根据status动态切换背景色 -->
            <span class="status-dot" :style="{
              backgroundColor: getStatusColor(scope.row.status),
              display: 'inline-block',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              marginRight: '6px',
              verticalAlign: 'middle' // 与文字垂直居中对齐
            }"></span>
            <!-- 状态文本 -->
            <span class="status-text" :style="{ verticalAlign: 'middle' }">
              {{ scope.row.status }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="项目类型" align="center" prop="projectType" />
        <el-table-column label="项目用途" align="center" prop="projectUsage" />
        <el-table-column label="建设单位名称" align="center" prop="constructionUnit" width="150" />
        <el-table-column label="组织机构代码" align="center" prop="organizationCode" width="150" />
        <el-table-column label="经办人" align="center" prop="contactPerson" />
        <el-table-column label="经办人联系方式" align="center" prop="contactPhone" />
        <el-table-column label="保护等级" align="center" prop="protectionLevel" />
        <el-table-column label="拟选位置" align="center" prop="projectPurpose" width="150" />
        <el-table-column label="建设项目总投资（万元）" align="center" prop="projectInvestment" />
        <el-table-column label="规划依据" align="center" prop="planningBasis" width="150" />
        <el-table-column label="建设内容涉及规模" align="center" prop="constructionContent" width="150" />
        <el-table-column label="其他需要说明的情况" align="center" prop="otherExplanations" />
        <el-table-column label="选址方案" align="center" prop="locationPlan" />
        <el-table-column label="专家评审意见" align="center" prop="expertOpinions" />
        <el-table-column label="会议材料" align="center" prop="meetingMaterials" />
        <el-table-column label="选址方案核准申报表" align="center" prop="siteSelectionReport" />
        <el-table-column label="立项文件L" align="center" prop="approvalDocuments" />
        <el-table-column label="项目用地红线图" align="center" prop="projectRedLine" />
        <el-table-column label="项目红线矢量数据" align="center" prop="redLineCoordinate" />
        <el-table-column label="项目三维模型" align="center" prop="threeDModel" />
        <el-table-column label="模型坐标" align="center" prop="modelCoordinate" />
        <el-table-column label="创建时间" align="center" prop="createTime" width="97" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="120">
          <template #default="scope">
            <!-- 1. 动态提示的“修改”按钮：仅“填报中”“管委会驳回”显示 -->
            <el-tooltip v-if="['填报中', '管委会驳回', '林业局驳回'].includes(scope.row.status) && canEdit()"
              :content="getEditTooltipContent(scope.row.status)" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
                v-hasPermi="['project:project:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="详情查看" placement="top" v-else>
              <el-button link type="primary" icon="View" @click="handleView(scope.row)"
                v-hasPermi="['project:project:query']"></el-button>
            </el-tooltip>
            <el-tooltip content="管委会审核" placement="top" v-if="scope.row.status === '填报中'">
              <el-button link type="primary" icon="Check" @click="handleAudit(scope.row)"
                v-hasPermi="['project:project:gwhApprove']"></el-button>
            </el-tooltip>
            <el-tooltip content="管委会审核" placement="top" v-if="scope.row.status === '管委会审批中'">
              <el-button link type="primary" icon="Check" @click="handleAudit(scope.row)"
                v-hasPermi="['project:project:gwhApprove']"></el-button>
            </el-tooltip>
            <el-tooltip content="林业局审核" placement="top" v-if="scope.row.status === '管委会通过'">
              <el-button link type="primary" icon="Check" @click="handleAudit(scope.row)"
                v-hasPermi="['project:project:lyjApprove']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
                v-hasPermi="['project:project:remove']"></el-button>
            </el-tooltip>
            <el-tooltip content="数据共享" placement="top" v-if="['已通过', '林业局通过'].includes(scope.row.status)">
              <el-button link type="primary" icon="Share" @click="handleShare(scope.row)"
                v-hasPermi="['project:project:share']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="1000px" append-to-body>
      <!-- 分为三部分容器 -->
      <div class="dialog-content">
        <!-- 上部分：项目基础信息 -->
        <div class="section project-basic-info">
          <h3 class="section-title">项目基础信息</h3>
          <el-form ref="infoFormRef" :model="form" label-width="178px" :rules="rules">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="建设项目名称" prop="projectName">
                  <el-input v-model="form.projectName" placeholder="请输入建设项目名称" :disabled="disabled" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="项目代码" prop="projectCode">
                  <el-input v-model="form.projectCode" placeholder="请输入项目代码" :disabled="disabled" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="所属行政区划" prop="administrativeRegion">
                  <el-input v-model="form.administrativeRegion" placeholder="请输入所属行政区划" :disabled="disabled" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="涉及风景名胜区名称" prop="scenicArea">
                  <el-input v-model="form.scenicArea" placeholder="请输入涉及风景名胜区名称" :disabled="disabled" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="项目类型" prop="projectType">
                  <el-input v-model="form.projectType" placeholder="请输入项目类型" :disabled="disabled" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="项目用途" prop="projectUsage">
                  <el-input v-model="form.projectUsage" placeholder="请输入项目用途" :disabled="disabled" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="申请人类型" prop="applicantType">
                  <el-radio-group v-model="form.applicantType" :disabled="disabled">
                    <el-radio-button label="单位">单位</el-radio-button>
                    <el-radio-button label="个人">个人</el-radio-button>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="建设单位名称" prop="constructionUnit">
                  <el-input v-model="form.constructionUnit" placeholder="请输入建设单位名称" :disabled="disabled" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="组织机构代码" prop="organizationCode">
                  <el-input v-model="form.organizationCode" placeholder="请输入组织机构代码" :disabled="disabled" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="经办人" prop="contactPerson">
                  <el-input v-model="form.contactPerson" placeholder="请输入经办人" :disabled="disabled" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="经办人联系方式" prop="contactPhone">
                  <el-input v-model="form.contactPhone" placeholder="请输入经办人联系方式" :disabled="disabled" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="保护等级" prop="protectionLevel">
                  <el-input v-model="form.protectionLevel" placeholder="请输入保护等级" :disabled="disabled" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="拟选位置" prop="projectPurpose">
                  <el-input v-model="form.projectPurpose" placeholder="请输入拟选位置" :disabled="disabled" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="建设项目总投资（万元）" prop="projectInvestment">
                  <el-input v-model="form.projectInvestment" placeholder="请输入建设项目总投资" :disabled="disabled" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="规划依据" prop="planningBasis">
              <el-input v-model="form.planningBasis" type="textarea" placeholder="请输入内容" :disabled="disabled" />
            </el-form-item>
            <el-form-item label="建设内容涉及规模">
              <editor v-model="form.constructionContent" :min-height="192" />
            </el-form-item>
            <el-form-item label="其他需要说明的情况" prop="otherExplanations">
              <el-input v-model="form.otherExplanations" type="textarea" placeholder="请输入内容" :disabled="disabled" />
            </el-form-item>
          </el-form>
        </div>
        <div class="section project-documents">
          <h3 class="section-title">项目相关文件</h3>
          <el-form :model="form" label-width="178px">
            <el-form-item label="选址方案" prop="locationPlan">
              <!-- 选址方案专属上传组件 -->
              <el-upload ref="locationPlanUploadRef" multiple :action="uploadFileUrl"
                :before-upload="(file) => handleBeforeUpload(file, 'locationPlan')" :file-list="locationPlanFileList"
                :limit="props.limit" :accept="fileAccept"
                :on-error="(err, file) => handleUploadError(err, file, 'locationPlan')" :on-exceed="handleExceed"
                :on-success="(res, file) => handleUploadSuccess(res, file, 'locationPlan')" :show-file-list="false"
                :headers="headers" class="upload-file-uploader" v-if="!disabled">
                <el-button type="primary">选取文件</el-button>
              </el-upload>
              <!-- 选址方案专属文件列表 -->
              <transition-group class="upload-file-list el-upload-list el-upload-list--text" name="el-fade-in-linear"
                tag="ul">
                <li v-for="(file, index) in locationPlanFileList" :key="file.uid"
                  class="el-upload-list__item ele-upload-list__item-content">
                  <el-link :href="`${file.url}`" :underline="false" target="_blank">
                    <span class="el-icon-document"> {{ getFileName(file.name) }} </span>
                  </el-link>
                  <div class="ele-upload-list__item-content-action">
                    <el-button type="danger" v-if="!disabled" link
                      @click="handleDeleteUploadFile(index, 'locationPlan')">
                      删除
                    </el-button>
                  </div>
                </li>
              </transition-group>
            </el-form-item>
            <el-form-item label="专家评审意见" prop="expertOpinions">
              <!-- 专家评审意见专属上传组件 -->
              <el-upload ref="expertOpinionsUploadRef" multiple :action="uploadFileUrl"
                :before-upload="(file) => handleBeforeUpload(file, 'expertOpinions')"
                :file-list="auditExpertOpinionsFileList" :limit="props.limit" :accept="fileAccept"
                :on-error="(err, file) => handleUploadError(err, file, 'expertOpinions')" :on-exceed="handleExceed"
                :on-success="(res, file) => handleUploadSuccess(res, file, 'expertOpinions')" :show-file-list="false"
                :headers="headers" class="upload-file-uploader" v-if="!disabled">
                <el-button type="primary">选取文件</el-button>
              </el-upload>
              <!-- 专家评审意见专属文件列表 -->
              <transition-group class="upload-file-list el-upload-list el-upload-list--text" name="el-fade-in-linear"
                tag="ul">
                <li v-for="(file, index) in auditExpertOpinionsFileList" :key="file.uid"
                  class="el-upload-list__item ele-upload-list__item-content">
                  <el-link :href="`${file.url}`" :underline="false" target="_blank">
                    <span class="el-icon-document"> {{ getFileName(file.name) }} </span>
                  </el-link>
                  <div class="ele-upload-list__item-content-action">
                    <el-button type="danger" v-if="!disabled" link
                      @click="handleDeleteUploadFile(index, 'expertOpinions')">
                      删除
                    </el-button>
                  </div>
                </li>
              </transition-group>
            </el-form-item>
            <el-form-item label="会议材料" prop="meetingMaterials">
              <el-upload ref="meetingMaterialsUploadRef" multiple :action="uploadFileUrl"
                :before-upload="(file) => handleBeforeUpload(file, 'meetingMaterials')"
                :file-list="meetingMaterialsFileList" :limit="props.limit" :accept="fileAccept"
                :on-error="(err, file) => handleUploadError(err, file, 'meetingMaterials')" :on-exceed="handleExceed"
                :on-success="(res, file) => handleUploadSuccess(res, file, 'meetingMaterials')" :show-file-list="false"
                :headers="headers" class="upload-file-uploader" v-if="!disabled">
                <el-button type="primary">选取文件</el-button>
              </el-upload>
              <transition-group class="upload-file-list el-upload-list el-upload-list--text" name="el-fade-in-linear"
                tag="ul">
                <li v-for="(file, index) in meetingMaterialsFileList" :key="file.uid"
                  class="el-upload-list__item ele-upload-list__item-content">
                  <el-link :href="`${file.url}`" :underline="false" target="_blank">
                    <span class="el-icon-document"> {{ getFileName(file.name) }} </span>
                  </el-link>
                  <div class="ele-upload-list__item-content-action">
                    <el-button type="danger" v-if="!disabled" link
                      @click="handleDeleteUploadFile(index, 'meetingMaterials')">
                      删除
                    </el-button>
                  </div>
                </li>
              </transition-group>
            </el-form-item>
            <el-form-item label="选址方案核准申报表" prop="siteSelectionReport">
              <el-upload ref="siteSelectionReportUploadRef" multiple :action="uploadFileUrl"
                :before-upload="(file) => handleBeforeUpload(file, 'siteSelectionReport')"
                :file-list="auditSiteSelectionReportFileList" :limit="props.limit" :accept="fileAccept"
                :on-error="(err, file) => handleUploadError(err, file, 'siteSelectionReport')" :on-exceed="handleExceed"
                :on-success="(res, file) => handleUploadSuccess(res, file, 'siteSelectionReport')"
                :show-file-list="false" :headers="headers" class="upload-file-uploader" v-if="!disabled">
                <el-button type="primary">选取文件</el-button>
              </el-upload>
              <transition-group class="upload-file-list el-upload-list el-upload-list--text" name="el-fade-in-linear"
                tag="ul">
                <li v-for="(file, index) in auditSiteSelectionReportFileList" :key="file.uid"
                  class="el-upload-list__item ele-upload-list__item-content">
                  <el-link :href="`${file.url}`" :underline="false" target="_blank">
                    <span class="el-icon-document"> {{ getFileName(file.name) }} </span>
                  </el-link>
                  <div class="ele-upload-list__item-content-action">
                    <el-button type="danger" v-if="!disabled" link
                      @click="handleDeleteUploadFile(index, 'siteSelectionReport')">
                      删除
                    </el-button>
                  </div>
                </li>
              </transition-group>
            </el-form-item>
            <el-form-item label="立项文件" prop="approvalDocuments">
              <el-upload ref="approvalDocumentsUploadRef" multiple :action="uploadFileUrl"
                :before-upload="(file) => handleBeforeUpload(file, 'approvalDocuments')"
                :file-list="auditApprovalDocumentsFileList" :limit="props.limit" :accept="fileAccept"
                :on-error="(err, file) => handleUploadError(err, file, 'approvalDocuments')" :on-exceed="handleExceed"
                :on-success="(res, file) => handleUploadSuccess(res, file, 'approvalDocuments')" :show-file-list="false"
                :headers="headers" class="upload-file-uploader" v-if="!disabled">
                <el-button type="primary">选取文件</el-button>
              </el-upload>
              <transition-group class="upload-file-list el-upload-list el-upload-list--text" name="el-fade-in-linear"
                tag="ul">
                <li v-for="(file, index) in auditApprovalDocumentsFileList" :key="file.uid"
                  class="el-upload-list__item ele-upload-list__item-content">
                  <el-link :href="`${file.url}`" :underline="false" target="_blank">
                    <span class="el-icon-document"> {{ getFileName(file.name) }} </span>
                  </el-link>
                  <div class="ele-upload-list__item-content-action">
                    <el-button type="danger" v-if="!disabled" link
                      @click="handleDeleteUploadFile(index, 'approvalDocuments')">
                      删除
                    </el-button>
                  </div>
                </li>
              </transition-group>
            </el-form-item>
            <el-form-item label="项目用地红线图" prop="projectRedLine">
              <el-upload ref="projectRedLineUploadRef" multiple :action="uploadFileUrl"
                :before-upload="(file) => handleBeforeUpload(file, 'projectRedLine')"
                :file-list="auditProjectRedLineFileList" :limit="props.limit" :accept="fileAccept"
                :on-error="(err, file) => handleUploadError(err, file, 'projectRedLine')" :on-exceed="handleExceed"
                :on-success="(res, file) => handleUploadSuccess(res, file, 'projectRedLine')" :show-file-list="false"
                :headers="headers" class="upload-file-uploader" v-if="!disabled">
                <el-button type="primary">选取文件</el-button>
              </el-upload>
              <transition-group class="upload-file-list el-upload-list el-upload-list--text" name="el-fade-in-linear"
                tag="ul">
                <li v-for="(file, index) in auditProjectRedLineFileList" :key="file.uid"
                  class="el-upload-list__item ele-upload-list__item-content">
                  <el-link :href="`${file.url}`" :underline="false" target="_blank">
                    <span class="el-icon-document"> {{ getFileName(file.name) }} </span>
                  </el-link>
                  <div class="ele-upload-list__item-content-action">
                    <el-button type="danger" v-if="!disabled" link
                      @click="handleDeleteUploadFile(index, 'projectRedLine')">
                      删除
                    </el-button>
                  </div>
                </li>
              </transition-group>
            </el-form-item>
            <el-form-item label="项目红线矢量数据" prop="redLineCoordinate">
              <el-upload ref="redLineCoordinateUploadRef" multiple :action="uploadFileUrl"
                :before-upload="(file) => handleBeforeUpload(file, 'redLineCoordinate')"
                :file-list="auditRedLineCoordinateFileList" :limit="props.limit" :accept="fileAccept"
                :on-error="(err, file) => handleUploadError(err, file, 'redLineCoordinate')" :on-exceed="handleExceed"
                :on-success="(res, file) => handleUploadSuccess(res, file, 'redLineCoordinate')" :show-file-list="false"
                :headers="headers" class="upload-file-uploader" v-if="!disabled">
                <el-button type="primary">选取文件</el-button>
              </el-upload>
              <transition-group class="upload-file-list el-upload-list el-upload-list--text" name="el-fade-in-linear"
                tag="ul">
                <li v-for="(file, index) in auditRedLineCoordinateFileList" :key="file.uid"
                  class="el-upload-list__item ele-upload-list__item-content">
                  <el-link :href="`${file.url}`" :underline="false" target="_blank">
                    <span class="el-icon-document"> {{ getFileName(file.name) }} </span>
                  </el-link>
                  <div class="ele-upload-list__item-content-action">
                    <el-button type="danger" v-if="!disabled" link
                      @click="handleDeleteUploadFile(index, 'redLineCoordinate')">
                      删除
                    </el-button>
                  </div>
                </li>
              </transition-group>
            </el-form-item>
            <el-form-item label="项目三维模型" prop="threeDModel">
              <el-upload ref="threeDModelUploadRef" multiple :action="uploadFileUrl"
                :before-upload="(file) => handleBeforeUpload(file, 'threeDModel')" :file-list="auditThreeDModelFileList"
                :limit="props.limit" :accept="fileAccept"
                :on-error="(err, file) => handleUploadError(err, file, 'threeDModel')" :on-exceed="handleExceed"
                :on-success="(res, file) => handleUploadSuccess(res, file, 'threeDModel')" :show-file-list="false"
                :headers="headers" class="upload-file-uploader" v-if="!disabled"> <!-- 查看模式（disabled=true）隐藏上传按钮 -->
                <el-button type="primary">选取文件</el-button>
              </el-upload>
              <transition-group class="upload-file-list el-upload-list el-upload-list--text" name="el-fade-in-linear"
                tag="ul">
                <li v-for="(file, index) in auditThreeDModelFileList" :key="file.uid"
                  class="el-upload-list__item ele-upload-list__item-content">
                  <el-link :href="`${file.url}`" :underline="false" target="_blank">
                    <span class="el-icon-document"> {{ getFileName(file.name) }} </span>
                  </el-link>
                  <div class="ele-upload-list__item-content-action">
                    <el-button type="danger" v-if="!disabled" link
                      @click="handleDeleteUploadFile(index, 'threeDModel')">
                      删除
                    </el-button>
                  </div>
                </li>
                <!-- 空数据提示 -->
                <li v-if="auditThreeDModelFileList.length === 0" class="el-upload-list__item">
                  <span class="el-icon-info"> 暂无三维模型文件 </span>
                </li>
              </transition-group>
              <el-button link type="primary" icon="Download">模型规范与模板下载</el-button>
            </el-form-item>
            <el-form-item label="模型坐标" prop="modelCoordinate">
              <el-input v-model="form.modelCoordinate" placeholder="请输入模型坐标" :disabled="disabled" />
            </el-form-item>
            <el-form-item label="模型预览" prop="modelPreview">
              <el-button type="primary" :icon="isViewMode ? 'View' : 'Edit'" :disabled="!form.id"
                @click="handleModelPreview">
                三维场景效果预览
              </el-button>
            </el-form-item>
          </el-form>
        </div>
        <!-- 修改审批信息部分 - 不仅在查看模式且在二次填报修改也可查看审批信息 -->
        <div v-if="isViewMode || (!isViewMode && ['管委会驳回', '林业局驳回'].includes(form.status))"
          class="section approval-info">
          <h3 class="section-title"> 审批信息</h3>
          <el-form label-width="178px" disabled>
            <!-- 1. 管委会审批信息：状态为“管委会审批中”或“管委会通过”时显示 -->
            <template v-if="['管委会通过', '管委会驳回', '林业局通过', '林业局驳回', '已通过'].includes(form.status)">
              <el-form-item label="管委会审批状态">
                <div class="approval-item">
                  <span :class="['status-icon',
                    form.approveRecord.gwhApproveResult === '通过' ? 'success' :
                      form.approveRecord.gwhApproveResult === '驳回' ? 'error' : 'pending'
                  ]">
                    {{
                      form.approveRecord.gwhApproveResult === '通过' ? '✓' :
                        form.approveRecord.gwhApproveResult === '驳回' ? '✗' : '-'
                    }}
                  </span>
                  <span class="status-text">
                    {{ form.approveRecord.gwhApproveResult || '待审批' }}
                  </span>
                </div>
              </el-form-item>

              <el-form-item label="审批时间">
                <span>{{ form.approveRecord.gwhApproveTime || '暂无时间' }}</span>
              </el-form-item>

              <el-form-item label="审批反馈">
                <el-input type="textarea" :value="form.approveRecord.gwhApprovalReason || '暂无反馈'" :rows="2"
                  style="background: #fff;" />
              </el-form-item>

              <el-form-item label="反馈文件">
                <transition-group class="upload-file-list el-upload-list el-upload-list--text" name="el-fade-in-linear"
                  tag="ul">
                  <li v-for="(file, index) in managementFeedbackFileList" :key="file.uid"
                    class="el-upload-list__item ele-upload-list__item-content">
                    <el-link :href="`${file.url}`" :underline="false" target="_blank">
                      <span class="el-icon-document"> {{ getFileName(file.name) }} </span>
                    </el-link>
                  </li>
                  <li v-if="managementFeedbackFileList.length === 0" class="el-upload-list__item">
                    <span class="el-icon-info"> 暂无反馈文件 </span>
                  </li>
                </transition-group>
              </el-form-item>
            </template>

            <!-- 2. 市林业局审批信息：不仅查看模式且管委会已通过时显示，另外在林业局通过和林业局驳回也显示审批信息 -->
            <template v-if="['林业局通过', '林业局驳回', '已通过'].includes(form.status)">
              <el-divider content="市林业局审核信息" />
              <el-form-item label="市林业局审核状态">
                <div class="approval-item">
                  <span :class="['status-icon',
                    form.approveRecord.lyjApproveResult === '通过' ? 'success' :
                      form.approveRecord.lyjApproveResult === '驳回' ? 'error' : 'pending'
                  ]">
                    {{
                      form.approveRecord.lyjApproveResult === '通过' ? '✓' :
                        form.approveRecord.lyjApproveResult === '驳回' ? '✗' : '-'
                    }}
                  </span>
                  <span class="status-text">
                    {{ form.approveRecord.lyjApproveResult || '待审核' }}
                  </span>
                </div>
              </el-form-item>

              <el-form-item label="审核时间">
                <span>{{ form.approveRecord.lyjApproveTime || '暂无时间' }}</span>
              </el-form-item>

              <el-form-item label="审核反馈">
                <el-input type="textarea" :value="form.approveRecord.lyjApprovalReason || '暂无反馈意见'" :rows="2"
                  style="background: #fff;" />
              </el-form-item>

              <el-form-item label="审核反馈文件">
                <transition-group class="upload-file-list el-upload-list el-upload-list--text" name="el-fade-in-linear"
                  tag="ul">
                  <li v-for="(file, index) in forestryFeedbackFileList" :key="file.uid"
                    class="el-upload-list__item ele-upload-list__item-content">
                    <el-link :href="`${file.url}`" :underline="false" target="_blank">
                      <span class="el-icon-document"> {{ getFileName(file.name) }} </span>
                    </el-link>
                  </li>
                  <li v-if="forestryFeedbackFileList.length === 0" class="el-upload-list__item">
                    <span class="el-icon-info"> 暂无反馈文件 </span>
                  </li>
                </transition-group>
              </el-form-item>
            </template>

            <!-- 3. 状态为“填报中”时：显示提示文本（可选，增强用户体验） -->
            <template v-if="isViewMode && !form.approveRecord.gwhApproveResult && form.status !== '管委会驳回'">
              <el-form-item>
                <span class="text-gray-500">当前项目暂无审批记录</span>
              </el-form-item>
            </template>
          </el-form>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer" v-if="!isViewMode">
          <el-button @click="cancel">取消</el-button>
          <el-button type="warning" @click="resetForm">重置</el-button>
          <el-button type="success" v-hasPermi="['project:project:stage']" @click="temporarilyForm">暂存</el-button>
          <el-button :loading="buttonLoading" v-hasPermi="['project:project:edit']" type="primary"
            @click="submitForm">确定</el-button>
        </div>
        <div class="dialog-footer" v-if="isViewMode">
          <el-button @click="cancel">取消</el-button>
          <template v-if="form.id && canAudit(form) && !['已通过'].includes(form.status)">
            <!-- 场景1：管委会审批权限（包括林业局驳回、管委会驳回、未审批） -->
            <el-button
              v-if="!form.approveRecord.gwhApproveResult || form.approveRecord.gwhApproveResult === '驳回' || form.approveRecord.lyjApproveResult === '驳回'"
              type="primary" @click="handleAudit(form)" v-hasPermi="['project:project:gwhApprove']">
              审批
            </el-button>
            <!-- 场景2：林业局审批权限（管委会通过、林业局未审批） -->
            <el-button v-else-if="form.approveRecord.gwhApproveResult === '通过' && !form.approveRecord.lyjApproveResult"
              type="primary" @click="handleAudit(form)" v-hasPermi="['project:project:lyjApprove']">
              二次审批
            </el-button>
          </template>
        </div>
      </template>
    </el-dialog>
    <!-- 审批对话框 -->
    <el-dialog
      :title="`${['管委会通过'].includes(form.status || auditForm.status) ? '林业局审批' : '项目审批'} - ${auditForm.projectName || ''}`"
      v-model="auditDialog.visible" width="1000px" append-to-body>
      <div class="audit-content">
        <!-- 第一部分：项目信息展示 -->
        <div class="audit-project-info mb-6">
          <h3 class="mb-4">项目基本信息</h3>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="建设项目名称">{{ auditForm.projectName }}</el-descriptions-item>
            <el-descriptions-item label="项目代码">{{ auditForm.projectCode }}</el-descriptions-item>
            <el-descriptions-item label="所属行政区划">{{ auditForm.administrativeRegion }}</el-descriptions-item>
            <el-descriptions-item label="涉及风景名胜区名称">{{ auditForm.scenicArea }}</el-descriptions-item>
            <el-descriptions-item label="单位或个人">{{ auditForm.applicantType }}</el-descriptions-item>
            <el-descriptions-item label="建设单位名称">{{ auditForm.constructionUnit }}</el-descriptions-item>
            <el-descriptions-item label="组织机构代码">{{ auditForm.organizationCode }}</el-descriptions-item>
            <el-descriptions-item label="经办人">{{ auditForm.contactPerson }}</el-descriptions-item>
            <el-descriptions-item label="经办人联系方式">{{ auditForm.contactPhone }}</el-descriptions-item>
            <el-descriptions-item label="保护等级">{{ auditForm.protectionLevel }}</el-descriptions-item>
            <el-descriptions-item label="状态">{{ auditForm.status }}</el-descriptions-item>
            <el-descriptions-item label="项目类型">{{ auditForm.projectType }}</el-descriptions-item>
            <el-descriptions-item label="项目用途">{{ auditForm.projectUsage }}</el-descriptions-item>
            <el-descriptions-item label="拟选位置">{{ auditForm.projectPurpose }}</el-descriptions-item>
            <el-descriptions-item label="建设项目总投资（万元）">{{ auditForm.projectInvestment }}</el-descriptions-item>
            <el-descriptions-item label="规划依据">{{ auditForm.planningBasis }}</el-descriptions-item>
            <el-descriptions-item label="建设内容涉及规模">{{ auditForm.constructionContent }}</el-descriptions-item>
            <el-descriptions-item label="其他需要说明的情况">{{ auditForm.otherExplanations }}</el-descriptions-item>
          </el-descriptions>

          <h3 class="mt-6 mb-4">项目相关文件</h3>
          <el-descriptions :column="1" border>
            <!-- 选址方案 -->
            <el-descriptions-item label="选址方案">
              <transition-group class="upload-file-list el-upload-list el-upload-list--text" name="el-fade-in-linear"
                tag="ul">
                <li v-for="(file, index) in auditLocationPlanFileList" :key="file.uid"
                  class="el-upload-list__item ele-upload-list__item-content">
                  <el-link :href="`${file.url}`" :underline="false" target="_blank">
                    <span class="el-icon-document"> {{ getFileName(file.name) }} </span>
                  </el-link>
                  <div class="ele-upload-list__item-content-action">
                    <!-- 审核场景通常不允许删除文件，这里禁用删除按钮（可根据实际业务调整） -->
                    <el-button type="danger" link @click="handleDeleteUploadFile(index, 'locationPlan')" disabled>
                      删除
                    </el-button>
                  </div>
                </li>
              </transition-group>
            </el-descriptions-item>

            <!-- 专家评审意见 -->
            <el-descriptions-item label="专家评审意见">
              <transition-group class="upload-file-list el-upload-list el-upload-list--text" name="el-fade-in-linear"
                tag="ul">
                <li v-for="(file, index) in expertOpinionsFileList" :key="file.uid"
                  class="el-upload-list__item ele-upload-list__item-content">
                  <el-link :href="`${file.url}`" :underline="false" target="_blank">
                    <span class="el-icon-document"> {{ getFileName(file.name) }} </span>
                  </el-link>
                  <div class="ele-upload-list__item-content-action">
                    <el-button type="danger" v-if="!disabled" link
                      @click="handleDeleteUploadFile(index, 'expertOpinions')">
                      删除
                    </el-button>
                  </div>
                </li>
              </transition-group>
            </el-descriptions-item>

            <!-- 会议材料 -->
            <el-descriptions-item label="会议材料">
              <transition-group class="upload-file-list el-upload-list el-upload-list--text" name="el-fade-in-linear"
                tag="ul">
                <li v-for="(file, index) in meetingMaterialsFileList" :key="file.uid"
                  class="el-upload-list__item ele-upload-list__item-content">
                  <el-link :href="`${file.url}`" :underline="false" target="_blank">
                    <span class="el-icon-document"> {{ getFileName(file.name) }} </span>
                  </el-link>
                  <div class="ele-upload-list__item-content-action">
                    <el-button type="danger" v-if="!disabled" link
                      @click="handleDeleteUploadFile(index, 'meetingMaterials')">
                      删除
                    </el-button>
                  </div>
                </li>
              </transition-group>
            </el-descriptions-item>

            <!-- 选址方案核准申报表 -->
            <el-descriptions-item label="选址方案核准申报表">
              <transition-group class="upload-file-list el-upload-list el-upload-list--text" name="el-fade-in-linear"
                tag="ul">
                <li v-for="(file, index) in siteSelectionReportFileList" :key="file.uid"
                  class="el-upload-list__item ele-upload-list__item-content">
                  <el-link :href="`${file.url}`" :underline="false" target="_blank">
                    <span class="el-icon-document"> {{ getFileName(file.name) }} </span>
                  </el-link>
                  <div class="ele-upload-list__item-content-action">
                    <el-button type="danger" v-if="!disabled" link
                      @click="handleDeleteUploadFile(index, 'siteSelectionReport')">
                      删除
                    </el-button>
                  </div>
                </li>
              </transition-group>
            </el-descriptions-item>

            <!-- 立项文件 -->
            <el-descriptions-item label="立项文件">
              <transition-group class="upload-file-list el-upload-list el-upload-list--text" name="el-fade-in-linear"
                tag="ul">
                <li v-for="(file, index) in approvalDocumentsFileList" :key="file.uid"
                  class="el-upload-list__item ele-upload-list__item-content">
                  <el-link :href="`${file.url}`" :underline="false" target="_blank">
                    <span class="el-icon-document"> {{ getFileName(file.name) }} </span>
                  </el-link>
                  <div class="ele-upload-list__item-content-action">
                    <el-button type="danger" v-if="!disabled" link
                      @click="handleDeleteUploadFile(index, 'approvalDocuments')">
                      删除
                    </el-button>
                  </div>
                </li>
              </transition-group>
            </el-descriptions-item>
            <el-descriptions-item label="项目用地红线图">
              <transition-group class="upload-file-list el-upload-list el-upload-list--text" name="el-fade-in-linear"
                tag="ul">
                <li v-for="(file, index) in projectRedLineFileList" :key="file.uid"
                  class="el-upload-list__item ele-upload-list__item-content">
                  <el-link :href="`${file.url}`" :underline="false" target="_blank">
                    <span class="el-icon-document"> {{ getFileName(file.name) }} </span>
                  </el-link>
                  <div class="ele-upload-list__item-content-action">
                    <el-button type="danger" v-if="!disabled" link
                      @click="handleDeleteUploadFile(index, 'projectRedLine')">
                      删除
                    </el-button>
                  </div>
                </li>
              </transition-group>
            </el-descriptions-item>
            <el-descriptions-item label="项目红线矢量数据">
              <transition-group class="upload-file-list el-upload-list el-upload-list--text" name="el-fade-in-linear"
                tag="ul">
                <li v-for="(file, index) in redLineCoordinateFileList" :key="file.uid"
                  class="el-upload-list__item ele-upload-list__item-content">
                  <el-link :href="`${file.url}`" :underline="false" target="_blank">
                    <span class="el-icon-document"> {{ getFileName(file.name) }} </span>
                  </el-link>
                  <div class="ele-upload-list__item-content-action">
                    <el-button type="danger" v-if="!disabled" link
                      @click="handleDeleteUploadFile(index, 'redLineCoordinate')">
                      删除
                    </el-button>
                  </div>
                </li>
              </transition-group>
            </el-descriptions-item>
            <el-descriptions-item label="项目三维模型">
              <transition-group class="upload-file-list el-upload-list el-upload-list--text" name="el-fade-in-linear"
                tag="ul">
                <li v-for="(file, index) in threeDModelFileList" :key="file.uid"
                  class="el-upload-list__item ele-upload-list__item-content">
                  <el-link :href="`${file.url}`" :underline="false" target="_blank">
                    <span class="el-icon-document"> {{ getFileName(file.name) }} </span>
                  </el-link>
                  <div class="ele-upload-list__item-content-action">
                    <el-button type="danger" v-if="!disabled" link
                      @click="handleDeleteUploadFile(index, 'threeDModel')">
                      删除
                    </el-button>
                  </div>
                </li>
              </transition-group>
            </el-descriptions-item>
            <el-descriptions-item label="模型坐标">{{ auditForm.modelCoordinate || '-' }}</el-descriptions-item>
          </el-descriptions>
        </div>

        <!-- 第二部分：审核操作区 -->
        <div class="audit-operation-area">
          <h3 class="mb-4">{{ form.approveRecord.gwhApproveResult === '通过' ? '市林业局审核信息' : '审核信息' }}</h3>
          <el-form ref="auditFormRef" :model="auditForm" label-width="120px">
            <el-form-item label="反馈意见" prop="feedback"
              :rules="[{ required: auditForm.auditResult === '驳回', message: '驳回必须填写反馈意见', trigger: 'blur' }]">
              <el-input v-model="auditForm.feedback" type="textarea" :rows="4" placeholder="请输入审核意见（驳回时必须填写）" />
            </el-form-item>
            <el-form-item label="反馈文件">
              <el-upload ref="feedbackFileUploadRef" multiple :action="uploadFileUrl"
                :before-upload="(file) => handleBeforeUpload(file, 'feedback')" :file-list="feedbackFileList"
                :limit="props.limit" :accept="fileAccept"
                :on-error="(err, file) => handleUploadError(err, file, 'feedback')" :on-exceed="handleExceed"
                :on-success="(res, file) => handleUploadSuccess(res, file, 'feedback')" :show-file-list="false"
                :headers="headers" class="upload-file-uploader">
                <el-button type="primary">选取文件</el-button>
              </el-upload>
              <transition-group class="upload-file-list el-upload-list el-upload-list--text" name="el-fade-in-linear"
                tag="ul">
                <li v-for="(file, index) in feedbackFileList" :key="file.uid"
                  class="el-upload-list__item ele-upload-list__item-content">
                  <el-link :href="`${file.url}`" :underline="false" target="_blank">
                    <span class="el-icon-document"> {{ getFileName(file.name) }} </span>
                  </el-link>
                  <div class="ele-upload-list__item-content-action">
                    <el-button type="danger" link @click="handleDeleteUploadFile(index, 'feedback')">
                      删除
                    </el-button>
                  </div>
                </li>
              </transition-group>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <!-- 第三部分：底部按钮 -->
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="auditDialog.visible = false">稍后处理</el-button>
          <el-button type="danger" @click="handleReject">驳回</el-button>
          <el-button type="primary" @click="handleApprove">通过</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Info" lang="ts">
import { useRouter } from 'vue-router'
import { ref, onMounted, nextTick } from 'vue';
import { listInfo, getInfo, stageInfo, delInfo, addInfo, submitInfo, gwhApprove, lyjApprove } from '@/api/project/normal/index';
import { useMajorProjectStore } from '@/store/modules/majorProject';
import { getUserProfile } from '@/api/system/user/index';
import { getInfo as getUserInfo } from '@/api/login';
import { delOss, listByIds } from '@/api/system/oss';
import { InfoVO, InfoQuery, InfoForm, AuditData } from '@/api/project/normal/types';
import { UserInfo } from '@/api/system/user/types';
import { propTypes } from '@/utils/propTypes';
import { globalHeaders } from '@/utils/request';
import bus from '../../../libs/eventbus'
const router = useRouter()
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const dateRangeCreateTime = ref<[string, string]>(['', '']);
const infoList = ref<InfoVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const previewListResource = ref(false);
const isViewMode = ref(false); // 新增：是否为查看模式
// 状态颜色映射：返回对应Hex颜色值
const getStatusColor = (status: string) => {
  switch (status) {
    case '填报中':
      return '#1890ff'; // 蓝色
    case '管委会审批中':
      return '#faad14'; // 橙色
    case '管委会通过':
    case '林业局通过':
    case '已通过':
      return '#62c232'; // 绿色
    case '管委会驳回':
    case '林业局驳回':
      return '#ff4d4f'; // 红色
    default:
      return '#bfbfbf'; // 默认灰色（应对未定义状态）
  }
};

// 动态获取修改按钮的提示文字
const getEditTooltipContent = (status: string) => {
  return status === '填报中' ? '信息填报' : '二次填报';
};
const majorProjectStore = useMajorProjectStore();
//上传文件
// 1. 上传组件 ref（每个字段一个）
const locationPlanUploadRef = ref<ElUploadInstance>(); // 选址方案
const expertOpinionsUploadRef = ref<ElUploadInstance>(); // 专家评审意见
const meetingMaterialsUploadRef = ref<ElUploadInstance>(); // 会议材料
const siteSelectionReportUploadRef = ref<ElUploadInstance>(); // 选址方案核准申报表
const approvalDocumentsUploadRef = ref<ElUploadInstance>(); // 立项文件
const projectRedLineUploadRef = ref<ElUploadInstance>(); // 项目用地红线图
const redLineCoordinateUploadRef = ref<ElUploadInstance>(); // 项目红线矢量数据
const threeDModelUploadRef = ref<ElUploadInstance>(); // 项目三维模型
const feedbackFileUploadRef = ref<ElUploadInstance>(); // 审核文件上传相关
// 补充审核相关的文件列表变量
const auditExpertOpinionsFileList = ref<any[]>([]); // 专家评审意见
const auditMeetingMaterialsFileList = ref<any[]>([]); // 会议材料
const auditSiteSelectionReportFileList = ref<any[]>([]); // 选址方案核准申报表
const auditApprovalDocumentsFileList = ref<any[]>([]); // 立项文件
// 审核相关的文件列表
const auditLocationPlanFileList = ref<any[]>([]);
const auditProjectRedLineFileList = ref<any[]>([]);
const auditThreeDModelFileList = ref<any[]>([]);
const feedbackFileList = ref<any[]>([]);
const auditRedLineCoordinateFileList = ref<any[]>([]);
// 新增审批反馈文件列表
const managementFeedbackFileList = ref<any[]>([]);
const forestryFeedbackFileList = ref<any[]>([]);


// 2. 文件列表（每个字段一个）
const locationPlanFileList = ref<any[]>([]);
const expertOpinionsFileList = ref<any[]>([]);
const meetingMaterialsFileList = ref<any[]>([]);
const siteSelectionReportFileList = ref<any[]>([]);
const approvalDocumentsFileList = ref<any[]>([]);
const projectRedLineFileList = ref<any[]>([]);
const redLineCoordinateFileList = ref<any[]>([]);
const threeDModelFileList = ref<any[]>([]);

// 3. 上传计数与临时列表（按字段区分，用于批量上传管理）
const uploadCount = reactive({
  locationPlan: 0,
  expertOpinions: 0,
  meetingMaterials: 0,
  siteSelectionReport: 0,
  approvalDocuments: 0,
  projectRedLine: 0,
  redLineCoordinate: 0,
  threeDModel: 0,
  feedback: 0
});
const uploadTempList = reactive({
  locationPlan: [] as any[],
  expertOpinions: [] as any[],
  meetingMaterials: [] as any[],
  siteSelectionReport: [] as any[],
  approvalDocuments: [] as any[],
  projectRedLine: [] as any[],
  redLineCoordinate: [] as any[],
  threeDModel: [] as any[],
  feedback: [] as any[]
});

type FileFieldType =
  'locationPlan' | 'expertOpinions' | 'meetingMaterials' |
  'siteSelectionReport' | 'approvalDocuments' | 'projectRedLine' |
  'redLineCoordinate' | 'threeDModel' | 'feedback';

// 2. 新增上传loading管理
const uploadLoading = reactive<Record<FileFieldType | 'feedback', boolean>>({
  locationPlan: false,
  expertOpinions: false,
  meetingMaterials: false,
  siteSelectionReport: false,
  approvalDocuments: false,
  projectRedLine: false,
  redLineCoordinate: false,
  threeDModel: false,
  feedback: false
});
// 审核相关变量
const auditDialog = reactive({
  visible: false,
  projectId: '' as string | number
});

// 审核表单数据
const auditForm = reactive({
  projectId: '' as string | number,
  projectName: '',
  projectCode: '',
  administrativeRegion: '',
  scenicArea: '',
  applicantType: '', // 补充：单位/个人
  constructionUnit: '',
  organizationCode: '', // 补充：组织机构代码
  contactPerson: '', // 补充：经办人
  contactPhone: '', // 补充：经办人联系方式
  protectionLevel: '',
  status: '', // 补充：项目状态
  projectType: '', // 补充：项目类型
  projectUsage: '', // 补充：项目用途
  projectPurpose: '',
  projectInvestment: '',
  planningBasis: '', // 补充：规划依据
  constructionContent: '', // 补充：建设内容涉及规模
  otherExplanations: '', // 补充：其他需要说明的情况
  feedback: '', // 审核反馈意见
  auditResult: '', // 审核结果：通过/驳回
  modelCoordinate: '',
  createTime: '',
  approveRecord: {
    gwhApprovalAttachment: '', // 管委会审批反馈文件
    gwhApprovalReason: '',// 管委会审批反馈
    gwhApproveResult: '',// 管委会审批状态
    gwhApproveTime: '',// 管委会审批时间
    lyjApprovalAttachment: '',// 市林业局审核反馈文件
    lyjApprovalReason: '',// 市林业局审核反馈
    lyjApproveResult: '',// 市林业局审核状态
    lyjApproveTime: '',// 市林业局审核时间
  },
});
const auditFormRef = ref<ElFormInstance>();

// 判断是否可以审核
const canAudit = async (row: InfoForm) => {
  try {
    const res = await getUserInfo();
    if (!res || !res.data || !res.data.roles || res.data.roles.length === 0) {
      console.error('用户角色信息无效');
      return false;
    }
    const userRole = res.data.roles[0];
    if (userRole === 'mca' && (
      !row.approveRecord.gwhApproveResult ||
      row.approveRecord.gwhApproveResult === '驳回' ||
      row.approveRecord.lyjApproveResult === '驳回'
    )) {
      return true;
    }
    // 后续权限判断逻辑
    if (userRole === 'mca' && ['待审核', '管委会已驳回'].includes(row.status)) {
      return true;
    } else if (userRole === 'constructor' && row.status === '填报中') {
      return true;
    } else if (userRole === 'clb_audit' && row.approveRecord.gwhApproveResult === '通过' && !row.approveRecord.lyjApproveResult) {
      return true;
    } else if (userRole === 'plb_approve' && row.status === '省林业局待审核') {
      return true;
    }
    return false;
  } catch (err) {
    console.error('获取用户角色失败：', err);
    return false;
  }
};

// 修改审核相关方法，区分一次审批和二次审批
const handleAudit = async (row: InfoForm) => {
  if (!row.id || (typeof row.id !== 'string' && typeof row.id !== 'number')) {
    proxy?.$modal.msgError('项目ID无效，无法进行审核操作');
    return;
  }
  auditDialog.projectId = row.id;
  auditForm.projectId = row.id;
  try {
    // 获取项目详情
    const res = await getInfo(row.id);
    let projectData = res.data;
    console.log('getInfo 接口完整返回（projectId=' + row.id + '）：', res);
    if (Array.isArray(projectData)) {
      console.warn('接口返回数组（预期单条），已自动取第一条数据', projectData);
      projectData = projectData.length > 0 ? projectData[0] : null;
    }
    // 若处理后仍无数据，提示并终止
    if (!projectData) {
      proxy?.$modal.msgError('未查询到项目详情，请刷新后重试');
      return;
    }
    form.value.status = projectData.status;
    // 填充项目基本信息
    Object.assign(auditForm, {
      projectName: projectData.projectName,
      projectCode: projectData.projectCode,
      administrativeRegion: projectData.administrativeRegion,
      scenicArea: projectData.scenicArea,
      applicantType: projectData.applicantType, // 已匹配补充的属性
      constructionUnit: projectData.constructionUnit,
      organizationCode: projectData.organizationCode, // 已匹配补充的属性
      contactPerson: projectData.contactPerson, // 已匹配补充的属性
      contactPhone: projectData.contactPhone, // 已匹配补充的属性
      protectionLevel: projectData.protectionLevel,
      status: projectData.status, // 已匹配补充的属性
      projectType: projectData.projectType, // 已匹配补充的属性
      projectUsage: projectData.projectUsage,
      projectPurpose: projectData.projectPurpose,
      projectInvestment: projectData.projectInvestment,
      planningBasis: projectData.planningBasis, // 已匹配补充的属性
      constructionContent: projectData.constructionContent, // 已匹配补充的属性
      otherExplanations: projectData.otherExplanations, // 已匹配补充的属性
      modelCoordinate: projectData.modelCoordinate,
      feedback: '',
    });
    await loadAllFileLists(projectData);
    // 清空之前的审核信息
    auditForm.feedback = '';
    feedbackFileList.value = [];

    // 显示审核对话框
    auditDialog.visible = true;
  } catch (err) {
    // 5. 捕获所有异常并提示
    const errorMsg = (err as Error).message || '审核弹窗加载失败';
    proxy?.$modal.msgError(`获取项目信息异常：${errorMsg}`);
    console.error('handleAudit 方法报错：', err); // 打印日志给后端排查
  }
};

// 处理审核通过
const handleApprove = async () => {
  await submitAuditResult('通过');
};

// 处理审核驳回
const handleReject = async () => {
  if (!auditForm.feedback.trim()) {
    proxy?.$modal.msgError('驳回必须填写反馈意见');
    return;
  }
  await submitAuditResult('驳回');
};

// 修改提交审核结果方法（按 form.status 选择接口）
const submitAuditResult = async (result: '通过' | '驳回') => {

  try {
    buttonLoading.value = true;

    // 准备审核数据（原有逻辑不变）
    const auditData: AuditData = {
      projectId: auditForm.projectId,
      approveResult: result,
      approvalReason: auditForm.feedback,
      approvalAttachment: listToString(feedbackFileList.value)
    };
    // form.value.managementApprovalTime = auditForm.feedback;
    // 👇 核心修改：增加对 status 为 undefined/空值的兜底处理
    const currentStatus = form.value.status || auditForm.status; // 优先用 form.status，次之用 auditForm.status
    if (!currentStatus) {
      // 状态完全获取失败时，提示用户并终止操作
      proxy?.$modal.msgError('获取项目状态失败，请刷新页面重试');
      return;
    }

    // 按状态选择接口（逻辑不变，仅将 form.value.status 改为 currentStatus）
    if (currentStatus === '管委会审批中' || currentStatus === '填报中') {
      await gwhApprove(auditData); // 管委会接口
    } else if (currentStatus === '管委会通过') {
      await lyjApprove(auditData); // 市林业局接口
    } else {
      // 仍有未匹配状态时，提示具体异常（便于排查）
      proxy?.$modal.msgError(`未匹配的项目状态：${currentStatus}，请联系管理员`);
      return;
    }

    // 审核成功后的逻辑（原有不变）
    proxy?.$modal.msgSuccess(`审核${result}成功`);
    auditDialog.visible = false;
    getList();
  } catch (err) {
    proxy?.$modal.msgError(`审核操作失败：${(err as Error).message || '未知错误'}`);
  } finally {
    buttonLoading.value = false;
  }
};
// 动态获取审批所需权限
const getAuditPermi = (row: InfoForm) => {
  if (row.approveRecord.lyjApproveResult === '驳回') {
    return ['project:project:gwhApprove'];
  }
  // 场景1：未审批/管委会驳回 → 管委会审批权限
  if (!row.approveRecord.gwhApproveResult || row.approveRecord.gwhApproveResult === '驳回') {
    return ['project:project:gwhApprove'];
  }
  // 场景2：管委会通过、林业局未审批 → 林业局审批权限
  if (row.approveRecord.gwhApproveResult === '通过' && !row.approveRecord.lyjApproveResult) {
    return ['project:project:lyjApprove'];
  }
  // 场景3：已通过（最终状态）→ 无审批权限，返回空数组（但通过模板层控制不渲染按钮）
  if (row.status === '已通过') {
    return [];
  }
  // 其他场景兜底
  return [];
};
const disabled = ref(false);
const fileUploadRef = ref<ElUploadInstance>();
const queryFormRef = ref<ElFormInstance>();
const infoFormRef = ref<ElFormInstance>();
const baseUrl = import.meta.env.VITE_APP_BASE_API;
const uploadFileUrl = ref(baseUrl + '/resource/oss/upload');
const headers = ref(globalHeaders());
const fileList = ref<any[]>([]);
const props = defineProps({
  modelValue: {
    type: [String, Object, Array],
    default: () => []
  },
  // 数量限制
  limit: propTypes.number.def(15),
  // 大小限制(MB)
  fileSize: propTypes.number.def(500),
  // 文件类型, 例如['png', 'jpg', 'jpeg']
  fileType: propTypes.array.def(['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'pdf', 'zip', 'rar', 'dwg', 'dxf', 'jpg', 'jpeg', 'png', 'cpg', 'dbf', 'prj', 'sbn', 'sbx', 'shp', 'shp.xml', 'shx', 'FBX', 'fbm', 'obj', 'pak']),
  // 是否显示提示
  isShowTip: propTypes.bool.def(true),
  // 禁用组件（仅查看文件）
  compDisabled: propTypes.bool.def(false)
});
const emit = defineEmits(['update:modelValue']);
const uploadList = ref<any[]>([]);
const fileAccept = computed(() => props.fileType.map((type) => `.${type}`).join(','));
watch(
  () => props.modelValue,
  async (val) => {
    fileList.value = []; // 先重置，避免残留旧数据
    if (!val) return; // 若val为null/undefined，直接返回

    let list: any[] = [];
    // 1. 若val是数组，先过滤无效值（避免空数组、非对象元素）
    if (Array.isArray(val)) {
      list = val.filter(item => item && typeof item === 'object'); // 只保留有效对象元素
    }
    // 2. 若val是单个ossId（字符串），调用接口获取列表
    else if (typeof val === 'string') {
      try {
        const res = await listByIds(val);
        // 确保res.data是数组，再处理
        list = Array.isArray(res.data)
          ? res.data.map((oss) => ({
            name: oss.originalName,
            url: oss.url,
            ossId: oss.ossId
          }))
          : [];
      } catch (err) {
        proxy?.$modal.msgError('获取文件列表失败');
        list = [];
      }
    }

    // 3. 处理文件列表，生成唯一uid
    let temp = 1;
    fileList.value = list.map((item) => ({
      name: item.name || '未知文件名',
      url: item.url || '',
      ossId: item.ossId || '',
      uid: item.uid || new Date().getTime() + temp++ // 确保uid唯一
    }));
  },
  { deep: true, immediate: true }
);
// 上传成功回调
const handleUploadSuccess = (res: any, file: UploadFile, field: FileFieldType) => {
  if (res.code === 200) {
    // 临时存储对应字段的上传成功文件
    uploadTempList[field].push({
      name: res.data.fileName,
      url: res.data.url,
      ossId: res.data.ossId
    });
    uploadedSuccessfully(field); // 处理对应字段的上传完成逻辑
  } else {
    uploadCount[field]--; // 对应字段计数-1
    proxy?.$modal.closeLoading();
    proxy?.$modal.msgError(res.msg);
    // 对应字段的上传组件移除失败文件
    const uploadRefs = {
      locationPlan: locationPlanUploadRef,
      expertOpinions: expertOpinionsUploadRef,
      meetingMaterials: meetingMaterialsUploadRef,
      siteSelectionReport: siteSelectionReportUploadRef,
      approvalDocuments: approvalDocumentsUploadRef,
      projectRedLine: projectRedLineUploadRef,
      redLineCoordinate: redLineCoordinateUploadRef,
      threeDModel: threeDModelUploadRef,
      feedback: feedbackFileUploadRef
    };
    uploadRefs[field].value?.handleRemove(file);
    uploadedSuccessfully(field);

  }
};
// 上传结束处理
const uploadedSuccessfully = (field: FileFieldType) => {
  if (uploadCount[field] > 0 && uploadTempList[field].length === uploadCount[field]) {
    const fieldMap: Record<FileFieldType, { list: any; formKey: string }> = {
      locationPlan: { list: locationPlanFileList, formKey: 'locationPlan' },
      expertOpinions: { list: expertOpinionsFileList, formKey: 'expertOpinions' },
      meetingMaterials: { list: meetingMaterialsFileList, formKey: 'meetingMaterials' },
      siteSelectionReport: { list: siteSelectionReportFileList, formKey: 'siteSelectionReport' },
      approvalDocuments: { list: approvalDocumentsFileList, formKey: 'approvalDocuments' },
      projectRedLine: { list: projectRedLineFileList, formKey: 'projectRedLine' },
      redLineCoordinate: { list: redLineCoordinateFileList, formKey: 'redLineCoordinate' },
      threeDModel: { list: auditThreeDModelFileList, formKey: 'threeDModel' },
      feedback: { list: feedbackFileList, formKey: 'feedback' }
    };
    const { list, formKey } = fieldMap[field];

    list.value = [...list.value, ...uploadTempList[field]];
    // 只有在主表单中存在该字段时才赋值（审核表单的feedback可能不需要绑定到form）
    if (form.value.hasOwnProperty(formKey)) {
      form.value[formKey] = listToString(list.value);
    }

    uploadTempList[field] = [];
    uploadCount[field] = 0;
    uploadLoading[field] = false;
    proxy?.$modal.closeLoading();
  }
};

// 文件个数超出
const handleExceed = () => {
  proxy?.$modal.msgError(`上传文件数量不能超过 ${props.limit} 个!`);
};

// 上传失败
const handleUploadError = (err: any, file: UploadFile, field: FileFieldType) => {
  // 可以根据字段名显示更具体的错误信息（可选）
  const fieldName = {
    locationPlan: '选址方案',
    expertOpinions: '专家评审意见',
    meetingMaterials: '会议材料',
    siteSelectionReport: '选址方案核准申报表',
    approvalDocuments: '立项文件',
    projectRedLine: '项目用地红线图',
    redLineCoordinate: '项目红线矢量数据',
    threeDModel: '项目三维模型',
    feedback: '反馈文件'
  }[field];
  proxy?.$modal.msgError(`${fieldName || '文件'}上传失败：${err?.msg || '未知错误'}`);
};
// 上传前校检格式和大小
const handleBeforeUpload = (file: any, field: FileFieldType) => {
  // 格式校验
  if (props.fileType.length) {
    const fileExt = file.name.split('.').pop() || '';
    const isTypeOk = props.fileType.includes(fileExt);
    if (!isTypeOk) {
      proxy?.$modal.msgError(`请上传${props.fileType.join('/')}格式文件!`);
      return false;
    }
  }
  // 文件名特殊字符校验
  if (file.name.includes(',')) {
    proxy?.$modal.msgError('文件名不能包含英文逗号!');
    return false;
  }
  // 大小校验
  if (props.fileSize && file.size / 1024 / 1024 >= props.fileSize) {
    proxy?.$modal.msgError(`文件大小不能超过${props.fileSize}MB!`);
    return false;
  }
  // 显示专属loading
  if (!uploadLoading[field]) {
    const fieldName = {
      locationPlan: '选址方案',
      expertOpinions: '专家评审意见',
      meetingMaterials: '会议材料',
      siteSelectionReport: '选址方案核准申报表',
      approvalDocuments: '立项文件',
      projectRedLine: '项目用地红线图',
      redLineCoordinate: '项目红线矢量数据',
      threeDModel: '项目三维模型',
      feedback: '反馈文件'
    }[field];
    proxy?.$modal.loading(`正在上传${fieldName}文件，请稍候...`);
    uploadLoading[field] = true;
  }
  uploadCount[field]++;
  return true;
};

// 获取文件名称
const getFileName = (name: string) => {
  // 如果是url那么取最后的名字 如果不是直接返回
  if (name.lastIndexOf('/') > -1) {
    return name.slice(name.lastIndexOf('/') + 1);
  } else {
    return name;
  }
};
// 对象转成指定字符串分隔
const listToString = (list: any[], separator?: string) => {
  let strs = '';
  separator = separator || ',';
  list.forEach((item) => {
    if (item.ossId) {
      strs += item.ossId + separator;
    }
  });
  return strs != '' ? strs.substring(0, strs.length - 1) : '';
};
const dialog = reactive<DialogOption>({
  visible: false,
  title: '',
});

const initFormData: InfoForm = {
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
  status: undefined,
  projectType: undefined,
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
  approveRecord: {
    gwhApprovalAttachment: undefined, // 管委会审批反馈文件
    gwhApprovalReason: undefined,// 管委会审批反馈
    gwhApproveResult: undefined,// 管委会审批状态
    gwhApproveTime: undefined,// 管委会审批时间
    lyjApprovalAttachment: undefined,// 市林业局审核反馈文件
    lyjApprovalReason: undefined,// 市林业局审核反馈
    lyjApproveResult: undefined,// 市林业局审核状态
    lyjApproveTime: undefined,// 市林业局审核时间
  },
}
const data = reactive<PageData<InfoForm, InfoQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
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
    status: undefined,
    projectType: undefined,
    projectUsage: undefined,
    projectPurpose: undefined,
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
    createTimeFrom: undefined,
    createTimeTo: undefined,
    majorFlag: true,
    // params: {
    // }
  },
  rules: {
    projectName: [
      { required: true, message: "建设项目名称不能为空", trigger: "blur" }
    ],
    administrativeRegion: [
      { required: true, message: "所属行政区划不能为空", trigger: "blur" }
    ],
    scenicArea: [
      { required: true, message: "涉及风景名胜区名称不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询【请填写功能名称】列表 */
const getList = async () => {
  loading.value = true;
  const res = await listInfo(queryParams.value);
  infoList.value = res.rows;
  total.value = res.total;
  loading.value = false;
}
// 模型预览按钮点击事件
const handleModelPreview = async () => {
  if (!form.value.id) {
    ElMessage.warning('请先保存项目信息');
    return;
  }
  const modelFile = auditThreeDModelFileList.value.find(item => item.url);
  if (!modelFile?.url) {
    ElMessage.warning('请先上传项目三维模型文件');
    return;
  }
  // 3. 校验3：模型坐标必须已填写
  if (!form.value.modelCoordinate) {
    ElMessage.warning('请先填写模型坐标');
    return;
  }
  // 核心新增：保存项目预览信息到状态管理
  const projectPreviewInfo = {
    id: form.value.id,
    threeDModel: modelFile.url,
    modelCoordinate: form.value.modelCoordinate,
    type: '重大项目'
  };
  majorProjectStore.savePreviewProjectInfo(projectPreviewInfo); // 保存到store
  majorProjectStore.saveDialogData({
    formData: form.value, // 所有表单字段
    threeDModelFileList: auditThreeDModelFileList.value, // 模型文件列表
    disabled: disabled.value, // 禁用状态
    isViewMode: isViewMode.value
  });
  await router.push('/screen/preview');
  bus.emit('previewModel', projectPreviewInfo);
  console.log('已保存项目预览信息到状态管理：', projectPreviewInfo);
};
/** 取消按钮 */
const cancel = async () => {
  dialog.visible = false;
}

/** 表单重置 */
const reset = async () => {
  form.value = { ...initFormData };
  await nextTick();
  if (infoFormRef.value) {
    infoFormRef.value.resetFields();
    await nextTick();
  }
  // 清空主列表（原有）
  locationPlanFileList.value = [];
  expertOpinionsFileList.value = [];
  meetingMaterialsFileList.value = [];
  siteSelectionReportFileList.value = [];
  approvalDocumentsFileList.value = [];
  projectRedLineFileList.value = [];
  redLineCoordinateFileList.value = [];
  threeDModelFileList.value = [];
  managementFeedbackFileList.value = [];
  forestryFeedbackFileList.value = [];
  // 新增：清空审核列表
  auditLocationPlanFileList.value = [];
  auditExpertOpinionsFileList.value = [];
  auditMeetingMaterialsFileList.value = [];
  auditSiteSelectionReportFileList.value = [];
  auditApprovalDocumentsFileList.value = [];
  auditProjectRedLineFileList.value = [];
  auditRedLineCoordinateFileList.value = [];
  auditThreeDModelFileList.value = []; // 关键：清空三维模型审核列表
  feedbackFileList.value = [];
  return Promise.resolve();
};

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  // 同步日期范围到查询参数
  if (dateRangeCreateTime.value[0] && dateRangeCreateTime.value[1]) {
    queryParams.value.createTimeFrom = dateRangeCreateTime.value[0];
    queryParams.value.createTimeTo = dateRangeCreateTime.value[1];
  } else {
    delete queryParams.value.createTimeFrom;
    delete queryParams.value.createTimeTo;
  }
  getList();
};

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  dateRangeCreateTime.value = ['', ''];
  handleQuery();
};

/** 多选框选中数据 */
const handleSelectionChange = (selection: InfoVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = async () => {
  await reset();
  dialog.title = "添加重大项目信息";
  disabled.value = false; // 启用表单
  isViewMode.value = false;
  dialog.visible = true;
}
const loadAllFileLists = async (projectData: InfoForm) => {
  form.value.approveRecord.gwhApprovalReason = projectData.approveRecord.gwhApprovalReason || '';
  // ---------- 新增：加载管委会审批反馈文件（关键修复） ----------
  if (projectData.approveRecord?.gwhApprovalAttachment) {
    const managementOssIds = projectData.approveRecord.gwhApprovalAttachment.split(',').filter(id => id.trim()); // 过滤空ID
    if (managementOssIds.length > 0) {
      try {
        const managementRes = await listByIds(managementOssIds.join(','));
        managementFeedbackFileList.value = managementRes.data.map((oss: any) => ({
          name: oss.originalName,
          url: oss.url,
          ossId: oss.ossId,
          uid: new Date().getTime() + Math.random()
        }));
      } catch (err) {
        console.error('加载管委会反馈文件失败：', err);
        managementFeedbackFileList.value = []; // 失败时清空列表
      }
    } else {
      managementFeedbackFileList.value = [];
    }
  } else {
    // 无反馈文件时，强制清空列表，避免残留旧数据
    managementFeedbackFileList.value = [];
  }

  // ---------- 1. 选址方案 ----------
  if (projectData.locationPlan) {
    const locationPlanOssIds = projectData.locationPlan.split(',').join(',');
    const locationPlanRes = await listByIds(locationPlanOssIds);
    locationPlanFileList.value = locationPlanRes.data.map((oss: any) => ({
      name: oss.originalName,
      url: oss.url,
      ossId: oss.ossId,
      uid: new Date().getTime() + Math.random()
    }));
  }
  // ---------- 2. 专家评审意见（新增，原遗漏） ----------
  if (projectData.expertOpinions) {
    const expertOpinionsOssIds = projectData.expertOpinions.split(',').join(',');
    const expertOpinionsRes = await listByIds(expertOpinionsOssIds);
    expertOpinionsFileList.value = expertOpinionsRes.data.map((oss: any) => ({
      name: oss.originalName,
      url: oss.url,
      ossId: oss.ossId,
      uid: new Date().getTime() + Math.random()
    }));
  }
  // ---------- 3. 会议材料（新增，原遗漏） ----------
  if (projectData.meetingMaterials) {
    const meetingMaterialsOssIds = projectData.meetingMaterials.split(',').join(',');
    const meetingMaterialsRes = await listByIds(meetingMaterialsOssIds);
    meetingMaterialsFileList.value = meetingMaterialsRes.data.map((oss: any) => ({
      name: oss.originalName,
      url: oss.url,
      ossId: oss.ossId,
      uid: new Date().getTime() + Math.random()
    }));
  }
  // ---------- 4. 选址方案核准申报表（新增，原遗漏） ----------
  if (projectData.siteSelectionReport) {
    const siteSelectionReportOssIds = projectData.siteSelectionReport.split(',').join(',');
    const siteSelectionReportRes = await listByIds(siteSelectionReportOssIds);
    siteSelectionReportFileList.value = siteSelectionReportRes.data.map((oss: any) => ({
      name: oss.originalName,
      url: oss.url,
      ossId: oss.ossId,
      uid: new Date().getTime() + Math.random()
    }));
  }
  // ---------- 5. 立项文件（新增，原遗漏） ----------
  if (projectData.approvalDocuments) {
    const approvalDocumentsOssIds = projectData.approvalDocuments.split(',').join(',');
    const approvalDocumentsRes = await listByIds(approvalDocumentsOssIds);
    approvalDocumentsFileList.value = approvalDocumentsRes.data.map((oss: any) => ({
      name: oss.originalName,
      url: oss.url,
      ossId: oss.ossId,
      uid: new Date().getTime() + Math.random()
    }));
  }
  // ---------- 6. 项目用地红线图（新增，原遗漏） ----------
  if (projectData.projectRedLine) {
    const projectRedLineOssIds = projectData.projectRedLine.split(',').join(',');
    const projectRedLineRes = await listByIds(projectRedLineOssIds);
    projectRedLineFileList.value = projectRedLineRes.data.map((oss: any) => ({
      name: oss.originalName,
      url: oss.url,
      ossId: oss.ossId,
      uid: new Date().getTime() + Math.random()
    }));
  }
  // ---------- 7. 项目红线矢量数据（新增，原遗漏） ----------
  if (projectData.redLineCoordinate) {
    const redLineCoordinateOssIds = projectData.redLineCoordinate.split(',').join(',');
    const redLineCoordinateRes = await listByIds(redLineCoordinateOssIds);
    redLineCoordinateFileList.value = redLineCoordinateRes.data.map((oss: any) => ({
      name: oss.originalName,
      url: oss.url,
      ossId: oss.ossId,
      uid: new Date().getTime() + Math.random()
    }));
  }
  // ---------- 8. 项目三维模型（新增，原遗漏） ----------
  if (projectData.threeDModel) {
    const threeDModelOssIds = projectData.threeDModel.split(',').join(',');
    const threeDModelRes = await listByIds(threeDModelOssIds);
    auditThreeDModelFileList.value = threeDModelRes.data.map((oss: any) => ({
      name: oss.originalName,
      url: oss.url,
      ossId: oss.ossId,
      uid: new Date().getTime() + Math.random()
    }));
    // 同步更新表单 threeDModel 字段（确保数据一致性）
    form.value.threeDModel = projectData.threeDModel;
  } else {
    // 若无模型数据，清空两个列表避免残留
    auditThreeDModelFileList.value = [];
    threeDModelFileList.value = [];
    form.value.threeDModel = '';
  }

  // ---------- 新增：10. 市林业局审核反馈文件 ----------
  if (projectData.approveRecord?.lyjApprovalAttachment) {
    const forestryOssIds = projectData.approveRecord.lyjApprovalAttachment.split(',').filter(id => id.trim());
    if (forestryOssIds.length > 0) {
      try {
        const forestryRes = await listByIds(forestryOssIds.join(','));
        forestryFeedbackFileList.value = forestryRes.data.map((oss: any) => ({
          name: oss.originalName,
          url: oss.url,
          ossId: oss.ossId,
          uid: new Date().getTime() + Math.random()
        }));
      } catch (err) {
        console.error('加载市林业局反馈文件失败：', err);
        forestryFeedbackFileList.value = [];
      }
    } else {
      forestryFeedbackFileList.value = [];
    }
  } else {
    forestryFeedbackFileList.value = [];
  }
};
// 详情查看
const handleView = async (row: InfoVO) => {
  try {
    await reset();
    const res = await getInfo(row.id);
    const projectData = res.data;
    console.log("🚀 ~ handleView ~ projectData:", projectData)
    Object.assign(form.value, res.data);
    await loadAllFileLists(projectData);
    dialog.visible = true;
    dialog.title = "查看重大项目信息";
    // console.log('form', form.value)
    // 设置表单为只读状态
    disabled.value = true;
    isViewMode.value = true; // 标记为查看模式
  } catch (err) {
    console.error('查看项目失败：', err);
    proxy?.$modal.msgError('加载项目信息失败，请重试');
  }
};
// 数据共享
const handleShare = async (row: InfoVO) => {
  try {
    // 显示确认对话框
    await proxy?.$modal.confirm('确定要将此项目数据共享吗？');

    // 调用数据共享接口
    // await shareInfo(row.id);

    // 显示成功消息
    proxy?.$modal.msgSuccess("数据共享成功");

    // 刷新列表
    getList();
  } catch (err) {
    // 如果用户取消或发生错误，不做处理或显示错误消息
    if (err !== 'cancel') {
      proxy?.$modal.msgError("数据共享失败：" + (err as Error).message || "未知错误");
    }
  }
};
// 校验当前用户是否有修改权限
const canEdit = async () => {
  try {
    const res = await getUserInfo();
    const userRoles = res.data?.roles || [];
    // 根据角色判断是否有修改权限（示例：管理员、建设单位有修改权限）
    return userRoles.some(role => ['superadmin', 'sysadmin', 'constructor', 'mca', 'clb_audit', 'plb_approve'].includes(role));
  } catch (err) {
    console.error('校验修改权限失败：', err);
    return false;
  }
};
/** 修改按钮操作 */
const handleUpdate = async (row?: InfoVO) => {
  const hasEditPermi = await canEdit();
  if (!hasEditPermi) {
    proxy?.$modal.msgError('当前操作没有权限');
    return;
  }
  reset();
  const _id = row?.id || ids.value[0];
  const res = await getInfo(_id);
  const projectData = res.data;
  Object.assign(form.value, res.data);
  await loadAllFileLists(projectData);
  dialog.title = "修改重大项目信息";
  disabled.value = false; // 启用表单
  isViewMode.value = false;
  dialog.visible = true;
};
/** 重置按钮 */
const resetForm = () => {
  console.log("🚀 ~ resetForm ~ form.value.id:", form.value.id)
  if (form.value.id) {
    handleUpdate();
  } else {
    reset();
  }
}
/** 暂存按钮 */
const temporarilyForm = () => {
  infoFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      try {
        await stageInfo(form.value);
        proxy?.$modal.msgSuccess("暂存成功");
        dialog.visible = false;
        await getList();
      } catch (err) {
        proxy?.$modal.msgError("暂存失败：" + (err as Error).message || "未知错误");
      } finally {
        buttonLoading.value = false;
      }
    }
  });
}
/** 提交按钮 */
const submitForm = () => {
  infoFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      try {
        if (form.value.id) {
          await submitInfo(form.value);
        } else {
          await addInfo(form.value);
        }
        proxy?.$modal.msgSuccess("操作成功");
        dialog.visible = false;
        await getList();
      } catch (err) {
        proxy?.$modal.msgError("操作失败：" + (err as Error).message || "未知错误");
      } finally {
        buttonLoading.value = false;
      }
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: InfoVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除建设项目？').finally(() => loading.value = false);
  await delInfo(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

// 删除文件
const handleDeleteUploadFile = async (index: number, field: FileFieldType) => {
  if (!proxy) {
    console.error('组件实例 proxy 未获取到');
    return;
  }
  const fieldName = {
    locationPlan: '选址方案',
    expertOpinions: '专家评审意见',
    meetingMaterials: '会议材料',
    siteSelectionReport: '选址方案核准申报表',
    approvalDocuments: '立项文件',
    projectRedLine: '项目用地红线图',
    redLineCoordinate: '项目红线矢量数据',
    threeDModel: '项目三维模型'
  }[field];
  if (!proxy?.$modal) {
    ElMessage.error('操作失败：模态框组件未加载');
    return;
  }
  try {
    await proxy.$modal.confirm(`是否确认删除该${fieldName}文件？`);
  } catch (err) {
    return; // 用户点击“取消”时，终止函数
  }
  const loading = ElLoading.service({
    target: proxy.$el, // 加载圈仅在当前组件内显示（推荐），若想精准定位可调整target
    text: `正在删除${fieldName}文件...`, // 加载提示文本
    background: 'rgba(0, 0, 0, 0.2)', // 半透明背景（提升视觉体验）
    lock: true // 锁定背景滚动（可选）
  });

  try {
    const fieldMap = {
      locationPlan: locationPlanFileList,
      expertOpinions: expertOpinionsFileList,
      meetingMaterials: meetingMaterialsFileList,
      siteSelectionReport: siteSelectionReportFileList,
      approvalDocuments: approvalDocumentsFileList,
      projectRedLine: projectRedLineFileList,
      redLineCoordinate: redLineCoordinateFileList,
      threeDModel: auditThreeDModelFileList
    };
    const fileList = fieldMap[field];
    const file = fileList.value[index];
    if (!file.ossId) {
      proxy?.$modal.msgError(`${fieldName}文件ID不存在，无法删除`);
      return;
    }
    await delOss(file.ossId);
    fileList.value.splice(index, 1);
    form.value[field] = listToString(fileList.value);
    proxy?.$modal.msgSuccess(`${fieldName}文件删除成功`);
  } catch (err) {
    proxy?.$modal.msgError(`${fieldName}文件删除失败，请重试`);
  } finally {
    loading.close();
  }
};
/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('system/info/export', {
    ...queryParams.value
  }, `info_${new Date().getTime()}.xlsx`)
}
onMounted(async () => { // 注意添加async关键字
  try {
    // 加载项目列表
    getList();
    const { isEditDialogVisible, formData, threeDModelFileList, disabled: storeDisabled, isViewMode: storeIsViewMode } = majorProjectStore;
    // 若需要显示弹窗，恢复所有数据
    if (isEditDialogVisible) {
      form.value = { ...form.value, ...formData }; // 恢复表单字段
      auditThreeDModelFileList.value = [...threeDModelFileList]; // 恢复模型文件列表
      disabled.value = storeDisabled; // 恢复禁用状态
      isViewMode.value = storeIsViewMode; // 恢复查看模式状态
      dialog.visible = true; // 自动弹出弹窗
    }
  } catch (err) {
    console.error('获取用户信息失败：', err);
    // 即使获取失败，仍尝试加载列表（可选）
    getList();
  }
});
</script>
<style lang="scss" scoped>
:deep(.el-form--inline .el-form-item__label) {
  width: 180px !important; // !important 可选，用于覆盖全局样式的优先级
  text-align: right; // 可选：让标签右对齐，避免文字与输入框间距异常
}

.upload-file-uploader {
  margin-bottom: 5px;
}

.upload-file-list .el-upload-list__item {
  border: 1px solid #e4e7ed;
  line-height: 2;
  margin-bottom: 10px;
  position: relative;
}

.upload-file-list .ele-upload-list__item-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: inherit;
}

.ele-upload-list__item-content-action .el-link {
  margin-right: 10px;
}

.audit-project-info {
  border-bottom: 1px solid #e4e7ed;
  padding-bottom: 10px;
}

.audit-operation-area {
  margin-top: 15px;
}

.file-item {
  margin-right: 15px;
  display: inline-block;
  margin-bottom: 5px;
}

.el-descriptions__label {
  font-weight: bold !important;
}

h3 {
  font-size: 16px;
  color: #1f2329;
  margin-top: 10px;
}

// 新增样式
.dialog-content {
  max-height: 70vh;
  overflow-y: auto;
  padding-right: 10px;
}

.section {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #1f2329;
  padding-left: 5px;
  border-left: 3px solid #409eff;
}

// 审批状态样式
.approval-item {
  display: flex;
  align-items: center;

  .status-icon {
    display: inline-block;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    text-align: center;
    line-height: 20px;
    margin-right: 8px;
    font-weight: bold;

    &.success {
      background-color: #52c41a;
      color: white;
    }

    &.error {
      background-color: #f5222d;
      color: white;
    }

    &.pending {
      background-color: #faad14; // 未审核-橙色
    }
  }
}

.approval-info:has(.status-text:contains("林业局驳回")) {
  .section-title {
    color: #f04134;
    border-left-color: #f04134;
  }
}

// 响应式调整
@media (max-width: 768px) {
  .el-row {
    .el-col {
      &:span-12 {
        width: 100% !important;
      }
    }
  }
}

.status-dot {
  // 已通过内联样式控制核心属性，此处可补充兼容性样式（可选）
  vertical-align: middle !important;
}

.status-text {
  vertical-align: middle !important;
}

// 操作栏按钮间距调整（可选，避免按钮过于拥挤）
:deep(.el-table-column__content .el-button) {
  margin: 0 4px;
}
</style>
