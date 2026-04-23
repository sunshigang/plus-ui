import { createWebHistory, createRouter, RouteRecordRaw } from 'vue-router';
import Layout from '@/layout/index.vue';
// import { getToken, setToken,getClientId,setClientId } from '@/utils/auth';
// import { getToken, setToken } from '@/utils/auth';
// import { useUserStore } from '@/store/modules/user';
// import { usePermissionStore } from '@/store/modules/permission'; // 确保导入
// import { ElMessage } from 'element-plus';
// import service from '@/utils/request';
// import { c } from 'node_modules/vite/dist/node/moduleRunnerTransport.d-DJ_mE5sf';
// import { set } from 'nprogress';

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



// 动态添加路由（保留原有逻辑，但改为从permissionStore读取，避免重复）
dynamicRoutes.forEach(route => { router.addRoute(route); }); // 注释掉，改为在generateRoutes中处理

/**
 * 优化：从URL直接提取token（适配 http://xxx/screen/screen?id=xxx&clientId=xxx&token=xxx 格式）
 */
// const extractTokenFromUrl = (removeAfterExtract = false): {token:string,clientId:string} | null => {
//   const urlParams = new URLSearchParams(window.location.search);
//   let token = urlParams.get('token');
//   let clientId = urlParams.get('clientId');
//   let finalAuth = null;

//   // 1. 提取当前URL的token
//   if (token && clientId) {
//     try {
//       finalAuth =
//       {
//         token: decodeURIComponent(token),
//         clientId: decodeURIComponent(clientId) 
//       };
//     } catch (e) {
//       console.error('Token解码失败：', e);
//     }
//   } else {
//     // 2. 兼容redirect里的token
//     const redirectUrl = urlParams.get('redirect');
//     if (redirectUrl) {
//       try {
//         const redirectParams = new URLSearchParams(redirectUrl.split('?')[1] || '');
//         token = redirectParams.get('token');
//         let clientId = urlParams.get('clientId');
//         if (token && clientId) {
//           finalAuth =
//           {
//             token: decodeURIComponent(token),
//             clientId: decodeURIComponent(clientId) 
//           };
//           // 移除redirect中的token（可选）
//           if (removeAfterExtract) {
//             redirectParams.delete('token');
//             const newRedirectUrl = redirectUrl.split('?')[0] + (redirectParams.toString() ? `?${redirectParams.toString()}` : '');
//             urlParams.set('redirect', newRedirectUrl);
//           }
//         }
//       } catch (e) {
//         console.error('Redirect Token解码失败：', e);
//       }
//     }
//   }

//   // 3. 提取后移除URL中的token（核心：避免重复读取）
//   if (removeAfterExtract && token) {
//     urlParams.delete('token');
//     const newUrl = window.location.pathname + (urlParams.toString() ? `?${urlParams.toString()}` : '');
//     window.history.replaceState({}, document.title, newUrl);
//   }

//   return finalAuth;
// };

/**
 * 优化：通过 /system/user/getInfo 接口校验Token有效性（区分「过期」和「无效」）
 * 逻辑：getInfo接口能正常返回用户信息 → Token有效；返回401 → Token过期；其他错误 → Token无效
 * @param token 待校验的token
 * @returns { isValid: boolean, isExpired: boolean } 校验结果+是否过期
 */
// const validateToken = async (urlAuth: {token:string,clientId:string}): Promise<{ isValid: boolean; isExpired: boolean }> => {
//   // 1. 先做格式校验（JWT格式：xxx.xxx.xxx）
//   if (!/^[A-Za-z0-9_\-]+\.[A-Za-z0-9_\-]+\.[A-Za-z0-9_\-]+$/.test(urlAuth.token)) {
//     return { isValid: false, isExpired: false }; // 格式错误=无效
//   }

//   // 2. 调用 /system/user/getInfo 接口校验Token（手动携带Token到Authorization头）
//   try {
//     const res = await service.get('/system/user/getInfo', {
//       headers: {
//         isToken: false, // 跳过请求拦截器自动加token
//         Authorization: `Bearer ${urlAuth.token}`, // 手动携带要校验的token
//         ClientId: `${urlAuth.clientId}`
//       }
//     });
//     console.log("🚀 ~ validateToken ~ res:", res)
//     // 接口成功返回 → Token有效（能获取用户信息=Token合法且未过期）
//     return { isValid: true, isExpired: false };
//   } catch (error: any) {
//     // 接口报错：根据错误码判断
//     const responseCode = error.response?.status;
//     const responseData = error.response?.data;

//     // 401状态码 → Token过期（后端返回401通常代表Token过期/未授权）
//     if (responseCode === 401) {
//       return { isValid: false, isExpired: true };
//     }
//     // 其他状态码（400/500等）→ Token无效（如Token篡改、不存在等）
//     else {
//       console.error('Token校验失败（getInfo接口报错）：', responseData?.msg || error.message);
//       return { isValid: false, isExpired: false };
//     }
//   }
// };


/**
 * 核心：路由守卫（修复动态路由存储逻辑）
 */
// router.beforeEach(async (to, from, next) => {
//   const userStore = useUserStore();
//   const permissionStore = usePermissionStore();
//   const localToken = getToken();
//   // 提取token并立即移除URL中的token（核心：防止重复读取）
//   const urlToken = extractTokenFromUrl(true);

//   // ========== 核心逻辑：URL有Token时优先校验 ==========
//   if (urlToken) {
//     // 1. 校验Token有效性
//     const { isValid, isExpired } = await validateToken(urlToken);

//     // 2. Token过期：提示+跳登录（仅一次）
//     if (isExpired) {
//       ElMessage.error('Token已过期，请重新替换有效Token后访问！');
//       // 跳登录并清空本地Token（避免二次触发）
//       setToken('');
//       setClientId('');
//       next(`/login?redirect=${encodeURIComponent(to.fullPath)}`);
//       return;
//     }

//     // 3. Token无效：提示+跳登录（仅一次）
//     if (!isValid) {
//       ElMessage.error('Token无效，请检查Token是否正确！');
//       // 跳登录并清空本地Token（避免二次触发）
//       setToken('');
//       setClientId('');
//       next(`/login?redirect=${encodeURIComponent(to.fullPath)}`);
//       return;
//     }

//     // 4. Token有效：存入本地
//     setToken(urlToken.token);
//     setClientId(urlToken.clientId);
//     ElMessage.success('Token验证通过，正在进入页面...');
//   }

//   // ========== 登录逻辑：确保动态路由被加载到Store中 ==========
//   try {
//     if (getToken()) {
//       // 已登录，但用户信息未加载 → 加载用户信息+生成动态路由
//       if (!userStore.userId) {
//         await userStore.getInfo();
//         const accessRoutes = await permissionStore.generateRoutes();

//         accessRoutes.forEach(route => router.addRoute(route));
//         permissionStore.setRoutes(accessRoutes);

//         next({ path: to.path, replace: true });
//         return;
//       }
//       // 已登录且用户信息已加载 → 直接放行
//       next();
//     } else {
//       // 无Token：走白名单逻辑
//       const whiteList = ['/login', '/register', '/social-callback'];
//       if (whiteList.includes(to.path)) {
//         next();
//       } else {
//         next(`/login?redirect=${encodeURIComponent(to.fullPath)}`);
//       }
//     }
//   } catch (error) {
//     // 异常兜底：清除Token+跳登录
//     setToken('');
//   setClientId('');
//     userStore.logout();
//     ElMessage.error('Token校验异常，请重新获取有效访问链接！');
//     next(`/login?redirect=${encodeURIComponent(to.fullPath)}`);
//   }
// });



export default router;