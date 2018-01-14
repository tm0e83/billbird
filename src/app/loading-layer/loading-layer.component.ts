import { Component, OnInit } from '@angular/core';
import { LoadingLayerService }  from './loading-layer.service';

@Component({
  selector: 'loading-layer',
  templateUrl: './loading-layer.component.html',
  styleUrls: ['./loading-layer.component.scss']
})
export class LoadingLayerComponent implements OnInit {
  isVisible: boolean = true;

  constructor(
    private loadingLayerService: LoadingLayerService
  ) {}

  ngOnInit() {
    this.loadingLayerService.isVisible().subscribe((isVisible) => {
      this.isVisible = isVisible;
    });
  }
}
