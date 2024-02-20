import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRouteEntryComponent } from './view-route-entry.component';

describe('ViewRouteEntryComponent', () => {
  let component: ViewRouteEntryComponent;
  let fixture: ComponentFixture<ViewRouteEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewRouteEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewRouteEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
