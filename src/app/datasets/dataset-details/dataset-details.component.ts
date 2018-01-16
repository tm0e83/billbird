import 'rxjs/add/operator/switchMap';
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { DatasetsComponent } from '../datasets.component';
import { Dataset } from '../shared/dataset.model';
import { DataService } from '../shared/data.service';
import { DateService } from '../shared/date.service';
import { NgRedux } from 'ng2-redux';
import { IAppState, rootReducer } from '../../store';
import * as moment from 'moment/moment';

@Component({
  moduleId: module.id,
  selector: 'dataset-details',
  templateUrl: './dataset-details.component.html',
  styleUrls: ['../dataset-list/dataset-list.component.scss']
})
export class DatasetDetailsComponent implements OnInit {
  validFromDate: any;
  expireDate: any;
  datepickerOptions: object = {};
  @Input() dataset: Dataset;
  @Output() closeDetailView = new EventEmitter();

  constructor(
    private dataService: DataService,
    private ngRedux: NgRedux<IAppState>
  ) {}

  ngOnInit(): void {
    this.validFromDate = this.dataset.validFromDate ? moment(this.dataset.validFromDate) : '';

    this.expireDate = this.dataset.expireDate ? moment(this.dataset.expireDate) : '';
  }

  save(): void {
    this.dataService.saveAllData();
  }

  onValidFromDateChange($event): void {
    if($event) {
      let date = typeof $event === 'string' ? moment(new Date($event)): moment($event)
      this.dataset.validFromDate = date.unix() * 1000;
      this.updateStore();
    }
  }

  onExpireDateChange($event): void {
    if($event) {
      let date = typeof $event === 'string' ? moment(new Date($event)): moment($event)
      this.dataset.expireDate = date.unix() * 1000;
      this.updateStore();
    }
  }

  goToList(dataset: Dataset): void {
    this.closeDetailView.emit();
  }

  updateStore(): void {
    this.ngRedux.dispatch({
      type: 'UPDATE_DATASET',
      dataset: this.dataService.calcDatasetValues(this.dataset)
    });
  }
}