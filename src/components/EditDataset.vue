<script setup>
  import { reactive, toRaw, watch } from 'vue';
  import { useStore } from '@/stores/store.js' ;
  import { format } from 'date-fns' ;
  import { de } from 'date-fns/locale';
  import CurrencyInput from '@/components/CurrencyInput.vue';

  const store = useStore();
  const props = defineProps(['dataset']);
  const emit = defineEmits(['close']);

  let data = Object.assign({}, toRaw(props.dataset));
  let state = reactive({
    dataset: data,
    errors: [],
  });

  watch(() => props.dataset, (newData, oldData) => {
    data = Object.assign({}, toRaw(newData));
    state.dataset = data;
    state.errors = [];
  });

  function validate() {
    state.errors = [];

    if (!state.dataset.type) state.errors.push('type');
    if (!state.dataset.groupId) state.errors.push('groupId');
    if (!state.dataset.title) state.errors.push('title');

    if (state.dataset.type === 1) {
      if (!state.dataset.invoiceDate) state.errors.push('invoiceDate');
      if (!state.dataset.interval) state.errors.push('interval');
      if (isNaN(state.dataset.invoiceAmount)) state.errors.push('invoiceAmount');
    } else {
      if (isNaN(state.dataset.monthlyAmount)) state.errors.push('monthlyAmount');
    }

    return state.errors.length === 0;
  }

  function save() {
    const isValid = validate();

    if (!isValid) return;

    if (state.dataset.id === null) {
      state.dataset.id = store.nextDatasetId;
      store.addDataset(state.dataset);
    } else {
      store.replaceDataset(state.dataset);
    }

    emit('close');
  }

  function handleDate(invoiceDate) {
    state.dataset.invoiceDate = format(invoiceDate, 'yyyy-MM-dd');
  }
</script>

<template>
  <div>
    <div class="modal-head">
      <span v-if="state.dataset.id">Datensatz bearbeiten</span>
      <span v-else>Datensatz erstellen</span>
    </div>

    <div v-if="state.errors.length" class="errors">
      Ups! Ihre Eingaben sind unvollständig oder fehlerhaft. Bitte überprüfen Sie Ihre Eingaben.
    </div>

    <div class="mb-4">
      <label for="ds-new-type">Typ</label>
      <select id="ds-new-type" v-model.number="state.dataset.type">
        <option value="" style="display:none">Auswählen</option>
        <option value="1">Rechnung</option>
        <option value="2">Sparplan</option>
      </select>
    </div>

    <div v-if="state.dataset.type" class="mb-4">
      <div class="mb-4">
        <label for="ds-new-title">Titel</label>
        <input
          type="text"
          id="ds-new-title"
          v-model="state.dataset.title"
        >
      </div>

      <div class="mb-4">
        <label for="ds-new-group">Gruppe</label>
        <select id="ds-new-group" v-model.number="state.dataset.groupId">
          <option value="" style="display:none">Auswählen</option>
          <option v-for="datagroup in store.datagroups" :value="datagroup.id">{{ datagroup.title }}</option>
        </select>
      </div>

      <div v-if="state.dataset.type === 1">
        <div class="mb-4">
          <label for="ds-new-invoice-date">Rechnungsdatum</label>
          <Datepicker
            v-model="state.dataset.invoiceDate"
            @update:modelValue="handleDate"
            :enableTimePicker="false"
            locale="de-DE"
            :format-locale="de"
            format="dd.MM.yyyy"
            autoApply
          />
        </div>

        <div class="mb-4">
          <label for="ds-new-interval">Interval</label>
          <select id="ds-new-interval" v-model="state.dataset.interval">
            <option value="">Auswählen</option>
            <option value="quarter">Quartal</option>
            <option value="year">Jahr</option>
            <option value="2years">2 Jahre</option>
          </select>
        </div>

        <div class="mb-4">
          <label for="ds-new-invoice-amount">Rechnungsbetrag</label>
          <CurrencyInput
            v-model.number="state.dataset.invoiceAmount"
            :options="{ currency: 'EUR', locale: 'de-DE', autoDecimalDigits: true }"
            classes="w-full"
          />
        </div>
      </div>

      <div v-else>
        <div class="mb-4">
          <label for="ds-new-monthly-amount">Pro Monat</label>
          <CurrencyInput
            v-model.number="state.dataset.monthlyAmount"
            :options="{ currency: 'EUR', locale: 'de-DE', autoDecimalDigits: true }"
            classes="w-full"
          />
        </div>
      </div>
    </div>

    <div class="mt-2 flex justify-between">
      <button @click="$emit('close')" class="button hollow">Schließen</button>
      <button @click="save" class="button">Speichern</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .errors {
    @apply
      mb-4
      p-5
      text-red-700
      border
      border-red-700
      bg-red-100
      rounded;
  }
</style>