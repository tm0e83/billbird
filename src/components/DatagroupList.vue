<script setup>
import { computed } from 'vue';
import { useStore } from '@/stores/store.js';
import DatagroupItem from '@/components/DatagroupItem.vue';
import { toCurrency } from './shared/functions.js';
import { CheckIcon } from 'vue-tabler-icons';
import draggable from 'vuedraggable';

const store = useStore();

function applyUpdate() {
  store.datagroups.map(datagroup => {
    datagroup.datasets.map(dataset => {
      store.addActualAmount(dataset.id, dataset.updateAmount);
      store.setUpdateAmount(dataset.id, null);
    });
  });
}

const hasUpdateAmounts = computed(() => {
  return store.allDatasets.filter(dataset => !!dataset.updateAmount).length > 0;
});
</script>

<template>
  <div class="outer-list">
    <draggable
      :list="store.datagroups"
      class="list"
      group="datagroups"
      handle=".drag-handle"
      item-key="id"
    >
      <template #item="{ element }">
        <DatagroupItem
          :datagroup="element"
          @edit="datagroup => $emit('editDatagroup', datagroup)"
          @delete="datagroup => $emit('deleteDatagroup', datagroup)"
        />
      </template>
    </draggable>

    <div class="list-footer">
      <div class="prop flex-1 title">Summe</div>
      <div class="prop grow-0 shrink-0 basis-[140px] text-right invoice-amount">
        <span class="label">Rg.-Betrag</span>
        <span class="value">{{ toCurrency(store.totalInvoiceAmount) }}</span>
      </div>
      <div class="prop grow-0 shrink-0 basis-[140px] text-right monthly-amount">
        <span class="label">Mtl. Betrag</span>
        <span class="value">{{ toCurrency(store.totalMonthlyAmount) }}</span>
      </div>
      <div class="prop grow-0 shrink-0 basis-[140px] invoice-date"></div>
      <div class="prop grow-0 shrink-0 basis-[140px] interval"></div>
      <div class="prop grow-0 shrink-0 basis-[200px] update-amount">
        <div class="grow flex flex-col 2xl:flex-row 2xl:items-center">
          <div class="grow 2xl:py-2 2xl:px-3 text-right flex justify-between 2xl:justify-end">
            <span class="label">Update</span>
            <span>{{ toCurrency(store.totalUpdateAmount) }}</span>
          </div>
          <button
            @click="applyUpdate"
            :disabled="!hasUpdateAmounts"
            class="button self-end my-0-xl"
            title="Update für alle Datensätze ausführen"
          >
            <CheckIcon class="icon" />
          </button>
        </div>
      </div>
      <div class="prop grow-0 shrink-0 basis-[140px] text-right actual-amount">
        <span class="label">Ist</span>
        <span class="value">{{ toCurrency(store.totalActualAmount) }}</span>
      </div>
      <div class="prop grow-0 shrink-0 basis-[140px] text-right debit-amount">
        <span class="label">Soll</span>
        <span class="value">{{ toCurrency(store.totalDebitAmount) }}</span>
      </div>
      <div class="prop grow-0 shrink-0 basis-[140px] text-right diff-amount">
        <span class="label">Differenz</span>
        <span class="value">{{ toCurrency(store.totalDiffAmount) }}</span>
      </div>
      <div class="prop grow-0 shrink-0 basis-[140px] buttons"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/variables';
@import '@/assets/styles/mixins';

.outer-list {
  box-shadow: 0 0 2px 0 rgb(99,99,99,0.15);
}

.list-footer {
  font-weight: bold;
  background-color: $gray-100;
  margin-top: 1px;
  // border-bottom-left-radius: 0.25rem;
  // border-bottom-right-radius: 0.25rem;
  padding-left: calc(28px - 0.625rem);
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.prop {
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;

  &.invoice-date,
  &.interval {
    display: none;
  }
}

.icon {
  width: 1.25rem;
  height: 1.25rem;
  margin-left: auto;
  margin-right: auto;
}

@media (min-width: $xxl) {
  .list-footer {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    padding-top: 0;
    padding-bottom: 0;
  }

  .prop {
    display: block;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;

    &.invoice-date,
    &.interval {
      display: block;
    }
  }

  span.label {
    display: none;
  }
}
</style>
