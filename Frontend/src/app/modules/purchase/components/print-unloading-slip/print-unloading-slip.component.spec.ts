import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintUnloadingSlipComponent } from './print-unloading-slip.component';

describe('PrintUnloadingSlipComponent', () => {
  let component: PrintUnloadingSlipComponent;
  let fixture: ComponentFixture<PrintUnloadingSlipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintUnloadingSlipComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrintUnloadingSlipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
