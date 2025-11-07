import request from '@/utils/request';
import { DocumentQuery, DocumentVO, DocumentForm } from './types';
import { AxiosPromise } from 'axios';
// 1. 查询项目规划成果归档列表
export function documentList(query: DocumentQuery): AxiosPromise<{ rows: DocumentVO[], total: number }> {
  return request({
    url: '/document/planningFile/list',
    method: 'get',
    params: query
  });
}

// 2. 更新项目规划成果归档版本
export function documentUpdate(data: DocumentForm): AxiosPromise<void> {
  return request({
    url: '/document/planningFile/updateVersion',
    method: 'put',
    data
  });
}

// 3. 导出项目规划成果归档列表
export function documentExport(query: DocumentQuery): AxiosPromise<Blob> {
  return request({
    url: '/document/planningFile/export',
    method: 'post',
    params: query,
    responseType: 'blob' // 导出文件需指定响应类型
  });
}

// 4. 停用项目规划成果归档（path参数ids为数组）
export function documentDisable(ids: Array<string | number>): AxiosPromise<void> {
  return request({
    url: `/document/planningFile/disable/${ids.join(',')}`, // 数组转逗号分隔字符串
    method: 'post'
  });
}

// 5. 获取项目规划成果归档详细信息（path参数id为单个值）
export function documentDetails(id: string | number): AxiosPromise<DocumentVO> {
  return request({
    url: `/document/planningFile/${id}`,
    method: 'get'
  });
}

// 6. 查询项目规划成果归档的版本列表
export function documentHistory(id: string | number): AxiosPromise<DocumentVO[]> {
  return request({
    url: `/document/planningFile/history/${id}`,
    method: 'get'
  });
}
export function documentAdd(data: DocumentForm): AxiosPromise<void> {
  return request({
    url: '/document/planningFile',
    method: 'post',
    data // 传递表单数据（名称、路径、类型等）
  });
}