import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPeComponent } from './edit-pe.component';

describe('EditPeComponent', () => {
  let component: EditPeComponent;
  let fixture: ComponentFixture<EditPeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditPeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
