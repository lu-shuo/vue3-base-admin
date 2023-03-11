<template>
	<Maximize v-if="themeConfig.maximize" />
	<Tabs v-if="themeConfig.tabs" />
	<el-main>
		<router-view v-slot="{ Component, route }">
			<transition appear name="fade-transform" mode="out-in">
				<keep-alive :include="keepAliveStore.keepAliveNameList">
					<component :is="Component" :key="route.path" v-if="isRouterShow" />
				</keep-alive>
			</transition>
		</router-view>
	</el-main>
	<el-footer v-if="themeConfig.footer">
		<Footer />
	</el-footer>
</template>

<script lang="ts" setup name="Main">
import { useAppStore } from '@/stores/modules/app';
import { useKeepAliveStore } from '@/stores/modules/keepAlive';
import Tabs from '@/layouts/components/Tabs/index.vue';
import Footer from '@/layouts/components/Footer/index.vue';
import Maximize from './components/Maximize.vue';

const appStore = useAppStore();
const keepAliveStore = useKeepAliveStore();

const themeConfig = appStore.themeConfig;

// 刷新当前页面
const isRouterShow = ref(true);
const refreshCurrentPage = (val: boolean) => (isRouterShow.value = val);
provide('refresh', refreshCurrentPage);

// 监听当前页是否最大化，动态添加 class
watch(
	() => themeConfig.maximize,
	() => {
		const app = document.getElementById('app') as HTMLElement;
		if (themeConfig.maximize) app.classList.add('main-maximize');
		else app.classList.remove('main-maximize');
	},
	{ immediate: true }
);
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
