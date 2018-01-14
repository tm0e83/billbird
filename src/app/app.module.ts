import {
	LOCALE_ID,
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  Injectable,
  Pipe,
  NgModule,
  PipeTransform
} from '@angular/core';
import { AppComponent } from './app.component';
import { CalendarComponent } from './calendar/calendar.component';
import { DataService } from './datasets/shared/data.service';
import { DateService } from './datasets/shared/date.service';
import { DatasetComponent } from './datasets/dataset-list/dataset/dataset.component';
import { ClickOutsideDirective } from './datasets/dataset-list/dataset/dataset-menu/clickoutside.directive';
import { DatasetMenuComponent } from './datasets/dataset-list/dataset/dataset-menu/dataset-menu.component';
import { Dataset } from './datasets/shared/dataset.model';
import { DatasetsComponent } from './datasets/datasets.component';
import { DatasetListComponent } from './datasets/dataset-list/dataset-list.component';
import { DatasetDetailsComponent } from './datasets/dataset-details/dataset-details.component';
import { LoginComponent } from './login/login.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { unixDateToStringPipe } from './datasets/shared/unix-date-to-string.pipe';
import { AppRoutingModule } from './shared/app-routing.module';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Router, Routes, ActivatedRoute, Params } from '@angular/router';
import { HttpModule } from '@angular/http';
import { Location } from '@angular/common';
import { DragulaModule } from 'ng2-dragula';

// Register locale modules
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
registerLocaleData(localeDe);

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { NgRedux, NgReduxModule } from 'ng2-redux';
import { IAppState, rootReducer } from './store';
import {
  CreateDatasetModalComponent,
  CreateDatasetModalService
} from './datasets/dataset-list/create-dataset-modal';
import { CurrencyMaskModule } from "ng2-currency-mask";
import { SimpleNotificationsModule, NotificationsService } from 'angular2-notifications';
import { DpDatePickerModule } from 'ng2-date-picker';
import { DatabaseService } from './shared/database.service';
import { LoadingLayerComponent } from './loading-layer/loading-layer.component';
import { LoadingLayerService } from './loading-layer/loading-layer.service';

import { ModalComponent } from './modal/modal.component';
import { ModalService } from './modal/modal.service';

const myFirebaseConfig = {
  apiKey: 'AIzaSyCTt-w2KYpb_EdLt0lX0KkhmeE3-9r1Cxg',
  authDomain: 'billbird-2fdcc.firebaseapp.com',
  databaseURL: 'https://billbird-2fdcc.firebaseio.com',
  projectId: 'billbird-2fdcc',
  storageBucket: 'billbird-2fdcc.appspot.com',
  messagingSenderId: '762800593481'
};

@NgModule({
	declarations: [
		AppComponent,
		CalendarComponent,
    ClickOutsideDirective,
    DatasetMenuComponent,
		DatasetListComponent,
		DatasetDetailsComponent,
		DatasetsComponent,
    DatasetComponent,
		LoginComponent,
		MainMenuComponent,
		unixDateToStringPipe,
    ModalComponent,
    CreateDatasetModalComponent,
    LoadingLayerComponent,
	],
	imports: [
		AppRoutingModule,
		BrowserModule,
		FormsModule,
		AngularFireModule.initializeApp(myFirebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    DragulaModule,
    NgReduxModule,
    HttpModule,
    CurrencyMaskModule,
    BrowserAnimationsModule,
    DpDatePickerModule,
    SimpleNotificationsModule.forRoot()
	],
	providers: [
		DataService,
		DateService,
    ModalService,
    CreateDatasetModalService,
    NotificationsService,
    DatabaseService,
    LoadingLayerService,
		{ provide: LOCALE_ID, useValue: 'de-DE' }
	],
	bootstrap: [ AppComponent ]
})
export class AppModule {
  constructor(
    private ngRedux: NgRedux<IAppState>
   ) {
    this.ngRedux.configureStore(rootReducer, {
      uid: '',
      datasets: [],
      settings: {}
    });
  }
}