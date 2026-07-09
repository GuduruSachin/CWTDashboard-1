import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PriorityReportComponent } from './priority-report.component';

describe('PriorityReportComponent', () => {
  let component: PriorityReportComponent;
  let fixture: ComponentFixture<PriorityReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PriorityReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriorityReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
