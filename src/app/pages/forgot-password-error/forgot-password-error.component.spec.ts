import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotPasswordErrorComponent } from './forgot-password-error.component';

describe('ForgotPasswordErrorComponent', () => {
  let component: ForgotPasswordErrorComponent;
  let fixture: ComponentFixture<ForgotPasswordErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForgotPasswordErrorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotPasswordErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
