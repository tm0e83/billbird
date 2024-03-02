<script setup>
import { computed, onBeforeUpdate, onMounted, ref } from 'vue';
import intervals from './shared/intervals.json';
import { toCurrency } from './shared/functions.js';
import { useStore } from '@/stores/store.js';
import { format } from 'date-fns';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon, EditIcon, GripVerticalIcon, TrashIcon } from 'vue-tabler-icons';
import CurrencyInput from '@/components/CurrencyInput.vue';

const props = defineProps(['dataset']);
const store = useStore();

const collapsed = ref(true);
const updateType = ref('add');

const intervalName = computed(() => (props.dataset.type === 1 ? intervals[props.dataset.interval].name : ''));
const isPositiveDiff = computed(() => props.dataset.diffAmount.toFixed(2) > 0);
const isNegativeDiff = computed(() => props.dataset.diffAmount.toFixed(2) < 0);

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
  return endDate.getMonth() - startDate.getMonth() + 12 * (endDate.getFullYear() - startDate.getFullYear());
}

function applyUpdate() {
  if (updateType.value === 'add') {
    store.addActualAmount(props.dataset.id, props.dataset.updateAmount);
  } else {
    store.setActualAmount(props.dataset.id, props.dataset.updateAmount);
  }

  store.setUpdateAmount(props.dataset.id, null);
}

function changeUpdateType() {
  updateType.value = updateType.value === 'add' ? 'equals' : 'add';
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
  <div
    class="dataset"
    :class="{ collapsed: collapsed }"
  >
    <div
      class="prop head"
      @click="collapsed = !collapsed"
    >
      <div class="title">
        <button class="button drag-handle secondary clear p-1 grow-0">
          <GripVerticalIcon class="icon mx-auto" />
        </button>
        <span>{{ dataset.title }}</span>
      </div>
      <div class="current-value">{{ toCurrency(dataset.actualAmount) }}</div>
      <div class="menu">
        <button
          @click="$emit('edit', dataset)"
          class="button clear p-1 grow-0"
          title="Bearbeiten"
        >
          <EditIcon class="icon mx-auto" />
        </button>
        <button
          @click="$emit('delete', dataset)"
          class="button alert clear p-1 grow-0"
          title="Löschen"
        >
          <TrashIcon class="icon mx-auto" />
        </button>
      </div>
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
        class="value"
        :class="{
          'text-green-600': isPositiveDiff,
          'text-red-600': isNegativeDiff,
        }"
      >
      {{ Math.floor(dataset.diffAmount) > 0 ? '+' : '' }}{{ toCurrency(dataset.diffAmount) }}
      </span>
    </div>

    <div class="prop text-right invoice-amount">
      <span class="prop-label">Rg.-Betrag</span>
      <span v-if="dataset.invoiceAmount">
        {{ toCurrency(dataset.invoiceAmount) }}
      </span>
    </div>

    <div class="prop text-right monthly-amount">
      <span class="prop-label">Monatlich</span>
      <span>{{ toCurrency(dataset.monthlyAmount) }}</span>
    </div>

    <div class="prop text-right invoice-date">
      <span class="prop-label">Rg.-Datum</span>
      <span v-if="dataset.invoiceDate">
        {{ format(new Date(dataset.invoiceDate), 'dd.MM.yyyy') }}
      </span>
    </div>

    <div class="prop text-right interval">
      <span class="prop-label">Interval</span>
      <span>{{ intervalName }}</span>
    </div>

    <div class="prop update-amount">
      <span class="prop-label">Update</span>
      <div class="flex">
        <div class="update-type-buttons">
          <a @click="changeUpdateType" :class="{ 'active' : updateType === 'add' }">+</a>
          <a @click="changeUpdateType" :class="{ 'active' : updateType === 'equals' }">=</a>
        </div>
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

    <div class="prop buttons">
      <div class="menu">
        <button
          @click="$emit('edit', dataset)"
          class="button grow 2xl:clear 2xl:p-1 2xl:grow-0"
          title="Bearbeiten"
        >
          <EditIcon class="icon mx-auto" />
        </button>
        <button
          @click="$emit('delete', dataset)"
          class="button alert grow 2xl:clear 2xl:p-1 2xl:grow-0"
          title="Löschen"
        >
          <TrashIcon class="icon mx-auto" />
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/variables';
@import '@/assets/styles/mixins';

.dataset {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  border-bottom: 1px solid $gray-200;
}

.prop {
  display: flex;
  flex-grow: 1;
  justify-content: space-between;
  padding: 0.1rem 1rem;

  &:not(.head) {
    margin-left: calc(28px - 0.625rem);
  }
}

.icon {
  width: 1.25rem;
  height: 1.25rem;
}

.drag-handle {
  cursor: move;
  padding: 0.25rem;
  margin-left: -0.5rem;
}

.head {
  align-items: center;
  overflow: hidden;
  font-weight: 500;
  padding: 0.5rem 1rem;

  .menu {
    display: flex;
    gap: 0.25rem;
    justify-content: flex-end;
    margin-left: 1rem;
    margin-right: -0.5rem;
  }

  .current-value {
    display: none;
  }
}

.title {
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  display: flex;
  align-items: center;
}

.update-type-buttons {
  display: flex;
  flex-direction: column;
  align-items: center;

  a {
    display: inline-flex;
    align-items: center;
    padding: 0 0.25rem;
    flex: 1;
    color: $gray-300;
    line-height: 1;

    &.active {
      color: $primary-color;
      font-weight: bold;
    }
  }
}

.buttons {
  display: none;
}

.currency-input {
  flex-grow: 1;
  max-width: 120px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;

  & + button {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
}

.dataset.collapsed {
  .head {
    .menu {
      display: none;
    }

    .current-value {
      display: block;
    }
  }
}

@media (min-width: $sm) {
  .title {
    flex-basis: 100%;
  }
}

@media (max-width: 1535px) {
  .dataset {
    &.collapsed {
      .prop:not(.head) {
        display: none;
      }
    }

    &:not(.collapsed) {
      padding-bottom: 0.75rem;
    }
  }

  .head {
    cursor: pointer;
  }
}

@media (min-width: $xxl) {
  .dataset {
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    margin-bottom: 0;
    padding-bottom: 0;
  }

  .prop {
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;

    &.collapsed {
      display: block;
    }

    &:not(.head) {
      margin-left: 0;
    }
  }

  .prop-label {
    display: none;
  }

  .head {
    flex-basis: auto;
    font-weight: 400;

    .menu {
      display: none;
    }

    .current-value {
      display: none !important;
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
    justify-content: flex-end;
    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: 140px;
  }

  .buttons {
    display: flex;

    .menu {
      display: flex;
      gap: 0.25rem;
      justify-content: flex-end;
      margin-left: 1rem;
      margin-right: -0.5rem;
    }
  }

  .actual-amount {
    order: 7;
  }

  .debit-amount {
    order: 8;
  }

  .diff-amount {
    order: 9;
  }

  .buttons {
    order: 10;
  }

  .update-amount {
    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: 200px;
    align-items: center;
  }

  .currency-input {
    max-width: initial;
  }

  .title {
    flex: 1;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    user-select: none;
  }
}
</style>
