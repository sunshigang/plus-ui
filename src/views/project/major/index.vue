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
            <el-form-item label="保护等级等" prop="protectionLevel">
              <el-input v-model="queryParams.protectionLevel" placeholder="请输入保护等级等" clearable
                @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="拟选位置" prop="projectPurpose">
              <el-input v-model="queryParams.projectPurpose" placeholder="请输入拟选位置" clearable
                @keyup.enter="handleQuery" />
            </el-form-item>

            <!-- <el-form-item label="建设项目总投资（万元）" prop="projectInvestment">
              <el-input v-model="queryParams.projectInvestment" placeholder="请输入建设项目总投资" clearable
                @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="规划依据" prop="planningBasis">
              <el-input v-model="queryParams.planningBasis" placeholder="请输入规划依据" clearable
                @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="其他需要说明的情况" prop="otherExplanations">
              <el-input v-model="queryParams.otherExplanations" placeholder="请输入其他需要说明的情况" clearable
                @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="选址方案" prop="locationPlan">
              <el-input v-model="queryParams.locationPlan" placeholder="请输入选址方案" clearable
                @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="专家评审意见" prop="expertOpinions">
              <el-input v-model="queryParams.expertOpinions" placeholder="请输入专家评审意见" clearable
                @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="会议材料" prop="meetingMaterials">
              <el-input v-model="queryParams.meetingMaterials" placeholder="请输入会议材料" clearable
                @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="选址方案核准申报表" prop="siteSelectionReport">
              <el-input v-model="queryParams.siteSelectionReport" placeholder="请输入选址方案核准申报表" clearable
                @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="立项文件" prop="approvalDocuments">
              <el-input v-model="queryParams.approvalDocuments" placeholder="请输入立项文件" clearable
                @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="项目用地红线图" prop="projectRedLine">
              <el-input v-model="queryParams.projectRedLine" placeholder="请输入项目用地红线图" clearable
                @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="项目红线矢量数据" prop="redLineCoordinate">
              <el-input v-model="queryParams.redLineCoordinate" placeholder="请输入项目红线矢量数据" clearable
                @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="项目三维模型" prop="threeDModel">
              <el-input v-model="queryParams.threeDModel" placeholder="请输入项目三维模型" clearable
                @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="模型坐标" prop="modelCoordinate">
              <el-input v-model="queryParams.modelCoordinate" placeholder="请输入模型坐标" clearable
                @keyup.enter="handleQuery" />
            </el-form-item> -->
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
              v-hasPermi="['system:info:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()"
              v-hasPermi="['system:info:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()"
              v-hasPermi="['system:info:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport"
              v-hasPermi="['system:info:export']">导出</el-button>
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
        <el-table-column label="建设单位名称" align="center" prop="constructionUnit" width="150" />
        <el-table-column label="组织机构代码" align="center" prop="organizationCode" width="150" />
        <el-table-column label="经办人" align="center" prop="contactPerson" />
        <el-table-column label="经办人联系方式" align="center" prop="contactPhone" />
        <el-table-column label="保护等级等" align="center" prop="protectionLevel" />
        <el-table-column label="状态" align="center" prop="status" />
        <el-table-column label="项目类型" align="center" prop="projectType" />
        <el-table-column label="拟选位置" align="center" prop="projectPurpose" width="150" />
        <el-table-column label="创建时间" align="center" prop="createTime" width="100" />
        <el-table-column label="建设项目总投资（万元）" align="center" prop="projectInvestment" />
        <el-table-column label="规划依据" align="center" prop="planningBasis" width="150" />
        <el-table-column label="建设内容涉及规模" align="center" prop="constructionContent" width="150" />
        <el-table-column label="其他需要说明的情况" align="center" prop="otherExplanations" />
        <el-table-column label="选址方案" align="center" prop="locationPlan">
          <!-- <template #default="scope">
            <ImagePreview v-if="previewListResource" :width="100" :height="100" :src="scope.row.url"
              :preview-src-list="[scope.row.url]" />
            <span v-text="scope.row.url" />
          </template> -->
        </el-table-column>
        <el-table-column label="专家评审意见" align="center" prop="expertOpinions" />
        <el-table-column label="会议材料" align="center" prop="meetingMaterials" />
        <el-table-column label="选址方案核准申报表" align="center" prop="siteSelectionReport" />
        <el-table-column label="立项文件L" align="center" prop="approvalDocuments" />
        <el-table-column label="项目用地红线图" align="center" prop="projectRedLine" />
        <el-table-column label="项目红线矢量数据" align="center" prop="redLineCoordinate" />
        <el-table-column label="项目三维模型" align="center" prop="threeDModel" />
        <el-table-column label="模型坐标" align="center" prop="modelCoordinate" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="230">
          <template #default="scope">
            <el-tooltip content="详情查看" placement="top">
              <el-button link type="primary" icon="View" @click="handleView(scope.row)"
                v-hasPermi="['system:info:view']"></el-button>
            </el-tooltip>
            <el-tooltip content="审核" placement="top">
              <el-button link type="primary" icon="Check" @click="handleAudit(scope.row)"
                v-hasPermi="['system:info:audit']"></el-button>
            </el-tooltip>
            <!-- <el-tooltip content="审核" placement="top" v-if="canAudit(scope.row)">
              <el-button link type="primary" icon="Check" @click="handleAudit(scope.row)"
                v-hasPermi="['system:info:audit']"></el-button>
            </el-tooltip> -->
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
                v-hasPermi="['system:info:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
                v-hasPermi="['system:info:remove']"></el-button>
            </el-tooltip>
            <el-tooltip content="数据共享" placement="top" v-if="scope.row.status === '市林业局已通过'">
              <el-button link type="primary" icon="Share" @click="handleShare(scope.row)"
                v-hasPermi="['system:info:share']"></el-button>
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
          <el-form ref="infoFormRef" :model="form" label-width="178px">
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
                <el-form-item label="保护等级等" prop="protectionLevel">
                  <el-input v-model="form.protectionLevel" placeholder="请输入保护等级等" :disabled="disabled" />
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
                :file-list="expertOpinionsFileList" :limit="props.limit" :accept="fileAccept"
                :on-error="(err, file) => handleUploadError(err, file, 'expertOpinions')" :on-exceed="handleExceed"
                :on-success="(res, file) => handleUploadSuccess(res, file, 'expertOpinions')" :show-file-list="false"
                :headers="headers" class="upload-file-uploader" v-if="!disabled">
                <el-button type="primary">选取文件</el-button>
              </el-upload>
              <!-- 专家评审意见专属文件列表 -->
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
                :file-list="siteSelectionReportFileList" :limit="props.limit" :accept="fileAccept"
                :on-error="(err, file) => handleUploadError(err, file, 'siteSelectionReport')" :on-exceed="handleExceed"
                :on-success="(res, file) => handleUploadSuccess(res, file, 'siteSelectionReport')"
                :show-file-list="false" :headers="headers" class="upload-file-uploader" v-if="!disabled">
                <el-button type="primary">选取文件</el-button>
              </el-upload>
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
            </el-form-item>
            <el-form-item label="立项文件" prop="approvalDocuments">
              <el-upload ref="approvalDocumentsUploadRef" multiple :action="uploadFileUrl"
                :before-upload="(file) => handleBeforeUpload(file, 'approvalDocuments')"
                :file-list="approvalDocumentsFileList" :limit="props.limit" :accept="fileAccept"
                :on-error="(err, file) => handleUploadError(err, file, 'approvalDocuments')" :on-exceed="handleExceed"
                :on-success="(res, file) => handleUploadSuccess(res, file, 'approvalDocuments')" :show-file-list="false"
                :headers="headers" class="upload-file-uploader" v-if="!disabled">
                <el-button type="primary">选取文件</el-button>
              </el-upload>
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
            </el-form-item>
            <el-form-item label="项目用地红线图" prop="projectRedLine">
              <el-upload ref="projectRedLineUploadRef" multiple :action="uploadFileUrl"
                :before-upload="(file) => handleBeforeUpload(file, 'projectRedLine')"
                :file-list="projectRedLineFileList" :limit="props.limit" :accept="fileAccept"
                :on-error="(err, file) => handleUploadError(err, file, 'projectRedLine')" :on-exceed="handleExceed"
                :on-success="(res, file) => handleUploadSuccess(res, file, 'projectRedLine')" :show-file-list="false"
                :headers="headers" class="upload-file-uploader" v-if="!disabled">
                <el-button type="primary">选取文件</el-button>
              </el-upload>
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
            </el-form-item>
            <el-form-item label="项目红线矢量数据" prop="redLineCoordinate">
              <el-upload ref="redLineCoordinateUploadRef" multiple :action="uploadFileUrl"
                :before-upload="(file) => handleBeforeUpload(file, 'redLineCoordinate')"
                :file-list="redLineCoordinateFileList" :limit="props.limit" :accept="fileAccept"
                :on-error="(err, file) => handleUploadError(err, file, 'redLineCoordinate')" :on-exceed="handleExceed"
                :on-success="(res, file) => handleUploadSuccess(res, file, 'redLineCoordinate')" :show-file-list="false"
                :headers="headers" class="upload-file-uploader" v-if="!disabled">
                <el-button type="primary">选取文件</el-button>
              </el-upload>
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
            </el-form-item>
            <el-form-item label="项目三维模型" prop="threeDModel">
              <el-upload ref="threeDModelUploadRef" multiple :action="uploadFileUrl"
                :before-upload="(file) => handleBeforeUpload(file, 'threeDModel')" :file-list="threeDModelFileList"
                :limit="props.limit" :accept="fileAccept"
                :on-error="(err, file) => handleUploadError(err, file, 'threeDModel')" :on-exceed="handleExceed"
                :on-success="(res, file) => handleUploadSuccess(res, file, 'threeDModel')" :show-file-list="false"
                :headers="headers" class="upload-file-uploader" v-if="!disabled">
                <el-button type="primary">选取文件</el-button>
              </el-upload>
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
              <el-button link type="primary" icon="Download">模型规范与模板下载</el-button>
            </el-form-item>
            <el-form-item label="模型坐标" prop="modelCoordinate">
              <el-input v-model="form.modelCoordinate" placeholder="请输入模型坐标" :disabled="disabled" />
            </el-form-item>
            <el-form-item label="模型预览" prop="modelPreview">
              <el-button type="primary" icon="Edit" :disabled="!form.id || isViewMode" @click="handleModelPreview">
                三维场景效果预览
              </el-button>
            </el-form-item>
          </el-form>
        </div>
        <!-- 审批信息部分 - 仅在查看模式显示 -->
        <div v-if="isViewMode" class="section approval-info">
          <h3 class="section-title">审批信息</h3>
          <el-form label-width="178px">
            <!-- 管委会审批信息 -->
            <el-form-item label="管委会审批">
              <div class="approval-item">
                <span :class="['status-icon', form.managementApprovalStatus === '通过' ? 'success' : 'error']">
                  {{ form.managementApprovalStatus === '通过' ? '✓' : form.managementApprovalStatus === '驳回' ? '✗' : '-' }}
                </span>
                <span class="status-text">{{ form.managementApprovalStatus || '未审批' }}</span>
              </div>
            </el-form-item>

            <el-form-item label="审批时间">
              <span>{{ form.managementApprovalTime || '-' }}</span>
            </el-form-item>

            <el-form-item label="审批反馈">
              <el-input type="textarea" :value="form.managementFeedback || '无'" disabled :rows="3" />
            </el-form-item>

            <el-form-item label="反馈文件">
              <!-- 管委会审批反馈文件列表 -->
              <transition-group class="upload-file-list el-upload-list el-upload-list--text" name="el-fade-in-linear"
                tag="ul">
                <li v-for="(file, index) in managementFeedbackFileList" :key="file.uid"
                  class="el-upload-list__item ele-upload-list__item-content">
                  <el-link :href="`${file.url}`" :underline="false" target="_blank">
                    <span class="el-icon-document"> {{ getFileName(file.name) }} </span>
                  </el-link>
                </li>
              </transition-group>
            </el-form-item>

            <!-- 市林业局审批信息 - 二次审批时显示 -->
            <template v-if="form.managementApprovalStatus === '通过'">
              <el-form-item label="市林业局审核">
                <div class="approval-item">
                  <span :class="['status-icon', form.forestryApprovalStatus === '通过' ? 'success' : 'error']">
                    {{ form.forestryApprovalStatus === '通过' ? '✓' : form.forestryApprovalStatus === '驳回' ? '✗' : '-' }}
                  </span>
                  <span class="status-text">{{ form.forestryApprovalStatus || '未审核' }}</span>
                </div>
              </el-form-item>

              <el-form-item label="审核时间">
                <span>{{ form.forestryApprovalTime || '-' }}</span>
              </el-form-item>

              <el-form-item label="反馈意见">
                <el-input type="textarea" :value="form.forestryFeedback || '无'" disabled :rows="3" />
              </el-form-item>

              <el-form-item label="反馈文件">
                <!-- 市林业局审核反馈文件列表 -->
                <transition-group class="upload-file-list el-upload-list el-upload-list--text" name="el-fade-in-linear"
                  tag="ul">
                  <li v-for="(file, index) in forestryFeedbackFileList" :key="file.uid"
                    class="el-upload-list__item ele-upload-list__item-content">
                    <el-link :href="`${file.url}`" :underline="false" target="_blank">
                      <span class="el-icon-document"> {{ getFileName(file.name) }} </span>
                    </el-link>
                  </li>
                </transition-group>
              </el-form-item>
            </template>
          </el-form>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer" v-if="!isViewMode">
          <el-button @click="cancel">取消</el-button>
          <el-button type="warning" @click="resetForm">重置</el-button>
          <el-button type="success" @click="temporarilyForm">暂存</el-button>
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确定</el-button>
        </div>
        <div class="dialog-footer" v-if="isViewMode">
          <el-button @click="cancel">取消</el-button>
          <el-button v-if="form.id && canAudit(form)" type="primary" @click="handleAudit(form)"
            v-hasPermi="getAuditPermi(form)">
            {{ form.managementApprovalStatus === '通过' ? '二次审批' : '审批' }}
          </el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 审批对话框 -->
    <el-dialog :title="`${form.managementApprovalStatus === '通过' ? '二次审批' : '项目审批'} - ${auditForm.projectName || ''}`"
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
            <el-descriptions-item label="保护等级等">{{ auditForm.protectionLevel }}</el-descriptions-item>
            <el-descriptions-item label="状态">{{ auditForm.status }}</el-descriptions-item>
            <el-descriptions-item label="项目类型">{{ auditForm.projectType }}</el-descriptions-item>
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
          <h3 class="mb-4">{{ form.managementApprovalStatus === '通过' ? '市林业局审核信息' : '审核信息' }}</h3>
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
import { listInfo, getInfo, stageInfo, delInfo, addInfo, updateInfo, gwhApprove, lyjApprove } from '@/api/project/normal/index';
import { getUserProfile } from '@/api/system/user/index';
import { delOss, listByIds } from '@/api/system/oss';
import { InfoVO, InfoQuery, InfoForm, AuditData } from '@/api/project/normal/types';
import { UserInfo } from '@/api/system/user/types';
import { propTypes } from '@/utils/propTypes';
import { globalHeaders } from '@/utils/request';
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
  projectPurpose: '',
  projectInvestment: '',
  planningBasis: '', // 补充：规划依据
  constructionContent: '', // 补充：建设内容涉及规模
  otherExplanations: '', // 补充：其他需要说明的情况
  feedback: '', // 审核反馈意见
  auditResult: '', // 审核结果：通过/驳回
  modelCoordinate: '',
  auditType: '' as 'forestry' | 'management'
});
const auditFormRef = ref<ElFormInstance>();

// 判断是否可以审核
const canAudit = (row: InfoForm) => {
  const res =  getUserProfile();
  // console.log('canAudit,res',res)
  // // 获取当前登录用户角色
  // const userRole = proxy?.store.getters.role;
  // console.log('canAudit,userRole',userRole)
  // // 1. 管委会用户：只能审核“待审核”或“管委会已驳回后重新提交”的项目
  // if (userRole === 'management' && ['待审核', '管委会已驳回'].includes(row.status)) {
  //   return true;
  // }
  // // 2. 市林业局用户：只能审核“管委会已通过”且未进行过二次审核的项目
  // if (userRole === 'forestry' && row.managementApprovalStatus === '通过' && !row.forestryApprovalStatus) {
  //   return true;
  // }
};

// 修改审核相关方法，区分一次审批和二次审批
const handleAudit = async (row: InfoForm) => {
  auditDialog.projectId = row.id;
  auditForm.projectId = row.id;

  // 获取项目详情
  const res = await getInfo(row.id);
  const projectData = res.data;

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
    projectPurpose: projectData.projectPurpose,
    projectInvestment: projectData.projectInvestment,
    planningBasis: projectData.planningBasis, // 已匹配补充的属性
    constructionContent: projectData.constructionContent, // 已匹配补充的属性
    otherExplanations: projectData.otherExplanations, // 已匹配补充的属性
    modelCoordinate: projectData.modelCoordinate,
    feedback: '',
  });

  // 加载项目文件列表
  // 选址方案
  if (projectData.locationPlan) {
    const locationPlanOssIds = projectData.locationPlan.split(',').join(',');
    const locationPlanRes = await listByIds(locationPlanOssIds);
    auditLocationPlanFileList.value = locationPlanRes.data.map((oss: any) => ({
      name: oss.originalName,
      url: oss.url,
      ossId: oss.ossId,
      uid: new Date().getTime() + Math.random()
    }));
  }
  // 专家评审意见
  if (projectData.expertOpinions) {
    const expertOpinionsOssIds = projectData.expertOpinions.split(',').join(',');
    const expertOpinionsRes = await listByIds(expertOpinionsOssIds);
    auditExpertOpinionsFileList.value = expertOpinionsRes.data.map((oss: any) => ({
      name: oss.originalName,
      url: oss.url,
      ossId: oss.ossId,
      uid: new Date().getTime() + Math.random()
    }));
  }

  // 会议材料
  if (projectData.meetingMaterials) {
    const meetingMaterialsOssIds = projectData.meetingMaterials.split(',').join(',');
    const meetingMaterialsRes = await listByIds(meetingMaterialsOssIds);
    auditMeetingMaterialsFileList.value = meetingMaterialsRes.data.map((oss: any) => ({
      name: oss.originalName,
      url: oss.url,
      ossId: oss.ossId,
      uid: new Date().getTime() + Math.random()
    }));
  }

  // 选址方案核准申报表
  if (projectData.siteSelectionReport) {
    const siteSelectionReportOssIds = projectData.siteSelectionReport.split(',').join(',');
    const siteSelectionReportRes = await listByIds(siteSelectionReportOssIds);
    auditSiteSelectionReportFileList.value = siteSelectionReportRes.data.map((oss: any) => ({
      name: oss.originalName,
      url: oss.url,
      ossId: oss.ossId,
      uid: new Date().getTime() + Math.random()
    }));
  }

  // 立项文件
  if (projectData.approvalDocuments) {
    const approvalDocumentsOssIds = projectData.approvalDocuments.split(',').join(',');
    const approvalDocumentsRes = await listByIds(approvalDocumentsOssIds);
    auditApprovalDocumentsFileList.value = approvalDocumentsRes.data.map((oss: any) => ({
      name: oss.originalName,
      url: oss.url,
      ossId: oss.ossId,
      uid: new Date().getTime() + Math.random()
    }));
  }
  // 项目用地红线图
  if (projectData.projectRedLine) {
    const projectRedLineOssIds = projectData.projectRedLine.split(',').join(',');
    const projectRedLineRes = await listByIds(projectRedLineOssIds);
    auditProjectRedLineFileList.value = projectRedLineRes.data.map((oss: any) => ({
      name: oss.originalName,
      url: oss.url,
      ossId: oss.ossId,
      uid: new Date().getTime() + Math.random()
    }));
  }
  // 项目三维模型
  if (projectData.threeDModel) {
    const threeDModelOssIds = projectData.threeDModel.split(',').join(',');
    const threeDModelRes = await listByIds(threeDModelOssIds);
    auditThreeDModelFileList.value = threeDModelRes.data.map((oss: any) => ({
      name: oss.originalName,
      url: oss.url,
      ossId: oss.ossId,
      uid: new Date().getTime() + Math.random()
    }));
  }
  // 判断是一次审批还是二次审批
  if (projectData.managementApprovalStatus === '通过') {
    // 二次审批 - 市林业局审核
    auditForm.auditType = 'forestry';
  } else {
    // 一次审批 - 管委会审批
    auditForm.auditType = 'management';
  }

  // 清空之前的审核信息
  auditForm.feedback = '';
  feedbackFileList.value = [];

  // 显示审核对话框
  auditDialog.visible = true;
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

// 修改提交审核结果方法，根据审核类型保存不同字段
const submitAuditResult = async (result: '通过' | '驳回') => {
  try {
    buttonLoading.value = true;

    // 准备审核数据
    const auditData: AuditData = {
      projectId: auditForm.projectId,
      auditResult: result,
      feedback: auditForm.feedback,
      feedbackFiles: listToString(feedbackFileList.value),
      auditType: auditForm.auditType // 区分审批类型
    };

    // 区分调用管委会/市林业局审批接口
    if (auditForm.auditType === 'management') {
      await gwhApprove(auditData); // 管委会审批接口
    } else {
      await lyjApprove(auditData); // 市林业局审批接口（新增）
    }

    proxy?.$modal.msgSuccess(`审核${result}成功`);
    auditDialog.visible = false;
    getList(); // 刷新列表
  } catch (err) {
    proxy?.$modal.msgError(`审核操作失败：${(err as Error).message || '未知错误'}`);
  } finally {
    buttonLoading.value = false;
  }
};
// 动态获取审批所需权限
const getAuditPermi = (row: InfoForm) => {
  // 管委会审批（一次审批）需要的权限
  if (!row.managementApprovalStatus || row.managementApprovalStatus === '驳回') {
    return ['management:info:audit'];
  }
  // 市林业局审批（二次审批）需要的权限
  if (row.managementApprovalStatus === '通过' && !row.forestryApprovalStatus) {
    return ['forestry:info:audit'];
  }
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
  fileType: propTypes.array.def(['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'pdf', 'zip', 'rar', 'dwg', 'dxf', 'jpg', 'jpeg', 'png', 'cpg', 'dbf', 'prj', 'sbn', 'sbx', 'shp', 'shp.xml', 'shx']),
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
      threeDModel: { list: threeDModelFileList, formKey: 'threeDModel' },
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
  title: ''
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
  projectPurpose: undefined,
  createTime: undefined,
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
  managementApprovalStatus: undefined, // 管委会审批状态
  managementApprovalTime: undefined,   // 管委会审批时间
  managementFeedback: undefined,       // 管委会审批反馈
  managementFeedbackFiles: undefined,  // 管委会审批反馈文件
  forestryApprovalStatus: undefined,   // 市林业局审核状态
  forestryApprovalTime: undefined,     // 市林业局审核时间
  forestryFeedback: undefined,         // 市林业局审核反馈
  forestryFeedbackFiles: undefined,    // 市林业局审核反馈文件
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
    administrativeRegion: [
      { required: true, message: "所属行政区划不能为空", trigger: "blur" }
    ],
    scenicArea: [
      { required: true, message: "涉及风景名胜区名称不能为空", trigger: "blur" }
    ],
    organizationCode: [
      { required: true, message: "组织机构代码不能为空", trigger: "blur" }
    ],
    contactPerson: [
      { required: true, message: "经办人不能为空", trigger: "blur" }
    ],
    protectionLevel: [
      { required: true, message: "保护等级等不能为空", trigger: "blur" }
    ],
    projectType: [
      { required: true, message: "项目类型不能为空", trigger: "change" }
    ],
    projectPurpose: [
      { required: true, message: "拟选位置不能为空", trigger: "blur" }
    ],
    projectInvestment: [
      { required: true, message: "建设项目总投资不能为空", trigger: "blur" }
    ],
    planningBasis: [
      { required: true, message: "规划依据不能为空", trigger: "blur" }
    ],
    constructionContent: [
      { required: true, message: "建设内容涉及规模不能为空", trigger: "blur" }
    ],
    // otherExplanations: [
    //   { required: true, message: "其他需要说明的情况不能为空", trigger: "blur" }
    // ],
    // locationPlan: [
    //   { required: true, message: "选址方案不能为空", trigger: "blur" }
    // ],
    // expertOpinions: [
    //   { required: true, message: "专家评审意见不能为空", trigger: "blur" }
    // ],
    // meetingMaterials: [
    //   { required: true, message: "会议材料不能为空", trigger: "blur" }
    // ],
    // siteSelectionReport: [
    //   { required: true, message: "选址方案核准申报表不能为空", trigger: "blur" }
    // ],
    // approvalDocuments: [
    //   { required: true, message: "立项文件不能为空", trigger: "blur" }
    // ],
    // projectRedLine: [
    //   { required: true, message: "项目用地红线图不能为空", trigger: "blur" }
    // ],
    // redLineCoordinate: [
    //   { required: true, message: "项目红线矢量数据不能为空", trigger: "blur" }
    // ],
    // threeDModel: [
    //   { required: true, message: "项目三维模型不能为空", trigger: "blur" }
    // ],
    // modelCoordinate: [
    //   { required: true, message: "模型坐标不能为空", trigger: "blur" }
    // ]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询【请填写功能名称】列表 */
const getList = async () => {
  loading.value = true;
  const res = await listInfo(queryParams.value);
  console.log("🚀 ~ getList ~ res:", res)
  infoList.value = res.rows;
  total.value = res.total;
  loading.value = false;
}
// 模型预览按钮点击事件
const handleModelPreview = () => {
  if (!form.value.id) {
    ElMessage.warning('请先保存项目信息');
    return;
  }
  // 实际场景：打开预览页面或弹窗
  // window.open(`/model-preview?id=${form.value.id}`, '_blank');
  // 或调用内部预览组件：proxy?.$modal.open({ title: '三维预览', content: ModelPreview, props: { id: form.value.id } });
};
/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
}

/** 表单重置 */
const reset = () => {
  form.value = { ...initFormData };
  infoFormRef.value?.resetFields();
  // 清空8个字段的文件列表
  locationPlanFileList.value = [];
  expertOpinionsFileList.value = [];
  meetingMaterialsFileList.value = [];
  siteSelectionReportFileList.value = [];
  approvalDocumentsFileList.value = [];
  projectRedLineFileList.value = [];
  redLineCoordinateFileList.value = [];
  threeDModelFileList.value = [];
}

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
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加重大项目信息";
  disabled.value = false; // 启用表单
  isViewMode.value = false; // 非查看模式
}
// 详情查看
const handleView = async (row: InfoVO) => {
  console.log(row)
  // 这里可以复用修改的逻辑，但设置表单为只读
  reset();
  const res = await getInfo(row.id);
  const projectData = res.data;
  Object.assign(form.value, res.data);

  // 加载所有文件列表
  const loadFileList = async (ossIds: string, targetList: any) => {
    if (!ossIds) return;
    const res = await listByIds(ossIds);
    targetList.value = res.data.map((oss: any) => ({
      name: oss.originalName,
      url: oss.url,
      ossId: oss.ossId,
      uid: new Date().getTime() + Math.random()
    }));
  };

  // 逐个加载文件
  await loadFileList(projectData.locationPlan || '', locationPlanFileList);
  await loadFileList(projectData.expertOpinions || '', expertOpinionsFileList);
  await loadFileList(projectData.meetingMaterials || '', meetingMaterialsFileList);
  await loadFileList(projectData.siteSelectionReport || '', siteSelectionReportFileList);
  await loadFileList(projectData.approvalDocuments || '', approvalDocumentsFileList);
  await loadFileList(projectData.projectRedLine || '', projectRedLineFileList);
  await loadFileList(projectData.redLineCoordinate || '', redLineCoordinateFileList);
  await loadFileList(projectData.threeDModel || '', threeDModelFileList);
  await loadFileList(projectData.managementFeedbackFiles || '', managementFeedbackFileList);
  await loadFileList(projectData.forestryFeedbackFiles || '', forestryFeedbackFileList);

  dialog.visible = true;
  dialog.title = "查看重大项目信息";
  // 设置表单为只读状态
  disabled.value = true;
  isViewMode.value = true; // 标记为查看模式
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
/** 修改按钮操作 */
const handleUpdate = async (row?: InfoVO) => {
  reset();
  const _id = row?.id || ids.value[0];
  const res = await getInfo(_id);
  const projectData = res.data;
  Object.assign(form.value, res.data);

  // 加载所有文件列表
  const loadFileList = async (ossIds: string, targetList: any) => {
    if (!ossIds) return;
    const res = await listByIds(ossIds);
    targetList.value = res.data.map((oss: any) => ({
      name: oss.originalName,
      url: oss.url,
      ossId: oss.ossId,
      uid: new Date().getTime() + Math.random()
    }));
  };

  await loadFileList(projectData.locationPlan || '', locationPlanFileList);
  await loadFileList(projectData.expertOpinions || '', expertOpinionsFileList);
  await loadFileList(projectData.meetingMaterials || '', meetingMaterialsFileList);
  await loadFileList(projectData.siteSelectionReport || '', siteSelectionReportFileList);
  await loadFileList(projectData.approvalDocuments || '', approvalDocumentsFileList);
  await loadFileList(projectData.projectRedLine || '', projectRedLineFileList);
  await loadFileList(projectData.redLineCoordinate || '', redLineCoordinateFileList);
  await loadFileList(projectData.threeDModel || '', threeDModelFileList);

  dialog.visible = true;
  dialog.title = "修改重大项目信息";
  disabled.value = false; // 启用表单
  isViewMode.value = false; // 非查看模式
};
/** 重置按钮 */
const resetForm = () => {
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
      if (form.value.id) {
        await updateInfo(form.value).finally(() => buttonLoading.value = false);
      } else {
        await addInfo(form.value).finally(() => buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
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
      threeDModel: threeDModelFileList
    };
    const fileList = fieldMap[field];
    const file = fileList.value[index];

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

onMounted(() => {
  // const userRole = proxy?.$store.getters.role;
  // if (userRole === 'forestry') {
  //   // 市林业局默认看“管委会已通过”的项目
  //   queryParams.value.status = '管委会已通过';
  // }
  getList();
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
</style>
