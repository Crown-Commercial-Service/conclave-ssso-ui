import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageOrganisationContactOperationSuccessComponent } from './manage-organisation-contact-operation-success.component';

describe('ManageOrganisationContactOperationSuccessComponent', () => {
  let component: ManageOrganisationContactOperationSuccessComponent;
  let fixture: ComponentFixture<ManageOrganisationContactOperationSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageOrganisationContactOperationSuccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageOrganisationContactOperationSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
