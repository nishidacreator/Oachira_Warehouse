import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingTeamComponent } from './loading-team.component';

describe('LoadingTeamComponent', () => {
  let component: LoadingTeamComponent;
  let fixture: ComponentFixture<LoadingTeamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadingTeamComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoadingTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
