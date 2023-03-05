<template>
	<Tabs v-if="themeConfig.tabs" />
	<el-main>
		<router-view v-slot="{ Component, route }">
			<transition appear name="fade-transform" mode="out-in">
				<keep-alive :include="keepAliveStore.keepAliveNameList">
					<component :is="Component" :key="route.path" />
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

const appStore = useAppStore();
const keepAliveStore = useKeepAliveStore();

const themeConfig = appStore.themeConfig;
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
