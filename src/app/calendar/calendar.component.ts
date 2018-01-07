import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  moduleId: module.id,
  selector: 'calendar',
  templateUrl: './calendar.component.html'
})
export class CalendarComponent {
  constructor(
    private location: Location
  ) {}

  goBack(): void {
    this.location.back();
  }
}
