<script setup>
import { computed, onBeforeUpdate, onMounted, ref } from "vue";
import intervals from "./shared/intervals.json";
import { toCurrency } from "./shared/functions.js";
import { useStore } from "@/stores/store.js";
import { format } from "date-fns";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  EditIcon,
  GripVerticalIcon,
  TrashIcon,
} from "vue-tabler-icons";
import CurrencyInput from "@/components/CurrencyInput.vue";

const props = defineProps(["dataset"]);
const store = useStore();

const collapsed = ref(true);

const intervalName = computed(() =>
  props.dataset.type === 1 ? intervals[props.dataset.interval].name : ""
);
const isPositiveDiff = computed(() => props.dataset.diffAmount.toFixed(2) > 0);
const isNegativeDiff = computed(() => props.dataset.diffAmount.toFixed(2) < 0);

function isValidDate(date) {
  return date instanceof Date && date.getTime();
}

function updateInvoiceDates() {
  let invoiceDate = new Date(props.dataset.invoiceDate);

  if (isValidDate(invoiceDate)) {
    if (invoiceDate < store.currentDate) {
      store.setLastInvoiceDate(
        props.dataset.id,
        format(invoiceDate, "yyyy-MM-dd")
      );
      const monthsPerInterval = intervals[props.dataset.interval].months;
      invoiceDate.setMonth(invoiceDate.getMonth() + monthsPerInterval);
      store.setInvoiceDate(props.dataset.id, format(invoiceDate, "yyyy-MM-dd"));
    }
  }
}

function calculateMonthlyAmount() {
  if (props.dataset.type === 1) {
    store.setMonthlyAmount(
      props.dataset.id,
      props.dataset.invoiceAmount / intervals[props.dataset.interval].months
    );
  }
}

function calculateDebitAmount() {
  if (props.dataset.type !== 1) {
    store.setDebitAmount(props.dataset.id, props.dataset.actualAmount);
  } else {
    let invoiceDate = new Date(props.dataset.invoiceDate);
    if (isValidDate(invoiceDate)) {
      const monthsBetween = getMonthDifference(store.currentDate, invoiceDate);
      const pastIntervalMonths =
        intervals[props.dataset.interval].months - monthsBetween;
      store.setDebitAmount(
        props.dataset.id,
        pastIntervalMonths * props.dataset.monthlyAmount
      );
    }
  }
}

function calculateDiffAmount() {
  store.setDiffAmount(
    props.dataset.id,
    props.dataset.actualAmount - props.dataset.debitAmount
  );
}

function getMonthDifference(startDate, endDate) {
  return (
    endDate.getMonth() -
    startDate.getMonth() +
    12 * (endDate.getFullYear() - startDate.getFullYear())
  );
}

function applyUpdate() {
  store.addActualAmount(props.dataset.id, props.dataset.updateAmount);
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
  applyUpdate,
});
</script>

<template>
  <div class="dataset">
    <div class="prop title">
      <span class="overflow-hidden text-ellipsis">{{ dataset.title }}</span>
      <button class="drag-handle button clear secondary p-1 grow-0 2xl:hidden">
        <GripVerticalIcon class="w-5 h-5" />
      </button>
    </div>

    <div class="prop text-right actual-amount">
      <span class="prop-label">Ist</span>
      <span>{{ toCurrency(dataset.actualAmount) }}</span>
    </div>

    <div class="prop text-right debit-amount">
      <span class="prop-label">Soll</span>
      <span>{{ toCurrency(dataset.debitAmount) }}</span>
    </div>

    <div class="prop text-right diff-amount">
      <span class="prop-label">Differenz</span>
      <span
        :class="{
          'text-green-600': isPositiveDiff,
          'text-red-600': isNegativeDiff,
        }"
      >
        {{ toCurrency(dataset.diffAmount) }}
      </span>
    </div>

    <div
      class="prop text-right invoice-amount"
      :class="{ collapsed: collapsed }"
    >
      <span class="prop-label">Rg.-Betrag</span>
      <span v-if="dataset.invoiceAmount">
        {{ toCurrency(dataset.invoiceAmount) }}
      </span>
    </div>

    <div
      class="prop text-right monthly-amount"
      :class="{ collapsed: collapsed }"
    >
      <span class="prop-label">Monatlich</span>
      <span>{{ toCurrency(dataset.monthlyAmount) }}</span>
    </div>

    <div class="prop text-right invoice-date" :class="{ collapsed: collapsed }">
      <span class="prop-label">Rg.-Datum</span>
      <span v-if="dataset.invoiceDate">
        {{ format(new Date(dataset.invoiceDate), "dd.MM.yyyy") }}
      </span>
    </div>

    <div class="prop text-right interval" :class="{ collapsed: collapsed }">
      <span class="prop-label">Interval</span>
      <span>{{ intervalName }}</span>
    </div>

    <div class="prop update-amount" :class="{ collapsed: collapsed }">
      <span class="prop-label">Update</span>
      <div class="flex">
        <CurrencyInput
          v-model="dataset.updateAmount"
          :options="{
            currency: 'EUR',
            locale: 'de-DE',
            autoDecimalDigits: true,
          }"
          classes="currency-input text-right"
        />
        <button
          @click="applyUpdate"
          :disabled="!dataset.updateAmount"
          class="button"
        >
          <CheckIcon class="w-5 h-5 mx-auto" />
        </button>
      </div>
    </div>

    <div class="prop details-toggle" @click="collapsed = !collapsed">
      <div v-if="collapsed" class="inner">
        <ChevronDownIcon class="w-5 h-5 mx-auto" />
        Details anzeigen
      </div>
      <div v-else class="inner">
        <ChevronUpIcon class="w-5 h-5 mx-auto" />
        Details ausblenden
      </div>
    </div>

    <div class="prop buttons">
      <button
        @click="$emit('delete', dataset)"
        class="button alert grow 2xl:clear 2xl:p-1 2xl:grow-0"
        title="Löschen"
      >
        <TrashIcon class="w-5 h-5 mx-auto" />
      </button>
      <button
        @click="$emit('edit', dataset)"
        class="button grow 2xl:clear 2xl:p-1 2xl:grow-0"
        title="Bearbeiten"
      >
        <EditIcon class="w-5 h-5 mx-auto" />
      </button>
      <button class="button clear secondary drag-handle hidden 2xl:block">
        <GripVerticalIcon class="w-5 h-5" />
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dataset {
  @apply mb-5
      flex
      flex-col
      grow
      border-t
      border-t-gray-100
      2xl:flex-row
      2xl:flex-nowrap
      2xl:items-center
      2xl:mb-0;
}

.prop {
  @apply flex
      grow
      justify-between
      px-4
      py-1
      2xl:py-2;

  &.collapsed {
    @apply hidden 2xl:block;
  }
}

.prop-label {
  @apply 2xl:hidden;
}

.title {
  @apply justify-between
      items-center
      font-bold
      overflow-hidden
      sm:basis-full
      2xl:basis-auto
      2xl:font-normal;
}

.drag-handle {
  @apply cursor-move p-1 grow-0;
}

.details-toggle {
  @apply flex
      justify-center
      text-sm
      text-gray-400
      py-2
      sm:basis-full
      2xl:hidden;

  .inner {
    @apply flex gap-1 items-center;
  }
}

.actual-amount,
.debit-amount,
.diff-amount,
.invoice-amount,
.monthly-amount,
.invoice-date,
.interval,
.buttons {
  @apply 2xl:justify-end 2xl:grow-0 2xl:shrink-0 2xl:basis-[140px];
}

.actual-amount {
  @apply 2xl:order-7;
}

.debit-amount {
  @apply 2xl:order-8;
}

.diff-amount {
  @apply 2xl:order-9;
}

.buttons {
  @apply 2xl:order-10;
}

.update-amount {
  @apply 2xl:grow-0
      2xl:shrink-0
      2xl:basis-[200px];
  .currency-input {
    @apply rounded
        grow
        mr-2
        max-w-[120px];
  }
}

.buttons {
  @apply flex
      gap-2
      justify-end;
}
</style>
