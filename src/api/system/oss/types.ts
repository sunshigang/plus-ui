export interface OssVO extends BaseEntity {
  ossId: string | number;
  fileName: string;
  originalName: string;
  fileSuffix: string;
  url: string;
  createByName: string;
  service: string;
  ossIds?: string;
  name?: string;
  id?: string;
  disabledFlag?: boolean;
  urls?: string;
}

export interface OssQuery extends PageQuery {
  fileName: string;
  originalName: string;
  fileSuffix: string;
  createTime: string;
  service: string;
  orderByColumn: string;
  isAsc: string;
}
export interface OssForm {
  file: undefined | string;
}
