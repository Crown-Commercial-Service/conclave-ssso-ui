import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendMFAResetNotificationComponent } from './send-mfa-reset-notification';

describe('SendMFAResetNotificationComponent', () => {
  let component: SendMFAResetNotificationComponent;
  let fixture: ComponentFixture<SendMFAResetNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendMFAResetNotificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SendMFAResetNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
