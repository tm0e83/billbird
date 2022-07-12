<script setup>
  import { reactive, toRaw, watch } from 'vue';
  import intervals from './shared/intervals.json';
  import { useStore } from '@/stores/store.js' ;
  import { format } from 'date-fns' ;

  const store = useStore();
  const props = defineProps(['dataset']);
  const emit = defineEmits(['close']);

  let data = Object.assign({}, toRaw(props.dataset));
  let state = reactive({ dataset: data });

  watch(() => props.dataset, (newData, oldData) => {
    data = Object.assign({}, toRaw(newData));
    state.dataset = data;
  });

  function getNextId() {
    if (!store.datasets.length) return 0;
    return Math.max(...store.datasets.map(dataset => dataset.id)) + 1;
  }

  function save() {
    if (state.dataset.id === null) {
      state.dataset.id = getNextId();

      if (state.dataset.type === 1) {
        state.dataset.monthlyAmount = state.dataset.invoiceAmount / intervals[state.dataset.interval].months;
      }

      store.addDataset(state.dataset);
    } else {
      store.updateDataset(state.dataset);
      console.log('updated', state.dataset);
    }

    emit('close');
  }

  function handleDate(invoiceDate) {
    state.dataset.invoiceDate = format(invoiceDate, 'yyyy-MM-dd');
  }
</script>

<template>
  <Teleport to=".modal-inner">
    <div>
      <div>
        <span v-if="state.dataset.id">Datensatz bearbeiten</span>
        <span v-else>Datensatz erstellen</span>
      </div>

      <div>
        <label for="ds-new-type">Typ</label>
        <select id="ds-new-type" v-model.number="state.dataset.type">
          <option value="">Auswählen</option>
          <option value="1">Rechnung</option>
          <option value="2">Sparplan</option>
        </select>
      </div>

      <div v-if="state.dataset.type">
        <div>
          <label for="ds-new-title">Titel</label>
          <input
            type="text"
            id="ds-new-title"
            v-model="state.dataset.title"
          >
        </div>

        <div v-if="state.dataset.type === 1">
          <div>
            <label for="ds-new-invoice-date">Rechnungsdatum</label>
            <Datepicker
              v-model="state.dataset.invoiceDate"
              @update:modelValue="handleDate"
              autoApply
            />
          </div>
          <div>
            <label for="ds-new-interval">Interval</label>
            <select id="ds-new-interval" v-model="state.dataset.interval">
              <option value="">Auswählen</option>
              <option value="quarter">Quartal</option>
              <option value="year">Jahr</option>
              <option value="2years">2 Jahre</option>
            </select>
          </div>
          <div>
            <label for="ds-new-invoice-amount">Rechnungsbetrag</label>
            <input
              type="text"
              id="ds-new-invoice-amount"
              v-model.number="state.dataset.invoiceAmount"
            >
          </div>
        </div>
        <div v-else>
          <div>
            <label for="ds-new-monthly-amount">Pro Monat</label>
            <input
              type="text"
              id="ds-new-monthly-amount"
              v-model="state.dataset.monthlyAmount"
            >
          </div>
        </div>
      </div>

      <button @click="$emit('close')">Schließen</button>
      <button @click="save" v-if="state.dataset.type">Speichern</button>
    </div>
  </Teleport>
</template>

<style lang="scss" scoped>

</style>