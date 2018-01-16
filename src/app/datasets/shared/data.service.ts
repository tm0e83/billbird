import { Injectable } from '@angular/core';
import { DateService } from './date.service';
import { Dataset, cycleMonths } from './';
import { NgRedux } from 'ng2-redux';
import { IAppState } from './../../store';
import { AngularFireDatabase } from 'angularfire2/database';
import { NotificationsService } from 'angular2-notifications';

@Injectable()
export class DataService {
  constructor(
    private dateService: DateService,
    private ngRedux: NgRedux<IAppState>,
    private angularDB: AngularFireDatabase,
    private notificationsService: NotificationsService
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
      title: dataset.title || '',
      active: true,
      billingCycle: dataset.billingCycle || '',
      creationDate: new Date().getTime(),
      lastModifiedDate: 0,
      chargeDate: dataset.chargeDate || new Date(),
      validFromDate: dataset.validFromDate || null,
      expireDate: dataset.expireDate || null,
      updateValue: 0,
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
    state.datasets.forEach(dataset => ids.push(dataset.id));
    return Math.max.apply(Math, ids);
  }

  calcDatasetValues(dataset) {
    if(dataset.billingCycle) {
      let monthsBetween = this.dateService.getMonthBetween(new Date(dataset.chargeDate), new Date(), true);
      let monthsPerCycle = this.getCycleMonths(dataset);
      dataset.monthlyShare = dataset.billingValue / cycleMonths[dataset.billingCycle];

      dataset.targetValue = 0;

      if(monthsBetween < 0) {
        dataset.targetValue = dataset.billingValue - (Math.abs(monthsBetween) % monthsPerCycle * dataset.monthlyShare);
      }

      if(monthsBetween > 0) {
        dataset.targetValue = monthsBetween % monthsPerCycle * dataset.monthlyShare;
      }
    } else {
      dataset.targetValue = dataset.billingValue;
    }

    dataset.diffValue = dataset.currentValue - dataset.targetValue;
    dataset.lastModifiedDate = new Date().getTime();

    return dataset;
  }

  currencyToNumber(currencyString: string): number {
    return parseFloat(currencyString.replace(/(\s€)|\./, '').replace(',', '.')) || 0;
  }

  saveAllData(): void {
    let state = this.ngRedux.getState();
    let data = {
      datasets: state.datasets,
      settings: state.settings
    };
    let datasets = this.ngRedux.getState().datasets;
    this.angularDB.object('/users/' + state.uid).set(data);
    this.notificationsService.html('Successfully saved', 'bare');
  }
}