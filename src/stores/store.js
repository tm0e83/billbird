import { defineStore } from 'pinia'
import { toRefs } from 'vue';

export const useStore = defineStore({
  id: 'counter',

  state: () => ({
    datasets: [],
    currentDate: new Date()
  }),

  // getters: {
  //   doubleCount: (state) => state.counter * 2
  // },

  actions: {
    addDataset(dataset) {
      this.datasets.push(dataset);
    },
    setDatasets(datasets) {
      this.datasets = datasets;
    },
    deleteDataset(id) {
      this.datasets = this.datasets.filter(d => d.id !== id);
    },
    updateActualAmount(id, amount) {
      this.datasets.filter(d => d.id === id).map(d => d.actualAmount += amount);
    },
    updateDebitAmount(id, amount) {
      this.datasets.filter(d => d.id === id).map(d => d.debitAmount = amount);
    },
    updateDataset(dataset) {
      this.datasets = this.datasets.map(d => d.id === dataset.id ? dataset : d);
    },
    updateInvoiceDate(id, dateStr) {
      this.datasets.filter(d => d.id === id).map(d => d.invoiceDate = dateStr);
    },
    updateLastInvoiceDate(id, dateStr) {
      this.datasets.filter(d => d.id === id).map(d => d.lastInvoiceDate = dateStr);
    },
  }
})
