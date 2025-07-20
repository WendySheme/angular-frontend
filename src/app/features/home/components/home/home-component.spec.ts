import { TestBed } from '@angular/core/testing';

import { HomeComponent } from './home-component';

describe('HomeComponent', () => {
  let service: HomeComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HomeComponent);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
