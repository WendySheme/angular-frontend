import { TestBed } from '@angular/core/testing';

import { UserTranformerService } from './user-tranformer.service';

describe('UserTranformerService', () => {
  let service: UserTranformerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserTranformerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
