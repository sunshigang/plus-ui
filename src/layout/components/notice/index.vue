<template>
  <div v-loading="state.loading" class="layout-navbars-breadcrumb-user-news">
    <div class="head-box">
      <div class="head-box-title">通知公告</div>
      <div class="head-box-btn" @click="readAll">全部已读</div>
    </div>
    <div v-loading="state.loading" class="content-box">
      <template v-if="newsList.length > 0">
        <div v-for="(v, k) in newsList" :key="k" class="content-box-item" @click="onNewsClick(k)">
          <div class="item-conten">
            <div>{{ v.message }}</div>
            <div class="content-box-msg"></div>
            <div class="content-box-time">{{ v.time }}</div>
          </div>
          <!-- 已读/未读 -->
          <span v-if="v.read" class="el-tag el-tag--success el-tag--mini read">已读</span>
          <span v-else class="el-tag el-tag--danger el-tag--mini read">未读</span>
        </div>
      </template>
      <el-empty v-else :description="'消息为空'"></el-empty>
    </div>
  </div>
</template>

<script setup lang="ts" name="layoutBreadcrumbUserNews">
import { ref, reactive, onMounted, nextTick, getCurrentInstance } from 'vue';
import { useNoticeStore } from '@/store/modules/notice';
import { listNotice, readNotice } from '@/api/system/notice';
import { NoticeQuery, NoticeVO } from '@/api/system/notice/types'; // 导入类型

const noticeStore = useNoticeStore();
const instance = getCurrentInstance();
const proxy = (instance?.proxy as unknown) as {
  $modal: {
    msgInfo: (content: string) => void;
    msgSuccess: (content: string) => void;
    msgError: (content: string) => void;
    confirm: (message: string) => Promise<void>;
    msgWarning: (content: string) => void;
  };
};
// 定义变量内容
const state = reactive({
  loading: false
});
const newsList = ref([]) as any;
// 修改 readAll 方法（替换原有逻辑）
const readAll = async () => {
  if (newsList.value.length === 0) {
    proxy?.$modal.msgInfo('暂无未读公告');
    return;
  }

  // 新增：过滤无效 ID，确保列表非空且无 undefined
  const noticeIds = newsList.value
    .map((item: any) => item.id)
    .filter((id: any) => id !== undefined && id !== null);

  if (noticeIds.length === 0) {
    proxy?.$modal.msgError('无有效公告 ID，无法批量标记已读');
    return;
  }

  const noticeTitle = `全部${noticeIds.length}条公告`;

  try {
    await proxy?.$modal.confirm(`是否将"${noticeTitle}"标记为已读？`);
    await readNotice(noticeIds); // 传入过滤后的有效 ID 列表
    newsList.value = [];
    noticeStore.clearNotice();
    proxy?.$modal.msgSuccess('全部标记为已读成功');
  } catch (error) {
    console.log('用户取消批量标记已读操作', error);
  }
};
/**
 * 初始化数据
 * @returns
 */
const getTableData = async () => {
  state.loading = true;
  try {
    const res = await listNotice({isAsc:'desc'} as NoticeQuery);
    console.log("🚀 ~ getTableData ~ res:", res)
    // 筛选未读公告（read: false）
    const unreadNotices = res.rows.filter((item: any) => !item.read);
    newsList.value = unreadNotices.map((item: any) => ({
      id: item.noticeId,
      message: item.noticeTitle,
      time: item.createTime,
      read: item.read
    }));
    // 同步到 Pinia（触发 Navbar 监听）
    noticeStore.state.notices = newsList.value;
  } catch (error) {
    console.error('获取未读公告失败', error);
    newsList.value = [];
  }
  state.loading = false;
};

// 点击单条公告标记已读（完整逻辑）
const onNewsClick = async (index: number) => {
  const row = newsList.value[index] as NoticeVO;
  console.log("🚀 ~ onNewsClick ~ row:", row)
  if (!row) {
    proxy?.$modal.msgError('请选择有效公告');
    return;
  }
  if (row.read) {
    proxy?.$modal.msgWarning('该公告已标记为已读');
    return;
  }

  // 新增：校验 noticeId 有效性
  const noticeIds = row.id;
  if (!noticeIds || noticeIds === undefined) {
    proxy?.$modal.msgError('公告 ID 无效，无法标记已读');
    return;
  }

  const noticeTitle = row.message || '当前公告';

  try {
    await proxy?.$modal.confirm(`是否将"${noticeTitle}"标记为已读？`);
    await readNotice(noticeIds); // 确保传入有效 ID
    newsList.value[index].read = true;
    noticeStore.state.notices = newsList.value;
    await getTableData();
    proxy?.$modal.msgSuccess('标记成功');
  } catch (error) {
    console.log('用户取消标记已读操作', error);
  }
};
onMounted(() => {
  nextTick(() => {
    getTableData();
  });
});
</script>

<style lang="scss" scoped>
.layout-navbars-breadcrumb-user-news {
  .head-box {
    display: flex;
    border-bottom: 1px solid var(--el-border-color-lighter);
    box-sizing: border-box;
    color: var(--el-text-color-primary);
    justify-content: space-between;
    height: 35px;
    align-items: center;

    .head-box-btn {
      color: var(--el-color-primary);
      font-size: 13px;
      cursor: pointer;
      opacity: 0.8;

      &:hover {
        opacity: 1;
      }
    }
  }

  .content-box {
    height: 300px;
    overflow: auto;
    font-size: 13px;

    .content-box-item {
      padding-top: 12px;
      display: flex;

      &:has(.el-tag--danger) {
        cursor: pointer;
      }

      &:last-of-type {
        padding-bottom: 12px;
      }

      .content-box-msg {
        color: var(--el-text-color-secondary);
        margin-top: 5px;
        margin-bottom: 5px;
      }

      .content-box-time {
        color: var(--el-text-color-secondary);
      }

      .item-conten {
        width: 100%;
        display: flex;
        flex-direction: column;
      }
    }
  }

  .foot-box {
    height: 35px;
    color: var(--el-color-primary);
    font-size: 13px;
    cursor: pointer;
    opacity: 0.8;
    display: flex;
    align-items: center;
    justify-content: center;
    border-top: 1px solid var(--el-border-color-lighter);

    &:hover {
      opacity: 1;
    }
  }

  :deep(.el-empty__description p) {
    font-size: 13px;
  }
}
</style>
