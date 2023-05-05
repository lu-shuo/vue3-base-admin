<template>
	<!-- 查询表单 card -->
	<SearchForm
		v-show="isShowSearch"
		:search="search"
		:reset="reset"
		:search-params="searchParams"
		:columns="searchColumns"
		:search-col="searchCol"
	/>

	<!-- 表格主体 card-->
	<div class="card table-main">
		<!-- 表格头部 操作按钮 -->
		<div class="table-header">
			<div class="header-button-lf">
				<slot name="tableHeader" :selectedIds="selectedIds" :selectedList="selectedList" :isSelected="isSelected" />
			</div>
			<div class="header-button-ri" v-if="toolButton">
				<slot name="toolButton">
					<el-button :icon="Refresh" circle @click="getTableList" />
					<el-button :icon="Operation" circle v-if="columns.length" @click="openColSetting" />
					<el-button :icon="Search" circle v-if="searchColumns.length" @click="isShowSearch = !isShowSearch" />
				</slot>
			</div>
		</div>
		<!-- 表格主体 -->
		<el-table
			ref="tableRef"
			v-bind="$attrs"
			v-loading="loading"
			:data="tableData"
			:row-key="getRowKey"
			@selection-change="handleSelectionChange"
		>
			<!-- 默认插槽 -->
			<slot></slot>
			<template v-for="item in tableColumns" :key="item">
				<!-- selection || index -->
				<el-table-column
					v-if="item.type === 'selection' || item.type === 'index'"
					v-bind="item"
					:align="item.align ?? 'center'"
					:reserve-selection="item.type === 'selection'"
				>
					<!-- reserve-selection: 数据刷新后是否保留选项，仅对  type=selection 的列有效， 请注意， 需指定 row-key 来让这个功能生效。 -->
				</el-table-column>
				<!-- expand -->
				<!-- expand	通过设置 type="expand" 和 slot 可以开启展开行功能， el-table-column 的模板会被渲染成为展开行的内容，展开行可访问的属性与使用自定义列模板时的 slot 相同。 -->
				<el-table-column v-if="item.type === 'expand'" v-bind="item" :align="item.align ?? 'center'" v-slot="scope">
					<component v-if="item.render" :is="item.render" v-bind="scope"></component>
					<slot v-else :name="item.type" v-bind="scope"></slot>
				</el-table-column>
				<!-- other 循环递归 -->
				<TableColumn v-if="!item.type && item.prop && item.isShow" :column="item">
					<template v-for="slot in Object.keys($slots)" #[slot]="scope">
						<slot :name="slot" v-bind="scope"></slot>
					</template>
				</TableColumn>
			</template>
			<!-- 插入表格最后一行之后的插槽 -->
			<template #append>
				<slot name="append"> </slot>
			</template>
			<!-- 表格无数据情况 -->
			<template #empty>
				<div class="table-empty">
					<slot name="empty">
						<img src="@/assets/images/notData.png" alt="notData" />
						<div>暂无数据</div>
					</slot>
				</div>
			</template>
		</el-table>
		<!-- 分页组件 -->
		<slot name="pagination">
			<Pagination
				v-if="pageable"
				:pageParams="pageParams"
				:handle-size-change="handleSizeChange"
				:handle-current-change="handleCurrentChange"
			/>
		</slot>
	</div>
	<!-- 列设置 -->
	<ColSetting v-if="toolButton" ref="colRef" v-model:col-setting="colSetting" />
</template>

<script lang="ts" setup name="ProTable">
import { useSelection } from '@/hooks/useSelection';
import { useTable } from '@/hooks/useTable';
import { Table } from '@/hooks/interface/index';
import { ColumnProps } from '@/components/ProTable/interface';
import { BreakPoint } from '@/components/Grid/interface';
import SearchForm from '@/components/SearchForm/index.vue';
import Pagination from './components/Pagination.vue';
import ColSetting from './components/ColSetting.vue';
import { handleProp } from '@/utils';
import { ElTable, TableProps } from 'element-plus';
import { Refresh, Operation, Search } from '@element-plus/icons-vue';

interface ProTableProps extends Partial<Omit<TableProps<any>, 'data'>> {
	columns: ColumnProps[]; // 列配置项
	api: (params: any) => Promise<any> | any; // 请求表格数据的 api ==> 必传
	requestOnMount?: boolean; // 是否在mounted周期自动执行请求 api ==> 非必传（默认为true）
	apiDataKeyMap?: Table.ApiDataKeyMap; // 接口返回数据字段映射 ==> 非必传（默认为{}）
	pageable?: boolean; // 是否需要分页组件 ==> 非必传（默认为true）
	pageParamsKeyMap?: Table.PageParamsKeyMap; // 分页字段映射 ==> 非必传（默认为{}）
	initParams?: any; // 初始请求参数 ==> 非必传（默认为{}）
	filterEmptyParams?: boolean; // 过滤掉请求参数中的null,undefined,''，不包括false或0 ==> 非必传（默认为false）
	dataCallback?: (data: any) => any; // 返回数据的回调函数，可以对数据进行处理 ==> 非必传
	rowKey?: string; // 行数据的 Key，用来优化 Table 的渲染，当表格数据多选时，所指定的 id ==> 非必传（默认为 id）
	toolButton?: boolean; // 是否显示表格功能按钮 ==> 非必传（默认为true）
	searchCol?: number | Record<BreakPoint, number>; // 表格搜索项 每列占比配置 ==> 非必传 { xs: 1, sm: 2, md: 2, lg: 3, xl: 4 }
}

// * props
const props = withDefaults(defineProps<ProTableProps>(), {
	columns: () => [],
	requestOnMount: true,
	apiDataKeyMap: () => ({
		tableData: 'records',
		pageNo: 'count',
		pageSize: 'size',
		total: 'total'
	}),
	pageable: true,
	pageParamsKeyMap: () => ({
		// 分页查询参数映射
		pageSize: 'pageSize',
		pageNo: 'pageNo'
	}),
	initParams: () => ({}),
	filterEmptyParams: false,
	rowKey: 'id',
	toolButton: true,
	searchCol: () => ({ xs: 1, sm: 2, md: 2, lg: 3, xl: 4 })
});

// * 是否显示搜索模块
const isShowSearch = ref(true);

// * 表格hooks
const tableRef = ref<InstanceType<typeof ElTable>>();

const {
	tableData,
	pageParams,
	searchParams,
	initSearchParams,
	loading,
	search,
	reset,
	getTableList,
	handleCurrentChange,
	handleSizeChange
} = useTable({
	api: props.api,
	apiDataKeyMap: props.apiDataKeyMap,
	initParams: props.initParams,
	dataCallback: props.dataCallback,
	pageable: props.pageable,
	initOnMount: props.requestOnMount
});

// * 监听页面 initParam 改化，重新获取表格数据
watch(() => props.initParams, getTableList, { deep: true });

// * 表格多选 Hooks
const { selectedIds, selectedList, isSelected, getRowKey, handleSelectionChange, toggleRowsSelection } = useSelection(
	props.rowKey,
	tableRef
);

// * 接收 columns 并设置为响应式
const tableColumns = ref<ColumnProps[]>(props.columns);

// * 定义 enumMap 存储 enum 值（避免异步请求无法格式化单元格内容 || 无法填充搜索下拉选择）
const enumMap = ref(new Map<string, { [key: string]: any }[]>());
provide('enumMap', enumMap);
const setEnumMap = async (col: ColumnProps) => {
	if (!col.enum) return; // 字典，可格式化单元格内容，还可以作为搜索框的下拉选项（字典可以为 API 请求函数，内部会自动执行）
	// 如果当前 enum 为后台数据需要请求数据，则调用该请求接口，并存储到 enumMap
	if (typeof col.enum !== 'function') return enumMap.value.set(col.prop!, col.enum!);
	const { data } = await col.enum();
	enumMap.value.set(col.prop!, data);
};

// * 扁平化 columns
const flatColumnsFunc = (columns: ColumnProps[], flatArr: ColumnProps[] = []) => {
	columns.forEach(async col => {
		if (col._children?.length) flatArr.push(...flatColumnsFunc(col._children));
		flatArr.push(col);

		// 给每一项 column 添加 isShow && isFilterEnum 默认属性
		col.isShow = col.isShow ?? true;
		col.isFilterEnum = col.isFilterEnum ?? true;

		// 设置 enumMap
		setEnumMap(col);
	});
	return flatArr.filter(item => !item._children?.length);
};

// flatColumns
const flatColumns = ref<ColumnProps[]>();
flatColumns.value = flatColumnsFunc(tableColumns.value);

// * 过滤需要搜索的配置项
const searchColumns = flatColumns.value.filter(item => item.search?.el);

// * 设置搜索表单排序默认值 && 设置搜索表单项的默认值
searchColumns.forEach((column, index) => {
	column.search!.order = column.search!.order ?? index + 2;
	if (column.search?.defaultValue !== undefined && column.search?.defaultValue !== null) {
		initSearchParams.value[column.search.key ?? handleProp(column.prop!)] = column.search?.defaultValue;
		searchParams.value[column.search.key ?? handleProp(column.prop!)] = column.search?.defaultValue;
	}
});
searchColumns.sort((a, b) => a.search!.order! - b.search!.order!);

// * 列设置 ==> 过滤掉不需要设置的列
const colRef = ref();
const colSetting = tableColumns.value!.filter(
	item => !['selection', 'index', 'expand'].includes(item.type!) && item.prop !== 'operation' && item.isShow
);
const openColSetting = () => colRef.value.openColSetting();

// * 设置查询参数默认值
const setInitSearchParams = (params: any) => {
	for (const key in params) initSearchParams.value[key] = params[key];
};

// * 清空选中数据列表
const clearSelection = () => tableRef.value!.clearSelection();

defineExpose({
	element: tableRef,
	tableData,
	initSearchParams, // 用于设置查询表单默认值
	selectedIds,
	selectedList,
	isSelected,
	setInitSearchParams,
	search,
	reset,
	getTableList,
	toggleRowsSelection,
	clearSelection
});
</script>

<script lang="ts">
export default {
	inheritAttrs: false // 禁用 attribute 自动继承在在根节点
};
</script>
