import { Component } from '@angular/core';
import { Router, RouterLinkActive } from '@angular/router'
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';;
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import * as FileSaver from 'file-saver';
import { NgRedux } from 'ng2-redux';
import { IAppState, rootReducer } from './../store';
import { ModalService } from './../modal';
import { NotificationsService } from 'angular2-notifications';
import { simpleNotificationsOptions } from './../datasets/shared/variables';

@Component({
  selector: 'main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent {
  fireStore: Observable<any>;
  fireSubscription: any;
  simpleNotificationsOptions: object = simpleNotificationsOptions;

  constructor(
    private http: Http,
    private angularFire: AngularFireAuth,
    private angularDB: AngularFireDatabase,
    private router: Router,
    private ngRedux: NgRedux<IAppState>,
    private notificationsService: NotificationsService,
    private modalService: ModalService,
  ) {}

  openSettings() {
    console.log('open settings');
    this.modalService.show();
  }

  logout(): void {
    this.angularFire.auth.signOut();
    this.router.navigate(['/']);
  }

  downloadData() {
    let state = this.ngRedux.getState();
    console.log(state);
    let groups = this.angularDB.object('/users/' + state.uid).valueChanges();

    let subscription = groups.subscribe((g) => {
      let blob = new Blob([JSON.stringify(g)], {
        type: 'application/json'
      });

      let date = new Date();
      let mm = date.getMonth() + 1;
      let dd = date.getDate();

      let dateString = [
        date.getFullYear(),
        (mm > 9 ? '' : '0') + mm,
        (dd > 9 ? '' : '0') + dd
      ].join('-');

      FileSaver.saveAs(blob, `billbird_v3-export-${dateString}.json`);
      subscription.unsubscribe();
    });
  }

  openLoadDialog() {
    document.getElementById('import-json').click();
  }

  loadData($event) {
    var fileReader = new FileReader();
    fileReader.readAsText($event.target.files[0]);
    fileReader.onload = (e) => {
      this.ngRedux.dispatch({
        type: 'DELETE_ALL_DATASETS'
      });

      this.ngRedux.dispatch({
        type: 'DELETE_SETTINGS'
      });

      let datasets = JSON.parse(fileReader.result).datasets;
      datasets.forEach((dataset) => {
        this.ngRedux.dispatch({
          type: 'ADD_DATASET',
          payload: dataset
        });
      });

      this.ngRedux.dispatch({
        type: 'SET_SETTINGS',
        payload: JSON.parse(fileReader.result).settings || {}
      });

      this.notificationsService.html('Data loaded', 'bare');
    }
  }
}