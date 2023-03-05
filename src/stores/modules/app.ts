// * 持久化
import { defineStore } from 'pinia';
import { AppState, ThemeConfigProps } from '../interface';
import piniaPersistConfig from '@/config/piniaPersist';

export const useAppStore = defineStore('app', {
	// 为了完整类型推理，推荐使用箭头函数
	state: (): AppState => ({
		// 所有这些属性都将自动推断出它们的类型
		// token
		token: '',
		// 用户信息
		userInfo: '',
		// 语言
		language: '',
		// 主题配置
		themeConfig: {
			// 主题色
			primary: '',
			// 深色模式
			isDark: false,
			// 灰色模式
			isGrey: false,
			// 色弱模式
			isWeak: false,
			// 菜单栏是否收缩
			isCollapse: false,
			// 布局
			layout: 'vertical',
			// 面包屑
			breadcrumb: true,
			// 面包屑图标
			breadcrumbIcon: true,
			// 显示tab栏
			tabs: true,
			// tab栏按钮图标
			tabsIcon: true,
			// 页脚
			footer: true
		}
	}),
	actions: {
		setToken(token: string) {
			this.token = token;
		},
		setThemeConfig(themeConfig: ThemeConfigProps) {
			Object.assign(this.themeConfig, themeConfig || {});
		}
	},
	persist: piniaPersistConfig('AppState')
});
