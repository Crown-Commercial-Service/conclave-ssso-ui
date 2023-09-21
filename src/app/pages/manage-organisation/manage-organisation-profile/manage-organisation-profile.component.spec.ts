import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageOrganisationProfileComponent } from './manage-organisation-profile.component';

describe('ManageOrganisationProfileComponent', () => {
  let component: ManageOrganisationProfileComponent;
  let fixture: ComponentFixture<ManageOrganisationProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageOrganisationProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageOrganisationProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
