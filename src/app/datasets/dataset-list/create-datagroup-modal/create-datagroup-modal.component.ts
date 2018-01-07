import { Observable } from 'rxjs';
import { Component, OnInit, Input } from '@angular/core';
import { CreateDatagroupModalService } from './create-datagroup-modal.service';
import { NgRedux, select } from 'ng2-redux';
import { IAppState, rootReducer } from '../../../store';
import { DataService } from './../../shared/data.service';

@Component({
  selector: 'create-datagroup-modal',
  templateUrl: './create-datagroup-modal.component.html',
  styleUrls: ['./create-datagroup-modal.component.scss']
})
export class CreateDatagroupModalComponent implements OnInit {
  isVisible: boolean = false;
  datagroupTitle: string;
  datagroupDescription: string;

  @Input() addDatasetModalVisible;

  constructor(
    private createDatagroupModalService: CreateDatagroupModalService,
    private dataService: DataService,
    private ngRedux: NgRedux<IAppState>
  ) {}

  ngOnInit() {
    this.createDatagroupModalService
      .isVisible()
      .subscribe(isVisible => {
        this.resetFields();
        this.isVisible = isVisible;
      });
  }

  resetFields(): void {
    this.datagroupTitle = void 0;
    this.datagroupDescription = void 0;
  }

  hide(): void {
    this.createDatagroupModalService.hide();
  }

  createDatagroup(): void {
    this.ngRedux.dispatch({
      type:'ADD_DATAGROUP',
      payload: this.dataService.getNewDatagroup({
        title: this.datagroupTitle,
        description: this.datagroupDescription
      })
    });
    this.hide();
  }
}
