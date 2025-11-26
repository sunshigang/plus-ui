<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter"
      :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true" label-width="100px">
            <el-form-item label="账号名称" prop="userName">
              <el-input v-model="queryParams.userName" placeholder="请输入账号名称" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-select v-model="queryParams.status" placeholder="用户状态" clearable>
                <el-option v-for="dict in sys_normal_disable" :key="dict.value" :label="dict.label"
                  :value="dict.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="创建时间" style="width: 308px">
              <el-date-picker v-model="dateRange" value-format="YYYY-MM-DD HH:mm:ss" type="daterange"
                range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
                :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"></el-date-picker>
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
        <el-row :gutter="10">
          <el-col :span="1.5">
            <el-button v-has-permi="['system:user:add']" type="primary" plain icon="Plus"
              @click="handleAdd()">新增</el-button>
          </el-col>
          <el-col :span="1.5">

          </el-col>
          <el-col :span="1.5">
            <el-button v-has-permi="['system:user:import']" type="primary" plain icon="Top"
              @click="handleImport">导入</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button v-has-permi="['system:user:export']" type="primary" plain icon="Download"
              @click="handleExport">导出</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button  type="primary" plain icon="Download"
              @click="importTemplate">下载模板</el-button>
            <!-- <el-dropdown class="mt-[1px]">
              <el-button plain type="info">
                更多
                <el-icon class="el-icon--right"><arrow-down /></el-icon></el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item icon="Download" @click="importTemplate">下载模板</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown> -->
          </el-col>
          <right-toolbar v-model:show-search="showSearch" :columns="columns" :search="true"
            @query-table="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" border :data="userList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column v-if="columns[0].visible" key="userId" label="序号" align="center" prop="userId" />
        <el-table-column v-if="columns[1].visible" key="userName" label="账号" align="center" prop="userName"
          :show-overflow-tooltip="true" />
        <el-table-column v-if="columns[2].visible" key="nickName" label="用户昵称" align="center" prop="nickName"
          :show-overflow-tooltip="true" />
        <el-table-column v-if="columns[3].visible" key="roles" label="所属角色" align="center"
          :show-overflow-tooltip="true">
          <template #default="scope">
            <!-- 遍历 roles 数组，拼接所有 roleName，用顿号分隔 -->
            {{scope.row.roles?.map(role => role.roleName).join('、') || '无角色'}}
          </template>
        </el-table-column>
        <el-table-column v-if="columns[7].visible" key="projectName" label="项目权限" align="center">
          <template #default="scope">
            <el-tooltip placement="top" :content="getProjectTooltip(scope.row)">
              <div class="project-name-wrapper">
                {{isAllProjects(scope.row) ? '全部' : scope.row.projects?.map(item => item.projectName).join('、') || '无'}}
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column v-if="columns[5].visible" key="status" label="状态" align="center" width="200">
          <template #default="scope">
            <el-switch v-model="scope.row.status" active-value="0" inactive-value="1"
              @change="handleStatusChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column v-if="columns[6].visible" label="创建时间" align="center" prop="createTime" width="200">
          <template #default="scope">
            <span>{{ scope.row.createTime ? scope.row.createTime.slice(0, 10) : '' }}</span>
          </template>
        </el-table-column>
        <el-table-column key="remark" label="备注" align="center" prop="remark" width="220" />
        <el-table-column label="操作" fixed="right" width="330" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-button v-hasPermi="['system:user:view']" link type="primary"
              @click="handleView(scope.row)">查看</el-button>
            <el-button v-hasPermi="['system:user:edit']" link type="primary"
              @click="handleUpdate(scope.row)">编辑</el-button>
            <el-button v-hasPermi="['system:user:resetPwd']" link type="primary"
              @click="handleResetPwd(scope.row)">重置密码</el-button>
            <!-- <el-button v-hasPermi="['system:user:edit']" link type="primary"
                  @click="handleAuthRole(scope.row)">分配角色</el-button> -->
            <el-button v-hasPermi="['system:user:remove']" link type="danger"
              @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize"
        :total="total" @pagination="getList" />
    </el-card>
    <!-- 添加或修改账号配置对话框（融合查看功能） -->
    <el-dialog ref="formDialogRef" v-model="dialog.visible" :title="dialog.title" width="600px" append-to-body
      @close="closeDialog">
      <el-form ref="userFormRef" :model="form" :rules="dialog.isView ? {} : rules" label-width="120px">
        <el-form-item label="账号名称" prop="userName">
          <el-input v-model="form.userName" placeholder="请输入账号名称" maxlength="30" :disabled="dialog.isView" />
        </el-form-item>
        <el-form-item label="账号密码" prop="password">
          <el-input v-model="form.password" placeholder="请输入账号密码" type="password" maxlength="20" show-password
            :disabled="dialog.isView" />
        </el-form-item>

        <el-form-item label="所属角色" prop="roleIds" v-if="dialog.isView == false">
          <el-select v-model="form.roleIds" filterable multiple placeholder="请选择" :disabled="dialog.isView">
            <el-option v-for="item in roleOptions" :key="item.roleId" :label="item.roleName"
              :value="String(item.roleId)" :disabled="item.status == '1'"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属角色" prop="roleIds" v-else>
          <el-input v-model="joinedRoleNames" placeholder="无角色" :disabled="true" />
        </el-form-item>
        <el-form-item label="项目权限" prop="projectIds">
          <el-select v-model="form.projectIds" filterable multiple clearable collapse-tags placeholder="请选择项目"
            :max-collapse-tags="1" popper-class="custom-header" :disabled="dialog.isView">
            <template #header>
              <el-checkbox v-model="checkAll" :indeterminate="indeterminate" @change="handleCheckAll"
                :disabled="dialog.isView">
                全部
              </el-checkbox>
            </template>
            <el-option key="all-option" label="全部" value="0" @click.prevent="handleCheckAll(true)" />
            <el-option v-for="item in projectOptions.filter(i => i.id !== '0')" :key="item.id" :label="item.projectName"
              :value="String(item.id)" />
            <!-- <el-option v-for="item in projectOptions" :key="item.id" :label="item.projectName" :value="String(item.id)"
              :style="{ display: item.id === '0' ? 'none' : '' }">
            </el-option> -->
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status" :disabled="dialog.isView">
            <el-radio v-for="dict in sys_normal_disable" :key="dict.value"
              :value="dict.value">{{ dict.label }}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" :disabled="dialog.isView"></el-input>
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <!-- 查看模式不显示确定按钮 -->
          <el-button v-if="!dialog.isView" type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel()">取 消</el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 用户导入对话框 -->
    <el-dialog v-model="upload.open" :title="upload.title" width="400px" append-to-body>
      <el-upload ref="uploadRef" :limit="1" accept=".xlsx, .xls" :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport" :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress" :on-success="handleFileSuccess" :auto-upload="false" drag>
        <el-icon class="el-icon--upload">
          <i-ep-upload-filled />
        </el-icon>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <template #tip>
          <div class="text-center el-upload__tip">
            <div class="el-upload__tip"><el-checkbox v-model="upload.updateSupport" />是否更新已经存在的用户数据</div>
            <span>仅允许导入xls、xlsx格式文件。</span>
            <el-link type="primary" :underline="false" style="font-size: 12px; vertical-align: baseline"
              @click="importTemplate">下载模板</el-link>
          </div>
        </template>
      </el-upload>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitFileForm">确 定</el-button>
          <el-button @click="upload.open = false">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="User" lang="ts">
import { ref, watch, computed } from 'vue'
import api from '@/api/system/user';
import { UserForm, UserQuery, UserVO } from '@/api/system/user/types';
import { DeptTreeVO, DeptVO } from '@/api/system/dept/types';
import { RoleVO, ProjectVO } from '@/api/system/role/types';
import { PostQuery, PostVO } from '@/api/system/post/types';
import { treeselect } from '@/api/system/dept';
import { globalHeaders } from '@/utils/request';
import { to } from 'await-to-js';
import { optionselect } from '@/api/system/post';
import { hasPermi } from '@/directive/permission';
import { checkPermi } from '@/utils/permission';
import { listInfo } from '@/api/project/normal/index';
import { InfoVO } from '@/api/project/normal/types';
import type { CheckboxValueType } from 'element-plus'
const router = useRouter();
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { sys_normal_disable, sys_user_sex } = toRefs<any>(proxy?.useDict('sys_normal_disable', 'sys_user_sex'));
const userList = ref<UserVO[]>();
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<number | string>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const dateRange = ref<[DateModelType, DateModelType]>(['', '']);
const deptName = ref('');
const roles = ref([]);// 当前用户的角色列表
const deptOptions = ref<DeptTreeVO[]>([]);
const enabledDeptOptions = ref<DeptTreeVO[]>([]);
const initPassword = ref<string>('');
const postOptions = ref<PostVO[]>([]);
const roleOptions = ref<RoleVO[]>([]);
interface AllProjectOption {
  id: string;
  projectName: string;
}

type ProjectOption = InfoVO | AllProjectOption;

const projectOptions = ref<ProjectOption[]>([]);
const checkAll = ref(false)
const indeterminate = ref(false)

// const handleCheckAll = (val: boolean) => {
//   indeterminate.value = false;
//   if (val) {
//     form.value.projectIds = ['0'];
//   } else {
//     // 取消全选时，清空数组
//     form.value.projectIds = [];
//   }
// };
const handleCheckAll = (val: boolean) => {
  indeterminate.value = false;
  if (val) {
    form.value.projectIds = ['0']; // 保持后端要求的赋值逻辑
    // 关键：让“全部”选项显示为选中状态（通过设置选中项实现）
    nextTick(() => {
      const allOption = document.querySelector('.el-select-dropdown__item[title="全部"]');
      if (allOption) {
        allOption.classList.add('selected'); // 手动添加选中样式
      }
    });
  } else {
    form.value.projectIds = []; // 取消全选清空
    nextTick(() => {
      const allOption = document.querySelector('.el-select-dropdown__item[title="全部"]');
      if (allOption) {
        allOption.classList.remove('selected'); // 移除选中样式
      }
    });
  }
};

/*** 用户导入参数 */
const upload = reactive<ImportOption>({
  // 是否显示弹出层（用户导入）
  open: false,
  // 弹出层标题（用户导入）
  title: '',
  // 是否禁用上传
  isUploading: false,
  // 是否更新已经存在的用户数据
  updateSupport: 0,
  // 设置上传的请求头部
  headers: globalHeaders(),
  // 上传的地址
  url: import.meta.env.VITE_APP_BASE_API + '/system/user/importData'
});
// 列显隐信息
const columns = ref<FieldOption[]>([
  { key: 0, label: `序号`, visible: false, children: [] },
  { key: 1, label: `账号名称`, visible: true, children: [] },
  { key: 2, label: `账号昵称`, visible: false, children: [] },
  { key: 3, label: `部门`, visible: true, children: [] },
  { key: 4, label: `手机号码`, visible: false, children: [] },
  { key: 5, label: `状态`, visible: true, children: [] },
  { key: 6, label: `创建时间`, visible: true, children: [] },
  { key: 7, label: `项目权限`, visible: true, children: [] }
]);

const deptTreeRef = ref<ElTreeInstance>();
const queryFormRef = ref<ElFormInstance>();
const userFormRef = ref<ElFormInstance>();
const uploadRef = ref<ElUploadInstance>();
const formDialogRef = ref<ElDialogInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: '',
  isView: false // 新增：是否为查看模式
});

const initFormData: UserForm = {
  userId: undefined,
  deptId: undefined,
  userName: '',
  nickName: undefined,
  password: '123456',
  phonenumber: undefined,
  email: undefined,
  sex: undefined,
  status: '0',
  remark: '',
  postIds: [],
  roleIds: [],
  projectName: '',
  projectIds: [],
};
// 查看表单（存储不可编辑数据）
// const viewForm = reactive<UserForm & { statusLabel: string; deptName: string }>({
//   ...initFormData,
//   statusLabel: '',
//   deptName: '',
//   roleNames: ''
// });

const initData: PageData<UserForm, UserQuery> = {
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    userName: '',
    phonenumber: '',
    status: '',
    deptId: '',
    roleId: '',
    userIds: ''
  },
  rules: {
    userName: [
      { required: true, message: '账号名称不能为空', trigger: 'blur' },
      {
        min: 2,
        max: 20,
        message: '账号名称长度必须介于 2 和 20 之间',
        trigger: 'blur'
      }
    ],
    nickName: [{ required: true, message: '账号昵称不能为空', trigger: 'blur' }],
    password: [
      { required: true, message: '账号密码不能为空', trigger: 'blur' },
      {
        min: 5,
        max: 20,
        message: '账号密码长度必须介于 5 和 20 之间',
        trigger: 'blur'
      },
      { pattern: /^[^<>"'|\\]+$/, message: '不能包含非法字符：< > " \' \\ |', trigger: 'blur' }
    ],
    email: [
      {
        type: 'email',
        message: '请输入正确的邮箱地址',
        trigger: ['blur', 'change']
      }
    ],
    phonenumber: [
      {
        pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
        message: '请输入正确的手机号码',
        trigger: 'blur'
      }
    ],
    roleIds: [{ required: true, message: '账号角色不能为空', trigger: 'blur' }]
  }
};
const data = reactive<PageData<UserForm, UserQuery>>(initData);

const { queryParams, form, rules } = toRefs<PageData<UserForm, UserQuery>>(data);

/** 通过条件过滤节点  */
const filterNode = (value: string, data: any) => {
  if (!value) return true;
  return data.label.indexOf(value) !== -1;
};
/** 根据名称筛选部门树 */
watchEffect(
  () => {
    deptTreeRef.value?.filter(deptName.value);
  },
  {
    flush: 'post'
  }
);
// 判断是否选中了“全部”项目
const isAllProjects = (row: UserVO) => {
  if (!row.projects || row.projects.length === 0) return false;
  //若项目ID数组包含'0'，则表示选择了“全部”
  return row.projectIds?.includes('0');
};

// 生成 tooltip 提示文本（选中“全部”时显示所有项目名）
const getProjectTooltip = (row: UserVO) => {
  if (isAllProjects(row)) {
    return "全部";
  }
  return row.projects?.map(item => item.projectName).join('、') || '无';
};
/** 查询用户列表 */
const getList = async () => {
  loading.value = true;
  const res = await api.listUser(proxy?.addDateRange(queryParams.value, dateRange.value));
  console.log("🚀 ~ getList ~ queryParams.value:", queryParams.value)
  const projectRes = await listInfo();
  console.log("🚀 ~ getList ~ projectRes.rows:", projectRes.rows)
  projectOptions.value = [];
  projectOptions.value.push({ id: '0', projectName: '全部' });
  projectOptions.value.push(...projectRes.rows);
  loading.value = false;
  userList.value = res.rows;
  console.log("🚀 ~ getList ~ userList.value:", userList.value)
  total.value = res.total;
};
/** 查询部门下拉树结构 */
const getDeptTree = async () => {
  const res = await api.deptTreeSelect();
  deptOptions.value = res.data;
  enabledDeptOptions.value = filterDisabledDept(res.data);
};

/** 过滤禁用的部门 */
const filterDisabledDept = (deptList: DeptTreeVO[]) => {
  return deptList.filter((dept) => {
    if (dept.disabled) {
      return false;
    }
    if (dept.children && dept.children.length) {
      dept.children = filterDisabledDept(dept.children);
    }
    return true;
  });
};

/** 节点单击事件 */
const handleNodeClick = (data: DeptVO) => {
  queryParams.value.deptId = data.id;
  handleQuery();
};


/** 辅助函数：根据部门ID获取部门名称 */
const getDeptNameById = (deptId: number | string | undefined, deptList: DeptTreeVO[]): string => {
  if (!deptId) return '';
  for (const dept of deptList) {
    if (dept.id === deptId) return dept.label;
    if (dept.children && dept.children.length) {
      const childName = getDeptNameById(deptId, dept.children);
      if (childName) return childName;
    }
  }
  return '';
};
/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
};
/** 重置按钮操作 */
const resetQuery = () => {
  dateRange.value = ['', ''];
  queryFormRef.value?.resetFields();
  queryParams.value.pageNum = 1;
  queryParams.value.deptId = undefined;
  deptTreeRef.value?.setCurrentKey(undefined);
  handleQuery();
};
/** 删除按钮操作（修复弹窗调用和逻辑） */
const handleDelete = async (row?: UserVO) => {
  const userIds = row?.userId || ids.value;
  try {
    // 正确调用 ElMessageBox.confirm，匹配截图样式
    await ElMessageBox.confirm(
      '请确认是否删除该账号，删除后无法再通过此账号密码登录，账号所有数据将删除。',
      '请确认是否删除账号',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error', // 红色错误图标
        confirmButtonClass: 'el-button--danger' // 红色确定按钮
      }
    );

    await api.delUser(userIds);
    await getList();
    proxy?.$modal.msgSuccess('删除成功');
  } catch (err) {
    // 捕获用户取消操作，不做额外处理
    if (err !== 'cancel') {
      proxy?.$modal.msgError(`删除失败：${(err as Error).message || '未知错误'}`);
    }
  }
};
/** 用户状态修改  */
const handleStatusChange = async (row: UserVO) => {
  const text = row.status === '0' ? '启用' : '停用';
  try {
    await proxy?.$modal.confirm('确认要"' + text + '""' + row.userName + '"账号吗?');
    await api.changeUserStatus(row.userId, row.status);
    proxy?.$modal.msgSuccess(text + '成功');
  } catch (err) {
    row.status = row.status === '0' ? '1' : '0';
  }
};
/** 重置密码按钮操作 */
const handleResetPwd = async (row: UserVO) => {
  const [err, res] = await to(
    ElMessageBox.prompt('请输入"' + row.userName + '"的新密码', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      closeOnClickModal: false,
      inputPattern: /^.{5,20}$/,
      inputErrorMessage: '账号密码长度必须介于 5 和 20 之间',
      inputValidator: (value) => {
        if (/<|>|"|'|\||\\/.test(value)) {
          return '不能包含非法字符：< > " \' \\ |';
        }
      }
    })
  );
  if (!err && res) {
    await api.resetUserPwd(row.userId, res.value);
    proxy?.$modal.msgSuccess('修改成功，新密码是：' + res.value);
  }
};

/** 选择条数  */
const handleSelectionChange = (selection: UserVO[]) => {
  ids.value = selection.map((item) => item.userId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
  queryParams.value.userIds = String(ids.value)
};

/** 导入按钮操作 */
const handleImport = () => {
  upload.title = '账号导入';
  upload.open = true;
};
/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download(
    'system/user/export',
    {
      ...queryParams.value
    },
    `user_${new Date().getTime()}.xlsx`
  );
};
/** 下载模板操作 */
const importTemplate = () => {
  proxy?.download('system/user/importTemplate', {}, `user_template_${new Date().getTime()}.xlsx`);
};

/**文件上传中处理 */
const handleFileUploadProgress = () => {
  upload.isUploading = true;
};
/** 文件上传成功处理 */
const handleFileSuccess = (response: any, file: UploadFile) => {
  upload.open = false;
  upload.isUploading = false;
  uploadRef.value?.handleRemove(file);
  console.log("🚀 ~ handleFileSuccess ~ uploadRef.value:", uploadRef.value)
  ElMessageBox.alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + '</div>', '导入结果', {
    dangerouslyUseHTMLString: true
  });
  getList();
};

/** 提交上传文件 */
function submitFileForm() {
  uploadRef.value?.submit();
  console.log("🚀 ~ submitFileForm ~ uploadRef.value:", uploadRef.value)
}

/** 重置操作表单 */
const reset = () => {
  form.value = { ...initFormData };
  userFormRef.value?.resetFields();
};
/** 取消按钮 */
const cancel = () => {
  dialog.visible = false;
  reset();
};

/** 新增按钮操作 */
const handleAdd = async () => {
  reset();
  const { data } = await api.getUser();
  dialog.visible = true;
  dialog.title = '新增账号';
  dialog.isView = false; // 明确设置为编辑模式
  postOptions.value = data.posts;
  roleOptions.value = data.roles;
  form.value.password = initPassword.value.toString();
};
const joinedRoleNames = computed(() => {
  // 类型守卫：判断是否为角色对象数组（查看模式）
  const isRoleVOArray = (arr: any[]): arr is RoleVO[] => {
    return arr.length > 0 && 'roleName' in arr[0];
  };

  if (Array.isArray(form.value.roleIds)) {
    // 若是角色对象数组，则提取roleName拼接
    if (isRoleVOArray(form.value.roleIds)) {
      return form.value.roleIds
        .map(role => role.roleName || '')
        .filter(name => name)
        .join('、') || '无角色';
    }
    // 若是ID数组（编辑模式查看时，理论上不会进入此分支）
    return '无角色';
  }
  return '无角色';
});
console.log("🚀 ~ joinedRoleNames:", joinedRoleNames)
/** 查看按钮操作 */
const handleView = async (row: UserVO) => {
  reset();
  // 获取用户完整信息
  const { data } = await api.getUser(row.userId);
  console.log("🚀 ~ handleView ~ data:", data)
  const { roles, ...userBaseInfo } = data.user;
  // 赋值基础信息
  Object.assign(form.value, data.user);
  // 处理角色数据
  form.value.roleIds = Array.isArray(roles) ? roles : [];
  console.log("🚀 ~ handleView ~  form.value.roleIds:", form.value.roleIds)
  // 处理项目权限
  form.value.projectIds = Array.isArray(data.projects)
    ? data.projects.map(item => String(item.id))
    : [];
  // 设置查看模式
  dialog.isView = true;
  dialog.title = '查看账号';
  dialog.visible = true;
};

/** 修改按钮操作 */
const handleUpdate = async (row?: UserForm) => {
  reset();
  const userId = row?.userId || ids.value[0];
  const { data } = await api.getUser(userId);
  dialog.visible = true;
  dialog.title = '修改账号';
  dialog.isView = false;
  roleOptions.value = data.roles || [];
  console.log("🚀 ~ handleUpdate ~ roleOptions.value:", roleOptions.value)
  postOptions.value = data.posts || [];
  Object.assign(form.value, data.user);
  form.value.roleIds = Array.isArray(data.roleIds) ? data.roleIds.map(id => String(id)) : [];
  form.value.postIds = Array.isArray(data.postIds) ? data.postIds : [];
  form.value.password = initPassword.value;
  form.value.projectIds = []; // 强制初始化为空数组，避免 null/undefined
  if (Array.isArray(data.projects)) { // 只在 data.projects 是有效数组时处理
    form.value.projectIds = data.projects.map(item => String(item.id)); // 直接赋值，比 push 更高效
    console.log(projectOptions)
  }
  console.log("🚀 ~ form.value.password :", form.value.password)
};

/** 提交按钮 */
const submitForm = () => {
  userFormRef.value?.validate(async (valid: boolean) => {
    console.log("🚀 ~ submitForm ~ form.value:", form.value)
    if (valid) {
      form.value.userId ? await api.updateUser(form.value) : await api.addUser(form.value);
      proxy?.$modal.msgSuccess('操作成功');
      dialog.visible = false;
      await getList();
    }
  });
};

/**
 * 关闭用户弹窗
 */
const closeDialog = () => {
  dialog.visible = false;
  resetForm();
};

/**
 * 重置表单
 */
const resetForm = () => {
  userFormRef.value?.resetFields();
  userFormRef.value?.clearValidate();

  form.value.id = undefined;
  form.value.status = '1';
};
// watch(() => form.value.projectIds, (val) => {
//   if (val.length === 0) {
//     checkAll.value = false;
//     indeterminate.value = false;
//   } else if (val.length === projectOptions.value.length) {
//     checkAll.value = true;
//     indeterminate.value = false;
//   } else {
//     indeterminate.value = true;
//   }
// }, { immediate: true, deep: true });
// 监听 projectIds 变化，同步全选框和“全部”选项状态
watch(() => form.value.projectIds, (val) => {
  const hasAll = val.includes('0'); // 判断是否选中“全部”
  const realProjectCount = projectOptions.value.filter(i => i.id !== '0').length; // 真实项目数量

  // 同步全选框状态
  if (hasAll) {
    checkAll.value = true;
    indeterminate.value = false;
    // 让“全部”选项显示选中
    nextTick(() => {
      const allOption = document.querySelector('.el-select-dropdown__item[title="全部"]');
      if (allOption) allOption.classList.add('selected');
    });
  } else if (val.length === 0) {
    checkAll.value = false;
    indeterminate.value = false;
    // 移除“全部”选项选中样式
    nextTick(() => {
      const allOption = document.querySelector('.el-select-dropdown__item[title="全部"]');
      if (allOption) allOption.classList.remove('selected');
    });
  } else {
    checkAll.value = false;
    indeterminate.value = true;
    // 移除“全部”选项选中样式
    nextTick(() => {
      const allOption = document.querySelector('.el-select-dropdown__item[title="全部"]');
      if (allOption) allOption.classList.remove('selected');
    });
  }
}, { immediate: true, deep: true });
onMounted(() => {
  getDeptTree(); // 初始化部门数据
  getList(); // 初始化列表数据
  proxy?.getConfigKey('sys.user.initPassword').then((response) => {
    initPassword.value = response.data;
    console.log("🚀 ~ initPassword.value:", initPassword.value)
  });
});


</script>
<style scoped>
/* 关键样式：控制文本只显示一行，超出隐藏并显示省略号 */
.project-name-wrapper {
  white-space: nowrap;
  /* 禁止文本换行 */
  overflow: hidden;
  /* 超出容器部分隐藏 */
  text-overflow: ellipsis;
  /* 超出部分显示省略号 */
  width: 100%;
  /* 继承容器宽度 */
}

.custom-header {
  .el-checkbox {
    display: flex;
    height: unset;
  }
}

:deep(.el-form-item--large .el-form-item__label) {
  height: 40px;
  line-height: 40px;
  width: 120px !important;
}

:deep(.el-select-dropdown__item.selected) {
  background-color: var(--el-select-dropdown-item-hover-bg-color);
  color: var(--el-color-primary);
  font-weight: 500;
}
</style>
