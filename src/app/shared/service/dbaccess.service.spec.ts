import { TestBed } from '@angular/core/testing';

import { DbaccessService } from './dbaccess.service';

describe('DbaccessService', () => {
  let service: DbaccessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DbaccessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
