import { Observable } from 'rxjs';
import { Component, OnInit, Input } from '@angular/core';
import { CreateDatasetModalService } from './create-dataset-modal.service';
import { NgRedux, select } from 'ng2-redux';
import { IAppState } from '../../../store';
import { DataService } from './../../shared/data.service';

@Component({
  selector: 'create-dataset-modal',
  templateUrl: './create-dataset-modal.component.html',
  styleUrls: ['./create-dataset-modal.component.scss']
})
export class CreateDatasetModalComponent implements OnInit {
  isVisible: boolean = false;
  datasetTitle: string;
  datasetDescription: string;
  datasetChargeDate: Date;
  datasetBillingCycle: string;
  datasetBillingValue: number;

  @Input() addDatasetModalVisible;

  constructor(
    private createDatasetModalService: CreateDatasetModalService,
    private dataService: DataService,
    private ngRedux: NgRedux<IAppState>
  ) {}

  ngOnInit() {
    this.datasetChargeDate = new Date();

    this.createDatasetModalService
      .isVisible()
      .subscribe(isVisible => {
        this.resetFields();
        this.isVisible = isVisible;
      });
  }

  resetFields(): void {
    this.datasetTitle = void 0;
    this.datasetDescription = void 0;
    this.datasetBillingCycle = void 0;
    this.datasetBillingValue = void 0;
  }

  hide(): void {
    this.createDatasetModalService.hide();
  }

  createDataset(): void {
    this.ngRedux.dispatch({
      type:'ADD_DATASET',
      payload: this.dataService.getNewDataset({
        title: this.datasetTitle,
        description: this.datasetDescription,
        chargeDate: this.datasetChargeDate.getTime(),
        billingCycle: this.datasetBillingCycle,
        billingValue: this.datasetBillingValue
      })
    });
    this.hide();
  }

  billingValueChange($event) {
    this.datasetBillingValue = this.dataService.currencyToNumber($event.target.value);
  }

  onDateChange($event) {
    this.datasetChargeDate = $event;
  }
}