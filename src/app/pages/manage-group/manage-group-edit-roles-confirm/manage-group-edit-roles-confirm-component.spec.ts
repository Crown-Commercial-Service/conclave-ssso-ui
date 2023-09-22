import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageGroupEditRolesConfirmComponent } from './manage-group-edit-roles-confirm-component';

describe('ManageGroupEditRolesConfirmComponent', () => {
  let component: ManageGroupEditRolesConfirmComponent;
  let fixture: ComponentFixture<ManageGroupEditRolesConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageGroupEditRolesConfirmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageGroupEditRolesConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
