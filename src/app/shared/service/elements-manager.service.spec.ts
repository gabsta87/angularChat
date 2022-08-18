import { TestBed } from '@angular/core/testing';

import { ElementsManagerService } from './elements-manager.service';

describe('ElementsManagerService', () => {
  let service: ElementsManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ElementsManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
