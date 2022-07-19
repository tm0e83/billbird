<script setup>
  import { RouterLink, RouterView } from 'vue-router';
  import { useStore } from '@/stores/store.js';

  const store = useStore();
</script>

<template>
  <header class="p-3 bg-white shadow">
    <div class="container m-auto lg:flex lg:items-end">
      <div class="text-2xl font-black relative leading-none">
        Bill<span class="text-emerald-500">Bird</span>
        <span class="text-xs font-mono text-red-600 ml-1 font-bolder">alpha</span>
      </div>
      <nav class="flex gap-x-6 lg:ml-12">
        <RouterLink to="/">Übersicht</RouterLink>
        <RouterLink to="/faq">FAQ</RouterLink>
      </nav>
    </div>
  </header>

  <main class="p-3">
    <RouterView />
  </main>
</template>

<style scoped lang="scss">
  nav a {
    @apply transition duration-300 px-2 text-gray-400 hover:text-black;
  }

  .router-link-active {
    @apply border-b-2 border-emerald-500 text-black;
  }
</style>