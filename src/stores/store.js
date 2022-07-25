import { defineStore } from 'pinia'

export const useStore = defineStore({
  id: 'counter',

  state: () => ({
    currentDate: new Date(),
    datagroups: []
  }),

  getters: {
    allDatasets(state) {
      return this.datagroups.reduce((datasets, datagroup) => datasets.concat(datagroup.datasets), []);
    },

    nextDatagroupId(state) {
      if (!state.datagroups.length) return 1;
      return Math.max(...state.datagroups.map(datagroup => datagroup.id)) + 1;
    },

    nextDatasetId(state) {
      const allDatasets = this.allDataSets;
      if (!allDatasets) return 0;
      return Math.max(...allDatasets.map(dataset => dataset.id)) + 1;
    },

    totalInvoiceAmount(state) {
      return this.allDatasets.reduce((sum, dataset) => dataset.invoiceAmount ? sum += dataset.invoiceAmount : sum, 0);
    },

    totalMonthlyAmount(state) {
      return this.allDatasets.reduce((sum, dataset) => dataset.monthlyAmount ? sum += dataset.monthlyAmount : sum, 0);
    },

    totalActualAmount(state) {
      return this.allDatasets.reduce((sum, dataset) => dataset.actualAmount ? sum += dataset.actualAmount : sum, 0);
    },

    totalDebitAmount(state) {
      return this.allDatasets.reduce((sum, dataset) => dataset.debitAmount ? sum += dataset.debitAmount : sum, 0);
    },

    totalDiffAmount(state) {
      return this.allDatasets.reduce((sum, dataset) => dataset.diffAmount ? sum += dataset.diffAmount : sum, 0);
    },

    totalUpdateAmount(state) {
      return this.allDatasets.reduce((sum, dataset) => dataset.updateAmount ? sum += dataset.updateAmount : sum, 0);
    }
  },

  actions: {
    addDataset(dataset) {
      this.datagroups.map(datagroup => {
        if (datagroup.id === dataset.groupId) datagroup.datasets.push(dataset);
      });
    },

    addDatagroup(datagroup) {
      this.datagroups.push(datagroup);
    },

    deleteDataset(dataset) {
      this.datagroups.map(datagroup => {
        if (datagroup.id === dataset.groupId) {
          datagroup.datasets = datagroup.datasets.filter(currentDataset => currentDataset.id !== dataset.id);
        }
      });
    },

    deleteDatagroup(id) {
      this.datagroups = this.datagroups.filter(datagroup => datagroup.id !== id);
    },

    addActualAmount(id, amount) {
      this.datagroups.map(datagroup => {
        datagroup.datasets
          .filter(d => d.id === id)
          .map(d => d.actualAmount += amount);
      });
    },

    setDebitAmount(id, amount) {
      this.datagroups.map(datagroup => {
        datagroup.datasets
          .filter(d => d.id === id)
          .map(d => d.debitAmount = amount);
      });
    },

    setDiffAmount(id, amount) {
      this.datagroups.map(datagroup => {
        datagroup.datasets
          .filter(d => d.id === id)
          .map(d => d.diffAmount = amount);
      });
    },

    setInvoiceDate(id, dateStr) {
      this.datagroups.map(datagroup => {
        datagroup.datasets
          .filter(d => d.id === id)
          .map(d => d.invoiceDate = dateStr);
      });
    },

    setLastInvoiceDate(id, dateStr) {
      this.datagroups.map(datagroup => {
        datagroup.datasets
          .filter(d => d.id === id)
          .map(d => d.lastInvoiceDate = dateStr);
      });
    },

    setMonthlyAmount(id, amount) {
      this.datagroups.map(datagroup => {
        datagroup.datasets
          .filter(d => d.id === id)
          .map(d => d.monthlyAmount = amount);
      });
    },

    setUpdateAmount(id, amount) {
      this.datagroups.map(datagroup => {
        datagroup.datasets
          .filter(d => d.id === id)
          .map(d => d.updateAmount = amount);
      });
    },

    replaceDatagroup(datagroup) {
      this.datagroups = this.datagroups.map(currentDatagroup => {
        return currentDatagroup.id === datagroup.id ? datagroup : currentDatagroup;
      });
    },

    replaceDataset(dataset) {
      this.datagroups.map(datagroup => {
        datagroup.datasets.map((set, idx) => {
          if (set.id === dataset.id) {
            datagroup.datasets.splice(idx, 1);
          }
        });
      });

      this.datagroups.map(group => {
        if (group.id === dataset.groupId) {
          group.datasets.unshift(dataset);
        }
      });
    }
  }
});