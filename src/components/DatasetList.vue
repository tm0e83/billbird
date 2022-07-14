<script setup>
  import { computed, reactive, ref } from 'vue' ;
  import { useStore } from '@/stores/store.js' ;
  import { toCurrency } from './shared/functions.js';
  import DatasetItem from '@/components/DatasetItem.vue' ;
  import EditDataset from '@/components/EditDataset.vue' ;
  import DeleteDataset from '@/components/DeleteDataset.vue' ;
  import { ChevronRightIcon } from '@heroicons/vue/solid';

  const props = defineProps(['datagroup']);
  const store = useStore();

  const datasetRefs = ref([]);

  const state = reactive({
    dataset: null
  });

  function editDataset(dataset) {
    state.dataset = dataset;
    store.showModal('editDataset');
  }

  function deleteDataset(dataset) {
    state.dataset = dataset;
    store.showModal('deleteDataset');
  }

  const totalInvoiceAmount = computed(() => {
    return props.datagroup.datasets.reduce((sum, dataset) => dataset.invoiceAmount ? sum += dataset.invoiceAmount : sum, 0);
  });

  const totalActualAmount = computed(() => {
    return props.datagroup.datasets.reduce((sum, dataset) => dataset.actualAmount ? sum += dataset.actualAmount : sum, 0);
  });

  const totalDebitAmount = computed(() => {
    return props.datagroup.datasets.reduce((sum, dataset) => dataset.debitAmount ? sum += dataset.debitAmount : sum, 0);
  });

  const totalDiffAmount = computed(() => {
    return datasetRefs.value.reduce((sum, datasetRef) => datasetRef.diffAmount ? sum += datasetRef.diffAmount : sum, 0);
  });

  const totalMonthlyAmount = computed(() => {
    return props.datagroup.datasets.reduce((sum, dataset) => dataset.monthlyAmount ? sum += dataset.monthlyAmount : sum, 0);
  });

  const totalUpdateAmount = computed(() => {
    return datasetRefs.value.reduce((sum, datasetRef) => datasetRef.updateAmount ? sum += datasetRef.updateAmount : sum, 0);
  });

  function applyUpdate() {
    datasetRefs.value.map(datasetRef => datasetRef.applyUpdate());
  }
</script>

<template>
  <EditDataset
    v-if="state.dataset && store.modalAction === 'editDataset'"
    :dataset="state.dataset"
  />

  <DeleteDataset
    v-if="state.dataset && store.modalAction === 'deleteDataset'"
    :dataset="state.dataset"
  />

  <div>
    <div class="list-head flex items-center">
      <div class="prop flex-1 title">Titel</div>
      <div class="prop flex-1 text-right invoice-amount">Rg.-Betrag</div>
      <div class="prop flex-1 invoice-data">Rg.-Datum</div>
      <div class="prop flex-1 interval">Interval</div>
      <div class="prop flex-1 text-right monthly-amount">Mtl. Betrag</div>
      <div class="prop flex-1 update-amount">Update</div>
      <div class="prop flex-1 text-right actual-amount">Ist</div>
      <div class="prop flex-1 text-right debit-amount">Soll</div>
      <div class="prop flex-1 text-right diff-amount">Differenz</div>
      <div class="prop flex-0 min-w-[135px] buttons"></div>
    </div>

    <div class="list">
      <DatasetItem
        v-for="dataset in datagroup.datasets" ref="datasetRefs"
        :data="dataset"
        @delete="dataset => deleteDataset(dataset)"
        @edit="dataset => editDataset(dataset)"
      />
    </div>

    <div class="list-footer flex items-center">
      <div class="prop flex-1 title"></div>
      <div class="prop flex-1 text-right invoice-amount">{{ toCurrency(totalInvoiceAmount) }}</div>
      <div class="prop flex-1 invoice-data"></div>
      <div class="prop flex-1 interval"></div>
      <div class="prop flex-1 text-right monthly-amount">{{ toCurrency(totalMonthlyAmount) }}</div>
      <div class="prop flex-1 update-amount">
        <div class="flex">
          <div class="w-full py-2 px-3 text-right">{{ toCurrency(totalUpdateAmount) }}</div>
          <button @click="applyUpdate">
            <ChevronRightIcon class="w-5 h-5" />
          </button>
        </div>
      </div>
      <div class="prop flex-1 text-right actual-amount">{{ toCurrency(totalActualAmount) }}</div>
      <div class="prop flex-1 text-right debit-amount">{{ toCurrency(totalDebitAmount) }}</div>
      <div class="prop flex-1 text-right diff-amount">{{ toCurrency(totalDiffAmount) }}</div>
      <div class="prop flex-0 min-w-[135px] buttons"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .list-head,
  .list-footer {
    font-weight: bold;
  }

  .list-head {
    border-bottom: 1px solid #ccc;
  }

  .list-footer {
    border-top: 1px solid #ccc;
  }

  .prop {
    @apply py-2 px-4;
  }
</style>