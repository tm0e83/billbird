<script setup>
  import { useStore } from '@/stores/store.js' ;

  const store = useStore();
  const props = defineProps(['dataset']);
  const emit = defineEmits(['close']);

  function deleteDataset() {
    console.log('deleteDataset', props.dataset.id);
    store.deleteDataset(props.dataset.id);
    emit('close');
  }
</script>

<template>
  <Teleport to=".modal-inner">
    <div>
      <div>Datensatz wirklich löschen?</div>
      <button @click="$emit('close')">Abbrechen</button>
      <button @click="deleteDataset">Löschen</button>
    </div>
  </Teleport>
</template>

<style lang="scss" scoped>

</style>