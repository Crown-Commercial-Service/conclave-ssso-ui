import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessUserMfaComponent } from './success-user-mfa.component';

describe('SuccessUserMfaComponent', () => {
  let component: SuccessUserMfaComponent;
  let fixture: ComponentFixture<SuccessUserMfaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuccessUserMfaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccessUserMfaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
