<script setup>
  import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header class="p-3 shadow">
    <div class="container m-auto flex">
      <div>BillBird</div>
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>
  <main class="p-3">
    <RouterView />
  </main>
</template>

<style scoped lang="scss">
</style>