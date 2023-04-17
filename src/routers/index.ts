import { createRouter, createWebHashHistory } from 'vue-router';
import { staticRouter, errorRouter } from './modules/staticRoutes';
import { initDynamicRouter } from './modules/dynamicRoutes';
import { useUserStore } from '@/stores/modules/user';
import { useAuthStore } from '@/stores/modules/auth';
import { ROUTER_WHITE_LIST, LOGIN_URL } from '@/config/router';
import NProgress from '@/config/nprogress';

/**
 * @description 动态路由参数配置简介 📚
 * @param path ==> 菜单路径
 * @param name ==> 菜单别名
 * @param redirect ==> 重定向地址
 * @param component ==> 视图文件路径
 * @param meta ==> 菜单信息
 * @param meta.icon ==> 菜单图标
 * @param meta.title ==> 菜单标题
 * @param meta.activeMenu ==> 当前路由为详情页时，需要高亮的菜单
 * @param meta.isLink ==> 是否外链
 * @param meta.isHide ==> 是否隐藏
 * @param meta.isFull ==> 是否全屏(示例：数据大屏页面)
 * @param meta.isAffix ==> 是否固定在 tabs nav
 * @param meta.isKeepAlive ==> 是否缓存
 * */
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
	const userStore = useUserStore();
	const authStore = useAuthStore();

	// * 1.显示loading栏
	NProgress.start();

	// * 2.设置document.title
	const title = import.meta.env.VITE_GLOB_APP_TITLE;
	document.title = to.meta.title ? `${to.meta.title} - ${title}` : title;

	// * 3.判断是访问登陆页，有 Token 就在当前页面，没有 Token 重置路由并放行到登陆页
	if (to.path === LOGIN_URL) {
		if (userStore.token) return next(from.fullPath);
		resetRouter();
		return next();
	}

	// * 4.白名单页面直接放行
	if (ROUTER_WHITE_LIST.includes(to.path)) return next();

	// * 5.判断是否有token，没有则重定向到登录
	if (!userStore.token) return next({ path: LOGIN_URL, replace: true });

	// * 6.如果没有菜单列表，就重新请求菜单列表并添加动态路由
	authStore.setRouteName(to.name as string);
	if (!authStore.authMenuListGet.length) {
		await initDynamicRouter();
		return next({ ...to, replace: true });
	}

	// * 7.正常访问页面
	next();
});

/**
 * @description 重置路由
 * */
export const resetRouter = () => {
	const authStore = useAuthStore();
	authStore.flatMenuListGet.forEach(route => {
		const { name } = route;
		if (name && router.hasRoute(name)) router.removeRoute(name);
	});
};

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
