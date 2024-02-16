import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRouteOrderDetailsComponent } from './view-route-order-details.component';

describe('ViewRouteOrderDetailsComponent', () => {
  let component: ViewRouteOrderDetailsComponent;
  let fixture: ComponentFixture<ViewRouteOrderDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewRouteOrderDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewRouteOrderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
