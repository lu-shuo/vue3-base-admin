import { defineStore } from 'pinia';
import { DEFAULT_PRIMARY } from '@/config/themeConfig';
import { ThemeConfigProps } from '../interface';
import piniaPersistConfig from '@/config/piniaPersist';

export const useAppStore = defineStore('app', {
	// 为了完整类型推理，推荐使用箭头函数
	state: () => ({
		// 所有这些属性都将自动推断出它们的类型
		// token
		token: '',
		// 用户信息
		userInfo: '',
		// 语言
		language: '',
		// 主题配置
		themeConfig: {
			// 深色模式
			isDark: false,
			// 主题色
			primary: DEFAULT_PRIMARY,
			// 灰色模式
			isGrey: false,
			// 色弱模式
			isWeak: false
		}
	}),
	actions: {
		setThemeConfig(themeConfig: ThemeConfigProps) {
			this.themeConfig = themeConfig;
		}
	},
	persist: piniaPersistConfig('AppState')
});
