import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmAcceptComponent } from './confirm-accept.component';

describe('ConfirmAcceptComponent', () => {
  let component: ConfirmAcceptComponent;
  let fixture: ComponentFixture<ConfirmAcceptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmAcceptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmAcceptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
