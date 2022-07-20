<script setup>
  import { computed } from 'vue';
  import { useStore } from '@/stores/store.js';
  import DatasetList from '@/components/DatasetList.vue';
  import { PencilAltIcon, TrashIcon } from '@heroicons/vue/solid';

  const props = defineProps(['datagroup']);
  const store = useStore();
  const datasets = computed(() => store.datasets.filter(dataset => dataset.groupId === props.datagroup.id));
</script>

<template>
  <div class="datagroup mb-3">
    <div class="py-2 px-4 bg-gray-100 flex justify-between items-center rounded-t">
      <div class="title text-lg uppercase">{{ datagroup.title }}</div>

      <div class="flex gap-2 justify-end">
        <button @click="$emit('delete', datagroup)" class="button alert flex clear p-1" title="Löschen">
          <TrashIcon class="w-5 h-5" />
        </button>
        <button @click="$emit('edit', datagroup)" class="button flex clear p-1" title="Bearbeiten">
          <PencilAltIcon class="w-5 h-5" />
        </button>
      </div>
    </div>

    <div class="list bg-white rounded-b">
      <DatasetList
        v-if="datasets.length"
        :datasets="datasets"
      />
      <div v-else class="py-2 px-4">Diese Datengruppe enthält keine Datensätze.</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
</style>