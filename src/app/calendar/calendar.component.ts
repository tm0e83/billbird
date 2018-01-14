import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { NgRedux, select } from 'ng2-redux';
import { IAppState, rootReducer } from './../store';
import { Dataset } from './../datasets/shared';
import * as moment from 'moment';
import { ActivatedRoute, Params }   from '@angular/router';

@Component({
  // moduleId: module.id,
  selector: 'calendar',
  templateUrl: './calendar.component.html'
})
export class CalendarComponent {
  state: object;
  months: object;

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private ngRedux: NgRedux<IAppState>
  ) {}

  ngOnInit() {
    this.ngRedux.subscribe(() => {
      this.months = this.getMonthObjects();
    });
    this.route.params.subscribe((params: Params) => {
      this.months = this.getMonthObjects();
    });
  }

  getMonthObjects(): object {
    let datasets = this.ngRedux.getState().datasets;

    // let months = {};

    // datasets.forEach((dataset, index) => {
    //   let month = {

    //   }

    //   let chargeDate = moment(dataset.chargeDate);
    //   let chargeYear = moment(dataset.chargeDate).format('YYYY');
    //   let chargeMonth = moment(dataset.chargeDate).format('MMMM');

    //   if(months[chargeYear])

    //   if(chargeDate.isSame(currentDate.add(i, 'month'), 'month') === true) {
    //     month.datasets.push(datasets[index]);
    //   }
    // });

    let months = [];

    for (let i = 0; i <= 11; i++) {
      let month = {
        title: moment().add(i, 'month').format('MMMM YYYY'),
        datasets: []
      };

      datasets.forEach((dataset, index) => {
        let chargeDate = moment(dataset.chargeDate);
        let currentDate = moment();

        if(chargeDate.isSame(currentDate.add(i, 'month'), 'month') === true) {
          month.datasets.push(datasets[index]);
        }
      });
      months.push(month);
    }

    return months;
  }

  goBack(): void {
    this.location.back();
  }
}
