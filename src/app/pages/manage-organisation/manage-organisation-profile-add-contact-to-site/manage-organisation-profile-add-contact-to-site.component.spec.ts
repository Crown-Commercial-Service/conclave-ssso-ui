import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageOrganisationProfileAddContactToSiteComponent } from './manage-organisation-profile-add-contact-to-site.component';

describe('ManageOrganisationProfileAddContactToSiteComponent', () => {
  let component: ManageOrganisationProfileAddContactToSiteComponent;
  let fixture: ComponentFixture<ManageOrganisationProfileAddContactToSiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageOrganisationProfileAddContactToSiteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageOrganisationProfileAddContactToSiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
