import { storeToRefs } from 'pinia';
import { useAppStore } from '@/stores/modules/app';
import { Theme } from './interface';
import { DEFAULT_PRIMARY } from '@/config/themeConfig';
import { getLightColor, getDarkColor } from '@/utils/theme/tool';
import { asideTheme, AsideThemeType } from '@/styles/theme/aside';

export const useTheme = () => {
	const appStore = useAppStore();
	const { primary, isDark, isGrey, isWeak, asideInverted, layout } = storeToRefs(appStore);
	// const themeConfig = appStore.themeConfig;

	const switchDark = () => {
		// documentElement 属性以一个元素对象返回一个文档的文档元素。
		// HTML 文档返回对象为HTML元素。
		const root = document.documentElement as HTMLElement;
		if (isDark.value) {
			root.setAttribute('class', 'dark');
		} else {
			root.setAttribute('class', '');
			changePrimary(primary.value);
			setAsideTheme();
		}
	};

	// 修改主题颜色
	const changePrimary = (color: string | null) => {
		if (!color) {
			color = DEFAULT_PRIMARY;
			ElMessage({ type: 'success', message: `主题颜色已重置为 ${DEFAULT_PRIMARY}` });
		}
		// 为了兼容暗黑模式下主题颜色也正常，以下方法计算主题颜色 由深到浅 的具体颜色
		document.documentElement.style.setProperty('--el-color-primary', color);
		document.documentElement.style.setProperty(
			'--el-color-primary-dark-2',
			isDark.value ? `${getLightColor(color, 0.2)}` : `${getDarkColor(color, 0.3)}`
		);
		// 颜色加深或变浅
		for (let i = 1; i <= 9; i++) {
			document.documentElement.style.setProperty(
				`--el-color-primary-light-${i}`,
				isDark.value ? `${getDarkColor(color, i / 10)}` : `${getLightColor(color, i / 10)}`
			);
		}
		appStore.setAppState('primary', color);
	};

	// 灰色和弱色切换
	const changeGreyOrWeak = (type: Theme.GreyOrWeakType, value: boolean) => {
		const body = document.body as HTMLElement;
		if (!value) return body.removeAttribute('style');
		const styles: Record<Theme.GreyOrWeakType, string> = {
			grey: 'filter: grayscale(1)',
			weak: 'filter: invert(80%)'
		};
		body.setAttribute('style', styles[type]);
		// 避免同时开启灰色和色弱模式
		const propName = type === 'grey' ? 'isWeak' : 'isGrey';
		appStore.setAppState(propName, false);
	};

	// 设置侧边栏样式 ==> light、inverted、dark
	const setAsideTheme = () => {
		// 默认所有侧边栏为 light 模式
		let type: AsideThemeType = 'light';
		// transverse 布局下菜单栏为 inverted 模式
		if (layout.value === 'transverse') type = 'inverted';
		// 侧边栏反转色目前只支持在 vertical 布局模式下生效
		if (layout.value === 'vertical' && asideInverted.value) type = 'inverted';
		// 侧边栏 dark 模式
		if (isDark.value) type = 'dark';
		const theme = asideTheme[type!];
		for (const [key, value] of Object.entries(theme)) {
			document.documentElement.style.setProperty(key, value);
		}
	};

	// 初始化 theme 配置
	const initTheme = () => {
		switchDark();
		if (isGrey.value) changeGreyOrWeak('grey', true);
		if (isWeak.value) changeGreyOrWeak('weak', true);
	};

	return {
		initTheme,
		switchDark,
		changePrimary,
		changeGreyOrWeak,
		setAsideTheme
	};
};
