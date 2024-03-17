import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPurchaseTransporterComponent } from './add-purchase-transporter.component';

describe('AddPurchaseTransporterComponent', () => {
  let component: AddPurchaseTransporterComponent;
  let fixture: ComponentFixture<AddPurchaseTransporterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPurchaseTransporterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPurchaseTransporterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
