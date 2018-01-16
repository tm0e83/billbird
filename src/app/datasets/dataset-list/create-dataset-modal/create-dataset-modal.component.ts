import { Observable } from 'rxjs';
import {
  Component,
  OnInit,
  Injectable,
  Input
} from '@angular/core';
import { CreateDatasetModalService } from './create-dataset-modal.service';
import { NgRedux, select } from 'ng2-redux';
import { IAppState } from '../../../store';
import { ModalComponent } from '../../../modal/modal.component';
import { DataService } from './../../shared/data.service';
import * as moment from 'moment/moment';

@Component({
  selector: 'create-dataset-modal',
  templateUrl: './create-dataset-modal.component.html',
  styleUrls: ['../../../modal/modal.component.scss']
})
export class CreateDatasetModalComponent extends ModalComponent {
  chargeDate: object;
  datepickerOptions: object = {};
  datasetTitle: string;
  datasetDescription: string;
  datasetValidFromDate: any;
  datasetExpireDate: any;
  datasetChargeDate: any;
  datasetBillingCycle: string;
  datasetBillingValue: number;

  constructor(
    private createDatasetModalService: CreateDatasetModalService,
    private dataService: DataService,
    private ngRedux: NgRedux<IAppState>
  ) {
    super(createDatasetModalService);
  }

  ngOnInit() {
    this.chargeDate = moment();

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
    this.chargeDate = moment();
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
        validFromDate: this.datasetValidFromDate,
        expireDate: this.datasetExpireDate,
        chargeDate: this.datasetChargeDate,
        billingCycle: this.datasetBillingCycle,
        billingValue: this.datasetBillingValue
      })
    });
    this.hide();
  }

  billingValueChange($event) {
    this.datasetBillingValue = this.dataService.currencyToNumber($event.target.value);
  }

  onValidFromDateChange($event) {
    if($event) {
      this.datasetValidFromDate = $event.unix() * 1000;
    }
  }

  onExpireDateChange($event) {
    if($event) {
      this.datasetExpireDate = $event.unix() * 1000;
    }
  }

  onChargeDateChange($event) {
    if($event) {
      this.datasetChargeDate = $event.unix() * 1000;
    }
  }
}