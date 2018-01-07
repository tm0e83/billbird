import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class CreateDatasetModalService {
  isVisibleSubject = new BehaviorSubject<boolean>(false);

  isVisible() {
    return this.isVisibleSubject.asObservable();
  }

  show() {
    this.isVisibleSubject.next(true);
  }

  hide() {
    this.isVisibleSubject.next(false);
  }
}
