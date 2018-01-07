import { Injectable } from '@angular/core';
import { Datagroup } from './datasets/shared/datagroup.model';
import { Dataset } from './datasets/shared/dataset.model';

export interface IAppState {
  datagroups: Datagroup[];
  selectedDatagroup?: Datagroup;
  selectedDataset?: Dataset;
  filterTitle?: string;
}

export function rootReducer(state: IAppState, action): IAppState {
  switch(action.type) {
    case 'ADD_DATAGROUP': {
      let newDatagroups = state.datagroups;
      newDatagroups.push(action.payload);
      return Object.assign({}, state, {
        datagroups: newDatagroups
      });
    }

    case 'ADD_DATASET': {
      let newDatagroups = state.datagroups;
      let currentGroupIndex = newDatagroups.indexOf(state.selectedDatagroup);
      newDatagroups[currentGroupIndex].datasets.push(action.payload);

      return Object.assign({}, state, {
        datagroups: newDatagroups
      });
    }

    case 'DELETE_ALL_DATAGROUPS': {
      return Object.assign({}, state, {
        datagroups: []
      });
    }

    case 'DELETE_DATAGROUP': {
      let newDatagroups = state.datagroups;
      newDatagroups.splice(newDatagroups.indexOf(state.selectedDatagroup), 1);

      return Object.assign({}, state, {
        datagroups: newDatagroups
      });
    }

    case 'DELETE_DATASET': {
      let newDatagroups = state.datagroups;
      let groupIndex = newDatagroups.indexOf(state.selectedDatagroup);
      newDatagroups[groupIndex].datasets.splice(newDatagroups[groupIndex].datasets.indexOf(state.selectedDataset), 1);

      return Object.assign({}, state, {
        datagroups: newDatagroups
      });
    }

    case 'SELECT_DATAGROUP': {
      return Object.assign({}, state, {
        datagroups: state.datagroups,
        selectedDatagroup: action.selectedDatagroup
      });
    }

    case 'SELECT_DATASET': {
      return Object.assign({}, state, {
        datagroups: state.datagroups,
        selectedDataset: action.selectedDataset
      });
    }

    case 'UPDATE_DATAGROUP': {
      let newDatagroups = state.datagroups;
      let groupIndex;

      newDatagroups.forEach((group, index) => {
        if(group.id === action.payload.id) {
          groupIndex = index;
        }
      });

      newDatagroups[groupIndex] = action.payload

      return Object.assign({}, state, {
        datagroups: newDatagroups
      });
    }

    case 'UPDATE_DATASET': {
      let newDatagroups = state.datagroups;

      let groupIndex;
      newDatagroups.forEach((group, index) =>{
        if(group.id === action.datagroup.id) {
          groupIndex = index;
        }
      });

      let datasetIndex;
      newDatagroups[groupIndex].datasets.forEach((set, index) =>{
        if(set.id === action.dataset.id) {
          datasetIndex = index;
        }
      });

      newDatagroups[groupIndex].datasets[datasetIndex] = action.dataset;

      return Object.assign({}, state, {
        datagroups: newDatagroups
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