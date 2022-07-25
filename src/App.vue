<script setup>
  import { ref } from 'vue';
  import { RouterLink, RouterView } from 'vue-router';
  import { useStore } from '@/stores/store.js';
  import githubLogo from '@/assets/images/github-logo.svg';
  import DropdownMenu from './components/DropdownMenu.vue';

  const store = useStore();
</script>

<template>
  <header class="p-3 bg-white shadow">
    <div class="container m-auto sm:flex sm:items-center">
      <div class="flex items-center text-2xl font-black relative leading-none">
        Bill<span class="text-emerald-500">Bird</span>
        <span class="text-xs self-end font-mono text-red-600 ml-1 font-bolder">alpha</span>
      </div>
      <div class="flex grow justify-between mt-3 sm-mt-0">
        <nav class="flex gap-x-8 sm:gap-x-12 sm:ml-20">
          <RouterLink to="/">Übersicht</RouterLink>
          <RouterLink to="/faq">FAQ</RouterLink>
        </nav>
        <a href="https://github.com/tm0e83/billbird" title="auf Github anzeigen" target="_blank">
          <img :src="githubLogo" alt="Github Logo">
        </a>
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