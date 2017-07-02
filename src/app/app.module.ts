//import 'hammerjs';
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
// import { MaterialModule } from '@angular/material';
import { HttpModule } from '@angular/http';
import { Location } from '@angular/common';
import { DragulaModule } from 'ng2-dragula';

// import {
//     FIREBASE_PROVIDERS,
//     defaultFirebase,
//     AngularFire,
//     firebaseAuthConfig,
//     AngularFireModule,
//     AuthProviders,
//     AuthMethods
// } from 'angularfire2/database';

//import { AngularFire } from 'angularfire2';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

const myFirebaseConfig = {
    apiKey: "AIzaSyCTt-w2KYpb_EdLt0lX0KkhmeE3-9r1Cxg",
    authDomain: "billbird-2fdcc.firebaseapp.com",
    databaseURL: "https://billbird-2fdcc.firebaseio.com",
    projectId: "billbird-2fdcc",
    storageBucket: "billbird-2fdcc.appspot.com",
    messagingSenderId: "762800593481"
};

// const myFirebaseAuthConfig = {
//   provider: AuthProviders.Password,
//   method: AuthMethods.Password
// };

// import {
//   FIREBASE_PROVIDERS,
//   defaultFirebase,
//   firebaseAuthConfig,
//   AuthProviders,
//   AuthMethods
// } from 'angularfire2';

@NgModule({
	declarations: [
		AppComponent,
		CalendarComponent,
		DatasetListComponent,
		DatasetDetailsComponent,
		DatasetsComponent,
		LoginComponent,
		MainMenuComponent,
		unixDateToStringPipe,
	],
	imports: [
		AppRoutingModule,
		BrowserModule,
		FormsModule,
		// MaterialModule,
		AngularFireModule.initializeApp(myFirebaseConfig),//, myFirebaseAuthConfig),
        AngularFireDatabaseModule,
        AngularFireAuthModule,
        DragulaModule
		//HttpModule,
	],
	providers: [
		DataService,
		DateService,
		{ provide: LOCALE_ID, useValue: "de-DE" }
	],
	bootstrap: [ AppComponent ]
})
export class AppModule {}