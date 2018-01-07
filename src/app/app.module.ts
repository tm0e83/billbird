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
import { Datagroup } from './datasets/shared/datagroup.model';

import { DatagroupMenuComponent } from './datasets/dataset-list/datagroup/datagroup-menu/datagroup-menu.component';
import { DatagroupComponent } from './datasets/dataset-list/datagroup/datagroup.component';
import { DatasetComponent } from './datasets/dataset-list/datagroup/dataset/dataset.component';

import { ClickOutsideDirective } from './datasets/dataset-list/datagroup/datagroup-menu/clickoutside.directive';

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
import { CreateDatagroupModalComponent, CreateDatagroupModalService } from './datasets/dataset-list/create-datagroup-modal';
import { CreateDatasetModalComponent, CreateDatasetModalService } from './datasets/dataset-list/create-dataset-modal';
import { NgDatepickerModule } from 'ng2-datepicker';

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
    DatagroupComponent,
    DatagroupMenuComponent,
    ClickOutsideDirective,
		DatasetListComponent,
		DatasetDetailsComponent,
		DatasetsComponent,
    DatasetComponent,
		LoginComponent,
		MainMenuComponent,
		unixDateToStringPipe,
		CreateDatagroupModalComponent,
    CreateDatasetModalComponent,
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
    NgDatepickerModule,
    HttpModule
	],
	providers: [
		DataService,
		DateService,
    CreateDatagroupModalService,
    CreateDatasetModalService,
		{ provide: LOCALE_ID, useValue: 'de-DE' }
	],
	bootstrap: [ AppComponent ]
})
export class AppModule {}