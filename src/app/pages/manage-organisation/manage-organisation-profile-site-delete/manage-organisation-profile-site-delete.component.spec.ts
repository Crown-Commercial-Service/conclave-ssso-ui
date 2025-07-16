import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { ManageOrganisationSiteDeleteComponent } from './manage-organisation-profile-site-delete.component';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

describe('ManageOrganisationSiteDeleteComponent', () => {
  let component: ManageOrganisationSiteDeleteComponent;
  let fixture: ComponentFixture<ManageOrganisationSiteDeleteComponent>;
  let localStore: any = {
    cii_organisation_id: 'test-org-id',
  };

  beforeEach(async () => {
    spyOn(localStorage, 'getItem').and.callFake((key) =>
      key in localStore ? localStore[key] : null
    );

    await TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
      ],
      declarations: [ManageOrganisationSiteDeleteComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Store, useFactory: () => ({}) }],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageOrganisationSiteDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize component properties correctly', () => {
    expect(component.organisationId).toEqual('test-org-id');
    expect(component.siteId).toEqual(0);
  });

  it('should call onDeleteConfirmClick method when confirm delete button is clicked', () => {
    spyOn(component, 'onDeleteConfirmClick');
    const deleteButton = fixture.nativeElement.querySelector(
      '.govuk-button--warning'
    );
    deleteButton.click();
    expect(component.onDeleteConfirmClick).toHaveBeenCalled();
  });

  it('should call onCancelClick method when cancel button is clicked', () => {
    spyOn(component, 'onCancelClick');
    const cancelButton = fixture.nativeElement.querySelector(
      '.govuk-button--secondary'
    );
    cancelButton.click();
    expect(component.onCancelClick).toHaveBeenCalled();
  });
});
