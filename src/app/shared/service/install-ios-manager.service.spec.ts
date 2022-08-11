import { TestBed } from '@angular/core/testing';

import { InstallIosManagerService } from './install-ios-manager.service';

describe('InstallIosManagerService', () => {
  let service: InstallIosManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InstallIosManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
