<template>
	<el-container class="layout">
		<el-aside>
			<div class="menu" :style="{ width: isCollapse ? '65px' : '210px' }">
				<div class="logo flex-center">
					<img src="@/assets/images/logo.svg" alt="logo" />
					<span v-show="!isCollapse">{{ appName }}</span>
				</div>
				<el-scrollbar>
					<!-- <el-menu
						:default-active="activeMenu"
						:router="false"
						:collapse="isCollapse"
						:collapse-transition="false"
						:unique-opened="true"
						background-color="#191a20"
						text-color="#bdbdc0"
						active-text-color="#ffffff"
					>
						<SubMenu :menuList="menuList" />
					</el-menu> -->
				</el-scrollbar>
			</div>
		</el-aside>
		<el-container>
			<router-view></router-view>
		</el-container>
	</el-container>
</template>

<script lang="ts" setup name="LayoutVertical">
import { useAppStore } from '@/stores/modules/app';
const appStore = useAppStore();
const appName = computed(() => import.meta.env.VITE_GLOB_APP_TITLE);
const isCollapse = computed(() => appStore.themeConfig.isCollapse);
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
