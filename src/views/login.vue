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
            style="width: 100%;border-radius: 1.14583vw;height: 3.125vw" @click.prevent="handleLogin">账号登录
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

const title = import.meta.env.VITE_APP_TITLE;
const userStore = useUserStore();
const router = useRouter();
const { t } = useI18n();

const loginForm = ref<LoginData>({
  tenantId: '000000',
  username: 'admin',
  password: '123456',
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
  const password = localStorage.getItem('password');
  const rememberMe = localStorage.getItem('rememberMe');
  loginForm.value = {
    tenantId: tenantId === null ? String(loginForm.value.tenantId) : tenantId,
    username: username === null ? String(loginForm.value.username) : username,
    password: password === null ? String(loginForm.value.password) : String(password),
    rememberMe: rememberMe === null ? false : Boolean(rememberMe)
  } as LoginData;
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
// const doSocialLogin = (type: string) => {
//   authBinding(type, loginForm.value.tenantId).then((res: any) => {
//     if (res.code === HttpStatus.SUCCESS) {
//       // 获取授权地址跳转
//       window.location.href = res.data;
//     } else {
//       ElMessage.error(res.msg);
//     }
//   });
// };

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
    margin: 2.0833vw auto 2.604167vw auto;
    text-align: center;
    font-weight: 500;
    font-size: 1.354167vw;
    color: rgba(0, 0, 0, 0.85);
  }

  :deep(.lang-select--style) {
    line-height: 0;
    color: #7483a3;
  }
}

.login-img {
  width: 35.41667vw;
  height: 35.41667vw;
}

.login-form {
  background: #ffffff;
  width: 35.41667vw;
  height: 35.41667vw;
  padding: 2.34375vw 1.302vw 0.26vw 1.302vw;
  z-index: 1;
  border-radius: 0 0.78125vw 0.78125vw 0;

  .el-input {
    height: 3.125vw;
    font-size: 1.041667vw;

    input {
      height: 3.125vw;
    }
  }

  .input-icon {
    height: 2.03125vw;
    width: 1.041667vw;
    margin-left: 0.52vw;
  }
}

.form-item-top {
  margin-top: 3.125vw;
}
.remember-me {
  margin: 3.125vw 0 !important;
  display: block;
}

.form-footer {
  margin-top: auto;
  padding-bottom: 2.083vw;
}

.login-tip {
  font-size: 0.8333vw;
  text-align: center;
  color: #bfbfbf;
}

.login-code {
  width: 33%;
  height: 2.0833vw;
  float: right;

  img {
    cursor: pointer;
    vertical-align: middle;
  }
}

.el-login-footer {
  height: 2.0833vw;
  line-height: 2.0833vw;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial, serif;
  font-size: 0.625vw;
  letter-spacing: 0.052vw;
}

.login-code-img {
  height: 2.0833vw;
  padding-left:  0.625vw;
}
</style>
