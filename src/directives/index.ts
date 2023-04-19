import { App, Directive } from 'vue';

const modules = import.meta.glob('./modules/*.ts', { eager: true }); // eager = true 直接引入所有的模块 / 否则为懒加载

const directives = {
	install(app: App<Element>) {
		for (const path in modules) {
			const name = path.slice(path.lastIndexOf('/') + 1, path.lastIndexOf('.'));
			app.directive(name, modules[path] as Directive);
		}
	}
};

export default directives;
