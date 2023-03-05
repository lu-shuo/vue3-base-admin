import { createApp } from 'vue';
import App from './App.vue';
// 样式
import '@/styles/index.scss';
// iconfont css
import '@/assets/iconfont/iconfont.scss';
// svg 组件
import SvgIcon from '@/components/SvgIcon/index.vue';
// element icon
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
// store
import pinia from '@/stores/index';
// vue Router
import router from '@/routers/index';
// vue i18n
import I18n from '@/languages/index';
// errorHandler
import errorHandler from '@/utils/errorHandler';

const app = createApp(App);

app.config.errorHandler = errorHandler;

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
	app.component(key, component);
}

app.component('SvgIcon', SvgIcon);

app.use(pinia);

app.use(router);

app.use(I18n);

app.mount('#app');
