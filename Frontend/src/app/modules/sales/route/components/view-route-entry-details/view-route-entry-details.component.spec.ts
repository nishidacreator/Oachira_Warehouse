import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRouteEntryDetailsComponent } from './view-route-entry-details.component';

describe('ViewRouteEntryDetailsComponent', () => {
  let component: ViewRouteEntryDetailsComponent;
  let fixture: ComponentFixture<ViewRouteEntryDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewRouteEntryDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewRouteEntryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
