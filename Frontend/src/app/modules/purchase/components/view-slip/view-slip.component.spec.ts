import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSlipComponent } from './view-slip.component';

describe('ViewSlipComponent', () => {
  let component: ViewSlipComponent;
  let fixture: ComponentFixture<ViewSlipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewSlipComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewSlipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
