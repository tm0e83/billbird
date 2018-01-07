import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'unixDateToString'
})
export class unixDateToStringPipe {
  transform(unixDate: number) {
    if(unixDate) {
      let now = new Date(unixDate);
      let day = now.getDate();
      let dayStr = day < 10 ? '0' + day : day;
      let month = now.getMonth() + 1;
      let monthStr = month < 10 ? '0' + month : month;
      return now.getFullYear() + '-' + monthStr + '-' + dayStr;
    }
  }
}