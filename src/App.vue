<template>
  <el-config-provider :locale="appStore.locale" :size="appStore.size">
    <router-view />
  </el-config-provider>
</template>

<script setup lang="ts">
import { useSettingsStore } from '@/store/modules/settings';
import { handleThemeStyle } from '@/utils/theme';
import { useAppStore } from '@/store/modules/app';

const appStore = useAppStore();

onMounted(() => {
  nextTick(() => {
    // 初始化主题样式
    handleThemeStyle(useSettingsStore().theme);
  });
});
</script>
<style>
@font-face {
  font-family: 'PangMenZhenDao';
  src: url(./static/font/PangMenZhenDao.ttf);
}

@font-face {
  font-family: 'xianglifang';
  src: url('./static/font/xianglifangheiti.ttf') format('truetype');
}

@font-face {
  font-family: 'ZCOOL QingKe HuangYou';
  src: url('./static/font/站酷文艺体.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}

@font-face {
  font-family: 'SourceHanSansCN-Medium';
  src: url(./static/font/SourceHanSansCN-Medium.otf);
}

@font-face {
  font-family: 'SourceHanSansCN-Regular';
  src: url(./static/font/SourceHanSansCN-Regular.otf);
}

@font-face {
  font-family: 'DINPro';
  src: url(./static/font/DINPro-Regular.otf);
}
</style>
