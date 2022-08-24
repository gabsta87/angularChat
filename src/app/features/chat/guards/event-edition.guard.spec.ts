import { TestBed } from '@angular/core/testing';

import { EventEditionGuard } from './event-edition.guard';

describe('EventEditionGuard', () => {
  let guard: EventEditionGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(EventEditionGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
