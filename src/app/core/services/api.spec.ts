import { ApiResponse } from './../../shared/models/api-response';
import { TestBed } from '@angular/core/testing';

import { ApiService } from './api';

describe('Api', () => {
  let service: ApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
