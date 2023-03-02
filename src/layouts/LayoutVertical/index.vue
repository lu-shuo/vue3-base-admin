<template>
	<el-container class="layout">
		<el-aside>
			<div class="menu" :style="{ width: isCollapse ? '65px' : '210px' }">
				<div class="logo flex-center">
					<img src="@/assets/images/logo.svg" alt="logo" />
					<span v-show="!isCollapse">{{ appName }}</span>
				</div>
				<el-scrollbar>
					<el-menu
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
					</el-menu>
				</el-scrollbar>
			</div>
		</el-aside>
		<el-container>
			<el-header>
				<HeaderLeft />
				<HeaderRight />
			</el-header>
			<router-view></router-view>
		</el-container>
	</el-container>
</template>

<script lang="ts" setup name="LayoutVertical">
import { useAppStore } from '@/stores/modules/app';
import { useAuthStore } from '@/stores/modules/auth';
import SubMenu from '../components/Menu/SubMenu.vue';
import HeaderLeft from '../components/Header/HeaderLeft.vue';
import HeaderRight from '../components/Header/HeaderRight.vue';

const route = useRoute();
const appStore = useAppStore();
const authStore = useAuthStore();
const appName = computed(() => import.meta.env.VITE_GLOB_APP_TITLE);
const isCollapse = computed(() => appStore.themeConfig.isCollapse);
const activeMenu = computed(() => (route.meta.activeMenu ? (route.meta.activeMenu as string) : route.path)); // 动态路由时指定activeMenu为公共组件的路径
const menuList = authStore.showMenuListGet;
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>

<style lang="scss">
.vertical {
	.el-menu,
	.el-menu--popup {
		.el-menu-item {
			&.is-active {
				background: #060708;
				&::before {
					position: absolute;
					top: 0;
					bottom: 0;
					left: 0;
					width: 4px;
					content: '';
					background: var(--el-color-primary);
				}
			}
		}
	}
}
</style>
