import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageOrganisationRegisterationCiiComponent } from './manage-organisation-registeration-cii.component';

describe('ManageOrganisationRegisterationCiiComponent', () => {
  let component: ManageOrganisationRegisterationCiiComponent;
  let fixture: ComponentFixture<ManageOrganisationRegisterationCiiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageOrganisationRegisterationCiiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageOrganisationRegisterationCiiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
