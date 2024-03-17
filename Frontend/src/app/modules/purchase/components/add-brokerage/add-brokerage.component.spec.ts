import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBrokerageComponent } from './add-brokerage.component';

describe('AddBrokerageComponent', () => {
  let component: AddBrokerageComponent;
  let fixture: ComponentFixture<AddBrokerageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddBrokerageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddBrokerageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
