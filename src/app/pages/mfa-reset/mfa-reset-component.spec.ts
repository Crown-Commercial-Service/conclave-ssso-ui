import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MFAResetComponent } from './mfa-reset-component';

describe('MFAResetComponent', () => {
  let component: MFAResetComponent;
  let fixture: ComponentFixture<MFAResetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MFAResetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MFAResetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
