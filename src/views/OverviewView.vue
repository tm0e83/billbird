<script setup>
  import { reactive, onMounted } from 'vue';
  import { useStore } from '@/stores/store.js';
  import DatasetList from '@/components/DatasetList.vue';
  import EditDataset from '@/components/EditDataset.vue';
  import DeleteDataset from '@/components/DeleteDataset.vue';

  const store = useStore();

  const state = reactive({
    showModal: false,
    dataset: null,
    modalAction: ''
  });

  function createNew() {
    state.modalAction = 'edit';
    state.showModal = true;
    state.dataset = getNewDataset();
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

  function closeModal() {
    state.showModal = false;
  }

  function editDataset(dataset) {
    state.modalAction = 'edit';
    state.dataset = dataset;
    state.showModal = true;
  }

  function deleteDataset(dataset) {
    state.modalAction = 'delete';
    state.dataset = dataset;
    state.showModal = true;
  }

  onMounted(() => {
    fetch('/src/data/data.json')
      .then(response => response.json())
      .then(data => {
        const datasets = data.reduce((datasets, group) => {
          datasets = [...datasets, ...group.datasets];
          return datasets;
        }, []);

        store.setDatasets(datasets);
        store.setGroups(data);
      }).catch(e => {
        console.log(e);
      });
  });
</script>

<template>
  <div>
    <ModalWindow :show="state.showModal" @close="closeModal" />

    <EditDataset
      v-if="state.dataset && state.modalAction === 'edit'"
      :dataset="state.dataset"
      @close="closeModal"
    />

    <DeleteDataset
      v-if="state.dataset && state.modalAction === 'delete'"
      :dataset="state.dataset"
      @close="closeModal"
    />

    <DatasetList
      v-if="store.datasets.length"
      @delete="dataset => deleteDataset(dataset)"
      @edit="dataset => editDataset(dataset)"
    />
    <div v-else>Keine Datensätze vorhanden</div>

    <button @click="createNew" class="large mt-3">Neuer Datensatz</button>
  </div>
</template>