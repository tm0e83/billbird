<script setup>
  import { useStore } from '@/stores/store.js' ;

  const store = useStore();
  const props = defineProps(['dataset']);

  function deleteDataset() {
    store.deleteDataset(props.dataset.id);
    store.hideModal();
  }
</script>

<template>
  <Teleport to=".modal-inner">
    <div>
      <div class="modal-head">Datensatz wirklich löschen?</div>
      <div class="flex justify-between">
        <button @click="store.hideModal()" class="hollow">Abbrechen</button>
        <button @click="deleteDataset">Löschen</button>
      </div>
    </div>
  </Teleport>
</template>

<style lang="scss" scoped>

</style>