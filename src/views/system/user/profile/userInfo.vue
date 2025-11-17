<template>
  <el-form ref="userRef" :model="userForm" label-width="80px">
    <el-form-item label="账号名称" prop="userName" label-width="95px">
      <el-input v-model="userForm.userName" maxlength="50" />
    </el-form-item>
    <el-form-item label="备注" prop="remark" label-width="95px">
      <el-input v-model="userForm.remark" maxlength="50" />
    </el-form-item>
    <el-form-item label="状态">
      <el-radio-group v-model="userForm.status">
        <el-radio value="0">正常</el-radio>
        <el-radio value="1">关闭</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item style="margin-left: 20px;">
      <el-button type="primary" @click="submit">保存</el-button>
      <el-button type="danger" @click="close">关闭</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { updateUserProfile } from '@/api/system/user';
import { propTypes } from '@/utils/propTypes';

const props = defineProps({
  user: propTypes.any.isRequired
});
const userForm = computed(() => props.user);
console.log("🚀 ~ userForm:", userForm)
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const userRef = ref<ElFormInstance>();
const rule: ElFormRules = {
  nickName: [{ required: true, message: '用户昵称不能为空', trigger: 'blur' }],
  email: [
    { required: true, message: '邮箱地址不能为空', trigger: 'blur' },
    {
      type: 'email',
      message: '请输入正确的邮箱地址',
      trigger: ['blur', 'change']
    }
  ],

};
const rules = ref<ElFormRules>(rule);

/** 提交按钮 */
const submit = () => {
  console.log("🚀 ~ submit ~ props.user:", props.user)
  userRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      await updateUserProfile(props.user);
      proxy?.$modal.msgSuccess('修改成功');
    }
  });
};
/** 关闭按钮 */
const close = () => {
  proxy?.$tab.closePage();
};
</script>
