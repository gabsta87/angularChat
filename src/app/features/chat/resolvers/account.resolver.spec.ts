import { TestBed } from '@angular/core/testing';

import { AccountResolver } from './account.resolver';

describe('AccountResolver', () => {
  let resolver: AccountResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(AccountResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
