import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnloadingSlipComponent } from './unloading-slip.component';

describe('UnloadingSlipComponent', () => {
  let component: UnloadingSlipComponent;
  let fixture: ComponentFixture<UnloadingSlipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnloadingSlipComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnloadingSlipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
