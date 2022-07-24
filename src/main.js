import '@vuepic/vue-datepicker/src/VueDatePicker/style/main.scss';
import '@/assets/styles/tailwind.scss';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import Datepicker from '@vuepic/vue-datepicker';
import ModalWindow from '@/components/ModalWindow.vue';

import App from './App.vue';
import router from './router';

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.component('Datepicker', Datepicker);
app.component('ModalWindow', ModalWindow);

app.mount('#app');
