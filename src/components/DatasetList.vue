<script setup>
import { computed, reactive, ref } from 'vue';
import { useStore } from '@/stores/store.js';
import { toCurrency } from './shared/functions.js';
import DatasetItem from '@/components/DatasetItem.vue';
import EditDataset from '@/components/EditDataset.vue';
import DeleteDataset from '@/components/DeleteDataset.vue';
import { CheckIcon } from 'vue-tabler-icons';
import draggable from 'vuedraggable';

const props = defineProps(['datasets']);
const store = useStore();

const datasetRefs = ref([]);

const state = reactive({
  dataset: null,
  editModalVisible: false,
  deleteModalVisible: false,
});

function editDataset(dataset) {
  state.dataset = null;
  state.dataset = dataset;
  state.editModalVisible = true;
}

function deleteDataset(dataset) {
  state.dataset = null;
  state.dataset = dataset;
  state.deleteModalVisible = true;
}

const totalInvoiceAmount = computed(() => {
  return props.datasets.reduce((sum, dataset) => (dataset.invoiceAmount ? (sum += dataset.invoiceAmount) : sum), 0);
});

const totalActualAmount = computed(() => {
  return props.datasets.reduce((sum, dataset) => (dataset.actualAmount ? (sum += dataset.actualAmount) : sum), 0);
});

const totalDebitAmount = computed(() => {
  return props.datasets.reduce((sum, dataset) => (dataset.debitAmount ? (sum += dataset.debitAmount) : sum), 0);
});

const totalDiffAmount = computed(() => {
  return props.datasets.reduce((sum, dataset) => (dataset.diffAmount ? (sum += dataset.diffAmount) : sum), 0);
});

const totalMonthlyAmount = computed(() => {
  return props.datasets.reduce((sum, dataset) => (dataset.monthlyAmount ? (sum += dataset.monthlyAmount) : sum), 0);
});

const totalUpdateAmount = computed(() => {
  return props.datasets.reduce((sum, dataset) => (dataset.updateAmount ? (sum += dataset.updateAmount) : sum), 0);
});

const hasUpdateAmounts = computed(() => {
  return props.datasets.filter(dataset => !!dataset.updateAmount).length > 0;
});

function applyUpdate() {
  datasetRefs.value.map(datasetRef => datasetRef.applyUpdate());
}

function onSort(args) {
  //
}
</script>

<template>
  <ModalWindow
    :show="state.editModalVisible"
    @close="state.editModalVisible = false"
    @afterLeave="state.dataset = null"
  >
    <EditDataset
      v-if="state.dataset"
      :dataset="state.dataset"
      @close="state.editModalVisible = false"
    />
  </ModalWindow>

  <ModalWindow
    :show="state.deleteModalVisible"
    max-width="400px"
    @close="state.deleteModalVisible = false"
  >
    <DeleteDataset
      v-if="state.dataset"
      :dataset="state.dataset"
      @close="state.deleteModalVisible = false"
    />
  </ModalWindow>

  <div>
    <div class="list-head">
      <div class="prop title">
        <span>Titel</span>
      </div>
      <div class="prop text-right invoice-amount">Rg.-Betrag</div>
      <div class="prop text-right monthly-amount">Mtl. Betrag</div>
      <div class="prop invoice-date">Rg.-Datum</div>
      <div class="prop interval">Interval</div>
      <div class="prop update-amount">Update</div>
      <div class="prop text-right actual-amount">Ist</div>
      <div class="prop text-right debit-amount">Soll</div>
      <div class="prop text-right diff-amount">Differenz</div>
      <div class="prop buttons"></div>
    </div>

    <draggable
      :list="datasets"
      class="list"
      handle=".drag-handle"
      group="datasets"
      item-key="id"
      @change="onSort"
    >
      <template #item="{ element }">
        <DatasetItem
          :ref="el => datasetRefs.push(el)"
          :dataset="element"
          @delete="dataset => deleteDataset(dataset)"
          @edit="dataset => editDataset(dataset)"
        />
      </template>
    </draggable>

    <div class="list-footer">
      <div class="prop title"></div>
      <div class="prop text-right invoice-amount">
        <span class="label">Rg.-Betrag</span>
        <span>{{ toCurrency(totalInvoiceAmount) }}</span>
      </div>
      <div class="prop text-right monthly-amount">
        <span class="label">Mtl. Betrag</span>
        <span>{{ toCurrency(totalMonthlyAmount) }}</span>
      </div>
      <div class="prop invoice-date"></div>
      <div class="prop interval"></div>
      <div class="prop update-amount">
        <div class="grow flex flex-col xl:flex-row xl:items-center">
          <div class="grow py-2 xl:px-3 mr-2 text-right flex justify-between xl:justify-end">
            <span class="label">Update</span>
            <span>{{ toCurrency(totalUpdateAmount) }}</span>
          </div>
          <button
            @click="applyUpdate"
            :disabled="!hasUpdateAmounts"
            class="button self-end mt-2 my-0-xl"
            title="Update für alle Datensätze der Gruppe ausführen"
          >
            <CheckIcon class="w-5 h-5" />
          </button>
        </div>
      </div>
      <div class="prop text-right actual-amount">
        <span class="label">Ist</span>
        <span>{{ toCurrency(totalActualAmount) }}</span>
      </div>
      <div class="prop text-right debit-amount">
        <span class="label">Soll</span>
        <span>{{ toCurrency(totalDebitAmount) }}</span>
      </div>
      <div class="prop text-right diff-amount">
        <span class="label">Differenz</span>
        <span>{{ toCurrency(totalDiffAmount) }}</span>
      </div>
      <div class="prop grow-0 shrink-0 basis-[140px] buttons"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

.list {
  align-items: flex-start;
}

.list-head {
  display: none;
}

.list-footer {
  border-top: 1px solid $gray-100;
}
.list-footer .prop {
  @apply block;
}

.prop {
  display: flex;
  flex-grow: 1;
  justify-content: space-between;
  padding: 0.5rem 1rem;

  // &.collapsed {
  //   display: none;
  // }

  &.invoice-date,
  &.interval {
    display: none;
  }
}

.title {
  justify-content: flex-start;
  font-size: 1.5rem;
  line-height: 2rem;
}

.update-amount {
  .inner {
    display: flex;
  }
}

.icon {
  width: 1.25rem;
  height: 1.25rem;
  margin-left: auto;
  margin-right: auto;
}

@media (min-width: $sm) {
  .list {
    display: grid;
    // grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.75rem;
  }

  .title {
    flex-basis: 100%;
  }
}

@media (min-width: $lg) {
  .list {
    // grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (min-width: $xl) {
  .list {
    display: block;
  }

  .list-head,
  .list-footer {
    display: flex;
    font-weight: bold;
    align-items: center;
  }

  .list-footer {
    color: $gray-400;
  }

  .prop {
    // &.collapsed {
    //   display: block;
    // }

    &.invoice-date,
    &.interval {
      display: block;
    }
  }
  .title {
    flex-basis: auto;
    font-size: 1rem;
    line-height: 1.5rem;
  }

  .actual-amount,
  .debit-amount,
  .diff-amount,
  .invoice-amount,
  .monthly-amount,
  .invoice-date,
  .interval,
  .buttons {
    justify-content: flex-end;
    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: 140px;
  }

  .update-amount {
    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: 200px;
  }

  span.label {
    display: none;
  }
}
</style>
