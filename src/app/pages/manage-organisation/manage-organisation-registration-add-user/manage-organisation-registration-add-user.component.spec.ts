import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageOrgRegAddUserComponent } from './manage-organisation-registration-add-user.component';

describe('ManageOrgRegAddUserComponent', () => {
  let component: ManageOrgRegAddUserComponent;
  let fixture: ComponentFixture<ManageOrgRegAddUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageOrgRegAddUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageOrgRegAddUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
