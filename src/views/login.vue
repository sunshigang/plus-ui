<template>
  <div class="login">
    <img src="../assets/images/login-img.png" class="login-img" />
    <el-form ref="loginRef" :model="loginForm" :rules="loginRules" class="login-form">
      <div class="title-box">
        <h3 class="title">{{ title }}</h3>
      </div>
      <el-form-item prop="username" class="form-item-top">
        <el-input v-model="loginForm.username" type="text" size="large" auto-complete="off"
          :placeholder="proxy.$t('login.username')">
          <template #prefix><svg-icon icon-class="user" class="el-input__icon input-icon" /></template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password" class="form-item-top">
        <el-input v-model="loginForm.password" type="password" size="large" auto-complete="off"
          :placeholder="proxy.$t('login.password')" show-password @keyup.enter="handleLogin">
          <template #prefix><svg-icon icon-class="password" class="el-input__icon input-icon" /></template>
        </el-input>
      </el-form-item>
      <el-checkbox v-model="loginForm.rememberMe"
        class="remember-me">{{ proxy.$t('login.rememberPassword') }}</el-checkbox>
      <div class="form-footer">
        <el-form-item style="width: 100%">
          <el-button :loading="loading" size="large" type="primary"
            style="width: 100%;font-size:20px;border-radius: 22px;height: 60px" @click.prevent="handleLogin">账号登录
          </el-button>
        </el-form-item>
      </div>
    </el-form>
    <!--  底部  -->
    <div class="el-login-footer">
    </div>
  </div>
</template>

<script setup lang="ts">
import { getCodeImg, getTenantList } from '@/api/login';
import { authBinding } from '@/api/system/social/auth';
import { useUserStore } from '@/store/modules/user';
import { LoginData, TenantVO } from '@/api/types';
import { to } from 'await-to-js';
import { HttpStatus } from '@/enums/RespEnum';
import { useI18n } from 'vue-i18n';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
console.log("🚀 ~ proxy:", proxy)

const title = import.meta.env.VITE_APP_TITLE;
const userStore = useUserStore();
const router = useRouter();
const { t } = useI18n();

const loginForm = ref<LoginData>({
  tenantId: '000000',
  username: 'admin',
  password: 'admin123',
  rememberMe: false,
  code: '',
  uuid: ''
} as LoginData);

const loginRules: ElFormRules = {
  tenantId: [{ required: true, trigger: 'blur', message: t('login.rule.tenantId.required') }],
  username: [{ required: true, trigger: 'blur', message: t('login.rule.username.required') }],
  password: [{ required: true, trigger: 'blur', message: t('login.rule.password.required') }],
  code: [{ required: true, trigger: 'change', message: t('login.rule.code.required') }]
};

const codeUrl = ref('');
const loading = ref(false);
// 验证码开关
const captchaEnabled = ref(true);
// 租户开关
const tenantEnabled = ref(true);

// 注册开关
const register = ref(false);
const redirect = ref('/');
const loginRef = ref<ElFormInstance>();
// 租户列表
const tenantList = ref<TenantVO[]>([]);

watch(
  () => router.currentRoute.value,
  (newRoute: any) => {
    redirect.value = newRoute.query && newRoute.query.redirect && decodeURIComponent(newRoute.query.redirect);
  },
  { immediate: true }
);

const handleLogin = () => {
  loginRef.value?.validate(async (valid: boolean, fields: any) => {
    if (valid) {
      loading.value = true;
      // 勾选了需要记住密码设置在 localStorage 中设置记住用户名和密码
      if (loginForm.value.rememberMe) {
        localStorage.setItem('tenantId', String(loginForm.value.tenantId));
        localStorage.setItem('username', String(loginForm.value.username));
        localStorage.setItem('password', String(loginForm.value.password));
        localStorage.setItem('rememberMe', String(loginForm.value.rememberMe));
      } else {
        // 否则移除
        localStorage.removeItem('tenantId');
        localStorage.removeItem('username');
        localStorage.removeItem('password');
        localStorage.removeItem('rememberMe');
      }
      // 调用action的登录方法
      const [err] = await to(userStore.login(loginForm.value));
      if (!err) {
        const redirectUrl = redirect.value || '/';
        await router.push(redirectUrl);
        loading.value = false;
      } else {
        loading.value = false;
        // 重新获取验证码
        if (captchaEnabled.value) {
          await getCode();
        }
      }
    } else {
      console.log('error submit!', fields);
    }
  });
};

/**
 * 获取验证码
 */
const getCode = async () => {
  const res = await getCodeImg();
  const { data } = res;
  captchaEnabled.value = data.captchaEnabled === undefined ? true : data.captchaEnabled;
  if (captchaEnabled.value) {
    codeUrl.value = 'data:image/gif;base64,' + data.img;
    loginForm.value.uuid = data.uuid;
  }
};

const getLoginData = () => {
  const tenantId = localStorage.getItem('tenantId');
  const username = localStorage.getItem('username');
  console.log("🚀 ~ getLoginData ~ username:", username)
  const password = localStorage.getItem('password');
  const rememberMe = localStorage.getItem('rememberMe');
  loginForm.value = {
    tenantId: tenantId === null ? String(loginForm.value.tenantId) : tenantId,
    username: username === null ? String(loginForm.value.username) : username,
    password: password === null ? String(loginForm.value.password) : String(password),
    rememberMe: rememberMe === null ? false : Boolean(rememberMe)
  } as LoginData;
  console.log("🚀 ~ getLoginData ~ loginForm.value:", loginForm.value)
};

/**
 * 获取租户列表
 */
const initTenantList = async () => {
  const { data } = await getTenantList(false);
  tenantEnabled.value = data.tenantEnabled === undefined ? true : data.tenantEnabled;
  if (tenantEnabled.value) {
    tenantList.value = data.voList;
    if (tenantList.value != null && tenantList.value.length !== 0) {
      loginForm.value.tenantId = tenantList.value[0].tenantId;
    }
  }
};

/**
 * 第三方登录
 * @param type
 */
const doSocialLogin = (type: string) => {
  authBinding(type, loginForm.value.tenantId).then((res: any) => {
    if (res.code === HttpStatus.SUCCESS) {
      // 获取授权地址跳转
      window.location.href = res.data;
    } else {
      ElMessage.error(res.msg);
    }
  });
};

onMounted(() => {
  getCode();
  initTenantList();
  getLoginData();
});
</script>

<style lang="scss" scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  // background-image: url('../assets/images/login-background.png');
  // background-size: cover;
  background: url('../assets/images/login-background.png') no-repeat;
  background-size: 100% 100%;
}

.title-box {
  display: flex;

  .title {
    margin: 40px auto 50px auto;
    text-align: center;
    font-weight: 500;
    font-size: 26px;
    color: rgba(0, 0, 0, 0.85);
  }

  :deep(.lang-select--style) {
    line-height: 0;
    color: #7483a3;
  }
}

.login-img {
  width: 680px;
  height: 680px;
}

.login-form {
  border-radius: 6px;
  background: #ffffff;
  width: 680px;
  height: 680px;
  padding: 45px 25px 5px 25px;
  z-index: 1;
  border-radius: 0px 15px 15px 0px;

  .el-input {
    height: 60px;
    font-size: 20px;

    input {
      height: 60px;
    }
  }

  .input-icon {
    height: 39px;
    width: 20px;
    margin-left: 10px;
  }
}

.form-item-top {
  margin-top: 60px;
  /* 可根据需求调整间距大小 */
}

/* 记住密码：添加上外边距，移除默认margin */
.remember-me {
  margin: 60px 0 !important;
  /* 上外边距20px，左右下0 */
  display: block;
  /* 独占一行，对齐更整齐 */
}

/* 按钮组父容器：固定在底部 */
.form-footer {
  margin-top: auto;
  /* 自动占据剩余空间，把自己推到底部 */
  padding-bottom: 40px;
  /* 底部内边距，避免贴边 */
}

.login-tip {
  font-size: 16px;
  text-align: center;
  color: #bfbfbf;
}

.login-code {
  width: 33%;
  height: 40px;
  float: right;

  img {
    cursor: pointer;
    vertical-align: middle;
  }
}

.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial, serif;
  font-size: 12px;
  letter-spacing: 1px;
}

.login-code-img {
  height: 40px;
  padding-left: 12px;
}
</style>
