/*
 * @Author: lushuo
 * @Date: 2023-02-28 22:19:20
 * @LastEditTime: 2023-02-28 22:37:11
 * @LastEditors: lushuo
 * @Description: hooks和组件按需自动导入
 * @FilePath: \vue3-base-admin\build\vite\plugins\autoImport.ts
 */
import type { PluginOption } from 'vite';
import Components from 'unplugin-vue-components/vite';
import AutoImport from 'unplugin-auto-import/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';

export function configAutoImport() {
	const plugins: PluginOption[] = [];
	plugins.push(
		AutoImport({
			// 自动导入hooks，支持vue, vue-router, vue-i18n, @vueuse/head, @vueuse/core等自动引入
			imports: ['vue', 'vue-router', 'vue-i18n', '@vueuse/head', '@vueuse/core'],
			resolvers: [ElementPlusResolver()],
			dts: 'src/auto-import.d.ts',
			eslintrc: {
				enabled: true, // Default `false`
				filepath: './.eslintrc-auto-import.json', // Default `./.eslintrc-auto-import.json`
				globalsPropValue: true // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
			}
		}),
		Components({
			// allow auto load markdown components under `./src/components/`
			extensions: ['vue', 'md'],
			// allow auto import and register components used in markdown
			include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
			resolvers: [
				ElementPlusResolver({
					importStyle: 'sass'
				})
			],
			dts: 'src/components.d.ts'
		})
	);
	return plugins;
}
