/**
 * Package file volume analysis
 * https://www.npmjs.com/package/rollup-plugin-visualizer
 */
import visualizer from 'rollup-plugin-visualizer';
import { isReportMode } from '../../utils';
import { PluginOption } from 'vite';

export function configVisualizerPlugin() {
	if (isReportMode()) {
		return visualizer({
			filename: './node_modules/.cache/visualizer/stats.html',
			open: true,
			gzipSize: true,
			brotliSize: true
		}) as unknown as PluginOption;
	}
	return [];
}
