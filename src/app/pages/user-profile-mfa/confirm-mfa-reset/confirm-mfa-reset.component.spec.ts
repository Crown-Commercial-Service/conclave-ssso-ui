import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmMfaResetComponent } from './confirm-mfa-reset.component';

describe('ConfirmMfaResetComponent', () => {
  let component: ConfirmMfaResetComponent;
  let fixture: ComponentFixture<ConfirmMfaResetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmMfaResetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmMfaResetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
