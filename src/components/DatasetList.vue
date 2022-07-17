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
    dataset: null,
    editModalVisible: false,
    deleteModalVisible: false
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
    return props.datagroup.datasets.reduce((sum, dataset) => dataset.updateAmount ? sum += dataset.updateAmount : sum, 0);
  });

  function applyUpdate() {
    datasetRefs.value.map(datasetRef => datasetRef.applyUpdate());
  }

  function closeEditModal() {
    state.editModalVisible = false;
    state.dataset = null;
  }
</script>

<template>
  <ModalWindow
    :show="state.editModalVisible"
    @close="closeEditModal()"
  >
    <EditDataset
      v-if="state.dataset"
      :dataset="state.dataset"
      @close="closeEditModal()"
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
    <div class="list-head font-bold flex items-center uppercase">
      <div class="prop flex-1 title">Titel</div>
      <div class="prop grow-0 shrink-0 basis-[140px] text-right invoice-amount">Rg.-Betrag</div>
      <div class="prop grow-0 shrink-0 basis-[140px] invoice-data">Rg.-Datum</div>
      <div class="prop grow-0 shrink-0 basis-[140px] interval">Interval</div>
      <div class="prop grow-0 shrink-0 basis-[140px] text-right monthly-amount">Mtl. Betrag</div>
      <div class="prop grow-0 shrink-0 basis-[200px] update-amount">Update</div>
      <div class="prop grow-0 shrink-0 basis-[140px] text-right actual-amount">Ist</div>
      <div class="prop grow-0 shrink-0 basis-[140px] text-right debit-amount">Soll</div>
      <div class="prop grow-0 shrink-0 basis-[140px] text-right diff-amount">Differenz</div>
      <div class="prop grow-0 shrink-0 basis-[140px] buttons"></div>
    </div>

    <div class="list">
      <DatasetItem
        v-for="dataset in datagroup.datasets" ref="datasetRefs"
        :dataset="dataset"
        @delete="dataset => deleteDataset(dataset)"
        @edit="dataset => editDataset(dataset)"
      />
    </div>

    <div class="list-footer font-bold flex items-center text-gray-400">
      <div class="prop flex-1 title"></div>
      <div class="prop grow-0 shrink-0 basis-[140px] text-right invoice-amount">{{ toCurrency(totalInvoiceAmount) }}</div>
      <div class="prop grow-0 shrink-0 basis-[140px] invoice-data"></div>
      <div class="prop grow-0 shrink-0 basis-[140px] interval"></div>
      <div class="prop grow-0 shrink-0 basis-[140px] text-right monthly-amount">{{ toCurrency(totalMonthlyAmount) }}</div>
      <div class="prop grow-0 shrink-0 basis-[200px] update-amount">
        <div class="flex">
          <div class="w-full py-2 px-6 text-right">{{ toCurrency(totalUpdateAmount) }}</div>
          <button
            @click="applyUpdate"
            :disabled="!totalUpdateAmount"
            class="button"
            title="Update für alle Datensätze der Gruppe ausführen"
          >
            <ChevronRightIcon class="w-5 h-5" />
          </button>
        </div>
      </div>
      <div class="prop grow-0 shrink-0 basis-[140px] text-right actual-amount">{{ toCurrency(totalActualAmount) }}</div>
      <div class="prop grow-0 shrink-0 basis-[140px] text-right debit-amount">{{ toCurrency(totalDebitAmount) }}</div>
      <div class="prop grow-0 shrink-0 basis-[140px] text-right diff-amount">{{ toCurrency(totalDiffAmount) }}</div>
      <div class="prop grow-0 shrink-0 basis-[140px] buttons"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .prop {
    @apply py-2 px-4;
  }
</style>