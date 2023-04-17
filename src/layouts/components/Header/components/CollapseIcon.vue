<template>
	<el-icon class="collapse-icon" @click="changeCollapse">
		<component :is="appStore.isCollapse ? 'expand' : 'fold'"></component>
	</el-icon>
</template>

<script lang="ts" setup>
import { useAppStore } from '@/stores/modules/app';

const appStore = useAppStore();

const changeCollapse = () => appStore.setAppState('isCollapse', !appStore.isCollapse);
</script>

<style lang="scss" scoped>
.collapse-icon {
	margin-right: 20px;
	font-size: 22px;
	cursor: pointer;
}
</style>
