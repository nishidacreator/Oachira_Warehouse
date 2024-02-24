import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintBrokerSlipComponent } from './print-broker-slip.component';

describe('PrintBrokerSlipComponent', () => {
  let component: PrintBrokerSlipComponent;
  let fixture: ComponentFixture<PrintBrokerSlipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintBrokerSlipComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrintBrokerSlipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
