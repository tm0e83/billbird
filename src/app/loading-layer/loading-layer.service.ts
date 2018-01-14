import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class LoadingLayerService {
  isVisibleSubject = new BehaviorSubject<boolean>(true);

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
