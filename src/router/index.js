import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import { useStore } from '@/stores/store.js';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/overview'
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/overview',
      name: 'overview',
      component: () => import('../views/Overview.vue')
    },
    {
      path: '/faq',
      name: 'faq',
      component: () => import('../views/Faq.vue')
    }
  ]
});

router.beforeEach(async (to, from) => {
  const publicPages = ['/login'];
  const authRequired = !publicPages.includes(to.path);
  const store = useStore();

  if (!authRequired && store.uid) {
    return '/overview';
  }

  if (authRequired && !store.uid) {
    // store.returnUrl = to.fullPath;
    return '/login';
  }
});

export default router;