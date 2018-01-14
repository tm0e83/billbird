import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DateService } from './shared/date.service';
import { DataService } from './shared/data.service';
import { simpleNotificationsOptions } from './shared/variables';
import { Dataset } from './shared/dataset.model';
import { DatasetListComponent } from './dataset-list/dataset-list.component';
import { DatasetDetailsComponent } from './dataset-details/dataset-details.component';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { NgRedux, select } from 'ng2-redux';
import { IAppState, rootReducer } from '../store';
import { ActivatedRoute, Params }   from '@angular/router';

@Component({
    selector: 'datasets',
    templateUrl: './datasets.component.html',
    styleUrls: ['./datasets.component.scss']
})
export class DatasetsComponent implements OnInit {
  datasets: Dataset[];
  selectedDataset: Dataset;
  fireStore: Observable<any>;
  fireSubscription: any;
  simpleNotificationsOptions: object = simpleNotificationsOptions;

  constructor(
    private dataService: DataService,
    private dateService: DateService,
    private angularFire: AngularFireAuth,
    private angularDB: AngularFireDatabase,
    private ngRedux: NgRedux<IAppState>,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.ngRedux.subscribe(() => {
      this.datasets = this.ngRedux.getState().datasets;
    });
    this.route.params.subscribe((params: Params) => {
      this.datasets = this.ngRedux.getState().datasets;
    });
  }

  onSelectDataset(dataset: Dataset): void {
    this.selectedDataset = dataset;
  }

  gotoDetail(dataset: Dataset): void {
    this.selectedDataset = dataset;
  }

  showList(): void {
    this.selectedDataset = void 0;
  }
}