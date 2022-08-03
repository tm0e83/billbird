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
        {{ toCurrency(store.totalInvoiceAmount) }}
      </div>
      <div class="prop grow-0 shrink-0 basis-[140px] text-right monthly-amount">
        {{ toCurrency(store.totalMonthlyAmount) }}
      </div>
      <div class="prop grow-0 shrink-0 basis-[140px] invoice-date"></div>
      <div class="prop grow-0 shrink-0 basis-[140px] interval"></div>
      <div class="prop grow-0 shrink-0 basis-[200px] update-amount">
        <div class="flex grow">
          <div class="grow py-2 px-6 text-right">
            {{ toCurrency(store.totalUpdateAmount) }}
          </div>
          <button
            @click="applyUpdate"
            :disabled="!hasUpdateAmounts"
            class="button"
          >
            <CheckIcon class="icon" />
          </button>
        </div>
      </div>
      <div class="prop grow-0 shrink-0 basis-[140px] text-right actual-amount">
        {{ toCurrency(store.totalActualAmount) }}
      </div>
      <div class="prop grow-0 shrink-0 basis-[140px] text-right debit-amount">
        {{ toCurrency(store.totalDebitAmount) }}
      </div>
      <div class="prop grow-0 shrink-0 basis-[140px] text-right diff-amount">
        {{ toCurrency(store.totalDiffAmount) }}
      </div>
      <div class="prop grow-0 shrink-0 basis-[140px] buttons"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.list-footer {
  @apply hidden
      2xl:items-center
      2xl:font-bold
      2xl:bg-white
      2xl:rounded
      2xl:flex
      2xl:flex;
}

.prop {
  @apply py-2 px-4;
}

.icon {
  @apply w-5
      h-5
      mx-auto;
}
</style>
