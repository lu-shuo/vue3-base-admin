import { PluginOption } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import legacy from '@vitejs/plugin-legacy';
import VueSetupExtend from 'vite-plugin-vue-setup-extend';
import EslintPlugin from 'vite-plugin-eslint';
import { configHtmlPlugin } from './html';
import { configVisualizerPlugin } from './visualizer';
import { configSvgPlugin } from './svg';

export function createVitePlugins(viteEnv: ViteEnv, isBuild: boolean) {
	const {
		VITE_LEGACY
		// VITE_USE_IMAGEMIN,
		// VITE_USE_MOCK,
		// VITE_BUILD_COMPRESS,
		// VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE,
	} = viteEnv;

	const vitePlugins: (PluginOption | PluginOption[])[] = [
		vue(), // *vue 必须
		vueJsx(), // * vite 可以使用 jsx/tsx 语法
		VueSetupExtend(), // * name 可以写在 setup script 标签上
		EslintPlugin() // *EsLint 报错信息显示在浏览器界面上
	];

	// @vitejs/plugin-legacy
	VITE_LEGACY && isBuild && vitePlugins.push(legacy());
	// vite-plugin-html
	vitePlugins.push(configHtmlPlugin(viteEnv, isBuild));
	// vite-plugin-svg-icons
	vitePlugins.push(configSvgPlugin(isBuild));
	// rollup-plugin-visualizer
	vitePlugins.push(configVisualizerPlugin());

	return vitePlugins;
}
