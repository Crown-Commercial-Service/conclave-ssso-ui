import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageOrganisationSiteDeleteComponent } from './manage-organisation-profile-site-delete.component';

describe('ManageOrganisationSiteDeleteComponent', () => {
  let component: ManageOrganisationSiteDeleteComponent;
  let fixture: ComponentFixture<ManageOrganisationSiteDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageOrganisationSiteDeleteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageOrganisationSiteDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
