<script setup>
  import { reactive } from 'vue' ;
  import { useStore } from '@/stores/store.js' ;
  import DatagroupItem from '@/components/DatagroupItem.vue' ;
  import EditDataset from '@/components/EditDataset.vue';
  import EditDatagroup from '@/components/EditDatagroup.vue';
  import DeleteDatagroup from '@/components/DeleteDatagroup.vue';
  import { toCurrency } from './shared/functions.js';
  import { CheckIcon, PlusIcon } from '@heroicons/vue/solid';

  const store = useStore();

  const state = reactive({
    dataset: null,
    datagroup: null,
    editDatasetModalVisible: false,
    editDatagroupModalVisible: false,
    deleteDatagroupModalVisible: false
  });

  function editDatagroup(datagroup) {
    state.datagroup = datagroup;
    state.editDatagroupModalVisible = true;
  }

  function deleteDatagroup(datagroup) {
    state.datagroup = datagroup;
    state.deleteDatagroupModalVisible = true;
  }

  function createNewDatagroup() {
    state.datagroup = getNewDatagroup();
    state.editDatagroupModalVisible = true;
  }

  function createNewDataset() {
    state.dataset = getNewDataset();
    state.editDatasetModalVisible = true;
  }

  function getNewDatagroup() {
    return {
      datasets: [],
      id: null,
      title: '',
    }
  }

  function getNewDataset() {
    return {
      actualAmount: 0,
      debitAmount: 0,
      id: null,
      interval: '',
      invoiceAmount: null,
      invoiceDate: null,
      lastInvoiceDate: null,
      lastUpdateDate: null,
      monthlyAmount: 0,
      title: '',
      type: ''
    }
  }

  function applyUpdate() {
    store.datasets.map(dataset => {
      store.addActualAmount(dataset.id, dataset.updateAmount);
      store.setUpdateAmount(dataset.id, null);
    });
  }
</script>

<template>
  <div>
    <ModalWindow :show="state.editDatasetModalVisible" @close="state.editDatasetModalVisible = false">
      <EditDataset
        v-if="state.dataset"
        :dataset="state.dataset"
        @close="state.editDatasetModalVisible = false"
      />
    </ModalWindow>

  <ModalWindow :show="state.editDatagroupModalVisible" @close="state.editDatagroupModalVisible = false">
    <EditDatagroup
      v-if="state.datagroup"
      :datagroup="state.datagroup"
      @close="state.editDatagroupModalVisible = false"
    />
  </ModalWindow>

  <ModalWindow
    :show="state.deleteDatagroupModalVisible"
    max-width="400px"
    @close="state.deleteDatagroupModalVisible = false"
  >
    <DeleteDatagroup
      v-if="state.datagroup"
      :datagroup="state.datagroup"
      @close="state.deleteDatagroupModalVisible = false"
    />
  </ModalWindow>

    <div class="list">
      <DatagroupItem
        v-for="datagroup in store.datagroups"
        :datagroup="datagroup"
        @edit="datagroup => editDatagroup(datagroup)"
        @delete="datagroup => deleteDatagroup(datagroup)"
      />
    </div>

    <div class="list-footer">
      <div class="prop flex-1 title">Summe</div>
      <div class="prop grow-0 shrink-0 basis-[140px] text-right invoice-amount">{{ toCurrency(store.totalInvoiceAmount) }}</div>
      <div class="prop grow-0 shrink-0 basis-[140px] text-right monthly-amount">{{ toCurrency(store.totalMonthlyAmount) }}</div>
      <div class="prop grow-0 shrink-0 basis-[140px] invoice-date"></div>
      <div class="prop grow-0 shrink-0 basis-[140px] interval"></div>
      <div class="prop grow-0 shrink-0 basis-[200px] update-amount">
        <div class="flex grow">
          <div class="grow py-2 px-6 text-right">
            {{ toCurrency(store.totalUpdateAmount) }}
          </div>
          <button @click="applyUpdate" :disabled="!store.totalUpdateAmount" class="button">
            <CheckIcon class="icon" />
          </button>
        </div>
      </div>
      <div class="prop grow-0 shrink-0 basis-[140px] text-right actual-amount">{{ toCurrency(store.totalActualAmount) }}</div>
      <div class="prop grow-0 shrink-0 basis-[140px] text-right debit-amount">{{ toCurrency(store.totalDebitAmount) }}</div>
      <div class="prop grow-0 shrink-0 basis-[140px] text-right diff-amount">{{ toCurrency(store.totalDiffAmount) }}</div>
      <div class="prop grow-0 shrink-0 basis-[140px] buttons"></div>
    </div>

    <button @click="createNewDatagroup" class="button large mt-3 md:mr-3 inline-flex items-center">
      <PlusIcon class="h-5 w-5 mr-2" />
      Neue Datengruppe
    </button>
    <button @click="createNewDataset" class="button large mt-3 inline-flex items-center">
      <PlusIcon class="h-5 w-5 mr-2" />
      Neuer Datensatz
    </button>
  </div>
</template>

<style lang="scss" scoped>
  .list-footer {
    @apply
      hidden
      2xl:items-center
      2xl:font-bold
      2xl:bg-white
      2xl:rounded
      2xl:flex
      2xl:flex;
  }

  .prop {
    @apply py-2 px-4;
  }

  .icon {
    @apply
      w-5
      h-5
      mx-auto;
  }
</style>