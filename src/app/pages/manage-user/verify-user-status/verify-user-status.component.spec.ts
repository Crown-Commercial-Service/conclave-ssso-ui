import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyUserStatusComponent } from './verify-user-status.component';

describe('VerifyUserStatusComponent', () => {
  let component: VerifyUserStatusComponent;
  let fixture: ComponentFixture<VerifyUserStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerifyUserStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyUserStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
