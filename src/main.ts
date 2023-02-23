import { createApp } from 'vue';
import App from './App.vue';
// reset style sheet
import '@/style/reset.scss';
// svg 组件
import SvgIcon from '@/components/SvgIcon/index.vue';
// Element Plus
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
// store
import pinia from '@/store/index';
// vue Router
import router from '@/router/index';

const app = createApp(App);

app.component('SvgIcon', SvgIcon);

app.use(ElementPlus);

app.use(pinia);

app.use(router);

app.mount('#app');
