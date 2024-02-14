import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRouteOrderComponent } from './view-route-order.component';

describe('ViewRouteOrderComponent', () => {
  let component: ViewRouteOrderComponent;
  let fixture: ComponentFixture<ViewRouteOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewRouteOrderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewRouteOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
