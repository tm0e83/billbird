import { describe, it, expect } from 'vitest';
import { createPinia } from 'pinia';
import { mount } from '@vue/test-utils';
import { useStore } from '@/stores/store.js';
import DatagroupItem from '../DatagroupItem.vue';

const wrapper = mount(DatagroupItem, {
  global: {
    plugins: [createPinia()],
  },
  propsData: {
    datagroup: {
      title: 'Datagroup 1',
      id: 1
    }
  }
});

const store = useStore();

store.datasets = [
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
];

describe('DatagroupList', () => {
  it('shows 1 dataset', () => {
    expect(wrapper.findAll('.dataset').length).toBe(1);
  });
});