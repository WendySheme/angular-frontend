import { TestBed } from '@angular/core/testing';

import { TutorAttendance } from './tutor-attendance';

describe('TutorAttendance', () => {
  let service: TutorAttendance;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TutorAttendance);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
