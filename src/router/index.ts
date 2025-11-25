import { createWebHistory, createRouter, RouteRecordRaw } from 'vue-router';
/* Layout */
import Layout from '@/layout/index.vue';

/**
 * Note: 路由配置项
 *
 * hidden: true                     // 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true                 // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                                  // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                  // 若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                  // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect             // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'               // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * query: '{"id": 1, "name": "ry"}' // 访问路由的默认传递参数
 * roles: ['admin', 'common']       // 访问路由的角色权限
 * permissions: ['a:a:a', 'b:b:b']  // 访问路由的菜单权限
 * meta : {
    noCache: true                   // 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
    title: 'title'                  // 设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'                // 设置该路由的图标，对应路径src/assets/icons/svg
    breadcrumb: false               // 如果设置为false，则不会在breadcrumb面包屑中显示
    activeMenu: '/system/user'      // 当路由设置了该属性，则会高亮相对应的侧边栏。
  }
 */

// 公共路由
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index.vue')
      }
    ]
  },
  {
    path: '/social-callback',
    hidden: true,
    component: () => import('@/layout/components/SocialCallback/index.vue')
  },
  {
    path: '/login',
    component: () => import('@/views/login.vue'),
    hidden: true
  },
  {
    path: '/register',
    component: () => import('@/views/register.vue'),
    hidden: true
  },
  {
    path: '/screen/screen',
    component: () => import('@/views/screen.vue'),
    hidden: true
  },
  {
    path: '/screen/preview',
    component: () => import('@/views/preview.vue'),
    hidden: true
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/error/404.vue'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error/401.vue'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: '/index',
    children: [
      {
        path: '/index',
        component: () => import('@/views/index.vue'),
        name: 'Index',
        meta: { title: '首页', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'profile',
        component: () => import('@/views/system/user/profile/index.vue'),
        name: 'Profile',
        meta: { title: '个人中心', icon: 'user' }
      }
    ]
  }
];

// 动态路由，基于用户权限动态去加载
export const dynamicRoutes: RouteRecordRaw[] = [
  {
    path: '/project/normal',
    component: Layout,
    name: 'ProjectNormal',
    meta: {
      title: '台账(项目)管理',
      icon: 'chart', // 侧边栏菜单图标（需确保对应svg文件存在）
      permissions: ['project:project:list'] // 菜单访问权限标识
    },
    children: [
      // 项目列表页（默认显示）
      {
        path: '',
        component: () => import('@/views/project/normal/index.vue'),
        name: 'ProjectNormalList',
        meta: {
          title: '一般项目',
          permissions: ['project:project:list']
        }
      },
      // 新增项目页面
      {
        path: 'normal-add',
        component: () => import('@/views/project/normal/addProject.vue'),
        name: 'NormalAddProject',
        hidden: true, // 侧边栏不显示
        meta: {
          title: '创建项目',
          activeMenu: '/project/normal', // 高亮父菜单
          permissions: ['project:project:add']
        }
      },
      // 信息填报页面（填报中状态）
      {
        path: 'normal-edit/:id',
        component: () => import('@/views/project/normal/editProject.vue'),
        name: 'NormalEditProject',
        hidden: true,
        meta: {
          title: '信息填报',
          activeMenu: '/project/normal',
          permissions: ['project:project:edit']
        }
      },
      // 二次填报页面（驳回状态）
      {
        path: 'normal-repeat-edit/:id',
        component: () => import('@/views/project/normal/repeatEditProject.vue'),
        name: 'NormalRepeatEditProject',
        hidden: true,
        meta: {
          title: '二次填报',
          activeMenu: '/project/normal',
          permissions: ['project:project:edit']
        }
      },
      // 查看项目页面
      {
        path: 'normal-view/:id',
        component: () => import('@/views/project/normal/viewProject.vue'),
        name: 'NormalViewProject',
        hidden: true,
        meta: {
          title: '一般项目查看',
          activeMenu: '/project/normal',
          permissions: ['project:project:query']
        }
      },
      // 审核项目页面（管委会/市林业局共用）
      {
        path: 'normal-review/:id',
        component: () => import('@/views/project/normal/reviewProject.vue'),
        name: 'NormalReviewProject',
        hidden: true,
        meta: {
          title: '项目审核',
          activeMenu: '/project/normal',
          permissions: ['project:project:gwhApprove']
        }
      },
      // 一般项目共享
      {
        path: 'normal-share/:id',
        component: () => import('@/views/project/normal/shareProject.vue'),
        name: 'NormalShareProject',
        hidden: true,
        meta: {
          title: '数据共享',
          activeMenu: '/project/normal',
          permissions: ['project:project:share']
        }
      }
    ]
  },
  {
    path: '/project/major',
    component: Layout,
    name: 'ProjectMajor',
    meta: {
      title: '台账(项目)管理',
      icon: 'build', // 侧边栏菜单图标（需确保对应svg文件存在）
      permissions: ['project:project:list'] // 菜单访问权限标识
    },
    children: [
      // 项目列表页（默认显示）
      {
        path: '',
        component: () => import('@/views/project/major/index.vue'),
        name: 'ProjectMajorList',
        meta: {
          title: '重大项目',
          permissions: ['project:project:list']
        }
      },
      // 新增项目页面
      {
        path: 'major-add',
        component: () => import('@/views/project/major/addProject.vue'),
        name: 'MajorAddProject',
        hidden: true, // 侧边栏不显示
        meta: {
          title: '创建项目',
          activeMenu: '/project/major', // 高亮父菜单
          permissions: ['project:project:add']
        }
      },
      // 信息填报页面（填报中状态）
      {
        path: 'major-edit/:id',
        component: () => import('@/views/project/major/editProject.vue'),
        name: 'MajorEditProject',
        hidden: true,
        meta: {
          title: '信息填报',
          activeMenu: '/project/major',
          permissions: ['project:project:edit']
        }
      },
      // 二次填报页面（驳回状态）
      {
        path: 'major-repeat-edit/:id',
        component: () => import('@/views/project/major/repeatEditProject.vue'),
        name: 'MajorRepeatEditProject',
        hidden: true,
        meta: {
          title: '二次填报',
          activeMenu: '/project/major',
          permissions: ['project:project:edit']
        }
      },
      // 查看项目页面
      {
        path: 'major-view/:id',
        component: () => import('@/views/project/major/viewProject.vue'),
        name: 'MajorViewProject',
        hidden: true,
        meta: {
          title: '重大项目查看',
          activeMenu: '/project/major',
          permissions: ['project:project:query']
        }
      },
      // 审核项目页面（管委会/市林业局共用）
      {
        path: 'major-review/:id',
        component: () => import('@/views/project/major/reviewProject.vue'),
        name: 'MajorReviewProject',
        hidden: true,
        meta: {
          title: '项目审核',
          activeMenu: '/project/major',
          permissions: ['project:project:gwhApprove', 'project:project:lyjApprove']
        }
      },
      // 重大项目共享
      {
        path: 'major-share/:id',
        component: () => import('@/views/project/major/shareProject.vue'),
        name: 'MajorShareProject',
        hidden: true,
        meta: {
          title: '数据共享',
          activeMenu: '/project/major',
          permissions: ['project:project:share']
        }
      },

    ]
  },
  //消息列表页面
  {
    path: '/project/notice', // 路由路径改为 /notice（与 /project 同级）
    component: Layout, // 继承 Layout 布局（保持侧边栏和顶部导航）
    name: 'NoticeCenter',
    hidden: true,
    meta: {
      title: '消息中心',
      icon: 'message', // 侧边栏图标（可选，不想显示侧边栏则设 hidden: true）
      permissions: ['system:notice:list', 'system:notice:query', 'system:notice:read']
    },
    children: [
      // 消息列表页面（默认显示）
      {
        path: '', // 空路径，访问 /notice 直接进入该页面
        component: () => import('@/views/project/notice/index.vue'),
        name: 'NoticeList',
        meta: {
          title: '消息列表',
          permissions: ['system:notice:list']
        }
      }
    ]
  },
  //规划成果归档
  {
    path: '/document/data',
    component: Layout, // 继承 Layout 布局（保持侧边栏和顶部导航）
    name: 'digitalRenewal',
    hidden: true,
    meta: {
      title: '规划成果归档',
      icon: 'message', // 侧边栏图标（可选，不想显示侧边栏则设 hidden: true）
      // permissions: ['system:notice:list', 'system:notice:query', 'system:notice:read']
    },
    children: [
      // 消息列表页面（默认显示）
      {
        path: '', // 空路径，访问 /notice 直接进入该页面
        component: () => import('@/views/document/data/index.vue'),
        name: 'digitalList',
        meta: {
          title: '数字化更新',
          permissions: ['document:document:list']
        }
      },
      //历史版本
      {
        path: 'history/:fileId',
        component: () => import('@/views/document/history/index.vue'),
        name: 'DocumentHistory',
        meta: {
          title: '历史版本',
          activeMenu: '/document/data',
          permissions: ['document:document:list']
        }
      },
    ]
  }
];

/**
 * 创建路由
 */
const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_APP_CONTEXT_PATH),
  routes: constantRoutes,
  // 刷新时，滚动条位置还原
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    return { top: 0 };
  }
});
dynamicRoutes.forEach(route => {
  router.addRoute(route);
});

export default router;
