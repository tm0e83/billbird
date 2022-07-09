<script setup>
  import { reactive, onMounted } from 'vue';
  import { useStore } from '@/stores/store.js';
  import DatasetList from '@/components/DatasetList.vue';
  import EditDataset from '@/components/EditDataset.vue';

  const store = useStore();

  function createNew() {
    console.log('Create new dataset');
    state.showModal = true;
    state.dataset = getNewDataset();
  }

  function getNewDataset() {
    return {
      title: '',
      id: getNextId()
    }
  }

  function getNextId() {
    return 1;
  }

  function closeModal() {
    state.showModal = false;
  }

  function editDataset(dataset) {
    console.log('edit dataset', dataset);
    state.dataset = dataset;
    state.showModal = true;
  }

  onMounted(() => {
    fetch('/src/data/data.json')
      .then(response => response.json())
      .then(jsonArr => {
        store.setDatasets(jsonArr);
      })
      .catch(e => {
        console.log(e);
      })
  });

  const state = reactive({
    showModal: false,
    dataset: getNewDataset()
  });
</script>

<template>
  <div>
    <ModalWindow :show="state.showModal" @close="closeModal">
      <EditDataset :dataset="state.dataset" @close="closeModal" />
    </ModalWindow>

    <DatasetList
      @delete="id => deleteDataset(id)"
      @edit="dataset => editDataset(dataset)"
    />

    <button @click="createNew" class="large mt-3">Neuer Datensatz</button>
  </div>
</template>
