import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintPurchaseTransporterComponent } from './print-purchase-transporter.component';

describe('PrintPurchaseTransporterComponent', () => {
  let component: PrintPurchaseTransporterComponent;
  let fixture: ComponentFixture<PrintPurchaseTransporterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintPurchaseTransporterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrintPurchaseTransporterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
