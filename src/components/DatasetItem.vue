<script setup>
  import { computed, onBeforeUpdate, onMounted, ref } from 'vue';
  import intervals from './shared/intervals.json';
  import { toCurrency } from './shared/functions.js';

  import { useStore } from '@/stores/store.js' ;
  import { format } from 'date-fns' ;
  import { ChevronRightIcon, PencilAltIcon, TrashIcon } from '@heroicons/vue/solid';
  import CurrencyInput from '@/components/CurrencyInput.vue';

  const props = defineProps(['dataset']);
  const store = useStore();

  const intervalName = computed(() => props.dataset.type === 1 ? intervals[props.dataset.interval].name : '');
  const isPositiveDiff = computed(() => props.dataset.diffAmount > 0);
  const isNegativeDiff = computed(() => props.dataset.diffAmount < 0);

  function isValidDate(date) {
    return date instanceof Date && date.getTime();
  }

  function updateInvoiceDates() {
    let invoiceDate = new Date(props.dataset.invoiceDate);

    if (isValidDate(invoiceDate)) {
      if (invoiceDate < store.currentDate) {
        store.setLastInvoiceDate(props.dataset.id, format(invoiceDate, 'yyyy-MM-dd'));
        const monthsPerInterval = intervals[props.dataset.interval].months;
        invoiceDate.setMonth(invoiceDate.getMonth() + monthsPerInterval);
        store.setInvoiceDate(props.dataset.id, format(invoiceDate, 'yyyy-MM-dd'));
      }
    }
  }

  function calculateMonthlyAmount() {
    if (props.dataset.type === 1) {
      store.setMonthlyAmount(props.dataset.id, props.dataset.invoiceAmount / intervals[props.dataset.interval].months);
    }
  }

  function calculateDebitAmount() {
    if (props.dataset.type !== 1) {
      store.setDebitAmount(props.dataset.id, props.dataset.actualAmount);
    } else {
      let invoiceDate = new Date(props.dataset.invoiceDate);
      if (isValidDate(invoiceDate)) {
        const monthsBetween = getMonthDifference(store.currentDate, invoiceDate);
        const pastIntervalMonths = intervals[props.dataset.interval].months - monthsBetween;
        store.setDebitAmount(props.dataset.id, pastIntervalMonths * props.dataset.monthlyAmount);
      }
    }
  }

  function calculateDiffAmount() {
    store.setDiffAmount(props.dataset.id, props.dataset.actualAmount - props.dataset.debitAmount);
  }

  function getMonthDifference(startDate, endDate) {
    return (
      endDate.getMonth() -
      startDate.getMonth() +
      12 * (endDate.getFullYear() - startDate.getFullYear())
    );
  }

  function applyUpdate() {
    store.setActualAmount(props.dataset.id, props.dataset.updateAmount);
    calculateDebitAmount();
    calculateDiffAmount();
    store.setUpdateAmount(props.dataset.id, null);
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
  <div class="dataset border-t last:border-b border-gray-100 flex items-center">
    <div class="prop flex-1 title">{{ dataset.title }}</div>
    <div class="prop flex-1 text-right invoice-amount">
      <span v-if="dataset.invoiceAmount">
      {{ toCurrency(dataset.invoiceAmount) }}
      </span>
    </div>
    <div class="prop flex-1 invoice-data">
      <span v-if="dataset.invoiceDate">
        {{ format(new Date(dataset.invoiceDate), 'dd.MM.yyyy') }}
      </span>
    </div>
    <div class="prop flex-1 interval">{{ intervalName }}</div>
    <div class="prop flex-1 text-right monthly-amount">{{ toCurrency(dataset.monthlyAmount) }}</div>
    <div class="prop flex-1 update-amount">
      <div class="flex">
        <CurrencyInput
          v-model="dataset.updateAmount"
          :options="{ currency: 'EUR', locale: 'de-DE', autoDecimalDigits: true }"
          classes="w-full text-right mr-3"
        />
        <button @click="applyUpdate" :disabled="!dataset.updateAmount" class="button">
          <ChevronRightIcon class="w-5 h-5" />
        </button>
      </div>
    </div>
    <div class="prop flex-1 text-right actual-amount">{{ toCurrency(dataset.actualAmount) }}</div>
    <div class="prop flex-1 text-right debit-amount">{{ toCurrency(dataset.debitAmount) }}</div>
    <div class="prop flex-1 text-right diff-amount" :class="{ 'text-green-600': isPositiveDiff, 'text-red-600': isNegativeDiff }">
      {{ toCurrency(dataset.diffAmount) }}
    </div>
    <div class="prop flex-0 min-w-[135px] buttons">
      <div class="flex justify-end">
        <button @click="$emit('delete', dataset)" class="icon-button alert flex items-center mr-3" title="Löschen">
          <TrashIcon class="w-5 h-5" />
        </button>
        <button @click="$emit('edit', dataset)" class="icon-button flex items-center" title="Bearbeiten">
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