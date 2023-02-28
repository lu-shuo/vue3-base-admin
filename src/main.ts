import { createApp } from 'vue';
import App from './App.vue';
// 样式
import '@/styles/index.scss';
// svg 组件
import SvgIcon from '@/components/SvgIcon/index.vue';
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

// app.use(ElementPlus);

app.use(pinia);

app.use(router);

app.mount('#app');
