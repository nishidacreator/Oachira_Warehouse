import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPickListDetailsComponent } from './view-pick-list-details.component';

describe('ViewPickListDetailsComponent', () => {
  let component: ViewPickListDetailsComponent;
  let fixture: ComponentFixture<ViewPickListDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewPickListDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewPickListDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
