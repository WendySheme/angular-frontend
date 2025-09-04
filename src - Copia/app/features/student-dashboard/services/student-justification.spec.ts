import { TestBed } from '@angular/core/testing';

import { StudentJustification } from './student-justification';

describe('StudentJustification', () => {
  let service: StudentJustification;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentJustification);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
