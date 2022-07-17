<script setup>
  import { useStore } from '@/stores/store.js' ;
  import DatasetList from '@/components/DatasetList.vue';
  import { PencilAltIcon, TrashIcon } from '@heroicons/vue/solid';

  const props = defineProps(['datagroup']);
  const store = useStore();
</script>

<template>
  <div class="datagroup mb-3">
    <div class="py-2 px-4 bg-gray-100 flex justify-between items-center rounded-t">
      <div class="title text-lg">{{ datagroup.title }}</div>

      <div class="flex justify-end">
        <button @click="$emit('delete', datagroup)" class="icon-button alert flex items-center mr-3" title="Löschen">
          <TrashIcon class="w-5 h-5" />
        </button>
        <button @click="$emit('edit', datagroup)" class="icon-button flex items-center" title="Bearbeiten">
          <PencilAltIcon class="w-5 h-5" />
        </button>
      </div>
    </div>

    <div class="list bg-white rounded-b">
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