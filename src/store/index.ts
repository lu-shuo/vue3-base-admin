import { createPinia, defineStore } from 'pinia';

export const useGlobalStore = defineStore('globalStore', {
	state: () => ({
		// token
		token: '',
		// userInfo
		userInfo: '',
		// language
		language: ''
	})
});

const pinia = createPinia();

export default pinia;
