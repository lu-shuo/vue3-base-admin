import { createRouter, createWebHashHistory } from 'vue-router';
import { staticRouter, errorRouter } from './modules/staticRoutes';
import { useAppStore } from '@/stores/modules/app';
import { ROUTER_WHITE_LIST, LOGIN_URL } from '@/config/router';
import NProgress from '@/config/nprogress';

const router = createRouter({
	history: createWebHashHistory(),
	routes: [...staticRouter, ...errorRouter],
	strict: false, // 严格检查路径末尾是否有尾部斜线（/）
	scrollBehavior: () => ({ left: 0, top: 0 })
});

/**
 * @description 路由拦截 beforeEach
 * */
router.beforeEach(async (to, from, next) => {
	const appStore = useAppStore();
	// * 1.显示loading栏
	NProgress.start();

	// * 2.设置document.title
	const title = import.meta.env.VITE_GLOB_APP_TITLE;
	document.title = to.meta.title ? `${to.meta.title} - ${title}` : title;

	// * 3.判断是访问登陆页，有 Token 就在当前页面，没有 Token 重置路由并放行到登陆页
	if (to.path === LOGIN_URL) {
		if (appStore.token) return next(from.fullPath);
		// resetRouter();
		return next();
	}

	// * 4.白名单页面直接放行
	if (ROUTER_WHITE_LIST.includes(to.path)) return next();

	// * 5.判断是否有token，没有则重定向到登录
	if (appStore.token) return next({ path: LOGIN_URL, replace: true });

	// TODO* 6.权限路由

	// 7.正常访问页面
	next();
});

/**
 * @description 路由跳转结束
 * */
router.afterEach(() => {
	NProgress.done();
});

/**
 * @description 路由跳转错误
 * */
router.onError(error => {
	NProgress.done();
	console.warn('路由错误', error.message);
});
export default router;
