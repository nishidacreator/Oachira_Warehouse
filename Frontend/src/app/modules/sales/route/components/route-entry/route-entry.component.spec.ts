import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteEntryComponent } from './route-entry.component';

describe('RouteEntryComponent', () => {
  let component: RouteEntryComponent;
  let fixture: ComponentFixture<RouteEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RouteEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RouteEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
