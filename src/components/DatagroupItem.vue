<script setup>
  import { useStore } from '@/stores/store.js' ;
  import DatasetList from '@/components/DatasetList.vue';

  const props = defineProps(['datagroup']);
  const store = useStore();
</script>

<template>
  <div class="datagroup bg-gray-200 mb-3">
    <div class="title py-2 px-4 text-lg bg-gray-300">{{ datagroup.title }}</div>
    <div class="list">
      <DatasetList
        v-if="datagroup.datasets.length"
        :datagroup="datagroup"
      />
      <div v-else class="py-2 px-4">Keine Datensätze vorhanden</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .positive {
    color: green;
  }

  .negative {
    color: red;
  }
</style>