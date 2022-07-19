<script setup>
  import { onMounted } from 'vue';
  import { useStore } from '@/stores/store.js';
  import DatagroupList from '@/components/DatagroupList.vue' ;
  import { format } from 'date-fns' ;
  import { DownloadIcon, UploadIcon } from 'vue-tabler-icons';

  const store = useStore();

  onMounted(() => {
    fetch('/src/data/data.json')
      .then(response => response.json())
      .then(data => {
        store.setDatagroups(data.datagroups);
        store.setDatasets(data.datasets);
      })
      .catch(e => {
        console.log(e);
      });
  });

  function loadData() {
    const fileInput = document.createElement('input');
    fileInput.setAttribute('type', 'file');

    fileInput.addEventListener('change', e => {
      const reader = new FileReader();
      reader.onload = event => {
        const json = JSON.parse(event.target.result);
        store.setDatagroups(json.datagroups);
        store.setDatasets(json.datasets);
      };
      reader.readAsText(event.target.files[0]);
    })

    fileInput.click();
  }

  function downloadAsJSON() {
    const a = document.createElement('a');
    const file = new Blob([JSON.stringify(store.datagroups)], { type: 'text/plain' });
    a.href = URL.createObjectURL(file);
    a.download = `billbird-data-${format(new Date(), 'yyyy-MM-dd')}.json`;
    a.click();
  }
</script>

<template>
  <div class="mt-8 max-w-[2000px] mx-auto">
    <nav>
      <ul class="flex gap-7 mb-3">
        <li>
          <a @click="downloadAsJSON" class="flex gap-1">
            <DownloadIcon />
            JSON herunterladen
          </a>
        </li>
        <li>
          <a @click="loadData" class="flex gap-1">
            <UploadIcon />
            JSON laden
          </a>
        </li>
      </ul>
    </nav>
    <DatagroupList v-if="store.datagroups.length" />
    <div v-else>Keine Datensätze vorhanden</div>
  </div>
</template>