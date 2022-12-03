import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import SvgIcon from '@/components/SvgIcon/index.vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

const app = createApp(App);

// svg组件
app.component('SvgIcon', SvgIcon);
// Element
app.use(ElementPlus);

app.mount('#app');
