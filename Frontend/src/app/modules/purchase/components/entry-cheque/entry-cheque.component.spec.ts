import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntryChequeComponent } from './entry-cheque.component';

describe('EntryChequeComponent', () => {
  let component: EntryChequeComponent;
  let fixture: ComponentFixture<EntryChequeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntryChequeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntryChequeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
