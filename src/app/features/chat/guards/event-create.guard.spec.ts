import { TestBed } from '@angular/core/testing';

import { EventCreateGuard } from './event-create.guard';

describe('EventCreateGuard', () => {
  let guard: EventCreateGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(EventCreateGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
