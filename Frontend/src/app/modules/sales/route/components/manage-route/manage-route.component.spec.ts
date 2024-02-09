import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageRouteComponent } from './manage-route.component';

describe('ManageRouteComponent', () => {
  let component: ManageRouteComponent;
  let fixture: ComponentFixture<ManageRouteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageRouteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
