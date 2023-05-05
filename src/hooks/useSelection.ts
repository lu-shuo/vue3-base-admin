import { ref, computed } from 'vue';

/**
 * @description: 表格多选
 * @param {string} key rowKey
 */
export const useSelection = (key: string, tableRef?: any) => {
	const isSelected = ref(false);

	const selectedList = ref([]);

	const selectedIds = computed((): string[] | number[] => {
		return selectedList.value.map(item => item[key]);
	});

	const getRowKey = (row: Recordable) => {
		return row[key];
	};

	const handleSelectionChange = (val: any) => {
		val.length ? (isSelected.value = true) : (isSelected.value = false);
		selectedList.value = val;
	};

	const toggleRowsSelection = (rows?: object[], selected?: boolean | undefined) => {
		if (!tableRef) {
			console.warn('[useSelection]: toggleRowsSelection需要传入tableRef');
			return;
		}
		if (rows) {
			rows.forEach(row => {
				// @ts-ignore
				tableRef.value!.toggleRowSelection(row, selected); // 用于多选表格，切换某一行的选中状态， 如果使用了第二个参数，则可直接设置这一行选中与否
			});
		} else {
			tableRef.value!.clearSelection();
		}
	};

	return {
		isSelected,
		selectedList,
		selectedIds,
		getRowKey,
		handleSelectionChange,
		toggleRowsSelection
	};
};
