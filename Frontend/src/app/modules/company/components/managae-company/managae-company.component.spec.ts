import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagaeCompanyComponent } from './managae-company.component';

describe('ManagaeCompanyComponent', () => {
  let component: ManagaeCompanyComponent;
  let fixture: ComponentFixture<ManagaeCompanyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagaeCompanyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagaeCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
