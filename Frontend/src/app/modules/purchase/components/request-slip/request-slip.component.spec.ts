import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestSlipComponent } from './request-slip.component';

describe('RequestSlipComponent', () => {
  let component: RequestSlipComponent;
  let fixture: ComponentFixture<RequestSlipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestSlipComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestSlipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
