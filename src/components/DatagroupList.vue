<script setup>
  import { reactive } from 'vue' ;
  import { useStore } from '@/stores/store.js' ;
  import DatagroupItem from '@/components/DatagroupItem.vue' ;
  import EditDataset from '@/components/EditDataset.vue';
  import EditDatagroup from '@/components/EditDatagroup.vue';
  import DeleteDatagroup from '@/components/DeleteDatagroup.vue';
  import { toCurrency } from './shared/functions.js';
  import { ChevronRightIcon, PlusIcon } from '@heroicons/vue/solid';

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
    console.log('update all');
  }

  // @delete="datagroup => deleteDatagroup(datagroup)"
  // @edit="datagroup => editDatagroup(datagroup)"
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

    <div class="list-footer flex items-center font-bold border bg-white rounded">
      <div class="prop flex-1 title">Summe</div>
      <div class="prop flex-1 text-right invoice-amount">{{ toCurrency(store.totalInvoiceAmount) }}</div>
      <div class="prop flex-1 invoice-date"></div>
      <div class="prop flex-1 interval"></div>
      <div class="prop flex-1 text-right monthly-amount">{{ toCurrency(store.totalMonthlyAmount) }}</div>
      <div class="prop flex-1 update-amount">
      <div class="flex">
        <div class="w-full py-2 px-6 text-right">
          {{ toCurrency(store.totalUpdateAmount) }}
        </div>
        <button @click="applyUpdate">
          <ChevronRightIcon class="w-5 h-5" />
        </button>
      </div>
      </div>
      <div class="prop flex-1 text-right actual-amount">{{ toCurrency(store.totalActualAmount) }}</div>
      <div class="prop flex-1 text-right debit-amount">{{ toCurrency(store.totalDebitAmount) }}</div>
      <div class="prop flex-1 text-right diff-amount">{{ toCurrency(store.totalDiffAmount) }}</div>
      <div class="prop flex-0 min-w-[135px] buttons"></div>
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
  .prop {
    @apply py-2 px-4;
  }
</style>