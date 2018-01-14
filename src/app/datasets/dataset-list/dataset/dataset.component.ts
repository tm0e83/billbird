import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output
} from '@angular/core';
import { Dataset, cycleMonths, currencyMaskOptions } from '../../shared';
import { DataService } from '../../shared/data.service';
import { DateService } from '../../shared/date.service';
import { NgRedux } from 'ng2-redux';
import { IAppState, rootReducer } from '../../../store';
import { DatasetMenuComponent } from './dataset-menu/dataset-menu.component';
import * as moment from 'moment/moment';

@Component({
  selector: 'dataset',
  templateUrl: './dataset.component.html',
  styleUrls: ['./dataset.component.scss']
})
export class DatasetComponent implements OnInit {
  currencyMaskOptions: object = currencyMaskOptions;
  datepickerOptions: object = {};
  gotoDetailCallback: Function;
  activateCallback: Function;
  deactivateCallback: Function;
  deleteCallback: Function;
  chargeDate: object;
  menuOptions: object = [
      { fn: this.gotoDetailCallback = this.gotoDetail.bind(this), text: 'Details' },
      { fn: this.deactivateCallback = this.deactivate.bind(this), text: 'Deactivate' },
      { fn: this.deleteCallback = this.delete.bind(this), text: 'Löschen' }
  ];
  @Input() filterTitle: any;
  @Input() dataset: Dataset;
  @Output() datasetSelectedEvent = new EventEmitter();

  constructor(
    private dataService: DataService,
    private dateService: DateService,
    private ngRedux: NgRedux<IAppState>
  ) {}

  ngOnInit(): void {
    this.updateMenu();
    this.chargeDate = moment(this.dataset.chargeDate);
    this.dataset = this.dataService.calcDatasetValues(this.dataset);
    this.updateBillingDate();
    this.updateStore();
  }

  updateBillingDate() {
    let chargeDate = moment(this.dataset.chargeDate);
    let currentDate = moment(new Date());
    let monthBetween = chargeDate.diff(currentDate, 'month');

    if(monthBetween < 0) {
      let monthPerCycle = this.dataService.getCycleMonths(this.dataset);
      this.dataset.chargeDate = chargeDate.add(monthPerCycle, 'month').unix() * 1000;
      this.chargeDate = moment(this.dataset.chargeDate);
    }
  };

  onDateChange($event) {
    this.dataset.chargeDate = $event.unix() * 1000;
    this.updateStore();
  }

  gotoDetail(): void {
    this.datasetSelectedEvent.emit(this.dataset);
  }

  delete(): void {
    this.ngRedux.dispatch({
      type: 'DELETE_DATASET',
      dataset: this.dataset
    });
  }

  updateMenu() {
    if(this.dataset.active) {
      this.menuOptions[1] = { fn: this.deactivateCallback = this.deactivate.bind(this), text: 'Deactivate' };
    } else {
      this.menuOptions[1] = { fn: this.activateCallback = this.activate.bind(this), text: 'Activate' };
    }
  }

  activate(): void {
    this.dataset.active = true;
    this.ngRedux.dispatch({
      type: 'UPDATE_DATASET',
      dataset: this.dataset
    });
    this.updateMenu();
  }

  deactivate(): void {
    this.dataset.active = false;
    this.ngRedux.dispatch({
      type: 'UPDATE_DATASET',
      dataset: this.dataset
    });
    this.updateMenu();
  }

  applyUpdateValue($event): void {
    this.dataset.currentValue += this.dataset.updateValue;
    this.dataset.updateValue = 0;
    this.updateStore();
  }

  updateStore() {
    this.ngRedux.dispatch({
      type: 'UPDATE_DATASET',
      dataset: this.dataService.calcDatasetValues(this.dataset)
    });
  }
}