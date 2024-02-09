import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerCategoryComponent } from './customer-category.component';

describe('CustomerCategoryComponent', () => {
  let component: CustomerCategoryComponent;
  let fixture: ComponentFixture<CustomerCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerCategoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
