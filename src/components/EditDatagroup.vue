<script setup>
  import { reactive, toRaw, watch } from 'vue';
  import { useStore } from '@/stores/store.js' ;

  const store = useStore();
  const props = defineProps(['datagroup']);

  let data = Object.assign({}, toRaw(props.datagroup));
  let state = reactive({
    datagroup: data,
    errors: []
  });

  watch(() => props.datagroup, (newData, oldData) => {
    data = Object.assign({}, toRaw(newData));
    state.datagroup = data;
  });

  function validate() {
    state.errors = [];

    if (!state.datagroup.title) state.errors.push('title');

    return state.errors.length === 0;
  }

  function save() {
    const isValid = validate();

    if (!isValid) return;

    if (state.datagroup.id === null) {
      state.datagroup.id = store.nextDatagroupId;

      store.addDatagroup(state.datagroup);
    } else {
      store.replaceDatagroup(state.datagroup);
    }

    store.hideModal();
  }
</script>

<template>
  <Teleport to=".modal-inner">
    <div>
      <div class="modal-head">
        <span v-if="state.datagroup.id">Datengruppe bearbeiten</span>
        <span v-else>Datengruppe erstellen</span>
      </div>

      <div v-if="state.errors.length" class="error">
        Ups! Ihre Eingaben sind fehlerhaft. Bitte überprüfen Sie die markierten Felder.
      </div>

      <div>
        <label for="ds-new-title">Titel</label>
        <input
          type="text"
          id="ds-new-title"
          v-model="state.datagroup.title"
        >
      </div>

      <div class="mt-4 flex justify-between">
        <button @click="store.setModalVisibility(false)" class="hollow">Schließen</button>
        <button @click="save">Speichern</button>
      </div>
    </div>
  </Teleport>
</template>

<style lang="scss" scoped>
</style>