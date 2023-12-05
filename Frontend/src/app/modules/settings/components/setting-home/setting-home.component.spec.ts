import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingHomeComponent } from './setting-home.component';

describe('SettingHomeComponent', () => {
  let component: SettingHomeComponent;
  let fixture: ComponentFixture<SettingHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingHomeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
