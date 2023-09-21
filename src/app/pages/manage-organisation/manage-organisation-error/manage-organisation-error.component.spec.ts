import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageOrganisationErrorComponent } from './manage-organisation-error.component';

describe('ManageOrganisationErrorComponent', () => {
  let component: ManageOrganisationErrorComponent;
  let fixture: ComponentFixture<ManageOrganisationErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageOrganisationErrorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageOrganisationErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
