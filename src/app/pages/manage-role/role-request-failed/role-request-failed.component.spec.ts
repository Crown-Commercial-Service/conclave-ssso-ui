import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleRequestFailedComponent } from './role-request-failed.component';

describe('RoleRequestFailedComponent', () => {
  let component: RoleRequestFailedComponent;
  let fixture: ComponentFixture<RoleRequestFailedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoleRequestFailedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleRequestFailedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
