import { describe, it, expect } from 'vitest';
import { createPinia } from 'pinia';
import { mount } from '@vue/test-utils';
import { useStore } from '@/stores/store.js';
import DatagroupList from '../DatagroupList.vue';

const wrapper = mount(DatagroupList, {
  global: {
    plugins: [createPinia()],
  },
});

const store = useStore();

store.datagroups = [
  {
    title: 'Datagroup 1',
    id: 1,
    datasets: [
      {
        actualAmount: 0,
        debitAmount: 90,
        diffAmount: -90,
        groupId: 1,
        id: 1,
        interval: "year",
        invoiceAmount: 120,
        invoiceDate: "2022-10-01",
        lastInvoiceDate: "2021-10-01",
        lastUpdateDate: "2022-06-01",
        monthlyAmount: 10,
        title: "Sample Dataset",
        type: 1,
        updateAmount: null
      }
    ]
  }
];

describe('DatagroupList', () => {
  it('shows 1 datagroup', () => {
    expect(wrapper.findAll('.datagroup').length).toBe(1);
  });

  it('shows correct invoice sum', () => {
    const invoiceAmountSum = store.allDatasets.reduce((sum, dataset) => sum += dataset.invoiceAmount, 0);
    expect(parseFloat(wrapper.find('.list-footer .invoice-amount').text())).toBe(invoiceAmountSum);
  });
});