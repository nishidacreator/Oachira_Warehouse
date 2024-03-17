import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUnloadingSlipComponent } from './add-unloading-slip.component';

describe('AddUnloadingSlipComponent', () => {
  let component: AddUnloadingSlipComponent;
  let fixture: ComponentFixture<AddUnloadingSlipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUnloadingSlipComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUnloadingSlipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
