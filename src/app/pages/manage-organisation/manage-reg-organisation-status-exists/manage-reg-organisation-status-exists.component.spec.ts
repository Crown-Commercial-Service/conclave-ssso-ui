import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ManageOrgRegSearchStatusExistsComponent } from './manage-reg-organisation-status-exists.component';
import { OrganisationService } from 'src/app/services/postgres/organisation.service';
import { TranslateModule } from '@ngx-translate/core';

describe('ManageOrgRegSearchStatusExistsComponent', () => {
  let component: ManageOrgRegSearchStatusExistsComponent;
  let fixture: ComponentFixture<ManageOrgRegSearchStatusExistsComponent>;
  let organisationServiceSpy: jasmine.SpyObj<OrganisationService>;

  beforeEach(async () => {
    organisationServiceSpy = jasmine.createSpyObj('OrganisationService', [
      'requestOrgAdminToJoinOrg',
    ]);

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      declarations: [ManageOrgRegSearchStatusExistsComponent],
      providers: [
        {
          provide: OrganisationService,
          useValue: organisationServiceSpy,
        },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ data: 'eyJhY2Nlc3NNb2RlIjogMTIzNH0=' }),
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageOrgRegSearchStatusExistsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set orgreginfo property on init', () => {
    const orgreginfo = { ciiOrgId: '123' };
    spyOn(sessionStorage, 'getItem').and.returnValue(
      JSON.stringify(orgreginfo)
    );
    component.ngOnInit();
    expect(component.orgreginfo).toEqual(orgreginfo);
  });

  it('should navigate to notify-join-org page on continue button click', () => {
    component.orgreginfo = {
      ciiOrgId: '123',
      adminUserFirstName: 'John',
      adminUserLastName: 'Doe',
      adminEmail: 'john.doe@example.com',
    };
    const navigateSpy = spyOn(component.router, 'navigateByUrl');
    organisationServiceSpy.requestOrgAdminToJoinOrg.and.returnValue(of({}));
    component.onContinueSingleOrgRegistered('Continue');
    expect(
      organisationServiceSpy.requestOrgAdminToJoinOrg
    ).toHaveBeenCalledWith('123', 'John', 'Doe', 'john.doe@example.com');
  });

  it('should go back in history on goBack button click', () => {
    const goBackSpy = spyOn(window.history, 'back');
    component.goBack('This is not my organisation');
    expect(goBackSpy).toHaveBeenCalled();
  });

  it('should display breadcrumbs for buyer flow', () => {
    spyOn(localStorage, 'getItem').and.returnValue('3');
    fixture.detectChanges();
    const breadcrumbs = fixture.nativeElement.querySelector(
      '.govuk-breadcrumbs__list'
    );
    expect(breadcrumbs).toBeTruthy();
    expect(breadcrumbs.children.length).toBe(9);
  });

  it('should display org details and continue button', () => {
    component.orgreginfo = {
      ciiOrgId: '123',
      adminUserFirstName: 'John',
      adminUserLastName: 'Doe',
      adminEmail: 'john.doe@example.com',
    };
    fixture.detectChanges();
    const orgDetails = fixture.nativeElement.querySelector(
      'app-reg-org-details'
    );
    const continueButton =
      fixture.nativeElement.querySelector('#continueButton');
    expect(orgDetails).toBeTruthy();
    expect(continueButton).toBeTruthy();
    expect(continueButton.textContent).toContain('Continue');
  });

  it('should display "This is not my organisation" button', () => {
    fixture.detectChanges();
    const cancelButton = fixture.nativeElement.querySelector(
      '.govuk-button--secondary'
    );
    expect(cancelButton).toBeTruthy();
    expect(cancelButton.textContent).toContain(
      'THIS_IS_NOT_MY_ORGANISATION_BTN'
    );
  });
});
