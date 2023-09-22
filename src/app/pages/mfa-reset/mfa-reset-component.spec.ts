import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendMFAResetNotificationSuccessComponent } from './send-mfa-reset-notification-success';

describe('SendMFAResetNotificationSuccessComponent', () => {
  let component: SendMFAResetNotificationSuccessComponent;
  let fixture: ComponentFixture<SendMFAResetNotificationSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendMFAResetNotificationSuccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SendMFAResetNotificationSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
