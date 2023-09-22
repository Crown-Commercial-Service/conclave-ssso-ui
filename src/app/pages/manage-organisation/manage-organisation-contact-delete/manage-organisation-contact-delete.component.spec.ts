import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageOrganisationContactDeleteComponent } from './manage-organisation-contact-delete.component';

describe('ManageOrganisationContactDeleteComponent', () => {
  let component: ManageOrganisationContactDeleteComponent;
  let fixture: ComponentFixture<ManageOrganisationContactDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageOrganisationContactDeleteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageOrganisationContactDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
