import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageOrganisationRegistryAddConfirmationComponent } from './manage-organisation-profile-registry-add-confirmed.component';

describe('ManageOrganisationRegistryAddConfirmationComponent', () => {
  let component: ManageOrganisationRegistryAddConfirmationComponent;
  let fixture: ComponentFixture<ManageOrganisationRegistryAddConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageOrganisationRegistryAddConfirmationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageOrganisationRegistryAddConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
