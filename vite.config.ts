import { defineConfig, loadEnv } from 'vite';
import type { ConfigEnv, UserConfig } from 'vite';
import { wrapperEnv, pathResolve } from './build/utils';
import { createProxy } from './build/vite/proxy';
import { createVitePlugins } from './build/vite/plugins';
import { BUILD_TARGET, OUTPUT_DIR } from './build/config';

// https://cn.vitejs.dev/config/
export default defineConfig(({ command, mode }: ConfigEnv): UserConfig => {
	const root = process.cwd();
	const isBuild = command === 'build';

	const env = loadEnv(mode, root); // 加载环境配置文件，可设置第三个参数为 '' 来加载所有环境变量，而不管是否有 `VITE_` 前缀。

	const viteEnv = wrapperEnv(env);

	const { VITE_PUBLIC_PATH, VITE_PORT, VITE_OPEN, VITE_PROXY, VITE_DROP_CONSOLE } = viteEnv;

	return {
		// *共享选项
		root, // 项目根路径，默认为process.cwd()
		base: VITE_PUBLIC_PATH, // 开发或生产环境服务的公共基础路径
		resolve: {
			// 路径别名，将会被传递到 @rollup/plugin-alias 作为 entries 的选项。
			// 使用路径别名时，务必使用绝对路径
			alias: {
				'@': pathResolve('src'),
				'#': pathResolve('types')
			}
		},
		css: {
			// 指定传递给 CSS 预处理器的选项。文件扩展名用作选项的键
			preprocessorOptions: {
				scss: {
					additionalData: '@use "@/styles/var.scss" as *;' // 在入口文件起始添加代码
				}
			}
		},
		plugins: createVitePlugins(viteEnv, isBuild),
		esbuild: {
			pure: VITE_DROP_CONSOLE ? ['console.log', 'debugger'] : []
		},
		// *服务器选项
		server: {
			// 服务器主机名，如果允许外部访问，可设置为 "0.0.0.0" / true
			host: '0.0.0.0',
			port: VITE_PORT,
			open: VITE_OPEN,
			cors: true, // 默认启用
			// 自定义代理规则
			proxy: createProxy(VITE_PROXY)
		},
		// 构建选项
		build: {
			target: BUILD_TARGET,
			outDir: OUTPUT_DIR,
			minify: 'esbuild', // esbuild打包速度快，但不能去除console
			chunkSizeWarningLimit: 1500, // 触发警告的 chunk 大小 kbs
			rollupOptions: {
				output: {
					// Static resource classification and packaging
					chunkFileNames: 'assets/js/[name]-[hash].js',
					entryFileNames: 'assets/js/[name]-[hash].js',
					assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
				}
			}
		}
	};
});
