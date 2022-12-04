import { createRouter, createWebHashHistory } from 'vue-router';
import { staticRouter, errorRouter } from './modules/staticRoutes';

const router = createRouter({
	history: createWebHashHistory(),
	routes: [...staticRouter, ...errorRouter]
});

export default router;
