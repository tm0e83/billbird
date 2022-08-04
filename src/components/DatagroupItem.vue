<script setup>
import { useStore } from '@/stores/store.js';
import DatasetList from '@/components/DatasetList.vue';
import { EditIcon, GripVerticalIcon, TrashIcon } from 'vue-tabler-icons';

defineProps(['datagroup']);
useStore();
</script>

<template>
  <div class="datagroup mb-3">
    <div class="py-2 px-4 bg-gray-100 flex justify-between items-center rounded-t">
      <div class="grow title">
        <span class="overflow-hidden text-ellipsis">{{ datagroup.title }}</span>
      </div>

      <div class="flex gap-2 justify-end ml-4">
        <button
          @click="$emit('delete', datagroup)"
          class="button alert grow clear p-1 grow-0"
          title="Löschen"
        >
          <TrashIcon class="w-5 h-5" />
        </button>
        <button
          @click="$emit('edit', datagroup)"
          class="button grow clear p-1 grow-0"
          title="Bearbeiten"
        >
          <EditIcon class="w-5 h-5" />
        </button>
        <button class="button clear secondary drag-handle">
          <GripVerticalIcon class="w-5 h-5" />
        </button>
      </div>
    </div>

    <div class="list bg-white rounded-b">
      <DatasetList
        v-if="datagroup.datasets.length"
        :datasets="datagroup.datasets"
      />
      <div
        v-else
        class="py-2 px-4"
      >
        Diese Datengruppe enthält keine Datensätze.
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.title {
  @apply flex
      justify-start
      items-center
      text-lg
      uppercase;
}

.drag-handle {
  @apply cursor-move p-1 grow-0 -mr-2.5;
}
</style>
