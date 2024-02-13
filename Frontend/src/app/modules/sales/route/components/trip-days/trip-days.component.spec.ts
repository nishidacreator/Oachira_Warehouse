import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripDaysComponent } from './trip-days.component';

describe('TripDaysComponent', () => {
  let component: TripDaysComponent;
  let fixture: ComponentFixture<TripDaysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TripDaysComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TripDaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
