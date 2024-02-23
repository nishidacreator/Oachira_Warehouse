import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseTransporterComponent } from './purchase-transporter.component';

describe('PurchaseTransporterComponent', () => {
  let component: PurchaseTransporterComponent;
  let fixture: ComponentFixture<PurchaseTransporterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseTransporterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseTransporterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
