import { defineStore } from 'pinia'

export const useStore = defineStore({
  id: 'counter',

  state: () => ({
    currentDate: new Date(),
    datagroups: [],
    datasets: [],
  }),

  getters: {
    nextDatagroupId: state => {
      if (!state.datagroups.length) return 0;
      return Math.max(...state.datagroups.map(datagroup => datagroup.id)) + 1;
    },

    nextDatasetId: state => {
      if (!state.datasets) return 0;
      return Math.max(...state.datasets.map(dataset => dataset.id)) + 1;
    },

    totalInvoiceAmount: state => {
      return state.datasets.reduce((sum, dataset) => dataset.invoiceAmount ? sum += dataset.invoiceAmount : sum, 0);
    },

    totalMonthlyAmount: state => {
      return state.datasets.reduce((sum, dataset) => dataset.monthlyAmount ? sum += dataset.monthlyAmount : sum, 0);
    },

    totalActualAmount: state => {
      return state.datasets.reduce((sum, dataset) => dataset.actualAmount ? sum += dataset.actualAmount : sum, 0);
    },

    totalDebitAmount: state => {
      return state.datasets.reduce((sum, dataset) => dataset.debitAmount ? sum += dataset.debitAmount : sum, 0);
    },

    totalDiffAmount: state => {
      return state.datasets.reduce((sum, dataset) => dataset.diffAmount ? sum += dataset.diffAmount : sum, 0);
    },

    totalUpdateAmount: state => {
      return state.datasets.reduce((sum, dataset) => dataset.updateAmount ? sum += dataset.updateAmount : sum, 0);
    }
  },

  actions: {
    addDataset(dataset) {
      this.datasets.push(dataset);
    },

    addDatagroup(datagroup) {
      this.datagroups.push(datagroup);
    },

    deleteDataset(id) {
      this.datasets = this.datasets.filter(dataset => dataset.id !== id);
    },

    deleteDatagroup(id) {
      this.datagroups = this.datagroups.filter(datagroup => datagroup.id !== id);
    },

    addActualAmount(id, amount) {
      this.datasets.filter(d => d.id === id).map(d => d.actualAmount += amount);
    },

    setDatagroups(datagroups) {
      this.datagroups = datagroups;
    },

    setDatasets(datasets) {
      this.datasets = datasets;
    },

    setDebitAmount(id, amount) {
      this.datasets.filter(d => d.id === id).map(d => d.debitAmount = amount);
    },

    setDiffAmount(id, amount) {
      this.datasets.filter(d => d.id === id).map(d => d.diffAmount = amount);
    },

    setInvoiceDate(id, dateStr) {
      this.datasets.filter(d => d.id === id).map(d => d.invoiceDate = dateStr);
    },

    setLastInvoiceDate(id, dateStr) {
      this.datasets.filter(d => d.id === id).map(d => d.lastInvoiceDate = dateStr);
    },

    setMonthlyAmount(id, amount) {
      this.datasets.filter(d => d.id === id).map(d => d.monthlyAmount = amount);
    },

    setUpdateAmount(id, amount) {
      this.datasets.filter(d => d.id === id).map(d => d.updateAmount = amount);
    },

    replaceDatagroup(datagroup) {
      this.datagroups = this.datagroups.map(currentDatagroup => {
        return currentDatagroup.id === datagroup.id ? datagroup : currentDatagroup;
      });
    },

    replaceDataset(dataset) {
      this.datasets = this.datasets.reduce((datasets, currentDataset) => {
        datasets.push(currentDataset.id === dataset.id ? dataset : currentDataset);
        return datasets;
      }, []);
    },
  }
});