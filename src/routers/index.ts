import { createRouter, createWebHashHistory } from 'vue-router';
import { staticRouter, errorRouter } from './modules/staticRoutes';

const router = createRouter({
	history: createWebHashHistory(),
	routes: [...staticRouter, ...errorRouter],
	strict: false, // 严格检查路径末尾是否有尾部斜线（/）
	scrollBehavior: () => ({ left: 0, top: 0 })
});

export default router;
