import '@vuepic/vue-datepicker/src/VueDatePicker/style/main.scss';
import '@/assets/styles/tailwind.scss';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import Datepicker from '@vuepic/vue-datepicker';
import ModalWindow from '@/components/ModalWindow.vue';

import App from './App.vue';
import router from './router';

// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAR1E7fmkRS1ucozio3IpYw33xoeL3LEvI',
  authDomain: 'billbird-72646.firebaseapp.com',
  projectId: 'billbird-72646',
  storageBucket: 'billbird-72646.appspot.com',
  messagingSenderId: '664806364130',
  appId: '1:664806364130:web:e8758806485e05fb19dfbb'
};

// Initialize Firebase
initializeApp(firebaseConfig);

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.component('Datepicker', Datepicker);
app.component('ModalWindow', ModalWindow);

app.mount('#app');