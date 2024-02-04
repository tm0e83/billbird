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
  <div>
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
        <span>{{ toCurrency(store.totalInvoiceAmount) }}</span>
      </div>
      <div class="prop grow-0 shrink-0 basis-[140px] text-right monthly-amount">
        <span class="label">Mtl. Betrag</span>
        {{ toCurrency(store.totalMonthlyAmount) }}
      </div>
      <div class="prop grow-0 shrink-0 basis-[140px] invoice-date"></div>
      <div class="prop grow-0 shrink-0 basis-[140px] interval"></div>
      <div class="prop grow-0 shrink-0 basis-[200px] update-amount">
        <div class="grow flex flex-col xl:flex-row xl:items-center">
          <div class="grow py-2 xl:px-3 mr-2 text-right flex justify-between xl:justify-end">
            <span class="label">Update</span>
            <span>{{ toCurrency(store.totalUpdateAmount) }}</span>
          </div>
          <button
            @click="applyUpdate"
            :disabled="!hasUpdateAmounts"
            class="button self-end mt-2 my-0-xl"
          >
            <CheckIcon class="icon" />
          </button>
        </div>
      </div>
      <div class="prop grow-0 shrink-0 basis-[140px] text-right actual-amount">
        <span class="label">Ist</span>
        <span>{{ toCurrency(store.totalActualAmount) }}</span>
      </div>
      <div class="prop grow-0 shrink-0 basis-[140px] text-right debit-amount">
        <span class="label">Soll</span>
        <span>{{ toCurrency(store.totalDebitAmount) }}</span>
      </div>
      <div class="prop grow-0 shrink-0 basis-[140px] text-right diff-amount">
        <span class="label">Differenz</span>
        <span>{{ toCurrency(store.totalDiffAmount) }}</span>
      </div>
      <div class="prop grow-0 shrink-0 basis-[140px] buttons"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

.list-footer {
  font-weight: bold;
  background-color: white;
  border-radius: 0.25rem;
}

.prop {
  padding: 0.5rem 1rem;
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

@media (min-width: $xl) {
  .list-footer {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
  }

  .prop {
    display: block;

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
