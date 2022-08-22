import { TestBed } from '@angular/core/testing';

import { ActivitiesResolver } from './activities.resolver';

describe('ActivitiesResolver', () => {
  let resolver: ActivitiesResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(ActivitiesResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
