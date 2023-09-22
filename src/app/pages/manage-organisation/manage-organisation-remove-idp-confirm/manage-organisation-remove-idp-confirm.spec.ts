import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageOrganisationRemoveIdpConfirmComponent} from './manage-organisation-remove-idp-confirm';

describe('ManageOrganisationRemoveIdpConfirmComponent', () => {
  let component: ManageOrganisationRemoveIdpConfirmComponent;
  let fixture: ComponentFixture<ManageOrganisationRemoveIdpConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageOrganisationRemoveIdpConfirmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageOrganisationRemoveIdpConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
