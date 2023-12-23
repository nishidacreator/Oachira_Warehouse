import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDistributorComponent } from './product-distributor.component';

describe('ProductDistributorComponent', () => {
  let component: ProductDistributorComponent;
  let fixture: ComponentFixture<ProductDistributorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductDistributorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductDistributorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
