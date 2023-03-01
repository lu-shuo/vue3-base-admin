import router from '@/routers/index';
import { useAppStore } from '@/stores/modules/app';
import { useAuthStore } from '@/stores/modules/auth';
import { LOGIN_URL } from '@/config/router';
import { getType } from '@/utils/utils';

// 引入 views 文件夹下所有 vue 文件
const modules = import.meta.glob('@/views/**/*.vue');

export const initDynamicRouter = async () => {
	const appStore = useAppStore();
	const authStore = useAuthStore();
	try {
		// * 1.获取菜单列表 && 按钮权限（可合并到一个接口获取，根据后端不同可自行改造）
		await authStore.getAuthMenuList();
		await authStore.getAuthButtonList();
		// * 2.判断用户是否有菜单权限
		if (!authStore.authMenuListGet.length) {
			ElNotification({
				title: '无权限访问',
				message: '当前账号无任何菜单权限，请联系系统管理员！',
				type: 'warning',
				duration: 3000
			});
			appStore.setToken('');
			router.replace(LOGIN_URL);
			return Promise.reject('No permission');
		}
		// * 3.添加动态路由
		authStore.flatMenuListGet.forEach((item: any) => {
			item.children && delete item.children;
			if (item.component && getType(item.component) === 'string') {
				item.component = modules['/src/views' + item.component + '.vue'];
			}
			if (item.meta.isFull) {
				router.addRoute(item);
			} else {
				router.addRoute('layout', item);
			}
		});
	} catch (error) {
		// ! 当按钮 || 菜单请求出错时，重定向到登陆页
		appStore.setToken('');
		router.replace(LOGIN_URL);
		return Promise.reject(error);
	}
};
