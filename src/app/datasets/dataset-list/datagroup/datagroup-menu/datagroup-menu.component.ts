import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { DataService } from '../../../shared/data.service';
import { ClickOutsideDirective } from './clickoutside.directive';
import { Datagroup } from '../../../shared/datagroup.model';
import { Dataset } from '../../../shared/dataset.model';
import { NgRedux, select } from 'ng2-redux';
import { IAppState, rootReducer } from '../../../../store';
import { CreateDatasetModalService } from '../../create-dataset-modal';

@Component({
  selector: 'datagroup-menu',
  templateUrl: './datagroup-menu.component.html',
  styleUrls: ['./datagroup-menu.component.scss']
})
export class DatagroupMenuComponent {
  isExpanded: boolean = false;

  constructor(
    private dataService: DataService,
    private createDatasetModalService: CreateDatasetModalService,
    private ngRedux: NgRedux<IAppState>
  ) {}

  toggleMenu(): void {
    this.isExpanded = !this.isExpanded;
  }

  closeMenu(): void {
    this.isExpanded = false;
  }

  alterGroup(todo): void {
    this.ngRedux.dispatch({ type: todo });
  }

  createDataset(): void {
    this.createDatasetModalService.show();
  }
}