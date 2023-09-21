import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageOrganisationRegistryDeleteComponent } from './manage-organisation-profile-registry-delete.component';

describe('ManageOrganisationRegistryDeleteComponent', () => {
  let component: ManageOrganisationRegistryDeleteComponent;
  let fixture: ComponentFixture<ManageOrganisationRegistryDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageOrganisationRegistryDeleteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageOrganisationRegistryDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
