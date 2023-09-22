import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageOrganisationRegistryConfirmComponent } from './manage-organisation-profile-registry-confirm.component';

describe('ManageOrganisationRegistryConfirmComponent', () => {
  let component: ManageOrganisationRegistryConfirmComponent;
  let fixture: ComponentFixture<ManageOrganisationRegistryConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageOrganisationRegistryConfirmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageOrganisationRegistryConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
