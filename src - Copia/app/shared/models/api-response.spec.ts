import { TestBed } from '@angular/core/testing';

import { ApiResponse } from './api-response';

describe('ApiResponse', () => {
  let service: ApiResponse;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiResponse);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
