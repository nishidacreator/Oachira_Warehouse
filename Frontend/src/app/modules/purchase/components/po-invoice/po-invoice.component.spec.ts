import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoInvoiceComponent } from './po-invoice.component';

describe('PoInvoiceComponent', () => {
  let component: PoInvoiceComponent;
  let fixture: ComponentFixture<PoInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PoInvoiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PoInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
