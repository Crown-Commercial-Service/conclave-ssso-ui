import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageOrgRegErrorUsernameExistsComponent } from './manage-organisation-registration-error-username-already-exists.component';

describe('ManageOrgRegErrorUsernameExistsComponent', () => {
  let component: ManageOrgRegErrorUsernameExistsComponent;
  let fixture: ComponentFixture<ManageOrgRegErrorUsernameExistsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageOrgRegErrorUsernameExistsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageOrgRegErrorUsernameExistsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
