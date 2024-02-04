<script setup>
import { computed, reactive } from 'vue';
import { useStore } from '@/stores/store.js';
import DatasetList from '@/components/DatasetList.vue';
import { EditIcon, GripVerticalIcon, TrashIcon, SquareIcon, SquareCheckIcon } from 'vue-tabler-icons';

const props = defineProps(['datagroup']);
const store = useStore();

const state = reactive({
  collapsed: true,
});

const isActive = computed(() => {
  return store.inactiveDatagroupIds.includes(props.datagroup.id) === false;
});

function activate() {
  store.activateDatagroup(props.datagroup.id);
}

function deactivate() {
  store.deactivateDatagroup(props.datagroup.id);
}

function toggle() {
  state.collapsed = !state.collapsed;
}
</script>

<template>
  <div
    class="datagroup mb-3"
    :class="{ collapsed: state.collapsed, inactive: !isActive }"
  >
    <div class="py-2 px-4 flex justify-between items-center rounded-t">
      <div
        @click="toggle"
        class="grow title"
      >
        <span class="overflow-hidden text-ellipsis">{{ datagroup.title }}</span>
      </div>

      <div class="flex gap-2 justify-end ml-4">
        <button
          v-if="!isActive"
          @click="activate"
          class="button grow clear p-1 grow-0"
          title="Aktivieren"
        >
          <SquareIcon class="w-5 h-5" />
        </button>
        <button
          v-if="isActive"
          @click="deactivate"
          class="button grow clear p-1 grow-0"
          title="Deaktivieren"
        >
          <SquareCheckIcon class="w-5 h-5" />
        </button>
        <button
          @click="$emit('edit', datagroup)"
          class="button grow clear p-1 grow-0"
          title="Bearbeiten"
        >
          <EditIcon class="w-5 h-5" />
        </button>
        <button
          @click="$emit('delete', datagroup)"
          class="button alert grow clear p-1 grow-0"
          title="Löschen"
        >
          <TrashIcon class="w-5 h-5" />
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
@import '@/assets/styles/variables';

.datagroup {
  background-color: $gray-100;

  &.collapsed {
    transition: 150ms background-color ease-in-out;
    background-color: $gray-50;

    &:hover {
      background-color: $gray-100;
    }

    .list {
      display: none;
    }
  }
}

.title {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 1.125rem;
  line-height: 1.75rem;
  text-transform: uppercase;
  user-select: none;
  cursor: pointer;
}

.drag-handle {
  cursor: move;
  padding: 0.25rem;
  flex-grow: 0;
  margin-right: -0.625rem;
}
</style>
