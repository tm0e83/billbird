import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output
} from '@angular/core';
import { Dataset } from '../shared/dataset.model';
import { DatasetComponent } from './dataset/dataset.component';
import { DataService } from '../shared/data.service';
import { DateService } from '../shared/date.service';
import { NgRedux, select } from 'ng2-redux';
import { IAppState, rootReducer } from '../../store';
import { ActivatedRoute, Params }   from '@angular/router';
import {
  CreateDatasetModalComponent,
  CreateDatasetModalService
} from './create-dataset-modal';
import { Observable } from 'rxjs';

@Component({
  selector: 'dataset-list',
  templateUrl: './dataset-list.component.html',
  styleUrls: ['./dataset-list.component.scss']
})
export class DatasetListComponent implements OnInit {
  search: string;
  selectedDataset: Dataset;
  billingValueSum: number = 0;
  monthlyShareSum: number = 0;
  updateValueSum: number = 0;
  currentValueSum: number = 0;
  targetValueSum: number = 0;
  diffValueSum: number = 0;
  filterTitle: any = /^.+$/;
  datasets: Dataset[];

  @Output() datasetSelectedEvent = new EventEmitter();
  @Output() updateSumEvent = new EventEmitter();

  constructor(
    private dataService: DataService,
    private dateService: DateService,
    private route: ActivatedRoute,
    private createDatasetModalService: CreateDatasetModalService,
    private ngRedux: NgRedux<IAppState>
  ) {}

  ngOnInit(): void {
    this.ngRedux.subscribe(() => {
      this.getDataFromStore();
      this.updateSum();
    });

    this.route.params.subscribe((params: Params) => {
      this.getDataFromStore();
      this.updateSum();
    });
  }

  save(dataset: Dataset): void {
    this.dataService.saveAllData();
  }

  getDataFromStore() {
    let state = this.ngRedux.getState();
    this.datasets = state.datasets;
    this.selectedDataset = state.selectedDataset;
    this.filterTitle = state.filterTitle === '' ? /^(.+)?$/ : new RegExp(state.filterTitle);
    this.search = state.filterTitle;
  }

  onChangeFilterTitle(): void {
    this.ngRedux.dispatch({
      type:'CHANGE_TITLE_FILTER',
      filterTitle: this.search
    });
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

  prefillUpdateValues() {
    this.datasets.forEach((dataset) => {
      if(dataset.active === true) {
        dataset.updateValue = dataset.monthlyShare;
        this.ngRedux.dispatch({
          type:'CHANGE_DATASET',
          payload: dataset
        });
      }
    });
  }

  applyUpdateValues() {
    this.datasets.forEach((dataset) => {
      if(dataset.active === true) {
        dataset.currentValue += dataset.updateValue;
        dataset.updateValue = 0;
        dataset = this.dataService.calcDatasetValues(dataset);
        this.ngRedux.dispatch({
          type:'CHANGE_DATASET',
          payload: dataset
        });
       }
    });
  }

  updateSum(): void {
    this.billingValueSum = 0;
    this.monthlyShareSum = 0;
    this.updateValueSum = 0;
    this.currentValueSum = 0;
    this.targetValueSum = 0;
    this.diffValueSum = 0;

    this.datasets.forEach(set => {
      if(set.active) {
        this.billingValueSum += set.billingValue;
        this.monthlyShareSum += set.monthlyShare;
        this.updateValueSum += set.updateValue;
        this.currentValueSum += set.currentValue;
        this.targetValueSum += set.targetValue;
        this.diffValueSum += set.diffValue;
      }
    });
  }

  updateStore() {
    // this.ngRedux.dispatch({
    //   type: 'UPDATE_DATAGROUP',
    //   payload: this.datagroup
    // });
    console.log('DatasetListComponent.updateStore()');
  }
}