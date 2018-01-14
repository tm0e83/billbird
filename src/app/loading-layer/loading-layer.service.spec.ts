import { TestBed, inject } from '@angular/core/testing';

import { LoadingLayerService } from './loading-layer.service';

describe('LoadingLayerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoadingLayerService]
    });
  });

  it('should be created', inject([LoadingLayerService], (service: LoadingLayerService) => {
    expect(service).toBeTruthy();
  }));
});
