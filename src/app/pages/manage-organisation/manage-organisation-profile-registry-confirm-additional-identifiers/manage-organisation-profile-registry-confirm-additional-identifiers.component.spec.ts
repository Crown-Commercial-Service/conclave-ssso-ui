import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageOrganisationRegistryConfirmAdditionalDetailsComponent } from './manage-organisation-profile-registry-confirm-additional-identifiers.component';

describe('ManageOrganisationRegistryConfirmAdditionalDetailsComponent', () => {
  let component: ManageOrganisationRegistryConfirmAdditionalDetailsComponent;
  let fixture: ComponentFixture<ManageOrganisationRegistryConfirmAdditionalDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageOrganisationRegistryConfirmAdditionalDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageOrganisationRegistryConfirmAdditionalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
