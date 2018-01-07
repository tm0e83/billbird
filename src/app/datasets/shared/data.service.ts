import { Injectable } from '@angular/core';
import { DateService } from './date.service';
import { Datagroup, Dataset, cycleMonths } from './';
import { NgRedux } from 'ng2-redux';
import { IAppState } from './../../store';

@Injectable()
export class DataService {
  constructor(
    private dateService: DateService,
    private ngRedux: NgRedux<IAppState>
  ) {}

  getCycleMonths(dataset: Dataset) {
    switch(dataset.billingCycle) {
      case 'month': return 1;
      case 'quarter': return 3;
      case 'year': return 12;
      case '2years': return 24;
    }
  }

  getNewDataset(dataset): Dataset {
    let state = this.ngRedux.getState();

    let newDataset = {
      id: this.getLatestDatasetId(state) + 1,
      groupID: state.selectedDatagroup.id,
      title: dataset.title || '',
      billingCycle: dataset.billingCycle || '',
      creationDate: new Date().getTime(),
      lastModifiedDate: 0,
      chargeDate: dataset.chargeDate || new Date(),
      updateValue: 0.00,
      currentValue: 0,
      targetValue: 0,
      billingValue: dataset.billingValue || 0,
      diffValue: 0,
      monthlyShare: 0
    }

    return this.calcDatasetValues(newDataset);
  }

  getLatestDatasetId(state): number {
    let ids = [1];
    state.datagroups.forEach(datagroup => {
      datagroup.datasets.forEach(dataset => {
        ids.push(dataset.id);
      });
    });
    return Math.max.apply(Math, ids);
  }

  calcDatasetValues(dataset) {
    let state = this.ngRedux.getState();

    if(dataset.billingCycle) {
      let monthsBetween = this.dateService.getMonthBetween(
        new Date(dataset.chargeDate),
        new Date()
      );

      let monthsPerCycle = this.getCycleMonths(dataset);
      dataset.monthlyShare = dataset.billingValue / cycleMonths[dataset.billingCycle];
      dataset.targetValue = ((monthsBetween % monthsPerCycle) + 1) * dataset.monthlyShare;
    } else {
      dataset.targetValue = dataset.billingValue;
    }
    dataset.diffValue = dataset.currentValue - dataset.targetValue;

    dataset.lastModifiedDate = new Date().getTime();

    return dataset;
  }

  getNewDatagroup = function(datagroup): Datagroup {
    let state = this.ngRedux.getState();
    return {
      id: this.getLatestDatagroupId() + 1,
      title: datagroup.title || 'Titel',
      description: datagroup.description || '',
      datasets: []
    }
  }

  getLatestDatagroupId = function(): number {
    let state = this.ngRedux.getState();
    let ids = [1];
    state.datagroups.forEach(datagroup => {
      ids.push(datagroup.id);
    });
    return Math.max.apply(Math, ids);
  }

  currencyToNumber(currencyString: string): number {
    return parseFloat(currencyString.replace(/(\s€)|\./, '').replace(',', '.')) || 0;
  }
}