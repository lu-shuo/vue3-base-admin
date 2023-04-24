<template>
	<!-- 分页组件 -->
	<el-pagination
		:background="true"
		:current-page="pageParams.pageNo"
		:page-size="pageParams.pageSize"
		:page-sizes="[10, 25, 50, 100]"
		:total="pageParams.total"
		layout="total, sizes, prev, pager, next, jumper"
		@size-change="handleSizeChange"
		@current-change="handleCurrentChange"
	></el-pagination>
</template>

<script setup lang="ts" name="Pagination">
interface pageParams {
	pageNo: number;
	pageSize: number;
	total: number;
}

interface PaginationProps {
	pageParams: pageParams;
	handleSizeChange: (size: number) => void;
	handleCurrentChange: (currentPage: number) => void;
}

defineProps<PaginationProps>();
</script>
