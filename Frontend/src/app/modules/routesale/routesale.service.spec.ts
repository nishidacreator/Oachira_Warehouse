import { TestBed } from '@angular/core/testing';

import { RoutesaleService } from './routesale.service';

describe('RoutesaleService', () => {
  let service: RoutesaleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoutesaleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
