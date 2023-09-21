import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageOrganisationProfileSuccessComponent } from './manage-organisation-profile-success.component';

describe('ManageOrganisationProfileSuccessComponent', () => {
  let component: ManageOrganisationProfileSuccessComponent;
  let fixture: ComponentFixture<ManageOrganisationProfileSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageOrganisationProfileSuccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageOrganisationProfileSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
