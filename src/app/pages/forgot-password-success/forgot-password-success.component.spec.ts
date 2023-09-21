import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotPasswordSuccessComponent } from './forgot-password-success';

describe('ForgotPasswordSuccessComponent', () => {
  let component: ForgotPasswordSuccessComponent;
  let fixture: ComponentFixture<ForgotPasswordSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForgotPasswordSuccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotPasswordSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
