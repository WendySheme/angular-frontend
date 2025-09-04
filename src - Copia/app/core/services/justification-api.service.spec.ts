import { TestBed } from '@angular/core/testing';

import { JustificationApiService } from './justification-api.service';

describe('JustificationApiService', () => {
  let service: JustificationApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JustificationApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
