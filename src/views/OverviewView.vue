<script setup>
  import { onMounted } from 'vue';
  import { useStore } from '@/stores/store.js';
  import DatagroupList from '@/components/DatagroupList.vue' ;

  const store = useStore();

  onMounted(() => {
    fetch('/src/data/data.json')
      .then(response => response.json())
      .then(datagroups => store.setDatagroups(datagroups)).catch(e => {
        console.log(e);
      });
  });
</script>

<template>
  <div>
    <DatagroupList v-if="store.datagroups.length" />
    <div v-else>Keine Datensätze vorhanden</div>
  </div>
</template>