import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageOrganisationRegistrySearchComponent } from './manage-organisation-profile-registry-search.component';

describe('ManageOrganisationRegistrySearchComponent', () => {
  let component: ManageOrganisationRegistrySearchComponent;
  let fixture: ComponentFixture<ManageOrganisationRegistrySearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageOrganisationRegistrySearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageOrganisationRegistrySearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
