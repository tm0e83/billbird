<script setup>
  import { computed, onBeforeUpdate, onMounted, ref } from 'vue';
  import intervals from './shared/intervals.json';
  import { toCurrency } from './shared/functions.js';

  import { useStore } from '@/stores/store.js' ;
  import { format } from 'date-fns' ;
  import { ChevronRightIcon, PencilAltIcon, TrashIcon } from '@heroicons/vue/solid';
  import CurrencyInput from '@/components/CurrencyInput.vue';

  const props = defineProps(['data']);
  const store = useStore();

  const intervalName = computed(() => props.data.type === 1 ? intervals[props.data.interval].name : '');
  const isPositiveDiff = computed(() => props.data.diffAmount > 0);
  const isNegativeDiff = computed(() => props.data.diffAmount < 0);

  function isValidDate(date) {
    return date instanceof Date && date.getTime();
  }

  function updateInvoiceDates() {
    let invoiceDate = new Date(props.data.invoiceDate);

    if (isValidDate(invoiceDate)) {
      if (invoiceDate < store.currentDate) {
        store.setLastInvoiceDate(props.data.id, format(invoiceDate, 'yyyy-MM-dd'));
        const monthsPerInterval = intervals[props.data.interval].months;
        invoiceDate.setMonth(invoiceDate.getMonth() + monthsPerInterval);
        store.setInvoiceDate(props.data.id, format(invoiceDate, 'yyyy-MM-dd'));
      }
    }
  }

  function calculateMonthlyAmount() {
    if (props.data.type === 1) {
      store.setMonthlyAmount(props.data.id, props.data.invoiceAmount / intervals[props.data.interval].months);
    }
  }

  function calculateDebitAmount() {
    if (props.data.type !== 1) {
      store.setDebitAmount(props.data.id, props.data.actualAmount);
    } else {
      let invoiceDate = new Date(props.data.invoiceDate);
      if (isValidDate(invoiceDate)) {
        const monthsBetween = getMonthDifference(store.currentDate, invoiceDate);
        const pastIntervalMonths = intervals[props.data.interval].months - monthsBetween;
        store.setDebitAmount(props.data.id, pastIntervalMonths * props.data.monthlyAmount);
      }
    }
  }

  function calculateDiffAmount() {
    store.setDiffAmount(props.data.id, props.data.actualAmount - props.data.debitAmount);
  }

  function getMonthDifference(startDate, endDate) {
    return (
      endDate.getMonth() -
      startDate.getMonth() +
      12 * (endDate.getFullYear() - startDate.getFullYear())
    );
  }

  function applyUpdate() {
    store.setActualAmount(props.data.id, props.data.updateAmount);
    calculateDebitAmount();
    calculateDiffAmount();
    store.setUpdateAmount(props.data.id, null);
  }

  onMounted(() => {
    updateInvoiceDates();
    calculateMonthlyAmount();
    calculateDebitAmount();
    calculateDiffAmount();
  });

  onBeforeUpdate(() => {
    updateInvoiceDates();
    calculateMonthlyAmount();
    calculateDebitAmount();
    calculateDiffAmount();
  });

  defineExpose({
    applyUpdate
  });
</script>

<template>
  <div class="dataset odd:bg-gray-100 even:bg-gray-125 flex items-center">
    <div class="prop flex-1 title">{{ data.title }}</div>
    <div class="prop flex-1 text-right invoice-amount">
      <span v-if="data.invoiceAmount">
      {{ toCurrency(data.invoiceAmount) }}
      </span>
    </div>
    <div class="prop flex-1 invoice-data">
      <span v-if="data.invoiceDate">
        {{ format(new Date(data.invoiceDate), 'dd.MM.yyyy') }}
      </span>
    </div>
    <div class="prop flex-1 interval">{{ intervalName }}</div>
    <div class="prop flex-1 text-right monthly-amount">{{ toCurrency(data.monthlyAmount) }}</div>
    <div class="prop flex-1 update-amount">
      <div class="flex">
        <CurrencyInput
          v-model="data.updateAmount"
          :options="{ currency: 'EUR', locale: 'de-DE', autoDecimalDigits: true }"
          classes="w-full text-right"
        />
        <button @click="applyUpdate">
          <ChevronRightIcon class="w-5 h-5" />
        </button>
      </div>
    </div>
    <div class="prop flex-1 text-right actual-amount">{{ toCurrency(data.actualAmount) }}</div>
    <div class="prop flex-1 text-right debit-amount">{{ toCurrency(data.debitAmount) }}</div>
    <div class="prop flex-1 text-right diff-amount" :class="{ 'text-green-600': isPositiveDiff, 'text-red-600': isNegativeDiff }">
      {{ toCurrency(data.diffAmount) }}
    </div>
    <div class="prop flex-0 min-w-[135px] buttons">
      <div class="flex justify-end">
        <button @click="$emit('delete', data)" class="alert flex items-center mr-3" title="Löschen">
          <TrashIcon class="w-5 h-5" />
        </button>
        <button @click="$emit('edit', data)" class="flex items-center" title="Bearbeiten">
          <PencilAltIcon class="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .positive {
    color: green;
  }

  .negative {
    color: red;
  }

  .prop {
    @apply py-2 px-4;
  }
</style>