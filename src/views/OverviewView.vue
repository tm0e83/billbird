<script setup>
  import { onMounted, reactive, ref } from 'vue';
  import { useStore } from '@/stores/store.js';
  import DatagroupList from '@/components/DatagroupList.vue' ;
  import EditDataset from '@/components/EditDataset.vue';
  import EditDatagroup from '@/components/EditDatagroup.vue';
  import DeleteDatagroup from '@/components/DeleteDatagroup.vue';
  import DropdownMenu from '@/components/DropdownMenu.vue';
  import { format } from 'date-fns' ;
  import { DotsVerticalIcon, DownloadIcon, PlusIcon, UploadIcon } from 'vue-tabler-icons';

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

  function loadData() {
    const fileInput = document.createElement('input');
    fileInput.setAttribute('type', 'file');

    fileInput.addEventListener('change', e => {
      const reader = new FileReader();

      reader.onload = event => {
        const resultJSON = JSON.parse(event.target.result)
        store.datagroups = resultJSON.datagroups;
      };

      reader.readAsText(event.target.files[0]);
    })

    fileInput.click();
  }

  function downloadAsJSON() {
    const a = document.createElement('a');
    const file = new Blob([JSON.stringify({ datagroups: store.datagroups })], { type: 'text/plain' });

    a.href = URL.createObjectURL(file);
    a.download = `billbird-data-${format(new Date(), 'yyyy-MM-dd')}.json`;
    a.click();
  }

  onMounted(() => {
    fetch('/timo.json')
    .then(response => response.json())
    .then(data => store.datagroups = data.datagroups)
    .catch(e => {
      fetch('/data.json')
        .then(response => response.json())
        .then(data => store.datagroups = data.datagroups)
        .catch(e => {
          console.log(e);
        });
    });
  });

  const menuItems = ref([
    {
      label: 'JSON herunterladen',
      onClick: () => downloadAsJSON()
    },
    {
      label: 'JSON laden',
      onClick: () => loadData()
    },
    {
      label: 'Neue Datengruppe',
      onClick: () => createNewDatagroup()
    },
    {
      label: 'Neuer Datensatz',
      onClick: () => createNewDataset()
    }
  ]);
</script>

<template>
  <div class="mt-8 max-w-[2000px] mx-auto">

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

    <div class="flex justify-end md:hidden mb-3">
      <DropdownMenu :menuItems="menuItems">
        <DotsVerticalIcon />
      </DropdownMenu>
    </div>

    <nav>
      <ul class="hidden md:flex flex-col flex-wrap gap-3 md:flex-row md:gap-7 mb-3">
        <li>
          <a @click="downloadAsJSON" class="flex gap-1">
            <DownloadIcon />
            <span>JSON herunterladen</span>
          </a>
        </li>
        <li>
          <a @click="loadData" class="flex gap-1">
            <UploadIcon />
            <span>JSON laden</span>
          </a>
        </li>
        <li>
          <a @click="createNewDatagroup" class="flex gap-1">
            <PlusIcon />
            <span>Neue Datengruppe</span>
          </a>
        </li>
        <li>
          <a @click="createNewDataset" class="flex gap-1">
            <PlusIcon />
            <span>Neue Datensatz</span>
          </a>
        </li>
      </ul>
    </nav>

    <DatagroupList
      v-if="store.datagroups.length"
      @editDatagroup="datagroup => editDatagroup(datagroup)"
      @deleteDatagroup="datagroup => deleteDatagroup(datagroup)"
    />
    <div v-else>
      <p>Keine Datensätze vorhanden</p>
    </div>

    <button @click="createNewDatagroup" class="w-full button large mt-3 sm:w-auto sm:mr-3 inline-flex justify-center items-center">
      <PlusIcon class="h-5 w-5 mr-2" />
      Neue Datengruppe
    </button>
    <button @click="createNewDataset" class="w-full button large mt-3 sm:w-auto inline-flex justify-center items-center">
      <PlusIcon class="h-5 w-5 mr-2" />
      Neuer Datensatz
    </button>
  </div>
</template>

<style lang="scss" scoped>
</style>