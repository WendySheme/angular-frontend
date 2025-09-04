import { TestBed } from '@angular/core/testing';

import { StudentManagement } from './student-management';

describe('StudentManagement', () => {
  let service: StudentManagement;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentManagement);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
