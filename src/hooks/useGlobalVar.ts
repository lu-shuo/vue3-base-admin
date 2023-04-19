import { getCurrentInstance, ComponentInternalInstance } from 'vue';

export function useGlobalVar() {
	const {
		appContext: {
			app: {
				config: { globalProperties }
			}
		}
	} = getCurrentInstance() as ComponentInternalInstance;
	return { ...globalProperties };
}
