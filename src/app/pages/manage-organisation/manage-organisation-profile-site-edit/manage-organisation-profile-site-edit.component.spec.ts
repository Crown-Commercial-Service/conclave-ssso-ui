import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageOrganisationSiteEditComponent } from './manage-organisation-profile-site-edit.component';

describe('ManageOrganisationSiteEditComponent', () => {
  let component: ManageOrganisationSiteEditComponent;
  let fixture: ComponentFixture<ManageOrganisationSiteEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageOrganisationSiteEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageOrganisationSiteEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
