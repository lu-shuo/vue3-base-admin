<template>
	<el-container class="layout">
		<el-aside>
			<div class="aside-box" :style="{ width: isCollapse ? '65px' : '210px' }">
				<div class="logo flx-center">
					<img class="logo-img" src="@/assets/images/logo.svg" alt="logo" />
					<span class="logo-text" v-show="!isCollapse">{{ appName }}</span>
				</div>
				<el-scrollbar>
					<el-menu
						:default-active="activeMenu"
						:collapse="isCollapse"
						:router="false"
						:unique-opened="true"
						:collapse-transition="false"
					>
						<SubMenu :menuList="menuList" />
					</el-menu>
				</el-scrollbar>
			</div>
		</el-aside>
		<el-container>
			<el-header>
				<HeaderLeft />
				<HeaderRight />
			</el-header>
			<Main />
		</el-container>
	</el-container>
</template>

<script lang="ts" setup name="LayoutVertical">
import { useAppStore } from '@/stores/modules/app';
import { useAuthStore } from '@/stores/modules/auth';
import SubMenu from '../components/Menu/SubMenu.vue';
import HeaderLeft from '../components/Header/HeaderLeft.vue';
import HeaderRight from '../components/Header/HeaderRight.vue';
import Main from '../components/Main/index.vue';

const route = useRoute();
const appStore = useAppStore();
const authStore = useAuthStore();
const appName = computed(() => import.meta.env.VITE_GLOB_APP_TITLE);
const isCollapse = computed(() => appStore.isCollapse);
const activeMenu = computed(() => (route.meta.activeMenu ? (route.meta.activeMenu as string) : route.path)); // 动态路由时指定activeMenu为公共组件的路径
const menuList = authStore.showMenuListGet;
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
