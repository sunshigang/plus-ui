import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { InfoVO, InfoForm, InfoQuery } from '@/api/project/normal/types';

/**
 * 查询【请填写功能名称】列表
 * @param query
 * @returns {*}
 */

export const listInfo = (query?: InfoQuery): AxiosPromise<InfoVO[]> => {
  return request({
    url: '/project/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询【请填写功能名称】详细
 * @param id
 */
export const getInfo = (id: string | number): AxiosPromise<InfoVO> => {
  return request({
    url: '/project/' + id,
    method: 'get'
  });
};

/**
 * 新增【请填写功能名称】
 * @param data
 */
export const addInfo = (data: InfoForm) => {
  return request({
    url: '/project/submit',
    method: 'post',
    data: data
  });
};

/**
 * 修改【请填写功能名称】
 * @param data
 */
export const updateInfo = (data: InfoForm) => {
  return request({
    url: '/project',
    method: 'put',
    data: data
  });
};

/**
 * 删除【请填写功能名称】
 * @param id
 */
export const delInfo = (id: string | number | Array<string | number>) => {
  return request({
    url: '/project/' + id,
    method: 'delete'
  });
};
/**
 * 项目暂存
 * @param id
 */
export const stageInfo = (data: InfoForm) => {
  return request({
    url: '/project/stage',
    method: 'post',
    data: data
  });
};
