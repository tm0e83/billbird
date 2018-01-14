import { Injectable } from '@angular/core';
import { Dataset } from './datasets/shared/dataset.model';

export interface IAppState {
  uid: string;
  datasets: Dataset[];
  settings: object;
  selectedDataset?: Dataset;
  filterTitle?: string;
}

export function rootReducer(state: IAppState, action): IAppState {
  switch(action.type) {
    case 'SET_UID': {
      return Object.assign({}, state, {
        uid: action.payload
      });
    }

    case 'DELETE_SETTINGS': {
      return Object.assign({}, state, {
        settings: action.payload
      });
    }

    case 'SET_SETTINGS': {
      return Object.assign({}, state, {
        settings: action.payload
      });
    }

    case 'SET_DATASETS': {
      return Object.assign({}, state, {
        datasets: action.payload
      });
    }

    case 'ADD_DATASET': {
      let newDatasets = state.datasets;
      newDatasets.push(action.payload);
      return Object.assign({}, state, {
        datasets: newDatasets
      });
    }

    case 'DELETE_DATASET': {
      let newDatasets = state.datasets;
      let datasetIndex = newDatasets.indexOf(state.selectedDataset);
      newDatasets.splice(datasetIndex, 1);
      return Object.assign({}, state, {
        datasets: newDatasets
      });
    }

    case 'DELETE_ALL_DATASETS': {
      return Object.assign({}, state, {
        datasets: []
      });
    }

    case 'SELECT_DATASET': {
      return Object.assign({}, state, {
        selectedDataset: action.selectedDataset
      });
    }

    case 'UPDATE_DATASET': {
      let newDatasets = state.datasets;
      let datasetIndex;

      newDatasets.forEach((set, index) => {
        if(set.id === action.dataset.id) {
          datasetIndex = index;
        }
      });

      newDatasets[datasetIndex] = action.dataset;

      return Object.assign({}, state, {
        datasets: newDatasets
      });
    }

    case 'CHANGE_TITLE_FILTER': {
      return Object.assign({}, state, {
        filterTitle: action.filterTitle
      });
    }

    default: return state;
  }
}