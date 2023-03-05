// * 不做持久化，路由改变时动态添加
import { defineStore } from 'pinia';
import { KeepAliveState } from '../interface';

export const useKeepAliveStore = defineStore('keepAlive', {
	state: (): KeepAliveState => ({
		keepAliveNameList: []
	}),
	getters: {
		keepAliveNameListGet: state => state.keepAliveNameList
	},
	actions: {
		addKeepAliveName(name: string) {
			!this.keepAliveNameList.includes(name) && this.keepAliveNameList.push(name);
		},
		async removeKeepAliveName(name: string) {
			this.keepAliveNameList = this.keepAliveNameList.filter(item => item !== name);
		},
		async setKeepAliveName(keepAliveNameList: string[] = []) {
			this.keepAliveNameList = keepAliveNameList;
		}
	}
});
