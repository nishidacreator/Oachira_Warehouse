import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsViewDailycollectionComponent } from './details-view-dailycollection.component';

describe('DetailsViewDailycollectionComponent', () => {
  let component: DetailsViewDailycollectionComponent;
  let fixture: ComponentFixture<DetailsViewDailycollectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailsViewDailycollectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsViewDailycollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
