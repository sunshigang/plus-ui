export interface NoticeVO extends BaseEntity {
  noticeId: number;
  noticeTitle: string;
  noticeType: string;
  noticeContent: string;
  status: string;
  remark: string;
  createByName: string;
  read: boolean;
  id: string;
  message: string;
  majorFlag:boolean;
  projectId: string;
}

export interface NoticeQuery extends PageQuery {
  noticeTitle: string;
  createByName: string;
  status: string;
  noticeType: string;
  read: boolean;
  /** 排序方向，与后端分页参数一致；不传时由接口默认排序 */
  isAsc?: string;
  orderByColumn?: string;
}

export interface NoticeForm {
  noticeId: number | string | undefined;
  noticeTitle: string;
  noticeType: string;
  noticeContent: string;
  status: string;
  remark: string;
  createByName: string;
  read: boolean;
}
