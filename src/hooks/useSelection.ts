import { ref, computed } from 'vue';

/**
 * @description: 表格多选
 * @param {string} key rowKey
 */
export const useSelection = (key: string) => {
	const isSelected = ref(false);
	const selectedList = ref([]);
	const selectedIds = computed((): string | number[] => {
		return selectedList.value.map(item => item[key]);
	});

	const getRowKey = (row: Recordable) => {
		return row[key];
	};
	const handleSelectionChange = (val: any) => {
		val.length ? (isSelected.value = true) : (isSelected.value = false);
		selectedList.value = val;
	};
	const toggleSelection = (tableRef: any, rows?: object[]) => {
		if (rows) {
			rows.forEach(row => {
				// eslint-disable-next-line no-undefined
				tableRef.value!.toggleRowSelection(row, undefined);
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
		toggleSelection
	};
};
