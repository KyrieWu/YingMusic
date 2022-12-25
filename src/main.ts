import { createApp } from 'vue';
import App from './App.vue';
//import './assets/icons';
import i18n from './locale';
import '@/styles//global.scss'
import '@/styles/nprogress.css'
import router from './router';
import store from './store';
import imgLazy from '@/utils/lazy';
import { setFontSize } from './utils/response'
import NProgress from 'nprogress';
window.addEventListener("resize", setFontSize, false);

NProgress.configure({ showSpinner: false, trickleSpeed: 100 });

const app = createApp(App)
app.use(router)
    .use(store)
    .use(imgLazy)
    .use(i18n)
    .mount('#app')
