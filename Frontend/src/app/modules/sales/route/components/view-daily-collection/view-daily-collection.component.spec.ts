import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDailyCollectionComponent } from './view-daily-collection.component';

describe('ViewDailyCollectionComponent', () => {
  let component: ViewDailyCollectionComponent;
  let fixture: ComponentFixture<ViewDailyCollectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewDailyCollectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewDailyCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
