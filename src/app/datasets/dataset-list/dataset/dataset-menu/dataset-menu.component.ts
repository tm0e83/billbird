import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { DataService } from '../../../shared/data.service';
import { ClickOutsideDirective } from './clickoutside.directive';
import { Dataset } from '../../../shared/dataset.model';
import { NgRedux, select } from 'ng2-redux';
import { IAppState, rootReducer } from '../../../../store';

@Component({
  selector: 'dataset-menu',
  templateUrl: './dataset-menu.component.html',
  styleUrls: ['./dataset-menu.component.scss']
})
export class DatasetMenuComponent {
  isExpanded: boolean = false;
  @Input() options;

  constructor(
    private dataService: DataService,
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

  deleteDataset(): void {

  }
}