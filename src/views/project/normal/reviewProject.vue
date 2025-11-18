<template>
  <el-dialog :title="title" v-model="visible" width="1800px" append-to-body>
    <!-- 项目基础信息（只读） -->
    <div class="section project-basic-info">
      <h3 class="section-title">项目基础信息</h3>
      <el-form :model="form" label-width="230px" disabled>
        <!-- 内容与viewProject.vue一致 -->
      </el-form>
    </div>

    <!-- 建设信息（只读） -->
    <div class="section project-documents">
      <h3 class="section-title">建设信息</h3>
      <el-button type="primary" @click="handleModelPreview" class="modelPreview">
        <img class="imgModel" src="../../../assets/images/model.png" />三维场景效果预览
      </el-button>
      <el-form :model="form" label-width="230px" disabled>
        <!-- 内容与viewProject.vue一致 -->
      </el-form>
    </div>

    <!-- 审批操作区 -->
    <div class="approval-operation">
      <h3 class="section-title">审批意见</h3>
      <el-form ref="approvalFormRef" :model="approvalForm" label-width="100px">
        <el-form-item label="审批结果" prop="result" required>
          <el-radio-group v-model="approvalForm.result">
            <el-radio-button label="通过">通过</el-radio-button>
            <el-radio-button label="驳回">驳回</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审批意见" prop="comment" required>
          <el-input v-model="approvalForm.comment" type="textarea" rows="4" placeholder="请输入审批意见" />
        </el-form-item>
      </el-form>
    </div>

    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="submitApproval">提交审批</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive } from 'vue'

const visible = ref(false)
const title = ref('审批项目')
const form = reactive({
  // 项目信息（只读）
})
const approvalForm = reactive({
  result: '',
  comment: ''
})

const submitApproval = () => {
  // 提交审批逻辑
}

defineExpose({
  open: (row) => {
    visible.value = true
    form = { ...row }
    // 根据审批角色设置标题
    title.value = row.status === '管委会审批中' ? '管委会审批' : '林业局审批'
  }
})
</script>
