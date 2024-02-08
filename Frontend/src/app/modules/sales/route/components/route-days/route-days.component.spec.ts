import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteDaysComponent } from './route-days.component';

describe('RouteDaysComponent', () => {
  let component: RouteDaysComponent;
  let fixture: ComponentFixture<RouteDaysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RouteDaysComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RouteDaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
