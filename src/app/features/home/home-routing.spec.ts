import { TestBed } from '@angular/core/testing';

import { HomeRouting } from './home-routing';

describe('HomeRouting', () => {
  let service: HomeRouting;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HomeRouting);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
