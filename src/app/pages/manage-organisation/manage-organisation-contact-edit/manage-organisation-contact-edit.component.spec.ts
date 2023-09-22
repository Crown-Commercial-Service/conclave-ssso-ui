import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageOrganisationContactEditComponent } from './manage-organisation-contact-edit.component';

describe('ManageOrganisationContactEditComponent', () => {
  let component: ManageOrganisationContactEditComponent;
  let fixture: ComponentFixture<ManageOrganisationContactEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageOrganisationContactEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageOrganisationContactEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
