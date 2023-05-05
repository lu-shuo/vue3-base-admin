<template>
	<div class="table-box">
		<ProTable
			ref="proTable"
			title="用户列表"
			border
			:api="getTableList"
			:columns="columns"
			:init-params="initParams"
			:pageParamsKeyMap="{ pageNo: 'pageNum', pageSize: 'pageSize' }"
			:apiDataKeyMap="{ tableData: 'list', pageNo: 'pageNum', pageSize: 'pageSize', total: 'total' }"
		>
			<!-- 表格 header 按钮 -->
			<template #tableHeader="scope">
				<el-button
					type="danger"
					:icon="Delete"
					plain
					@click="batchDelete(scope.selectedIds as string[])"
					:disabled="!scope.isSelected"
				>
					批量删除用户
				</el-button>
			</template>
			<!-- Expand -->
			<template #expand="scope">
				{{ scope.row }}
			</template>
			<!-- usernameHeader -->
			<template #usernameHeader="scope">
				<el-button type="primary" @click="ElMessage.success('我是通过作用域插槽渲染的表头')">
					{{ scope.row.label }}
				</el-button>
			</template>
			<!-- createTime -->
			<template #createTime="scope">
				<el-button type="primary" link @click="ElMessage.success('我是通过作用域插槽渲染的内容')">
					{{ scope.row.createTime }}
				</el-button>
			</template>
			<!-- 表格操作 -->
			<template #operation="scope">
				<el-button type="primary" link :icon="Delete" @click="deleteAccount(scope.row)">删除</el-button>
			</template>
		</ProTable>
	</div>
</template>

<script lang="tsx" setup name="UseProTable">
import { getUserList, getUserGender, getUserStatus, deleteUser } from '@/api/modules/user';
import { User } from '@/api/models/user';
import ProTable from '@/components/ProTable/index.vue';
import { ColumnProps } from '@/components/ProTable/interface';
import { ElMessage } from 'element-plus';
import { Delete } from '@element-plus/icons-vue';
import { useConfirm } from '@/hooks/useConfirm';

// 获取 ProTable 元素，调用其获取刷新数据方法（还能获取到当前查询参数，方便导出携带参数）
const proTable = ref();

// 自定义渲染表头（使用tsx语法）
const headerRender = (row: ColumnProps) => {
	return (
		<el-button
			type="primary"
			onClick={() => {
				ElMessage.success('我是通过 tsx 语法渲染的表头');
			}}
		>
			{row.label}
		</el-button>
	);
};

const columns: ColumnProps<User.ResUserList>[] = [
	{ type: 'selection', fixed: 'left', width: 80 },
	{ type: 'index', label: '#', width: 80 },
	{ type: 'expand', label: 'Expand', width: 100 },
	{
		prop: 'username',
		label: '用户姓名',
		search: { el: 'input' },
		render: scope => {
			return (
				<el-button type="primary" link onClick={() => ElMessage.success('我是通过 tsx 语法渲染的内容')}>
					{scope.row.username}
				</el-button>
			);
		}
	},
	{
		prop: 'gender',
		label: '性别',
		// 字典数据
		// enum: genderType,
		// 字典请求不带参数
		enum: getUserGender,
		// isFilterEnum: true,
		// 字典请求携带参数
		// enum: () => getUserGender({ id: 1 }),
		search: { el: 'select', props: { filterable: true } },
		fieldNames: { label: 'genderLabel', value: 'genderValue' }
	},
	// 多级 prop
	{ prop: 'user.detail.age', label: '年龄', search: { el: 'input' } },
	{ prop: 'idCard', label: '身份证号', search: { el: 'input' } },
	{ prop: 'email', label: '邮箱' },
	{ prop: 'address', label: '居住地址' },
	{
		prop: 'status',
		label: '用户状态',
		enum: getUserStatus,
		fieldNames: { label: 'userLabel', value: 'userStatus' },
		render: scope => {
			return (
				<>
					<el-tag type={scope.row.status ? 'success' : 'danger'}>{scope.row.status ? '启用' : '禁用'}</el-tag>
				</>
			);
		}
	},
	{
		prop: 'createTime',
		label: '创建时间',
		headerRender,
		width: 180,
		search: {
			el: 'date-picker',
			span: 2,
			props: { type: 'datetimerange', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
			defaultValue: ['2022-11-12 11:35:00', '2022-12-12 11:35:00']
		}
	},
	{ prop: 'operation', label: '操作', fixed: 'right', width: 330 }
];
// 如果表格需要初始化请求参数，直接定义传给 ProTable(之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParams = reactive({ type: 1 });

// 如果你想在请求之前对当前请求参数做一些操作，可以自定义如下函数：params 为当前所有的请求参数（包括分页），最后返回请求列表接口
// 默认不做操作就直接在 ProTable 组件上绑定	:requestApi="getUserList"
const getTableList = (params: any) => {
	const newParams = JSON.parse(JSON.stringify(params));
	newParams.username && (newParams.username = 'custom-' + newParams.username);
	return getUserList(newParams);
};

// 删除用户信息
const deleteAccount = async (params: User.ResUserList) => {
	await useConfirm(deleteUser, { id: [params.id] }, `删除【${params.username}】用户`, '删除成功', '删除失败');
	proTable.value.getTableList();
};

// 批量删除用户信息
const batchDelete = async (id: string[]) => {
	await useConfirm(deleteUser, { id }, '删除所选用户信息', '删除成功', '删除失败');
	proTable.value.clearSelection();
	proTable.value.getTableList();
};
</script>

<style lang="scss" scoped></style>
