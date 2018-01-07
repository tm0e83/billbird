import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output
} from '@angular/core';
import { Datagroup } from '../shared/datagroup.model';
import { Dataset } from '../shared/dataset.model';
import { DatagroupComponent } from './datagroup/datagroup.component';
import { DataService } from '../shared/data.service';
import { DateService } from '../shared/date.service';
import { NgRedux, select } from 'ng2-redux';
import { IAppState, rootReducer } from '../../store';
import { CreateDatagroupModalService } from './create-datagroup-modal/create-datagroup-modal.service';
import { CreateDatagroupModalComponent } from './create-datagroup-modal/create-datagroup-modal.component';
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
  selectedDatagroup: Datagroup;
  selectedDataset: Dataset;
  billingValueSum: number = 0;
  monthlyShareSum: number = 0;
  updateValueSum: number = 0;
  currentValueSum: number = 0;
  targetValueSum: number = 0;
  diffValueSum: number = 0;
  datagroups: Datagroup[];
  addDatasetModalVisible: boolean = false;

  @Output() datasetSelectedEvent = new EventEmitter();
  @Output() updateSumEvent = new EventEmitter();

  @select('datagroups') groups;
  @select('selectedDatagroup') selectedGroup;
  @select('selectedDataset') selectedSet;

  constructor(
    private dataService: DataService,
    private dateService: DateService,
    private createDatagroupModalService: CreateDatagroupModalService,
    private ngRedux: NgRedux<IAppState>
  ) {}

  ngOnInit(): void {
    this.ngRedux.subscribe(() => {
      this.getDataFromStore();
      this.updateSum();
    });

    this.getDataFromStore();
    // this.updateSum();
  }

  getDataFromStore() {
    let state = this.ngRedux.getState();
    this.datagroups = state.datagroups;
    this.selectedDatagroup = state.selectedDatagroup;
    this.selectedDataset = state.selectedDataset;
  }

  addNewDatagroup(): void {
    this.createDatagroupModalService.show();
  }

  onChangeFilterTitle(): void {
    this.ngRedux.dispatch({
      type:'CHANGE_TITLE_FILTER',
      filterTitle: this.search
    });
  }

  onSelectDatagroup(datagroup: Datagroup): void {
    this.ngRedux.dispatch({
      type:'SELECT_DATAGROUP',
      selectedDatagroup: datagroup
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
    this.datagroups.forEach((datagroup) => {
      datagroup.datasets.forEach((dataset) => {
        dataset.updateValue = dataset.monthlyShare;
      });
      this.ngRedux.dispatch({
        type:'CHANGE_DATAGROUP',
        payload: datagroup
      });
    });
  }

  applyUpdateValues() {
    this.datagroups.forEach((datagroup) => {
      datagroup.datasets.forEach((dataset) => {
        dataset.currentValue += dataset.updateValue;
        dataset.updateValue = 0;
        dataset = this.dataService.calcDatasetValues(dataset);
      });
      this.ngRedux.dispatch({
        type:'CHANGE_DATAGROUP',
        payload: datagroup
      });
    });
  }

  updateSum(): void {
    this.billingValueSum = 0;
    this.monthlyShareSum = 0;
    this.updateValueSum = 0;
    this.currentValueSum = 0;
    this.targetValueSum = 0;
    this.diffValueSum = 0;

    this.datagroups.forEach(group => {
      group.datasets.forEach(set => {
        this.billingValueSum += set.billingValue;
        this.monthlyShareSum += set.monthlyShare;
        this.updateValueSum += set.updateValue;
        this.currentValueSum += set.currentValue;
        this.targetValueSum += set.targetValue;
        this.diffValueSum += set.diffValue;
      });
    });
  }
}