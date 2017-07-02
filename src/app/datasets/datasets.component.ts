import { Component, OnInit, OnDestroy } from '@angular/core';
import {
    DataService,
    DateService,
    Datagroup,
    DatasetListComponent,
    DatasetDetailsComponent,
    Dataset
} from './shared';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';

@Component({
    selector: 'datasets',
    templateUrl: './datasets.component.html',
    styleUrls: []
})
export class DatasetsComponent implements OnInit, OnDestroy {
    datagroups: Datagroup[];
    selectedDatagroup: Datagroup;
    selectedDataset: Dataset;
    fireStore: FirebaseObjectObservable<any>;
    fireSubscription: any;

    constructor(
        private dataService: DataService,
        private dateService: DateService,
        private angularFire: AngularFireAuth,
        private angularDB: AngularFireDatabase
    ) {}

    ngOnInit(): void {
        this.fireStore = this.angularDB.object('/datagroups');
        this.fireSubscription = this.fireStore.subscribe(groups => {
            this.datagroups = groups.filter((v, k) => k.toString().match(/^$/) === null);
        });
    }

    ngOnDestroy(): void {
        this.fireSubscription.unsubscribe();
    }

    saveAllData(): void {
        this.fireStore.set(this.datagroups);
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