import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageOrganisationRegistryOrgNotFoundComponent } from './manage-organisation-profile-registry-error-not-my-organisation.component';

describe('ManageOrganisationRegistryOrgNotFoundComponent', () => {
  let component: ManageOrganisationRegistryOrgNotFoundComponent;
  let fixture: ComponentFixture<ManageOrganisationRegistryOrgNotFoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageOrganisationRegistryOrgNotFoundComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageOrganisationRegistryOrgNotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
