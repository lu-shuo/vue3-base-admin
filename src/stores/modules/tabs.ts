// * 持久化
import { defineStore } from 'pinia';
import { TabsState, TabMenu } from '../interface';
import router from '@/routers';
import piniaPersistConfig from '@/config/piniaPersist';

export const useTabsStore = defineStore('tabs', {
	state: (): TabsState => ({
		currentTabPath: '', // 当前菜单的path
		tabsMenuList: []
	}),
	actions: {
		setTabMenuList(list: TabMenu[]) {
			this.tabsMenuList = list;
		},
		addTabMenu(tabMenu: TabMenu) {
			if (this.tabsMenuList.every(tab => tab.path !== tabMenu.path)) {
				this.tabsMenuList.push(tabMenu);
			}
		},
		removeTabMenu(path: string) {
			const tabs = this.tabsMenuList;
			if (path === this.currentTabPath) {
				tabs.forEach((tab, index) => {
					if (tab.path === path) {
						const nextTab = tabs[index + 1] || tabs[index - 1];
						if (nextTab) {
							this.currentTabPath = nextTab.path;
							router.push(this.currentTabPath);
						}
					}
				});
			}
			this.tabsMenuList = tabs.filter(tab => tab.path !== path);
		},
		closeOtherTab() {
			this.tabsMenuList = this.tabsMenuList.filter(tab => tab.path === this.currentTabPath || !tab.closable);
		},
		closeAllTab() {
			this.tabsMenuList = this.tabsMenuList.filter(tab => !tab.closable);
			this.currentTabPath = this.tabsMenuList.length ? this.tabsMenuList[0].path : '';
		}
	},
	persist: piniaPersistConfig('TabState')
});
