import { defineStore } from 'pinia';
import { reactive } from 'vue';
import { unreadCount, readNotice } from '@/api/system/notice'; // 引入接口
interface NoticeItem {
  id?: number | string; // 新增：公告ID
  title?: string;
  read: boolean;
  message: any;
  time: string;
}

export const useNoticeStore = defineStore('notice', () => {
  const state = reactive({
    notices: [] as NoticeItem[],
    unreadNum: 0 // 新增：未读数量（供 Navbar 显示）
  });

  const addNotice = (notice: NoticeItem) => {
    state.notices.push(notice);
  };

  const removeNotice = (notice: NoticeItem) => {
    state.notices.splice(state.notices.indexOf(notice), 1);
  };
  const clearNotice = () => {
    state.notices = [];
  };
  // 新增：获取未读数量（Navbar 和 Notice 共用）
  const fetchUnreadCount = async () => {
    try {
      const response = await unreadCount();
      state.unreadNum = typeof response.data === 'number' ? response.data : 0;
    } catch (error) {
      console.error('获取未读数量失败', error);
      state.unreadNum = 0;
    }
  };

  // 新增：批量标记已读（供 Notice 调用）
  const batchReadAll = async () => {
    if (state.notices.length === 0) return;
    const noticeIds = state.notices.map(item => item.id);
    await readNotice(noticeIds); // 调用接口标记已读
    state.notices.forEach(item => item.read = true); // 更新 Pinia 状态
    await fetchUnreadCount(); // 刷新未读数量
  };

  return {
    state,
    addNotice,
    removeNotice,
    clearNotice,
    fetchUnreadCount, // 暴露方法
    batchReadAll // 暴露方法
  };
});
