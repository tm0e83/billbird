<script setup>
import { useStore } from '@/stores/store.js';

const store = useStore();
const props = defineProps(['datagroup']);
const emit = defineEmits(['close']);

function deleteDatagroup() {
  store.deleteDatagroup(props.datagroup.id);
  emit('close');
}
</script>

<template>
  <div>
    <div class="modal-head text-center">Datengruppe wirklich löschen?</div>
    <div class="flex justify-between">
      <button
        @click="$emit('close')"
        class="button alert hollow"
      >
        Abbrechen
      </button>
      <button
        @click="deleteDatagroup"
        class="button alert"
      >
        Löschen
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/variables';
@import '@/assets/styles/mixins';
</style>
