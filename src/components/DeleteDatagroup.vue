<script setup>
  import { useStore } from '@/stores/store.js' ;

  const store = useStore();
  const props = defineProps(['datagroup']);

  function deleteDatagroup() {
    store.deleteDatagroup(props.datagroup.id);
    store.setModalVisibility(false);
  }
</script>

<template>
  <Teleport to=".modal-inner">
    <div>
      <div>Datengruppe wirklich löschen?</div>
      <button @click="store.setModalVisibility(false)">Abbrechen</button>
      <button @click="deleteDatagroup">Löschen</button>
    </div>
  </Teleport>
</template>

<style lang="scss" scoped>

</style>