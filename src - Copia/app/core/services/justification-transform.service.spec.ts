import { TestBed } from '@angular/core/testing';

import { JustificationTransformService } from './justification-transform.service';

describe('JustificationTransformService', () => {
  let service: JustificationTransformService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JustificationTransformService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
