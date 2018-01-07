import { Injectable } from '@angular/core';

@Injectable()
export class DateService {
  getMonthBetween(date1, date2): number {
    var months;
    months = (date2.getFullYear() - date1.getFullYear()) * 12;
    months -= date1.getMonth() + 1;
    months += date2.getMonth();
    return months <= 0 ? 0 : months;
  }

  getCurrentDateString(): string {
    let now = new Date();
    let day = now.getDate();
    let dayStr = day < 10 ? '0' + day : day;
    let month = now.getMonth() + 1;
    let monthStr = month < 10 ? '0' + month : month;
    return now.getFullYear() + '-' + monthStr + '-' + dayStr;
  }

  getTimestampFromDateString(datestring: string): number {
    return new Date(datestring).getTime();
  }
}