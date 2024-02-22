import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagaeComponentComponent } from './managae-component.component';

describe('ManagaeComponentComponent', () => {
  let component: ManagaeComponentComponent;
  let fixture: ComponentFixture<ManagaeComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagaeComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagaeComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
