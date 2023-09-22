import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageOrganisationRegistryErrorComponent } from './manage-organisation-profile-registry-error.component';

describe('ManageOrganisationRegistryErrorComponent', () => {
  let component: ManageOrganisationRegistryErrorComponent;
  let fixture: ComponentFixture<ManageOrganisationRegistryErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageOrganisationRegistryErrorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageOrganisationRegistryErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
