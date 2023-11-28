import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageUserReactivateConfirmComponent } from './manage-user-reactivate-confirm.component';

describe('ManageUserReactivateConfirmComponent', () => {
  let component: ManageUserReactivateConfirmComponent;
  let fixture: ComponentFixture<ManageUserReactivateConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageUserReactivateConfirmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageUserReactivateConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
