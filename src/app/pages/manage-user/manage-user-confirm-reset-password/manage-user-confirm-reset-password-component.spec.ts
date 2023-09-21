import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageUserConfirmResetPasswordComponent } from './manage-user-confirm-reset-password-component';

describe('ManageUserConfirmResetPasswordComponent', () => {
  let component: ManageUserConfirmResetPasswordComponent;
  let fixture: ComponentFixture<ManageUserConfirmResetPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageUserConfirmResetPasswordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageUserConfirmResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
