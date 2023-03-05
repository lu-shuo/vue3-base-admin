import { useAppStore } from '@/stores/modules/app';
import { DEFAULT_PRIMARY } from '@/config/themeConfig';
import { getLightColor, getDarkColor } from '@/utils/theme/tool';

export const useTheme = () => {
	const appStore = useAppStore();
	const themeConfig = appStore.themeConfig;

	const switchDark = () => {
		// documentElement 属性以一个元素对象返回一个文档的文档元素。
		// HTML 文档返回对象为HTML元素。
		const root = document.documentElement as HTMLElement;
		if (themeConfig.isDark) {
			root.setAttribute('class', 'dark');
		} else {
			root.setAttribute('class', '');
			changePrimary(DEFAULT_PRIMARY);
		}
	};
	// 修改主题颜色
	const changePrimary = (color: string | null) => {
		if (!color) {
			color = DEFAULT_PRIMARY;
			ElMessage({ type: 'success', message: `主题颜色已重置为 ${DEFAULT_PRIMARY}` });
		}
		themeConfig.primary = color;
		// 为了兼容暗黑模式下主题颜色也正常，以下方法计算主题颜色 由深到浅 的具体颜色
		document.documentElement.style.setProperty('--el-color-primary', themeConfig.primary);
		document.documentElement.style.setProperty(
			'--el-color-primary-dark-2',
			themeConfig.isDark ? `${getLightColor(themeConfig.primary, 0.2)}` : `${getDarkColor(themeConfig.primary, 0.3)}`
		);
		// 颜色加深或变浅
		for (let i = 1; i <= 9; i++) {
			document.documentElement.style.setProperty(
				`--el-color-primary-light-${i}`,
				themeConfig.isDark ? `${getDarkColor(themeConfig.primary, i / 10)}` : `${getLightColor(themeConfig.primary, i / 10)}`
			);
		}
	};

	// 灰色和弱色切换
	const changeGreyOrWeak = (value: boolean, type: string) => {
		const body = document.body as HTMLElement;
		if (!value) return body.setAttribute('style', '');
		if (type === 'grey') body.setAttribute('style', 'filter: grayscale(1)');
		if (type === 'weak') body.setAttribute('style', 'filter: invert(80%)');
		// 避免同时开启灰色和色弱模式
		const propName = type === 'grey' ? 'isWeak' : 'isGrey';
		appStore.setThemeConfig({ ...themeConfig, [propName]: false });
	};

	// 初始化 theme 配置
	const initTheme = () => {
		switchDark();
		changePrimary(themeConfig.primary);
		if (themeConfig.isGrey) changeGreyOrWeak(true, 'grey');
		if (themeConfig.isWeak) changeGreyOrWeak(true, 'weak');
	};

	return {
		switchDark,
		changePrimary,
		changeGreyOrWeak,
		initTheme
	};
};
