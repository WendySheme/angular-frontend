import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JustificationList } from './justification-list';

describe('JustificationList', () => {
  let component: JustificationList;
  let fixture: ComponentFixture<JustificationList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JustificationList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JustificationList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
