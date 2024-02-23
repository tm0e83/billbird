<script setup>
import { computed, reactive } from 'vue';
import { useStore } from '@/stores/store.js';
import { toCurrency } from './shared/functions.js';
import DatasetList from '@/components/DatasetList.vue';
import { CheckIcon, EditIcon, GripVerticalIcon, TrashIcon, SquareIcon, SquareCheckIcon } from 'vue-tabler-icons';

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

const totalInvoiceAmount = computed(() => {
  return props.datagroup.datasets.reduce((sum, dataset) => (dataset.invoiceAmount ? (sum += dataset.invoiceAmount) : sum), 0);
});

const totalDebitAmount = computed(() => {
  return props.datagroup.datasets.reduce((sum, dataset) => (dataset.debitAmount ? (sum += dataset.debitAmount) : sum), 0);
});

const totalDiffAmount = computed(() => {
  return props.datagroup.datasets.reduce((sum, dataset) => (dataset.diffAmount ? (sum += dataset.diffAmount) : sum), 0);
});

const totalMonthlyAmount = computed(() => {
  return props.datagroup.datasets.reduce((sum, dataset) => (dataset.monthlyAmount ? (sum += dataset.monthlyAmount) : sum), 0);
});

const totalUpdateAmount = computed(() => {
  return props.datagroup.datasets.reduce((sum, dataset) => (dataset.updateAmount ? (sum += dataset.updateAmount) : sum), 0);
});

const hasUpdateAmounts = computed(() => {
  return props.datagroup.datasets.filter(dataset => !!dataset.updateAmount).length > 0;
});

function activate() {
  store.activateDatagroup(props.datagroup.id);
}

function deactivate() {
  store.deactivateDatagroup(props.datagroup.id);
}

function toggle(e) {
  if (e.target.classList.contains('button') || e.target.closest('.button')) return;
  state.collapsed = !state.collapsed;
}

function applyUpdate() {
  props.datagroup.datasets.map(dataset => {
    store.addActualAmount(dataset.id, dataset.updateAmount);
    store.setUpdateAmount(dataset.id, null);
  });
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
    <div class="prop title">
        <button class="button drag-handle secondary clear p-1 grow-0">
          <GripVerticalIcon class="w-5 h-5 mx-auto" />
        </button>
        <span class="overflow-hidden text-ellipsis">{{ datagroup.title }}</span>
      </div>
      <div class="prop text-right invoice-amount">
        <span>{{ toCurrency(totalInvoiceAmount) }}</span>
      </div>
      <div class="prop text-right monthly-amount">
        <span title="Mtl. Betrag">{{ toCurrency(totalMonthlyAmount) }}</span>
      </div>
      <div class="prop invoice-date"></div>
      <div class="prop interval"></div>
      <div class="prop update-amount">
        <div class="grow flex flex-col 2xl:flex-row 2xl:items-center">
          <div class="grow 2xl:px-3 text-right flex justify-between 2xl:justify-end">
            <span>{{ toCurrency(totalUpdateAmount) }}</span>
          </div>
          <button
            @click="applyUpdate"
            :disabled="!hasUpdateAmounts"
            class="button self-end 2xl:self-center my-0-xl"
            title="Update für alle Datensätze der Gruppe ausführen"
          >
            <CheckIcon class="w-5 h-5" />
          </button>
        </div>
      </div>
      <div class="prop text-right actual-amount">
        <span title="Ist">{{ toCurrency(totalActualAmount) }}</span>
      </div>
      <div class="prop text-right debit-amount">
        <span title="Soll">{{ toCurrency(totalDebitAmount) }}</span>
      </div>
      <div class="prop text-right diff-amount">
        <span title="Differenz">{{ toCurrency(totalDiffAmount) }}</span>
      </div>
      <div class="prop grow-0 shrink-0 basis-[140px] buttons">
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
        </div>
      </div>
    </div>

    <div class="list">
      <DatasetList
        v-if="datagroup.datasets.length"
        :datasets="datagroup.datasets"
        :collapsed="state.collapsed"
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
  // background-color: $gray-100;
  background-color: #fff;
  margin-bottom: 1px;

  &:last-of-type {
    margin-bottom: 0;
  }

  .head {
    padding: 0;
    align-items: center;
    display: flex;
    min-height: 3.25rem;
    font-weight: bold;
    cursor: pointer;
    box-shadow: inset 0 -1px 0 0 $gray-200;

    .current-value {
      display: none;
    }
  }

  .drag-handle {
    cursor: move;
    margin-left: -0.5rem;
  }
  .prop {
    padding: 0.5rem 1rem;
  }

  .title {
    flex: 1;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-size: 1.125rem;
    line-height: 1.75rem;
    text-transform: uppercase;
    user-select: none;
  }

  .actual-amount {
    display: none;
  }

  .debit-amount,
  .diff-amount,
  .invoice-amount,
  .monthly-amount,
  .invoice-date,
  .interval,
  .update-amount {
    display: none;
  }

  .menu {
    display: flex;
    gap: 0.25rem;
    justify-content: flex-end;
    margin-left: 1rem;
    margin-right: -0.5rem;
  }

  .list {
    background-color: #fff;
    background-color: $gray-50;
  }

  &[draggable='false'] .head {
    cursor: pointer;
  }

  &.collapsed {
    margin-bottom: 0;

    .actual-amount {
      display: flex;
    }

    .menu {
      display: none;
    }


    .list {
      display: none;
    }
  }

  @media (min-width: $xxl) {
    .head {
      justify-content: space-between;

      .menu {
        display: flex;
      }
    }

    .prop {
      justify-content: space-between;

      &.title {
        justify-content: flex-start;
      }
    }

    .buttons {
      display: flex;
      justify-content: flex-end;
      flex-grow: 0;
      flex-shrink: 0;
      flex-basis: 140px;
    }

    .actual-amount {
      display: none;
    }

    &.collapsed {
      .actual-amount,
      .debit-amount,
      .diff-amount,
      .invoice-amount,
      .monthly-amount,
      .invoice-date,
      .interval,
      .update-amount {
        display: flex;
        justify-content: flex-end;
        flex-grow: 0;
        flex-shrink: 0;
        flex-basis: 140px;
      }

      .update-amount {
        display: flex;
        flex-grow: 0;
        flex-shrink: 0;
        flex-basis: 200px;
      }
    }
  }
}
</style>
