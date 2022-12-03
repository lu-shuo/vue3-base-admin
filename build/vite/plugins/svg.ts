/**
 *  Vite Plugin for fast creating SVG sprites.
 * https://github.com/anncwb/vite-plugin-svg-icons
 */

import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import { pathResolve } from '../../utils';

export function configSvgPlugin(isBuild: boolean) {
	return createSvgIconsPlugin({
		iconDirs: [pathResolve('src/assets/icons')],
		svgoOptions: isBuild, // 压缩选项
		// default
		symbolId: 'icon-[dir]-[name]'
	});
}
