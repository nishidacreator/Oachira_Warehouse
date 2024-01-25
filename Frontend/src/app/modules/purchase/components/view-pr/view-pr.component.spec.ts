import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPrComponent } from './view-pr.component';

describe('ViewPrComponent', () => {
  let component: ViewPrComponent;
  let fixture: ComponentFixture<ViewPrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewPrComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewPrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
