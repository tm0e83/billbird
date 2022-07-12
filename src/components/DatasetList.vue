<script setup>
  import { computed, ref } from 'vue' ;
  import { useStore } from '@/stores/store.js' ;
  import { toCurrency } from './shared/functions.js';
  import DatasetItem from '@/components/DatasetItem.vue' ;
  const store = useStore();

  const datasetRefs = ref([]);

  const totalInvoiceAmount = computed(() => {
    return store.datasets.reduce((sum, dataset) => dataset.invoiceAmount ? sum += dataset.invoiceAmount : sum, 0);
  });

  const totalActualAmount = computed(() => {
    return store.datasets.reduce((sum, dataset) => dataset.actualAmount ? sum += dataset.actualAmount : sum, 0);
  });

  const totalDebitAmount = computed(() => {
    return store.datasets.reduce((sum, dataset) => dataset.debitAmount ? sum += dataset.debitAmount : sum, 0);
  });

  const totalDiffAmount = computed(() => {
    return datasetRefs.value.reduce((sum, datasetRef) => datasetRef.diffAmount ? sum += datasetRef.diffAmount : sum, 0);
  });

  const totalMonthlyAmount = computed(() => {
    return store.datasets.reduce((sum, dataset) => dataset.monthlyAmount ? sum += dataset.monthlyAmount : sum, 0);
  });

  const totalUpdateAmount = computed(() => {
    return datasetRefs.value.reduce((sum, datasetRef) => datasetRef.updateAmount ? sum += datasetRef.updateAmount : sum, 0);
  });

  function applyUpdate() {
    datasetRefs.value.map(datasetRef => datasetRef.applyUpdate());
  }
</script>

<template>
  <div>
    <div class="list-head">
      <div class="prop id">ID</div>
      <div class="prop title">Titel</div>
      <div class="prop invoice-amount">Rg.-Betrag</div>
      <div class="prop invoice-data">Rg.-Datum</div>
      <div class="prop interval">Interval</div>
      <div class="prop monthly-amount">Mtl. Betrag</div>
      <div class="prop update-amount">Update</div>
      <div class="prop actual-amount">Ist</div>
      <div class="prop debit-amount">Soll</div>
      <div class="prop diff-amount">Differenz</div>
      <div class="prop buttons"></div>
    </div>

    <div class="list">
      <DatasetItem
        v-for="dataset in store.datasets" ref="datasetRefs"
        :data="dataset"
        @delete="id => $emit('delete', id)"
        @edit="dataset => $emit('edit', dataset)"
      />
    </div>

    <div class="list-footer">
      <div class="prop id"></div>
      <div class="prop title"></div>
      <div class="prop invoice-amount">{{ toCurrency(totalInvoiceAmount) }}</div>
      <div class="prop invoice-data"></div>
      <div class="prop interval"></div>
      <div class="prop monthly-amount">{{ toCurrency(totalMonthlyAmount) }}</div>
      <div class="prop update-amount">
        {{ toCurrency(totalUpdateAmount) }}
        <button @click="applyUpdate">&raquo;</button>
      </div>
      <div class="prop actual-amount">{{ toCurrency(totalActualAmount) }}</div>
      <div class="prop debit-amount">{{ toCurrency(totalDebitAmount) }}</div>
      <div class="prop diff-amount">{{ toCurrency(totalDiffAmount) }}</div>
      <div class="prop buttons"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .list-head,
  .list-footer {
    display: flex;
    font-weight: bold;
  }

  .list-head {
    border-bottom: 1px solid #ccc;
  }

  .list-footer {
    border-top: 1px solid #ccc;
  }

  .prop {
    flex: 1;
    padding: 0.5rem;
  }
</style>