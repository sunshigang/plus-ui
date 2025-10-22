export interface InfoVO {
  projectUsage?: string; //项目类型
  forestryFeedbackFiles?: string;     // 市林业局审核反馈文件
  managementFeedbackFiles?: string;   // 管委会审批反馈文件
  managementApprovalTime?: string; // 新增：管理审批时间
  managementFeedback?: string; // 新增：管理审批反馈
  forestryApprovalStatus?: string; // 新增：林业审批状态
  forestryApprovalTime?: string; // 新增：林业审批时间
  forestryFeedback?: string; // 新增：林业审批反馈
  managementApprovalStatus?: string; // 新增该属性
  /**
   *
   */
  id: string | number;

  /**
   * 建设活动（建设项目）名称
   */
  projectName: string;

  /**
   * 项目代码
   */
  projectCode: string;

  /**
   * 所属行政区划
   */
  administrativeRegion: string;

  /**
   * 涉及风景名胜区名称
   */
  scenicArea: string;

  /**
   * 单位或个人
   */
  applicantType: string;

  /**
   * 建设单位名称
   */
  constructionUnit: string;

  /**
   * 组织机构代码
   */
  organizationCode: string;

  /**
   * 经办人
   */
  contactPerson: string;

  /**
   * 经办人联系方式
   */
  contactPhone: string;

  /**
   * 保护等级等
   */
  protectionLevel: string;

  /**
   * 项目类型
   */
  projectType: string;

  /**
   * 项目用地
   */
  projectPurpose: string;
  /**
   * 创建时间
   */
  createTimeFrom: string;
  /**
   * 结束时间
   */
  createTimeTo: string;
  /**
   * 建设项目总投资（万元）
   */
  projectInvestment: number;

  /**
   * 规划依据
   */
  planningBasis: string;

  /**
   * 建设内容涉及规模
   */
  constructionContent: string;

  /**
   * 其他需要说明的情况
   */
  otherExplanations: string;

  /**
   * 选址方案URL
   */
  locationPlan: string;

  /**
   * 专家评审意见URL
   */
  expertOpinions: string;

  /**
   * 会议材料URL
   */
  meetingMaterials: string;

  /**
   * 选址方案核准申报表URL
   */
  siteSelectionReport: string;

  /**
   * 立项文件URL
   */
  approvalDocuments: string;

  /**
   * 项目用地红线图URL
   */
  projectRedLine: string;

  /**
   * 项目红线矢量数据URL
   */
  redLineCoordinate: string;

  /**
   * 项目三维模型URL
   */
  threeDModel: string;

  /**
   * 模型坐标（格式：X0,Y0,Z0,X1,Y1,Z1）
   */
  modelCoordinate: string;
  createTime?: string;
  status?: string;

}

export interface InfoForm extends BaseEntity {
  projectUsage?: string;//项目用途
  forestryFeedbackFiles?: string;     // 市林业局审核反馈文件
  managementFeedbackFiles?: string;   // 管委会审批反馈文件
  managementApprovalTime?: string; // 新增：管理审批时间
  managementFeedback?: string; // 新增：管理审批反馈
  forestryApprovalStatus?: string; // 新增：林业审批状态
  forestryApprovalTime?: string; // 新增：林业审批时间
  forestryFeedback?: string; // 新增：林业审批反馈
  managementApprovalStatus?: string; // 新增该属性
  status?: string;
  majorFlag?: boolean;
  /**
   *
   */
  id?: string | number;

  /**
   * 建设活动（建设项目）名称
   */
  projectName?: string;

  /**
   * 项目代码
   */
  projectCode?: string;

  /**
   * 所属行政区划
   */
  administrativeRegion?: string;

  /**
   * 涉及风景名胜区名称
   */
  scenicArea?: string;

  /**
   * 单位或个人
   */
  applicantType?: string;

  /**
   * 建设单位名称
   */
  constructionUnit?: string;

  /**
   * 组织机构代码
   */
  organizationCode?: string;

  /**
   * 经办人
   */
  contactPerson?: string;

  /**
   * 经办人联系方式
   */
  contactPhone?: string;

  /**
   * 保护等级等
   */
  protectionLevel?: string;

  /**
   * 项目类型
   */
  projectType?: string;

  /**
   * 项目用地
   */
  projectPurpose?: string;
  /**
   * 创建时间
   */
  projectCreatedtime?: string;
  /**
   * 建设项目总投资（万元）
   */
  projectInvestment?: number;

  /**
   * 规划依据
   */
  planningBasis?: string;

  /**
   * 建设内容涉及规模
   */
  constructionContent?: string;

  /**
   * 其他需要说明的情况
   */
  otherExplanations?: string;

  /**
   * 选址方案URL
   */
  locationPlan?: string;

  /**
   * 专家评审意见URL
   */
  expertOpinions?: string;

  /**
   * 会议材料URL
   */
  meetingMaterials?: string;

  /**
   * 选址方案核准申报表URL
   */
  siteSelectionReport?: string;

  /**
   * 立项文件URL
   */
  approvalDocuments?: string;

  /**
   * 项目用地红线图URL
   */
  projectRedLine?: string;

  /**
   * 项目红线矢量数据URL
   */
  redLineCoordinate?: string;

  /**
   * 项目三维模型URL
   */
  threeDModel?: string;

  /**
   * 模型坐标（格式：X0,Y0,Z0,X1,Y1,Z1）
   */
  modelCoordinate?: string;
  /**
   * 创建时间
   */
  createTimeFrom?: string;
  createTimeTo?: string;
  createTime?: string;
  modelPreview?: string;
}

export interface InfoQuery extends PageQuery {
  projectUsage?: string;
  status?: string;

  /**
   * 建设活动（建设项目）名称
   */
  projectName?: string;

  /**
   * 项目代码
   */
  projectCode?: string;

  /**
   * 所属行政区划
   */
  administrativeRegion?: string;

  /**
   * 涉及风景名胜区名称
   */
  scenicArea?: string;

  /**
   * 单位或个人
   */
  applicantType?: string;

  /**
   * 建设单位名称
   */
  constructionUnit?: string;

  /**
   * 组织机构代码
   */
  organizationCode?: string;

  /**
   * 经办人
   */
  contactPerson?: string;

  /**
   * 经办人联系方式
   */
  contactPhone?: string;

  /**
   * 保护等级等
   */
  protectionLevel?: string;

  /**
   * 项目类型
   */
  projectType?: string;

  /**
   * 项目用地
   */
  projectPurpose?: string;

  /**
   * 建设项目总投资（万元）
   */
  projectInvestment?: number;

  /**
   * 规划依据
   */
  planningBasis?: string;

  /**
   * 建设内容涉及规模
   */
  constructionContent?: string;

  /**
   * 其他需要说明的情况
   */
  otherExplanations?: string;

  /**
   * 选址方案URL
   */
  locationPlan?: string;

  /**
   * 专家评审意见URL
   */
  expertOpinions?: string;

  /**
   * 会议材料URL
   */
  meetingMaterials?: string;

  /**
   * 选址方案核准申报表URL
   */
  siteSelectionReport?: string;

  /**
   * 立项文件URL
   */
  approvalDocuments?: string;

  /**
   * 项目用地红线图URL
   */
  projectRedLine?: string;

  /**
   * 项目红线矢量数据URL
   */
  redLineCoordinate?: string;

  /**
   * 项目三维模型URL
   */
  threeDModel?: string;

  /**
   * 模型坐标（格式：X0,Y0,Z0,X1,Y1,Z1）
   */
  modelCoordinate?: string;

  /**
   * 日期范围参数
   */
  createTimeFrom?: string;
  /**
   * 结束时间
   */
  createTimeTo?: string;
  createTime?: string;
  majorFlag?: boolean;
  modelPreview?: string;
}
export interface AuditData {
  projectId: string | number;
  auditResult: '通过' | '驳回';
  feedback: string;
  feedbackFiles: string;
  auditType: 'forestry' | 'management';
}



