import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output
} from '@angular/core';
import { Datagroup, Dataset, cycleMonths } from '../../../shared';
import { DataService } from '../../../shared/data.service';
import { DateService } from '../../../shared/date.service';
import { NgRedux } from 'ng2-redux';
import { IAppState, rootReducer } from '../../../../store';

@Component({
  selector: 'dataset',
  templateUrl: './dataset.component.html',
  styleUrls: ['./dataset.component.scss']
})
export class DatasetComponent implements OnInit {
  @Input() datagroup;
  @Input() dataset;
  @Output() datasetSelectedEvent = new EventEmitter();

  constructor(
    private dataService: DataService,
    private dateService: DateService,
    private ngRedux: NgRedux<IAppState>
  ) {}

  ngOnInit(): void {
    this.dataset = this.dataService.calcDatasetValues(this.dataset);
    this.updateStore();
  }

  gotoDetail(dataset: Dataset): void {
    this.datasetSelectedEvent.emit(this.dataset);
  }

  applyUpdateValue($event): void {
    this.dataset.currentValue += this.dataset.updateValue;
    this.dataset.updateValue = 0;
    this.updateStore();
  }

  onUpdateValueChange($event) {
    this.dataset.updateValue = this.dataService.currencyToNumber($event.target.value);
    this.updateStore();
  }

  onBillingValueChange($event) {
    this.dataset.billingValue = this.dataService.currencyToNumber($event.target.value);
    this.updateStore();
  }

  onMonthlyShareChange($event) {
    this.dataset.monthlyShare = this.dataService.currencyToNumber($event.target.value);
    this.updateStore();
  }

  updateStore() {
    this.ngRedux.dispatch({
      type: 'UPDATE_DATASET',
      datagroup: this.datagroup,
      dataset: this.dataService.calcDatasetValues(this.dataset)
    });
  }
}