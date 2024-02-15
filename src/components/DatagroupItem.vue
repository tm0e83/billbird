<script setup>
import { computed, reactive } from 'vue';
import { useStore } from '@/stores/store.js';
import { toCurrency } from './shared/functions.js';
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

const totalActualAmount = computed(() => {
  return props.datagroup.datasets.reduce((sum, dataset) => (dataset.actualAmount ? (sum += dataset.actualAmount) : sum), 0);
});

function activate() {
  store.activateDatagroup(props.datagroup.id);
}

function deactivate() {
  store.deactivateDatagroup(props.datagroup.id);
}

function hasParent(el, cssClass) {
  if (el) {
    if (el.classList.contains(cssClass)) {
      return true;
    } else {
      hasParent(el.parentElement, cssClass);
    }
  } else {
    return false;
  }
}

function toggle(e) {
  if (e.target.classList.contains('button') || hasParent(e.target.parentElement, 'button')) return;
  state.collapsed = !state.collapsed;
}
</script>

<template>
  <div
    class="datagroup"
    :class="{ collapsed: state.collapsed, inactive: !isActive }"
  >
    <div
      class="head"
      @click="toggle"
    >
      <div class="title">
        <span class="overflow-hidden text-ellipsis">{{ datagroup.title }}</span>
      </div>

      <div class="current-value">{{ toCurrency(totalActualAmount) }}</div>
      <div class="menu">
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
        <button class="button drag-handle secondary clear p-1 grow-0">
          <GripVerticalIcon class="w-5 h-5 mx-auto" />
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
@import '@/assets/styles/mixins';
.datagroup {
  background-color: $gray-100;
  margin-bottom: 1px;

  .head {
    padding: 0.5rem 1rem;
    align-items: center;
    display: flex;
    cursor: pointer;

    .current-value {
      display: none;
    }
  }

  .drag-handle {
    cursor: move;
    margin-left: -0.625rem;
    // padding: 0.25rem;
  }

  .title {
    flex-grow: 1;
  }

  .menu {
    display: flex;
    gap: 0.25rem;
    justify-content: flex-end;
    margin-left: 1rem;
  }

  .title {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-size: 1.125rem;
    line-height: 1.75rem;
    text-transform: uppercase;
    user-select: none;
  }

  &[draggable='false'] .head {
    cursor: pointer;
  }

  &.collapsed {
    transition: 150ms background-color ease-in-out;
    background-color: $gray-50;

    &:hover {
      background-color: $gray-100;
    }

    .head {
      .menu {
        display: none;
      }

      .current-value {
        display: block;
      }
    }

    .list {
      display: none;
    }
  }

  @media (min-width: $xxl) {
    .head {
      justify-content: space-between;

      .menu {
        display: none;
      }

      .current-value {
        display: none !important;
      }
    }
  }
}
</style>
