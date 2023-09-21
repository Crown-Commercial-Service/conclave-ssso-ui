import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageOrganisationRegistryDetailsWrongComponent } from './manage-organisation-profile-registry-error-details-wrong.component';

describe('ManageOrganisationRegistryDetailsWrongComponent', () => {
  let component: ManageOrganisationRegistryDetailsWrongComponent;
  let fixture: ComponentFixture<ManageOrganisationRegistryDetailsWrongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageOrganisationRegistryDetailsWrongComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageOrganisationRegistryDetailsWrongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
