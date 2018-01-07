import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output
} from '@angular/core';
import { Datagroup, Dataset } from '../../shared';
import { DatasetComponent } from './dataset/dataset.component';
import { DataService } from '../../shared/data.service';
import { DateService } from '../../shared/date.service';
import { NgRedux, select } from 'ng2-redux';
import { IAppState, rootReducer } from '../../../store';
import { CreateDatasetModalService } from '../create-dataset-modal';

@Component({
  selector: 'datagroup',
  templateUrl: './datagroup.component.html',
  styleUrls: ['./datagroup.component.scss']
})
export class DatagroupComponent implements OnInit {
  selectedDatagroup: Datagroup;
  selectedDataset: Dataset;
  billingValueSum: number = 0;
  monthlyShareSum: number = 0;
  updateValueSum: number = 0;
  currentValueSum: number = 0;
  targetValueSum: number = 0;
  diffValueSum: number = 0;
  filterTitle: any = /^.+$/;

  id: number;
  title: string;
  datasets: Dataset[];
  description: string;

  @Input() datagroup: Datagroup;
  @Input() datagroups: Datagroup[];
  @Output() datasetSelectedEvent = new EventEmitter();
  @Output() updateSumEvent = new EventEmitter();

  constructor(
    private dataService: DataService,
    private dateService: DateService,
    private createDatasetModalService: CreateDatasetModalService,
    private ngRedux: NgRedux<IAppState>
  ) {}

  ngOnInit(): void {
    this.ngRedux.subscribe(() => {
      let state = this.ngRedux.getState();
      let hasSelectedDataset = false;

      if(state.selectedDataset) {
        this.datagroup.datasets.forEach(dataset => {
          if(dataset.id === state.selectedDataset.id) {
            hasSelectedDataset = true;
          }
        });
      }

      this.selectedDataset = hasSelectedDataset ? state.selectedDataset : void 0;

      this.filterTitle = state.filterTitle === '' ? /^.+$/ : new RegExp(state.filterTitle);

      this.updateSum();
    });

    this.updateSum();
  }

  onSelectDataset(dataset: Dataset): void {
    this.ngRedux.dispatch({
      type:'SELECT_DATASET',
      selectedDataset: dataset
    });
  }

  createDataset(): void {
    this.createDatasetModalService.show();
  }

  deleteDataset(): void {
    this.ngRedux.dispatch({
      type:'DELETE_DATASET',
      selectedDataset:
      this.selectedDataset
    });
  }

  gotoDetail(dataset: Dataset): void {
    this.selectedDataset = dataset;
    this.datasetSelectedEvent.emit(this.selectedDataset);
  }

  currencyToNumber(currencyString: string): number {
    return parseFloat(currencyString.replace(/(\s€)|\./, '').replace(',', '.')) || 0;
  }

  updateSum(): void {
    this.billingValueSum = 0;
    this.monthlyShareSum = 0;
    this.updateValueSum = 0;
    this.currentValueSum = 0;
    this.targetValueSum = 0;
    this.diffValueSum = 0;

    this.datagroup.datasets.forEach(set => {
      this.billingValueSum += set.billingValue;
      this.monthlyShareSum += set.monthlyShare;
      this.updateValueSum += set.updateValue;
      this.currentValueSum += set.currentValue;
      this.targetValueSum += set.targetValue;
      this.diffValueSum += set.diffValue;
    });
  }

  updateStore() {
    this.ngRedux.dispatch({
      type: 'UPDATE_DATAGROUP',
      payload: this.datagroup
    });
  }
}