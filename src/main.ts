import { createApp } from 'vue';
import App from './App.vue';
// reset style sheet
import '@/styles/reset.scss';
// common css
import '@/styles/common.scss';
// svg 组件
import SvgIcon from '@/components/SvgIcon/index.vue';
// element plus
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
// element dark(内置暗黑模式)
import 'element-plus/theme-chalk/dark/css-vars.css';
// element 样式自定义
import '@/styles/element.scss';
// 自定义暗黑模式
import '@/styles/dark/index.scss';
// element icon
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
// store
import pinia from '@/stores/index';
// vue Router
import router from '@/routers/index';

const app = createApp(App);

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
	app.component(key, component);
}

app.component('SvgIcon', SvgIcon);

app.use(ElementPlus);

app.use(pinia);

app.use(router);

app.mount('#app');
