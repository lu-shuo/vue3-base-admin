<template>
	<div class="tabs-box">
		<div class="tabs-menu">
			<el-tabs v-model="tabsStore.currentTabPath" type="card" @tab-click="tabClick" @tab-remove="tabRemove">
				<el-tab-pane
					v-for="item in tabsMenuList"
					:key="item.path"
					:label="item.title"
					:name="item.path"
					:closable="item.closable"
				>
					<template #label>
						<el-icon class="tabs-icon" v-show="item.icon && themeConfig.tabsIcon">
							<component :is="item.icon"></component>
						</el-icon>
						{{ item.title }}
					</template>
				</el-tab-pane>
			</el-tabs>
			<MoreButton />
		</div>
	</div>
</template>

<script lang="ts" setup name="Tabs">
import { useTabsStore } from '@/stores/modules/tabs';
import { useAppStore } from '@/stores/modules/app';
import { useAuthStore } from '@/stores/modules/auth';
import { useKeepAliveStore } from '@/stores/modules/keepAlive';
import { TabsPaneContext, TabPaneName } from 'element-plus';
import Sortable from 'sortablejs';
import MoreButton from './components/MoreButton.vue';

const router = useRouter();
const route = useRoute();

const appStore = useAppStore();
const themeConfig = appStore.themeConfig;

const authStore = useAuthStore();

const tabsStore = useTabsStore();
const tabsMenuList = computed(() => tabsStore.tabsMenuList);

const keepAliveStore = useKeepAliveStore();

// 监听路由变化激活对应tab
watch(
	() => route.fullPath,
	() => {
		if (route.meta.isFull) return; // 全屏页面跳过
		tabsStore.currentTabPath = route.fullPath;
		const tab = {
			icon: route.meta.icon as string,
			title: route.meta.title as string,
			path: route.fullPath,
			name: route.name as string,
			closable: !route.meta.isAffix
		};
		tabsStore.addTabMenu(tab);
		route.meta.isKeepAlive && keepAliveStore.addKeepAliveName(route.name as string);
	},
	{
		immediate: true
	}
);

// 切换至当前页面
// (pane: TabsPaneContext, ev: Event)
const tabClick = (pane: TabsPaneContext) => {
	router.push(pane.props.name as string);
};
// 删除标签
// (name: TabPaneName)
const tabRemove = (path: TabPaneName) => {
	const name = tabsMenuList.value.filter(tab => tab.path === path)[0].name;
	keepAliveStore.removeKeepAliveName(name);
	tabsStore.removeTabMenu(path as string);
	router.push(tabsStore.currentTabPath);
};

// 初始化固定显示的标签
const initAffixTabs = () => {
	authStore.flatMenuListGet.forEach(item => {
		if (item.meta.isAffix && !item.meta.isHide && !item.meta.isFull) {
			const tabMenu = {
				icon: item.meta.icon,
				title: item.meta.title,
				path: item.path,
				name: item.name,
				closable: false
			};
			tabsStore.addTabMenu(tabMenu);
		}
	});
};

const initTabDrag = () => {
	Sortable.create(document.querySelector('.el-tabs__nav') as HTMLElement, {
		draggable: '.el-tabs__item',
		animation: 300,
		onEnd({ newIndex, oldIndex }) {
			const tabsList = [...tabsMenuList.value];
			const currRow = tabsList.splice(oldIndex as number, 1)[0];
			tabsList.splice(newIndex as number, 0, currRow);
			tabsStore.setTabMenuList(tabsList);
		}
	});
};

onMounted(() => {
	initAffixTabs();
	initTabDrag();
});
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
