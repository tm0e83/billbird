import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Dataset } from './datasets/shared/dataset.model';
import { Router } from '@angular/router';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { NgRedux, select } from 'ng2-redux';
import { IAppState, rootReducer } from './store';
import { LoadingLayerComponent } from './loading-layer/loading-layer.component';
import { LoadingLayerService } from './loading-layer/loading-layer.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: []
})
export class AppComponent implements OnInit {
  title = 'Billbird';
  uid: string;
  settings: object;
  datasets: Dataset[];
  selectedDataset: Dataset;
  fireStore: Observable<any>;
  fireSubscription: any;

  constructor(
    private angularFire: AngularFireAuth,
    private angularDB: AngularFireDatabase,
    private router: Router,
    private ngRedux: NgRedux<IAppState>,
    private loadingLayerService: LoadingLayerService
  ) {}

  ngOnInit(): void {
    this.angularFire.authState.subscribe((auth) => {
      if(auth) {
        this.fireStore = this.getStore(auth.uid);
        new Promise((resolve) => {
          this.fireSubscription = this.fireStore.subscribe(data => {
            this.uid = auth.uid;

            if(data) {
              this.settings = data.settings || {};
              this.datasets = data.datasets || [];
            } else {
              this.settings = {};
              this.datasets = [];
            }
            resolve();
          });
        }).then(() => {
          this.ngRedux.dispatch({
            type:'SET_UID',
            payload: this.uid
          });

          this.ngRedux.dispatch({
            type:'SET_SETTINGS',
            payload: this.settings
          });

          this.ngRedux.dispatch({
            type:'SET_DATASETS',
            payload: this.datasets
          });

          this.router.navigate(['/list']);
          this.loadingLayerService.hide();
        });
      } else {
        if(this.fireSubscription) {
          this.fireSubscription.unsubscribe();
        }

        this.router.navigate(['/login']);
        this.loadingLayerService.hide();
      }
    });
  }

  getStore(uid: string) {
    return this.angularDB.object('/users/' + uid).valueChanges();
  }
}