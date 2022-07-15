import { defineStore } from 'pinia'

const allDatasets = datagroups => {
  return datagroups.reduce((datasets, datagroup) => [...datasets, ...datagroup.datasets], []);
}

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
      if (!allDatasets(state.datagroups)) return 0;
      return Math.max(...allDatasets(state.datagroups).map(dataset => dataset.id)) + 1;
    },

    totalInvoiceAmount: state => {
      return allDatasets(state.datagroups).reduce((sum, dataset) => dataset.invoiceAmount ? sum += dataset.invoiceAmount : sum, 0);
    },

    totalMonthlyAmount: state => {
      return allDatasets(state.datagroups).reduce((sum, dataset) => dataset.monthlyAmount ? sum += dataset.monthlyAmount : sum, 0);
    },

    totalActualAmount: state => {
      return allDatasets(state.datagroups).reduce((sum, dataset) => dataset.actualAmount ? sum += dataset.actualAmount : sum, 0);
    },

    totalDebitAmount: state => {
      return allDatasets(state.datagroups).reduce((sum, dataset) => dataset.debitAmount ? sum += dataset.debitAmount : sum, 0);
    },

    totalDiffAmount: state => {
      return allDatasets(state.datagroups).reduce((sum, dataset) => dataset.diffAmount ? sum += dataset.diffAmount : sum, 0);
    },

    totalUpdateAmount: state => {
      return allDatasets(state.datagroups).reduce((sum, dataset) => dataset.updateAmount ? sum += dataset.updateAmount : sum, 0);
    }  ,
  },

  actions: {
    addDataset(dataset) {
      this.datagroups.map(datagroup => {
        if (datagroup.id === dataset.groupId) {
          datagroup.datasets.push(dataset);
        }

        return datagroup;
      })
    },

    addDatagroup(datagroup) {
      this.datagroups.push(datagroup);
    },

    deleteDataset(id) {
      this.datagroups.map(datagroup => {
        datagroup.datasets = datagroup.datasets.filter(dataset => dataset.id !== id);
      });
    },

    setActualAmount(id, amount) {
      allDatasets(this.datagroups).filter(d => d.id === id).map(d => d.actualAmount += amount);
    },

    setDatagroups(datagroups) {
      this.datagroups = datagroups;
    },

    setDebitAmount(id, amount) {
      allDatasets(this.datagroups).filter(d => d.id === id).map(d => d.debitAmount = amount);
    },

    setDiffAmount(id, amount) {
      allDatasets(this.datagroups).filter(d => d.id === id).map(d => d.diffAmount = amount);
    },

    setInvoiceDate(id, dateStr) {
      allDatasets(this.datagroups).filter(d => d.id === id).map(d => d.invoiceDate = dateStr);
    },

    setLastInvoiceDate(id, dateStr) {
      allDatasets(this.datagroups).filter(d => d.id === id).map(d => d.lastInvoiceDate = dateStr);
    },

    setMonthlyAmount(id, amount) {
      allDatasets(this.datagroups).filter(d => d.id === id).map(d => d.monthlyAmount = amount);
    },

    setUpdateAmount(id, amount) {
      allDatasets(this.datagroups).filter(d => d.id === id).map(d => d.updateAmount = amount);
    },

    replaceDatagroup(datagroup) {
      this.datagroups = this.datagroups.map(currentDatagroup => {
        return currentDatagroup.id === datagroup.id ? datagroup : currentDatagroup;
      });
    },

    replaceDataset(dataset) {
      this.datagroups = this.datagroups.map(currentDatagroup => {
        currentDatagroup.datasets = currentDatagroup.datasets.reduce((datasets, currentDataset) => {
          datasets.push(currentDataset.id === dataset.id ? dataset : currentDataset);
          return datasets;
        }, []);

        return currentDatagroup;
      });
    },
  }
});