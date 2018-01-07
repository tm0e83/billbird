import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DateService } from './shared/date.service';
import { DataService } from './shared/data.service';
import { Datagroup } from './shared/datagroup.model';
import { Dataset } from './shared/dataset.model';

import { DatagroupMenuComponent } from './dataset-list/datagroup/datagroup-menu/datagroup-menu.component';
import { DatasetListComponent } from './dataset-list/dataset-list.component';
import { DatasetDetailsComponent } from './dataset-details/dataset-details.component';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { NgRedux, select } from 'ng2-redux';
import { IAppState, rootReducer } from '../store';

@Component({
    selector: 'datasets',
    templateUrl: './datasets.component.html',
    styleUrls: ['./datasets.component.scss']
})
export class DatasetsComponent implements OnInit, OnDestroy {
  datagroups: Datagroup[];
  selectedDatagroup: Datagroup;
  selectedDataset: Dataset;
  fireStore: Observable<any>;
  fireSubscription: any;

  constructor(
    private dataService: DataService,
    private dateService: DateService,
    private angularFire: AngularFireAuth,
    private angularDB: AngularFireDatabase,
    private ngRedux: NgRedux<IAppState>
  ) {}

  ngOnInit(): void {
    this.fireStore = this.angularDB.object('/datagroups').valueChanges();

    new Promise((resolve) => {
      this.fireSubscription = this.fireStore.subscribe(groups => {
        // this.datagroups = groups.filter((v, k) => {
        //   return k.toString().match(/^$/) === null;
        //  });
        this.datagroups = groups;
         resolve();
      });
    }).then(() => {
      this.ngRedux.configureStore(rootReducer, {
        datagroups: this.datagroups
      });
    });
  }

  ngOnDestroy(): void {
    this.fireSubscription.unsubscribe();
  }

  saveAllData(): void {
    let datagroups = this.ngRedux.getState().datagroups;
    this.angularDB.object('/datagroups').set(datagroups);
  }

  onSelectDataset(dataset: Dataset): void {
    this.selectedDataset = dataset;
  }

  onSelectDatagroup(datagroup: Datagroup): void {
    this.selectedDatagroup = datagroup;
  }

  gotoDetail(dataset: Dataset): void {
    this.selectedDataset = dataset;
  }

  showList(): void {
    this.selectedDataset = void 0;
  }
}