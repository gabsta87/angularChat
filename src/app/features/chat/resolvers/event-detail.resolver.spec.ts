import { TestBed } from '@angular/core/testing';

import { EventDetailResolver } from './event-detail.resolver';

describe('EventDetailResolver', () => {
  let resolver: EventDetailResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(EventDetailResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
