<template>
	<div class="header-left">
		<CollapseIcon id="collapseIcon" />
		<Breadcrumb id="breadcrumb" v-if="appStore.themeConfig.breadcrumb" />
	</div>
</template>

<script lang="ts" setup name="HeaderLeft">
import CollapseIcon from './components/CollapseIcon.vue';
import Breadcrumb from './components/Breadcrumb.vue';
import { useAppStore } from '@/stores/modules/app';

const appStore = useAppStore();
</script>

<style lang="scss" scoped>
.header-left {
	display: flex;
	align-items: center;
	justify-content: center;
	overflow: hidden;
	white-space: nowrap;
}
</style>
