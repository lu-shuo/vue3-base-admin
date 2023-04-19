<template>
	<el-drawer v-model="drawerVisible" :title="$t('themeDrawer.title')" size="300px">
		<!-- 布局切换 -->
		<!-- <el-divider class="divider" content-position="center">
			<el-icon><Notification /></el-icon>
			布局切换
		</el-divider>
		<div class="layout-box">
			<el-tooltip effect="dark" content="纵向" placement="top" :show-after="200">
				<div
					:class="['layout-item layout-vertical', themeConfig.layout == 'vertical' ? 'is-active' : '']"
					@click="changeLayout('vertical')"
				>
					<div class="layout-dark"></div>
					<div class="layout-container">
						<div class="layout-light"></div>
						<div class="layout-content"></div>
					</div>
					<el-icon v-if="themeConfig.layout == 'vertical'"><CircleCheckFilled /></el-icon>
				</div>
			</el-tooltip>
			<el-tooltip effect="dark" content="经典" placement="top" :show-after="200">
				<div
					:class="['layout-item layout-classic', themeConfig.layout == 'classic' ? 'is-active' : '']"
					@click="changeLayout('classic')"
				>
					<div class="layout-dark"></div>
					<div class="layout-container">
						<div class="layout-light"></div>
						<div class="layout-content"></div>
					</div>
					<el-icon v-if="themeConfig.layout == 'classic'"><CircleCheckFilled /></el-icon>
				</div>
			</el-tooltip>
			<el-tooltip effect="dark" content="横向" placement="top" :show-after="200">
				<div
					:class="['layout-item layout-transverse', themeConfig.layout == 'transverse' ? 'is-active' : '']"
					@click="changeLayout('transverse')"
				>
					<div class="layout-dark"></div>
					<div class="layout-content"></div>
					<el-icon v-if="themeConfig.layout == 'transverse'"><CircleCheckFilled /></el-icon>
				</div>
			</el-tooltip>
			<el-tooltip effect="dark" content="分栏" placement="top" :show-after="200">
				<div
					:class="['layout-item layout-columns', themeConfig.layout == 'columns' ? 'is-active' : '']"
					@click="changeLayout('columns')"
				>
					<div class="layout-dark"></div>
					<div class="layout-light"></div>
					<div class="layout-content"></div>
					<el-icon v-if="themeConfig.layout == 'columns'"><CircleCheckFilled /></el-icon>
				</div>
			</el-tooltip>
		</div>
		<br /> -->

		<!-- 全局主题 -->
		<el-divider class="divider" content-position="center">
			<el-icon><ColdDrink /></el-icon>
			{{ $t('themeDrawer.theme') }}
		</el-divider>
		<div class="theme-item">
			<span>{{ $t('themeDrawer.primaryColor') }}</span>
			<el-color-picker v-model="primary" :predefine="colorList" @change="changePrimary" />
		</div>
		<div class="theme-item">
			<span>{{ $t('themeDrawer.darkMode') }}</span>
			<SwitchDark />
		</div>
		<div class="theme-item">
			<span>{{ $t('themeDrawer.greyMode') }}</span>
			<el-switch v-model="isGrey" @change="changeGreyOrWeak('grey', !!$event)" />
		</div>
		<div class="theme-item">
			<span>{{ $t('themeDrawer.weakMode') }}</span>
			<el-switch v-model="isWeak" @change="changeGreyOrWeak('weak', !!$event)" />
		</div>
		<div class="theme-item mb40">
			<span>
				{{ $t('themeDrawer.reverseSidebarColor') }}
				<!-- <el-tooltip effect="dark" content="该属性目前只在纵向布局模式下生效" placement="top">
					<el-icon><QuestionFilled /></el-icon>
				</el-tooltip> -->
			</span>
			<el-switch v-model="asideInverted" :disabled="layout !== 'vertical'" @change="setAsideTheme" />
		</div>

		<!-- 界面设置 -->
		<el-divider class="divider" content-position="center">
			<el-icon><Setting /></el-icon>
			<span>{{ $t('themeDrawer.interfaceSettings') }}</span>
		</el-divider>
		<div class="theme-item">
			<span>{{ $t('themeDrawer.isCollapse') }}</span>
			<el-switch v-model="isCollapse" />
		</div>
		<div class="theme-item">
			<span>{{ $t('themeDrawer.breadcrumb') }}</span>
			<el-switch v-model="breadcrumb" />
		</div>
		<div class="theme-item">
			<span>{{ $t('themeDrawer.breadcrumbIcon') }}</span>
			<el-switch v-model="breadcrumbIcon" />
		</div>
		<div class="theme-item">
			<span>{{ $t('themeDrawer.tab') }}</span>
			<el-switch v-model="tabs" />
		</div>
		<div class="theme-item">
			<span>{{ $t('themeDrawer.tabIcon') }}</span>
			<el-switch v-model="tabsIcon" />
		</div>
		<div class="theme-item">
			<span>{{ $t('themeDrawer.footer') }}</span>
			<el-switch v-model="footer" />
		</div>
	</el-drawer>
</template>

<script setup lang="ts">
import { useTheme } from '@/hooks/useTheme';
import { useAppStore } from '@/stores/modules/app';
import { storeToRefs } from 'pinia';
// import { LayoutType } from '@/stores/interface';
import { DEFAULT_PRIMARY } from '@/config/themeConfig';
import SwitchDark from '@/components/SwitchDark/index.vue';
import mittBus from '@/utils/mittBus';

const { changePrimary, changeGreyOrWeak, setAsideTheme } = useTheme();

// 预定义主题颜色
const colorList = [
	DEFAULT_PRIMARY,
	'#DAA96E',
	'#0C819F',
	'#409EFF',
	'#27ae60',
	'#ff5c93',
	'#e74c3c',
	'#fd726d',
	'#f39c12',
	'#9b59b6'
];

const appStore = useAppStore();
const { layout, primary, isGrey, isWeak, asideInverted, isCollapse, breadcrumb, breadcrumbIcon, tabs, tabsIcon, footer } =
	storeToRefs(appStore);

// 切换布局方式
// const setLayout = (val: LayoutType) => {
// 	appStore.setAppState("layout", val);
// };

// 打开主题设置
const drawerVisible = ref(false);
mittBus.on('OPEN_THEME_DRAWER', () => {
	drawerVisible.value = true;
});
</script>

<style scoped lang="scss">
@import './index.scss';
</style>
