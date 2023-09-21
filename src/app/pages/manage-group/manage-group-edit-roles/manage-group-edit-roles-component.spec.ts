import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageGroupEditRolesComponent } from './manage-group-edit-roles-component';

describe('ManageGroupEditRolesComponent', () => {
  let component: ManageGroupEditRolesComponent;
  let fixture: ComponentFixture<ManageGroupEditRolesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageGroupEditRolesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageGroupEditRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
