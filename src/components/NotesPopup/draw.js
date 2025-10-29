import request from '@/utils/request';
export const addMarks = (data) => {
  return request({
    url: '/marks/info',
    method: 'post',
    data: data
  });
};
