import request from '@/utils/request';
export const getMarkList = () => {
  return request({
    url: '/marks/info/list',
    method: 'get',
  });
};
