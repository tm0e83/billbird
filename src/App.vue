<script setup>
  import { RouterLink, RouterView } from 'vue-router';
  import { useStore } from '@/stores/store.js';

  const store = useStore();
</script>

<template>
  <header class="p-3 shadow">
    <div class="container m-auto flex items-end">
      <div class="text-2xl font-black">Bill<span class="text-emerald-500">Bird</span></div>
      <nav class="flex gap-x-6 ml-12">
        <RouterLink to="/">Übersicht</RouterLink>
        <RouterLink to="/info">Information</RouterLink>
      </nav>
    </div>
  </header>

  <main class="p-3">
    <RouterView />
  </main>

  <ModalWindow :show="store.modalVisible" @close="store.hideModal()" />
</template>

<style scoped lang="scss">
  nav a {
    @apply transition duration-300 px-2 text-gray-400 hover:text-black;
  }

  .router-link-active {
    @apply border-b-2 border-emerald-500 text-black;
  }
</style>