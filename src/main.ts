import { createApp } from 'vue';
import App from './App.vue';
//import './assets/icons';
import './assets/css/global.scss'
import router from './router';
import store from './store';
import imgLazy from '@/utils/lazy';
import { setFontSize } from './utils/response'
window.addEventListener("resize", setFontSize, false);

const app = createApp(App)
app.use(router)
app.use(store)
app.use(imgLazy)
app.mount('#app')
