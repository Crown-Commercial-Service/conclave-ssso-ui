import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleGuard } from './role.guard';

describe('RoleGuard', () => {
  let component: RoleGuard;
  let fixture: ComponentFixture<RoleGuard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoleGuard ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleGuard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
