<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter"
      :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true" label-width="80px">
            <el-form-item label="公告标题" prop="noticeTitle">
              <el-input v-model="queryParams.noticeTitle" placeholder="请输入公告标题" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="操作人员" prop="createByName">
              <el-input v-model="queryParams.createByName" placeholder="请输入操作人员" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="类型" prop="noticeType">
              <el-select v-model="queryParams.noticeType" placeholder="公告类型" clearable>
                <el-option v-for="dict in sys_notice_type" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
              <el-button icon="Refresh" @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </transition>

    <el-card shadow="hover">
      <template #header>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button v-hasPermi="['system:notice:add']" type="primary" plain icon="Plus"
              @click="handleAdd">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button v-hasPermi="['system:notice:edit']" type="success" plain icon="Edit" :disabled="single"
              @click="handleUpdate()">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button v-hasPermi="['system:notice:remove']" type="danger" plain icon="Delete" :disabled="multiple"
              @click="handleDelete()">
              删除
            </el-button>
          </el-col>
          <right-toolbar v-model:show-search="showSearch" @query-table="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" border :data="noticeList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column v-if="false" label="序号" align="center" prop="noticeId" width="100" />
        <el-table-column label="公告标题" align="center" prop="noticeTitle" :show-overflow-tooltip="true" />
        <el-table-column label="公告类型" align="center" prop="noticeType" width="150">
          <template #default="scope">
            <dict-tag :options="sys_notice_type" :value="scope.row.noticeType" />
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" prop="status" width="150">
          <template #default="scope">
            <dict-tag :options="sys_notice_status" :value="scope.row.status" />
          </template>
        </el-table-column>
        <el-table-column label="创建者" align="center" prop="createByName" width="150" />
        <el-table-column label="创建时间" align="center" prop="createTime" width="150">
          <template #default="scope">
            <span>{{ proxy.parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-button v-hasPermi="['system:notice:view']" link type="primary"
              @click="handleView(scope.row)">详情查看</el-button>
            <!-- <el-tooltip content="修改" placement="top">
              <el-button v-hasPermi="['system:notice:edit']" link type="primary" icon="Edit"
                @click="handleUpdate(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button v-hasPermi="['system:notice:remove']" link type="primary" icon="Delete"
                @click="handleDelete(scope.row)"></el-button>
            </el-tooltip> -->
            <el-button v-hasPermi="['system:notice:read']" link :style="{
              color: scope.row.read ? '#999999' : '#409eff',
              cursor: scope.row.read ? 'default' : 'pointer'
            }" :disabled="scope.row.read" @click="handleRead(scope.row)">
              标为已读
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize"
        :total="total" @pagination="getList" />
    </el-card>
    <!-- 添加或修改公告对话框 -->
    <el-dialog v-model="dialog.visible" :title="dialog.title" width="780px" append-to-body>
      <el-form ref="noticeFormRef" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="公告标题" prop="noticeTitle">
              <el-input v-model="form.noticeTitle" placeholder="请输入公告标题" :disabled="isViewMode" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="公告类型" prop="noticeType">
              <el-select v-model="form.noticeType" placeholder="请选择" :disabled="isViewMode">
                <el-option v-for="dict in sys_notice_type" :key="dict.value" :label="dict.label"
                  :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="状态">
              <el-radio-group v-model="form.status" :disabled="isViewMode">
                <el-radio v-for="dict in sys_notice_status" :key="dict.value"
                  :value="dict.value">{{ dict.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="内容">
              <editor v-model="form.noticeContent" :min-height="192" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm" v-if="!isViewMode">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Notice" lang="ts">
import { listNotice, getNotice, delNotice, readNotice, addNotice, updateNotice } from '@/api/system/notice';
import { NoticeForm, NoticeQuery, NoticeVO } from '@/api/system/notice/types';
import { useRouter } from 'vue-router'
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { sys_notice_status, sys_notice_type } = toRefs<any>(proxy?.useDict('sys_notice_status', 'sys_notice_type'));
const router = useRouter()
const noticeList = ref<NoticeVO[]>([]);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const noticeFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: NoticeForm = {
  noticeId: undefined,
  noticeTitle: '',
  noticeType: '',
  noticeContent: '',
  status: '0',
  remark: '',
  createByName: '',
  read: false
};
const data = reactive<PageData<NoticeForm, NoticeQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    noticeTitle: '',
    createByName: '',
    status: '',
    noticeType: '',
    read: false
  },
  rules: {
    noticeTitle: [{ required: true, message: '公告标题不能为空', trigger: 'blur' }],
    noticeType: [{ required: true, message: '公告类型不能为空', trigger: 'change' }]
  }
});
const isViewMode = ref(false);
const { queryParams, form, rules } = toRefs(data);

/** 查询公告列表 */
const getList = async () => {
  loading.value = true;
  const res = await listNotice(queryParams.value);
  noticeList.value = res.rows;
  console.log("🚀 ~ getList ~ noticeList.value:", noticeList.value)
  total.value = res.total;
  loading.value = false;
};
/** 取消按钮 */
const cancel = () => {
  reset();
  isViewMode.value = false;
  dialog.visible = false;
};
/** 表单重置 */
const reset = () => {
  form.value = { ...initFormData };
  noticeFormRef.value?.resetFields();
};
/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
};
/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  handleQuery();
};
/** 多选框选中数据 */
const handleSelectionChange = (selection: NoticeVO[]) => {
  ids.value = selection.map((item) => item.noticeId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};
/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = '添加公告';
};
/**修改按钮操作 */
const handleUpdate = async (row?: NoticeVO) => {
  reset();
  const noticeId = row?.noticeId || ids.value[0];
  const { data } = await getNotice(noticeId);
  Object.assign(form.value, data);
  dialog.visible = true;
  dialog.title = '修改公告';
  isViewMode.value = false; // 重置为修改模式
};
/**查看按钮操作 */
const handleView = async (row?: NoticeVO) => {
   if (!row) return; // 确保有选中行
  reset();
  if (row.majorFlag == true) {
    router.push(`/project/major/major-view/${row.projectId}`);
  } else {
    router.push(`/project/normal/normal-view/${row.projectId}`);
  }
  // if (!row) return; // 确保有选中行
  // reset();
  // const noticeId = row.noticeId;
  // const { data } = await getNotice(noticeId);
  // Object.assign(form.value, data); // 加载数据
  // isViewMode.value = true; // 标记为查看模式
  // dialog.visible = true;
  // dialog.title = '查看公告';
};

/** 提交按钮 */
const submitForm = () => {
  noticeFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      form.value.noticeId ? await updateNotice(form.value) : await addNotice(form.value);
      proxy?.$modal.msgSuccess('操作成功');
      dialog.visible = false;
      await getList();
    }
  });
};
/** 删除按钮操作 */
const handleDelete = async (row?: NoticeVO) => {
  const noticeIds = row?.noticeId || ids.value;
  await proxy?.$modal.confirm('是否确认删除公告编号为"' + noticeIds + '"的数据项？');
  await delNotice(noticeIds);
  await getList();
  proxy?.$modal.msgSuccess('删除成功');
};
/** 已读按钮操作 */
const handleRead = async (row?: NoticeVO) => {
  if (!row) {
    proxy?.$modal.msgError('请选择有效公告');
    return;
  }
  // 2. 已读状态直接返回，避免重复操作
  if (row.read) {
    proxy?.$modal.msgWarning('该公告已标记为已读');
    return;
  }
  const noticeIds = row.noticeId;
  const noticeTitle = row.noticeTitle || '当前公告'; // 兜底文案，避免空值
  try {
    // 3. 捕获弹窗取消的 Promise 异常
    await proxy?.$modal.confirm(`是否将"${noticeTitle}"标记为已读？`);
    await readNotice(noticeIds);
    await getList();
    proxy?.$modal.msgSuccess('标记成功');
  } catch (error) {
    // 捕获取消操作的异常，不抛出错误
    console.log('用户取消标记已读操作', error);
  }
};

onMounted(() => {
  getList();
});
</script>
<style scoped>
::v-deep .el-form-item--large .el-form-item__label {
  height: 40px;
  line-height: 40px;
  width: 100px !important;
}
</style>
