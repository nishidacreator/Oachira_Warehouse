import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerGradeComponent } from './customer-grade.component';

describe('CustomerGradeComponent', () => {
  let component: CustomerGradeComponent;
  let fixture: ComponentFixture<CustomerGradeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerGradeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerGradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
