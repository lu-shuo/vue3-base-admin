import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { TIMEOUT } from '@/config/axiosConfig';
import { ResponseCode, Result } from '#/axios';
import { ElMessage } from 'element-plus';
import { LOGIN_URL } from '@/config/routerConfig';
import { checkHttpStatus } from './helper/checkHttpStatus';
import { useGlobalStore } from '@/store';
import router from '@/router';

const config = {
	// 默认请求地址，可配置
	baseURL: import.meta.env.VITE_API_URL,
	// 超时时间，可配置
	timeout: TIMEOUT,
	// 跨域时候允许携带凭证
	withCredentials: true
};

class HttpRequest {
	private axiosInstance: AxiosInstance;

	constructor(config: AxiosRequestConfig) {
		this.axiosInstance = axios.create(config);
		/**
		 * @description 请求拦截器
		 * 客户端发送请求 -> [请求拦截器] -> 服务器
		 * token校验(JWT) : 接受服务器返回的token,存储到vuex/pinia/本地储存当中
		 */
		this.axiosInstance.interceptors.request.use(
			(config: AxiosRequestConfig) => {
				// TODO:header配置中添加noLoading控制是否显示loading栏

				// TODO: token鉴权及token请求携带
				const globalStore = useGlobalStore();
				const token = globalStore.token;
				return { ...config, headers: { ...config.headers, 'x-access-token': token } };
			},
			(error: AxiosError) => {
				return Promise.reject(error);
			}
		);
		/**
		 * @description 响应拦截器
		 *  服务器换返回信息 -> [拦截统一处理] -> 客户端JS获取到信息
		 */
		this.axiosInstance.interceptors.response.use(
			(response: AxiosResponse) => {
				// 2xx 范围内的状态码都会触发该函数
				const { data } = response;
				const globalStore = useGlobalStore();
				// * 登录失效 清空token重新登陆
				if (data.code === ResponseCode.OVERDUE) {
					ElMessage.error(data.msg);
					globalStore.token = '';
					router.replace(LOGIN_URL);
					return Promise.reject(data);
				}
				// * 全局错误信息拦截
				// * 去除下载文件没有code的情况
				if (data.code && data.code !== ResponseCode.SUCCESS) {
					ElMessage.error(data.msg);
					return Promise.reject(data);
				}
				// * 成功请求（在页面上除非特殊情况，否则不用在页面处理失败逻辑）
				return data;
			},
			(error: AxiosError) => {
				// 超出 2xx 范围的状态码都会触发该函数
				const { response, message } = error;
				if (response) {
					// * 请求成功发出且服务器也响应了状态码，但状态码超出了 2xx 的范围
					checkHttpStatus(response.status);
				} else {
					// * 发送请求时出了点问题
					if (message.indexOf('timeout') !== -1) ElMessage.error('请求超时！请您稍后重试');
					if (message.indexOf('Network Error') !== -1) ElMessage.error('网络错误！请您稍后重试');
				}
				// * 断网跳转断网页面
				if (!window.navigator.onLine) router.replace('/500');
				return Promise.reject(error);
			}
		);
	}
	// * 常用请求方法封装
	get<T>(url: string, params?: object, _object = {}): Promise<Result<T>> {
		return this.axiosInstance.get(url, { params, ..._object });
	}
	post<T>(url: string, params?: object, _object = {}): Promise<Result<T>> {
		return this.axiosInstance.post(url, params, _object);
	}
	put<T>(url: string, params?: object, _object = {}): Promise<Result<T>> {
		return this.axiosInstance.put(url, params, _object);
	}
	delete<T>(url: string, params?: any, _object = {}): Promise<Result<T>> {
		return this.axiosInstance.delete(url, { params, ..._object });
	}
}

export default new HttpRequest(config);
