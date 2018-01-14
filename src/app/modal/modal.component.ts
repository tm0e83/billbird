import { Observable } from 'rxjs';
import { Component, OnInit, Input } from '@angular/core';
import { ModalService } from './modal.service';
import { NgRedux, select } from 'ng2-redux';

@Component({
  selector: 'modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  isVisible: boolean = false;

  constructor(
    private modalService: ModalService
  ) {}

  ngOnInit() {

    this.modalService
      .isVisible()
      .subscribe(isVisible => {
        this.isVisible = isVisible;
      });
  }

  show() {
    this.modalService.show();
  }

  hide() {
    this.modalService.hide();
  }
}