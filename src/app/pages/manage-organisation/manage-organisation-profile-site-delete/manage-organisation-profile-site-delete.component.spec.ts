import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { ManageOrganisationSiteDeleteComponent } from './manage-organisation-profile-site-delete.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';

describe('ManageOrganisationSiteDeleteComponent', () => {
  let component: ManageOrganisationSiteDeleteComponent;
  let fixture: ComponentFixture<ManageOrganisationSiteDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        TranslateModule.forRoot(),
      ],
      declarations: [ManageOrganisationSiteDeleteComponent],
      providers: [{ provide: Store, useFactory: () => ({}) }],
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
    expect(component.organisationId).toEqual('');
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
