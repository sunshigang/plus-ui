export interface DocumentVO extends BaseEntity {
  id: string;
  name?: string; // 规划文件名称
  urls: string; // 文件路径URL（多个用逗号分隔）
  fileSuffix: string; // 文件后缀名
  disabledFlag?: boolean; // 停用标记（true=停用，false=启用）
  createDept?: string | number; // 创建部门
  createBy?: string | number; // 创建者
  // createTime?: string; // 创建时间
  updateBy?: string | number; // 更新者
  updateTime?: string; // 更新时间
  ossIds: string;
  params?: {
    property1: string;
    property2: string;
  };
  versionId: string | number;
  fileId: string | number;
  versionUrls: string;
  versionSuffix: string;
  versionCreateTime: string;
}

// 项目规划成果归档查询参数
export interface DocumentQuery extends PageQuery {
  pageNum: number; // 页码（必选）
  pageSize: number; // 每页条数（必选）
  name?: string; // 文件名称（可选）
  fileSuffix?: string; // 文件后缀（可选）
  updateTime?: string; // 更新时间（可选）
  disabledFlag?: boolean; // 状态（可选）
  orderByColumn?: string; // 排序列（可选）
  isAsc?: string; // 排序方向（可选）
}

// 关键：确保DocumentForm接口存在并导出
export interface DocumentForm {
  id?: string | number;
  name?: string;
  ossIds?: string; // 存储上传文件的OSS ID（多个用逗号分隔）
  urls?: string; // 可选：文件URL，可从OSS接口获取
  fileSuffix?: string; // 文件后缀，自动提取
  disabledFlag?: boolean;
  updateTime?: string;
}
export interface DocumentAddForm extends DocumentForm {
  // 新增专属字段（如无则直接用DocumentForm）
}
