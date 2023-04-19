import { reactive, toRefs, computed, onMounted } from 'vue';
import { Table } from './interface/index';
import { ResponseCode } from '@/api/interface';

/**
 * @description: 表格hook
 * @param {object} UseTableParams
 */
export const useTable = <T>({
	api, // 表格接口
	apiDataKeyMap = {
		// 接口数据字段映射
		tableData: 'records',
		pageNo: 'count',
		pageSize: 'size',
		total: 'total'
	},
	initParams = {}, // 初始参数
	pageable = true, // 是否分页
	pageParamsKeyMap = {
		// 分页查询参数映射
		pageSize: 'pageSize',
		pageNo: 'pageNo'
	},
	filterEmptyParams = false, // 过滤空参
	handleSearchParams, // 查询前处理查询参数
	tableDataCallback, // 处理接口返回数据
	initOnMount = true // Mount是否自动拉取表格数据
}: Table.UseTableParams) => {
	const state = reactive<Table.TableStateProps<T>>({
		loading: false,
		tableData: [],
		pageParams: {
			// 当前页数
			pageNo: 1,
			// 每页显示条数
			pageSize: 10,
			// 总条数
			total: 0
		},
		// 默认查询参数(用于设置查询表单默认值)
		initSearchParams: {},
		// 查询参数(用于绑定查询表单模板)
		searchParams: {},
		// 最终表格接口参数
		finalParams: {}
	});
	/**
	 * @description 分页查询参数(按照接口字段映射)
	 */
	const finalPageParams = computed(() => ({
		[pageParamsKeyMap.pageNo]: state.pageParams.pageNo,
		[pageParamsKeyMap.pageSize]: state.pageParams.pageSize
	}));
	/**
	 * 更新分页参数
	 */
	const updatePageParams = (data: Table.PageParams) => {
		if (typeof data.pageSize === 'number' && data.pageSize !== 0) {
			state.pageParams.pageSize = data.pageSize;
		}
		if (typeof data.pageNo === 'number' && data.pageNo >= 1) {
			state.pageParams.pageNo = data.pageNo;
		}
		if (typeof data.total === 'number') {
			state.pageParams.total = data.total;
		}
	};
	/**
	 * 更新接口参数（拼装查询参数）
	 */
	const updateFinalParams = () => {
		state.finalParams = {};
		const newSearchParams: any = {};
		// 过滤空参数
		if (filterEmptyParams) {
			for (const key in state.searchParams) {
				// * 某些情况下参数为 false/0 也应该携带参数
				if (state.searchParams[key] || state.searchParams[key] === false || state.searchParams[key] === 0) {
					newSearchParams[key] = state.searchParams[key];
				}
			}
		} else {
			for (const key in state.searchParams) {
				newSearchParams[key] = state.searchParams[key];
			}
		}
		handleSearchParams && handleSearchParams(newSearchParams);
		Object.assign(state.finalParams, newSearchParams, pageable ? finalPageParams.value : {});
	};
	/**
	 * 获取表格数据
	 */
	const getTableList = async () => {
		try {
			state.loading = true;
			Object.assign(state.finalParams, initParams, pageable ? finalPageParams.value : {});
			const res = await api(state.finalParams);
			if (res.code === ResponseCode.SUCCESS) {
				const data = res.data;
				let tableDate = pageable ? data[apiDataKeyMap.tableData] : data;
				tableDataCallback && (tableDate = tableDataCallback(tableDate));
				state.tableData = tableDate;
				pageable &&
					updatePageParams({
						pageNo: data[apiDataKeyMap.pageNo],
						pageSize: data[apiDataKeyMap.pageSize],
						total: data[apiDataKeyMap.total]
					});
			} else {
				state.tableData = [];
				updatePageParams({
					pageNo: 1,
					pageSize: 10,
					total: 0
				});
			}
		} catch (error) {
			console.error(error);
		} finally {
			state.loading = false;
		}
	};
	/**
	 * 查询，页码重置为1
	 */
	const search = () => {
		state.pageParams.pageNo = 1;
		updateFinalParams();
		getTableList();
	};
	/**
	 * 重置查询参数，初始化表格数据
	 */
	const reset = (resetPageNo = true) => {
		resetPageNo && (state.pageParams.pageNo = 1);
		state.searchParams = {};
		// 重置搜索参数，如果有默认搜索参数，则重置默认的搜索参数
		Object.keys(state.initSearchParams).forEach(key => {
			state.searchParams[key] = state.initSearchParams[key];
		});
		updateFinalParams();
		getTableList();
	};
	/**
	 * 更新pageNum
	 */
	const handleCurrentChange = (newVal: number) => {
		state.pageParams.pageNo = newVal;
		getTableList();
	};
	/**
	 * 更新pageSize
	 */
	const handleSizeChange = (newVal: number) => {
		state.pageParams.pageSize = newVal;
		getTableList();
	};
	onMounted(() => {
		if (initOnMount) {
			reset();
		}
	});

	return {
		...toRefs(state),
		getTableList,
		search,
		reset,
		updateFinalParams,
		handleCurrentChange,
		handleSizeChange
	};
};
