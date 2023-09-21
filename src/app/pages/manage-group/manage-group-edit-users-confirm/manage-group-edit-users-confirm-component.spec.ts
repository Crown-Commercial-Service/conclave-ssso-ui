import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageGroupEditUsersConfirmComponent } from './manage-group-edit-users-confirm-component';

describe('ManageGroupEditUsersConfirmComponent', () => {
  let component: ManageGroupEditUsersConfirmComponent;
  let fixture: ComponentFixture<ManageGroupEditUsersConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageGroupEditUsersConfirmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageGroupEditUsersConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
