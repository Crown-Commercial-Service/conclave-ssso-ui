import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageGroupEditUsersComponent } from './manage-group-edit-users-component';

describe('ManageGroupEditUsersComponent', () => {
  let component: ManageGroupEditUsersComponent;
  let fixture: ComponentFixture<ManageGroupEditUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageGroupEditUsersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageGroupEditUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
