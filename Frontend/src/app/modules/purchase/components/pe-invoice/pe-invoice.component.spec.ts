import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeInvoiceComponent } from './pe-invoice.component';

describe('PeInvoiceComponent', () => {
  let component: PeInvoiceComponent;
  let fixture: ComponentFixture<PeInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PeInvoiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PeInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
