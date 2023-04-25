import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyUserComponent } from './verify-user.component';

describe('VerifyUserComponent', () => {
  let component: VerifyUserComponent;
  let fixture: ComponentFixture<VerifyUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerifyUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
