import { TestBed } from '@angular/core/testing';

import { TutorJustification } from './tutor-justification';

describe('TutorJustification', () => {
  let service: TutorJustification;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TutorJustification);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
