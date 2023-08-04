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
        {{ toCurrency(totalInvoiceAmount) }}
      </div>
      <div class="prop text-right monthly-amount">
        {{ toCurrency(totalMonthlyAmount) }}
      </div>
      <div class="prop invoice-date"></div>
      <div class="prop interval"></div>
      <div class="prop update-amount">
        <div class="flex grow">
          <div class="grow py-2 px-3 mr-2 border border-transparent text-right">
            {{ toCurrency(totalUpdateAmount) }}
          </div>
          <button
            @click="applyUpdate"
            :disabled="!hasUpdateAmounts"
            class="button"
            title="Update für alle Datensätze der Gruppe ausführen"
          >
            <CheckIcon class="w-5 h-5" />
          </button>
        </div>
      </div>
      <div class="prop text-right text-right actual-amount">
        {{ toCurrency(totalActualAmount) }}
      </div>
      <div class="prop text-right text-right debit-amount">
        {{ toCurrency(totalDebitAmount) }}
      </div>
      <div class="prop text-right text-right diff-amount">
        {{ toCurrency(totalDiffAmount) }}
      </div>
      <div class="prop grow-0 shrink-0 basis-[140px] buttons"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.list {
  @apply items-start
      sm:grid
      sm:grid-cols-2
      lg:grid-cols-3
      2xl:block
      sm:gap-3;
}

.list-head,
.list-footer {
  @apply 2xl:font-bold
      2xl:flex
      2xl:items-center;
}

.list-footer {
  @apply 2xl:text-gray-400
      border-t
      border-t-gray-100;
}
.list-footer .prop {
  @apply block;
}

.prop {
  @apply flex
      grow
      justify-between
      px-4
      py-2;

  &.collapsed {
    @apply hidden 2xl:block;
  }
}

.title {
  @apply justify-start
      text-2xl
      sm:basis-full
      2xl:basis-auto
      2xl:text-base;
}

.actual-amount,
.debit-amount,
.diff-amount,
.invoice-amount,
.monthly-amount,
.invoice-date,
.interval,
.buttons {
  @apply 2xl:justify-end
      2xl:grow-0
      2xl:shrink-0
      2xl:basis-[140px];
}

.update-amount {
  @apply 2xl:grow-0
      2xl:shrink-0
      2xl:basis-[200px];

  .inner {
    @apply flex;
  }
}

.icon {
  @apply w-5
      h-5
      mx-auto;
}
</style>
