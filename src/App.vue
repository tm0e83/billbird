<script setup>
  import { ref, watch } from 'vue';
  import { RouterLink, RouterView } from 'vue-router';
  import { useStore } from '@/stores/store.js';
  import githubLogo from '@/assets/images/github-logo.svg';
  import { getAuth, signOut } from 'firebase/auth';
  import router from './router';
  import { LogoutIcon } from 'vue-tabler-icons';

  const store = useStore();
  const auth = getAuth();

  const isLoggedIn = ref(false);

  watch(() => store.uid, () => isLoggedIn.value = !!store.uid);

  function logout() {
    if (store.uid === 'testuser') {
      store.uid = null;
      router.push('/login');
    } else {
      signOut(auth)
        .then(() => {
          store.uid = null;
          router.push('/login')
        })
        .catch(() => console.log('failed to logout'));
    }
  }
</script>

<template>
  <header class="p-3 bg-white shadow">
    <div class="container m-auto sm:flex sm:items-center">
      <div class="flex items-center text-2xl font-black relative leading-none">
        Bill<span class="text-emerald-500">Bird</span>
        <span class="text-xs self-end font-mono text-red-600 ml-1 font-bolder">alpha</span>
      </div>
      <div class="flex grow justify-between items-center mt-3 sm-mt-0">
        <nav class="flex gap-x-8 sm:gap-x-12 sm:ml-20">
          <RouterLink to="/overview">Übersicht</RouterLink>
          <RouterLink to="/faq">FAQ</RouterLink>
        </nav>
        <div class="flex gap-x-8 sm:gap-x-12">
          <a v-if="isLoggedIn" @click="logout" class="flex gap-1 items-center">
            <LogoutIcon class="w-5 h-5" />
            <span>Ausloggen</span>
          </a>
          <a href="https://github.com/tm0e83/billbird" title="auf Github anzeigen" target="_blank">
            <img :src="githubLogo" alt="Github Logo">
          </a>
        </div>
      </div>
    </div>
  </header>

  <main class="p-3">
    <RouterView />
  </main>
</template>

<style scoped lang="scss">
  nav a {
    @apply transition duration-300 text-gray-400 hover:text-black;
  }

  .router-link-active {
    @apply text-black cursor-default;
  }
</style>