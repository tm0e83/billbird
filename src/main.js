import { createApp } from 'vue';
import { createPinia } from 'pinia';
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
// import '@/assets/styles/tailwind.scss';
import '@/assets/styles/main.scss';

import ModalWindow from '@/components/ModalWindow.vue';

import App from './App.vue';
import router from './router';

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.component('Datepicker', Datepicker);
app.component('ModalWindow', ModalWindow);

app.mount('#app');
