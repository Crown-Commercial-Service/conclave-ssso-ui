import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleRequestSuccessComponent } from './role-request-success.component';

describe('RoleRequestSuccessComponent', () => {
  let component: RoleRequestSuccessComponent;
  let fixture: ComponentFixture<RoleRequestSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoleRequestSuccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleRequestSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
