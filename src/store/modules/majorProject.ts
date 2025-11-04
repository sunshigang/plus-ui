// src/stores/majorProject.js
import { defineStore } from 'pinia';

export const useMajorProjectStore = defineStore('majorProject', {
  state: () => ({
    // 弹窗显示状态（控制返回后是否自动弹出）
    isEditDialogVisible: false,
    // 表单所有字段（与弹窗form结构完全一致）
    formData: {
      id: '',
      projectName: '',
      projectCode: '',
      administrativeRegion: '',
      scenicArea: '',
      applicantType: '',
      constructionUnit: '',
      organizationCode: '',
      contactPerson: '',
      contactPhone: '',
      protectionLevel: '',
      status: '',
      projectType: '',
      projectUsage: '',
      projectPurpose: '',
      createTime: '',
      updateTime: '',
      projectInvestment: 0,
      planningBasis: '',
      constructionContent: '',
      otherExplanations: '',
      locationPlan: '',
      expertOpinions: '',
      meetingMaterials: '',
      siteSelectionReport: '',
      approvalDocuments: '',
      projectRedLine: '',
      redLineCoordinate: '',
      threeDModel: '', // 存储模型文件URL
      modelCoordinate: ''
    },
    // 三维模型文件列表（与auditThreeDModelFileList对应）
    threeDModelFileList: [],
    // 其他可能需要保留的状态（如禁用状态）
    disabled: false,
    isViewMode: false
  }),
  actions: {
    // 保存弹窗数据（跳转预览前调用）
    saveDialogData(data) {
      this.formData = { ...this.formData, ...data.formData };
      this.threeDModelFileList = [...data.threeDModelFileList];
      this.disabled = data.disabled;
      this.isEditDialogVisible = true; // 标记弹窗需要显示
      this.isViewMode = data.isViewMode;
    },
    // 清空弹窗数据（关闭弹窗时调用，可选）
    clearDialogData() {
      this.isEditDialogVisible = false;
      this.formData = {
        id: '', projectName: '', projectCode: '', administrativeRegion: '', scenicArea: '',
        applicantType: '', constructionUnit: '', organizationCode: '', contactPerson: '',
        contactPhone: '', protectionLevel: '', status: '', projectType: '', projectUsage: '',
        projectPurpose: '', createTime: '', updateTime: '', projectInvestment: 0,
        planningBasis: '', constructionContent: '', otherExplanations: '', locationPlan: '',
        expertOpinions: '', meetingMaterials: '', siteSelectionReport: '', approvalDocuments: '',
        projectRedLine: '', redLineCoordinate: '', threeDModel: '', modelCoordinate: ''
      };
      this.threeDModelFileList = [];
      this.disabled = false;
      this.isViewMode = false;
    }
  }
});