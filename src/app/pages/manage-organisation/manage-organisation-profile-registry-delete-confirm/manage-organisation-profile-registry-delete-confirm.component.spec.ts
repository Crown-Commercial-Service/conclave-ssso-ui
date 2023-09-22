import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageOrganisationRegistryDeleteConfirmationComponent } from './manage-organisation-profile-registry-delete-confirm.component';

describe('ManageOrganisationRegistryDeleteConfirmationComponent', () => {
  let component: ManageOrganisationRegistryDeleteConfirmationComponent;
  let fixture: ComponentFixture<ManageOrganisationRegistryDeleteConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageOrganisationRegistryDeleteConfirmationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageOrganisationRegistryDeleteConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
