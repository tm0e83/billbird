<script setup>
  import { useStore } from '@/stores/store.js' ;
  import DatasetItem from '@/components/DatasetItem.vue' ;
  const store = useStore();
</script>

<template>
  <div class="dataset-list">
    <DatasetItem
      v-for="dataset in store.datasets"
      :data="dataset"
      @delete="id => $emit('delete', id)"
      @edit="dataset => $emit('edit', dataset)"
    />
  </div>
</template>

<style lang="scss" scoped>
  .dataset-list {

  }
</style>