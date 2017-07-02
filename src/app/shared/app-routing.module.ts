import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { DatasetsComponent } from '../datasets/datasets.component';
import { CalendarComponent } from '../calendar/calendar.component';

const routes: Routes = [
    //{ path: '', redirectTo: '/', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'list', component: DatasetsComponent },
    { path: 'calendar', component: CalendarComponent }
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})
export class AppRoutingModule {}