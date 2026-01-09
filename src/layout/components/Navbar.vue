<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="appStore.sidebar.opened" class="hamburger-container"
      @toggle-click="toggleSideBar" />
    <breadcrumb v-if="!settingsStore.topNav" id="breadcrumb-container" class="breadcrumb-container" />
    <top-nav v-if="settingsStore.topNav" id="topmenu-container" class="topmenu-container" />

    <div class="right-menu flex align-center">
      <template v-if="appStore.device !== 'mobile'">
        <!-- <el-select v-if="userId === 1 && tenantEnabled" v-model="companyName" class="min-w-244px" clearable filterable
          reserve-keyword :placeholder="proxy.$t('navbar.selectTenant')" @change="dynamicTenantEvent"
          @clear="dynamicClearEvent">
          <el-option v-for="item in tenantList" :key="item.tenantId" :label="item.companyName" :value="item.tenantId">
          </el-option>
          <template #prefix><svg-icon icon-class="company" class="el-input__icon input-icon" /></template>
</el-select> -->
        <el-button link type="primary" @click="handle3DScreen()" v-hasPermi="['screen:screen:3d']" v-if="showScreen"
          class="screen-link-btn">可视化大屏</el-button>
        <search-menu ref="searchMenuRef" />
        <el-tooltip content="搜索" effect="dark" placement="bottom">
          <div class="right-menu-item hover-effect" @click="openSearchMenu">
            <svg-icon class-name="search-icon" icon-class="search" />
          </div>
        </el-tooltip>
        <!-- 消息 -->
        <el-tooltip :content="proxy.$t('navbar.message')" effect="dark" placement="bottom">
          <div>
            <el-popover placement="bottom" trigger="click" transition="el-zoom-in-top" :width="300" :persistent="false">
              <template #reference>
                <el-badge :value="noticeStore.state.unreadNum > 0 ? noticeStore.state.unreadNum : ''" :max="99">
                  <div class="right-menu-item hover-effect" style="display: block"><svg-icon icon-class="message" />
                  </div>
                </el-badge>
              </template>
              <template #default>
                <notice></notice>
              </template>
            </el-popover>
          </div>
        </el-tooltip>
        <el-tooltip :content="proxy.$t('navbar.full')" effect="dark" placement="bottom">
          <screenfull id="screenfull" class="right-menu-item hover-effect" />
        </el-tooltip>

        <!-- <el-tooltip :content="proxy.$t('navbar.language')" effect="dark" placement="bottom">
          <lang-select id="lang-select" class="right-menu-item hover-effect" />
        </el-tooltip> -->

        <el-tooltip :content="proxy.$t('navbar.layoutSize')" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip>
      </template>
      <div class="avatar-container">
        <el-dropdown class="right-menu-item hover-effect" trigger="click" @command="handleCommand">
          <div class="avatar-wrapper">
            <img :src="userStore.avatar" class="user-avatar" />
            <el-icon><caret-bottom /></el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <router-link v-if="!dynamic" to="/user/profile">
                <el-dropdown-item>{{ proxy.$t('navbar.personalCenter') }}</el-dropdown-item>
              </router-link>
              <el-dropdown-item v-if="settingsStore.showSettings" command="setLayout">
                <span>{{ proxy.$t('navbar.layoutSetting') }}</span>
              </el-dropdown-item>
              <el-dropdown-item divided command="logout">
                <span>{{ proxy.$t('navbar.logout') }}</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { Router } from 'vue-router';
import { ComponentInternalInstance, getCurrentInstance } from 'vue';
import { unreadCount } from '@/api/system/notice';
import SearchMenu from './TopBar/search.vue';
import { useAppStore } from '@/store/modules/app';
import { useUserStore } from '@/store/modules/user';
import { useSettingsStore } from '@/store/modules/settings';
import { useNoticeStore } from '@/store/modules/notice';
import { getTenantList } from '@/api/login';
import { dynamicClear, dynamicTenant } from '@/api/system/tenant';
import { TenantVO } from '@/api/types';
import notice from './notice/index.vue';
import router from '@/router';
import { ElMessageBox, ElMessageBoxOptions } from 'element-plus';
import { getInfo as getUserInfo } from '@/api/login';
import bus from '../../libs/eventbus';
// 声明自定义 proxy 类型
interface CustomProxy {
  $router: {
    push: (path: string | { path: string; query?: Record<string, any> }) => Promise<void>;
  };
  $tab: {
    closeAllPage: () => Promise<void>;
    refreshPage: () => Promise<void>;
  };
  $modal: {
    msgError: (content: string) => void;
    msgSuccess: (content: string) => void;
    msgInfo: (content: string) => void;
    confirm: (message: string, title: string, options: any) => Promise<void>;
  };
  $t: (key: string) => string; // 国际化方法
}
const showScreen = ref(false)
const noticeStore = useNoticeStore();
const appStore = useAppStore();
const userStore = useUserStore();
const settingsStore = useSettingsStore();
// 替换原有的 proxy 获取方式
const instance = getCurrentInstance();
const proxy = (instance?.proxy as unknown) as CustomProxy;

const userId = ref(userStore.userId);
const companyName = ref(undefined);
const tenantList = ref<TenantVO[]>([]);
// 是否切换了租户
const dynamic = ref(false);
// 租户开关
const tenantEnabled = ref(true);
// 搜索菜单
const searchMenuRef = ref<InstanceType<typeof SearchMenu>>();

const openSearchMenu = () => {
  searchMenuRef.value?.openSearch();
};
//跳转可视化大屏
const handle3DScreen = () => {
  router.push({
    path: '/screen/screen',
  })
}
// 动态切换
const dynamicTenantEvent = async (tenantId: string) => {
  if (companyName.value != null && companyName.value !== '') {
    await dynamicTenant(tenantId);
    dynamic.value = true;
    await proxy?.$router.push('/');
    await proxy?.$tab.closeAllPage();
    await proxy?.$tab.refreshPage();
  }
};

const dynamicClearEvent = async () => {
  await dynamicClear();
  dynamic.value = false;
  await proxy?.$router.push('/');
  await proxy?.$tab.closeAllPage();
  await proxy?.$tab.refreshPage();
};

/** 租户列表 */
const initTenantList = async () => {
  const { data } = await getTenantList(true);
  tenantEnabled.value = data.tenantEnabled === undefined ? true : data.tenantEnabled;
  if (tenantEnabled.value) {
    tenantList.value = data.voList;
  }
};

defineExpose({
  initTenantList
});

const toggleSideBar = () => {
  appStore.toggleSideBar(false);
};

const logout = async () => {
  await ElMessageBox.confirm('您确定要退出当前账号吗？项目操作数据将自动保存。', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  } as ElMessageBoxOptions);
  userStore.logout().then(() => {
    // 关键修改：直接跳转登录页，不携带 redirect 参数，且 replace 清除历史
    router.replace({ path: '/login' });
    proxy?.$tab.closeAllPage(); // 关闭所有打开的标签页（若依标签页组件）
    // 额外新增：清除可能缓存的路由相关数据
    sessionStorage.removeItem('redirect');
    localStorage.removeItem('lastVisitedRoute'); // 若有其他缓存键也一并清除
  });
  // userStore.logout().then(() => {
  //   router.replace({
  //     path: '/login',
  //     query: {
  //       redirect: encodeURIComponent(router.currentRoute.value.fullPath || '/')
  //     }
  //   });
  //   proxy?.$tab.closeAllPage();
  // });
};

const emits = defineEmits(['setLayout']);
const setLayout = () => {
  emits('setLayout');
};
// 定义Command方法对象 通过key直接调用方法
const commandMap: { [key: string]: any } = {
  setLayout,
  logout
};
const handleCommand = (command: string) => {
  // 判断是否存在该方法
  if (commandMap[command]) {
    commandMap[command]();
  }
};
//用深度监听 消息
watch(
  () => noticeStore.state.notices,
  async (newVal) => {
    // 原有逻辑保留，新增接口获取最新未读数
    await noticeStore.fetchUnreadCount();
  },
  { deep: true }
);
onMounted(async () => {
  noticeStore.fetchUnreadCount();
  // 原有 initTenantList 等逻辑保留
  const res = await getUserInfo();
  if (res.data.roles[0] == 'sysadmin' || res.data.roles[0] == 'superadmin') {
    showScreen.value = true
  } else {
    showScreen.value = false
  }
});
</script>

<style lang="scss" scoped>
:deep(.screen-link-btn) {
  // 蓝色横线（可替换为你需要的蓝色值，如 #1890ff 是 Element 主色）
  border-bottom: 2px solid #1890ff !important;
  padding-bottom: 2px !important; // 文字与横线的间距，避免过于拥挤
  text-decoration: none !important; // 清除 link 类型默认下划线（若有）
  margin-right: 10px;

  // hover 状态优化（可选，保持样式一致性）
  &:hover,
  &:focus,
  &:active {
    border-bottom-color: #40a9ff !important; // hover 时浅化蓝色
    text-decoration: none !important;
  }
}

:deep(.el-select .el-input__wrapper) {
  height: 30px;
}

:deep(.el-badge__content.is-fixed) {
  top: 12px;
}

.flex {
  display: flex;
}

.align-center {
  align-items: center;
}

.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  //background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .topmenu-container {
    position: absolute;
    left: 50px;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;
    display: flex;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 40px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
          margin-top: 10px;
        }

        i {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 17px;
        }
      }
    }
  }
}
</style>
