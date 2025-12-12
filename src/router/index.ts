import { createWebHistory, createRouter, RouteRecordRaw } from 'vue-router';
import Layout from '@/layout/index.vue';
import { getToken, setToken } from '@/utils/auth';
import { useUserStore } from '@/store/modules/user';
import { usePermissionStore } from '@/store/modules/permission'; // 确保导入
import { ElMessage } from 'element-plus';
import service from '@/utils/request';

// 原有公共路由（完全保留）
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      { path: '/redirect/:path(.*)', component: () => import('@/views/redirect/index.vue') }
    ]
  },
  { path: '/social-callback', hidden: true, component: () => import('@/layout/components/SocialCallback/index.vue') },
  { path: '/login', component: () => import('@/views/login.vue'), hidden: true },
  { path: '/register', component: () => import('@/views/register.vue'), hidden: true },
  { path: '/screen/screen', component: () => import('@/views/screen.vue'), hidden: true },
  { path: '/screen/preview', component: () => import('@/views/preview.vue'), hidden: true },
  { path: '/:pathMatch(.*)*', component: () => import('@/views/error/404.vue'), hidden: true },
  { path: '/401', component: () => import('@/views/error/401.vue'), hidden: true },
  {
    path: '',
    component: Layout,
    redirect: '/index',
    children: [
      { path: '/index', component: () => import('@/views/index.vue'), name: 'Index', meta: { title: '首页', icon: 'dashboard', affix: true } }
    ]
  },
  {
    path: '/user',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      { path: 'profile', component: () => import('@/views/system/user/profile/index.vue'), name: 'Profile', meta: { title: '个人中心', icon: 'user' } }
    ]
  }
];

// 原有动态路由（完全保留）
export const dynamicRoutes: RouteRecordRaw[] = [
  {
    path: '/project/normal',
    component: Layout,
    name: 'ProjectNormal',
    meta: { title: '台账(项目)管理', icon: 'chart', permissions: ['project:project:list'] },
    children: [
      { path: '', component: () => import('@/views/project/normal/index.vue'), name: 'ProjectNormalList', meta: { title: '一般项目', permissions: ['project:project:list'] } },
      { path: 'normal-add', component: () => import('@/views/project/normal/addProject.vue'), name: 'NormalAddProject', hidden: true, meta: { title: '创建项目', activeMenu: '/project/normal', permissions: ['project:project:add'] } },
      { path: 'normal-edit/:id', component: () => import('@/views/project/normal/editProject.vue'), name: 'NormalEditProject', hidden: true, meta: { title: '信息填报', activeMenu: '/project/normal', permissions: ['project:project:edit'] } },
      { path: 'normal-repeat-edit/:id', component: () => import('@/views/project/normal/repeatEditProject.vue'), name: 'NormalRepeatEditProject', hidden: true, meta: { title: '二次填报', activeMenu: '/project/normal', permissions: ['project:project:edit'] } },
      { path: 'normal-view/:id', component: () => import('@/views/project/normal/viewProject.vue'), name: 'NormalViewProject', hidden: true, meta: { title: '一般项目查看', activeMenu: '/project/normal', permissions: ['project:project:query'] } },
      { path: 'normal-review/:id', component: () => import('@/views/project/normal/reviewProject.vue'), name: 'NormalReviewProject', hidden: true, meta: { title: '项目审核', activeMenu: '/project/normal', permissions: ['project:project:gwhApprove'] } },
      { path: 'normal-share/:id', component: () => import('@/views/project/normal/shareProject.vue'), name: 'NormalShareProject', hidden: true, meta: { title: '数据共享', activeMenu: '/project/normal', permissions: ['project:project:share'] } }
    ]
  },
  {
    path: '/project/major',
    component: Layout,
    name: 'ProjectMajor',
    meta: { title: '台账(项目)管理', icon: 'build', permissions: ['project:project:list'] },
    children: [
      { path: '', component: () => import('@/views/project/major/index.vue'), name: 'ProjectMajorList', meta: { title: '重大项目', permissions: ['project:project:list'] } },
      { path: 'major-add', component: () => import('@/views/project/major/addProject.vue'), name: 'MajorAddProject', hidden: true, meta: { title: '创建项目', activeMenu: '/project/major', permissions: ['project:project:add'] } },
      { path: 'major-edit/:id', component: () => import('@/views/project/major/editProject.vue'), name: 'MajorEditProject', hidden: true, meta: { title: '信息填报', activeMenu: '/project/major', permissions: ['project:project:edit'] } },
      { path: 'major-repeat-edit/:id', component: () => import('@/views/project/major/repeatEditProject.vue'), name: 'MajorRepeatEditProject', hidden: true, meta: { title: '二次填报', activeMenu: '/project/major', permissions: ['project:project:edit'] } },
      { path: 'major-view/:id', component: () => import('@/views/project/major/viewProject.vue'), name: 'MajorViewProject', hidden: true, meta: { title: '重大项目查看', activeMenu: '/project/major', permissions: ['project:project:query'] } },
      { path: 'major-review/:id', component: () => import('@/views/project/major/reviewProject.vue'), name: 'MajorReviewProject', hidden: true, meta: { title: '项目审核', activeMenu: '/project/major', permissions: ['project:project:gwhApprove', 'project:project:lyjApprove'] } },
      { path: 'major-share/:id', component: () => import('@/views/project/major/shareProject.vue'), name: 'MajorShareProject', hidden: true, meta: { title: '数据共享', activeMenu: '/project/major', permissions: ['project:project:share'] } }
    ]
  },
  {
    path: '/project/notice',
    component: Layout,
    name: 'NoticeCenter',
    hidden: true,
    meta: { title: '消息中心', icon: 'message', permissions: ['system:notice:list', 'system:notice:query', 'system:notice:read'] },
    children: [
      { path: '', component: () => import('@/views/project/notice/index.vue'), name: 'NoticeList', meta: { title: '消息列表', permissions: ['system:notice:list'] } }
    ]
  },
  {
    path: '/document/data',
    component: Layout,
    name: 'digitalRenewal',
    hidden: true,
    meta: { title: '规划成果归档', icon: 'message' },
    children: [
      { path: '', component: () => import('@/views/document/data/index.vue'), name: 'digitalList', meta: { title: '数字化更新', permissions: ['document:document:list'] } },
      { path: 'history/:fileId', component: () => import('@/views/document/history/index.vue'), name: 'DocumentHistory', meta: { title: '历史版本', activeMenu: '/document/data', permissions: ['document:document:list'] } }
    ]
  }
];

/**
 * 创建路由实例（保留原有配置）
 */
const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_APP_CONTEXT_PATH),
  routes: constantRoutes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition;
    return { top: 0 };
  }
});


dynamicRoutes.forEach(route => { router.addRoute(route); });



export default router;