<script setup>
  import { computed, onBeforeUpdate, onMounted, ref } from 'vue';
  import intervals from './shared/intervals.json';
  import { toCurrency } from './shared/functions.js';

  import { useStore } from '@/stores/store.js' ;
  import { format } from 'date-fns' ;

  const props = defineProps(['data']);
  const store = useStore();

  const updateAmount = ref(null);
  const debitAmount = ref(0);
  const diffAmount = ref(0);

  const intervalName = computed(() => props.data.type === 1 ? intervals[props.data.interval].name : '');
  const isPositiveDiff = computed(() => diffAmount.value > 0);
  const isNegativeDiff = computed(() => diffAmount.value < 0);

  function isValidDate(date) {
    return date instanceof Date && date.getTime();
  }

  function updateInvoiceDates() {
    let invoiceDate = new Date(props.data.invoiceDate);

    if (isValidDate(invoiceDate)) {
      if (invoiceDate < store.currentDate) {
        store.updateLastInvoiceDate(props.data.id, format(invoiceDate, 'yyyy-MM-dd'));
        const monthsPerInterval = intervals[props.data.interval].months;
        invoiceDate.setMonth(invoiceDate.getMonth() + monthsPerInterval);
        store.updateInvoiceDate(props.data.id, format(invoiceDate, 'yyyy-MM-dd'));
      }
    }
  }

  function calculateDebitAmount() {
    if (props.data.type !== 1) {
      debitAmount.value = props.data.actualAmount;
    } else {
      let invoiceDate = new Date(props.data.invoiceDate);

      if (isValidDate(invoiceDate)) {
        const monthsBetween = getMonthDifference(store.currentDate, invoiceDate);
        const pastIntervalMonths = intervals[props.data.interval].months - monthsBetween;
        debitAmount.value = pastIntervalMonths * props.data.monthlyAmount;
      }
    }

    store.updateDebitAmount(props.data.id, debitAmount);
  }

  function calculateDiffAmount() {
    diffAmount.value = props.data.actualAmount - debitAmount.value;
  }

  function getMonthDifference(startDate, endDate) {
    return (
      endDate.getMonth() -
      startDate.getMonth() +
      12 * (endDate.getFullYear() - startDate.getFullYear())
    );
  }

  function applyUpdate() {
    store.updateActualAmount(props.data.id, updateAmount.value);
    calculateDebitAmount();
    calculateDiffAmount();
    updateAmount.value = null;
  }

  onMounted(() => {
    updateInvoiceDates();
    calculateDebitAmount();
    calculateDiffAmount();
  });

  onBeforeUpdate(() => {
    updateInvoiceDates();
    calculateDebitAmount();
    calculateDiffAmount();
  });

  defineExpose({
    applyUpdate,
    diffAmount,
    updateAmount
  });
</script>

<template>
  <div class="dataset">
    <div class="prop id">{{ data.id }}</div>
    <div class="prop title">{{ data.title }}</div>
    <div class="prop invoice-amount">
      <span v-if="data.invoiceAmount">
      {{ toCurrency(data.invoiceAmount) }}
      </span>
    </div>
    <div class="prop invoice-data">
      <span v-if="data.invoiceDate">
        {{ format(new Date(data.invoiceDate), 'dd.MM.yyyy') }}
      </span>
    </div>
    <div class="prop interval">{{ intervalName }}</div>
    <div class="prop monthly-amount">{{ toCurrency(data.monthlyAmount) }}</div>
    <div class="prop update-amount">
      <input type="text" v-model.number="updateAmount">
      <button @click="applyUpdate">&raquo;</button>
    </div>
    <div class="prop actual-amount">{{ toCurrency(data.actualAmount) }}</div>
    <div class="prop debit-amount">{{ toCurrency(debitAmount) }}</div>
    <div class="prop diff-amount" :class="{ positive: isPositiveDiff, negative: isNegativeDiff }">
      {{ toCurrency(diffAmount) }}
    </div>
    <div class="prop buttons">
      <button @click="$emit('delete', data)">Löschen</button>
      <button @click="$emit('edit', data)">Bearbeiten</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  @import '@/assets/styles/variables';

  .dataset {
    display: flex;

    &:nth-child(odd) {
      background-color: $gray-100-color;
    }
  }

  .positive {
    color: green;
  }

  .negative {
    color: red;
  }

  .prop {
    flex: 1;
    padding: 0.5rem;
  }
</style>