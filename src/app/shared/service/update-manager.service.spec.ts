import { TestBed } from '@angular/core/testing';

import { UpdateManagerService } from './update-manager.service';

describe('UpdateManagerService', () => {
  let service: UpdateManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpdateManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
