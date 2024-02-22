import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEntryComponent } from './view-entry.component';

describe('ViewEntryComponent', () => {
  let component: ViewEntryComponent;
  let fixture: ComponentFixture<ViewEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
