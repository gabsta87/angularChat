import { TestBed } from '@angular/core/testing';

import { EventEditionResolver } from './event-edition.resolver';

describe('EventEditionResolver', () => {
  let resolver: EventEditionResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(EventEditionResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
