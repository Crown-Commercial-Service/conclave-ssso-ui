import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { OrganisationSiteResponse } from 'src/app/models/site';
import { WrapperOrganisationSiteService } from 'src/app/services/wrapper/wrapper-org-site-service';
import { ManageOrganisationProfileAddContactToSiteComponent } from './manage-organisation-profile-add-contact-to-site.component';
import { OperationEnum } from 'src/app/constants/enum';

describe('ManageOrganisationProfileAddContactToSiteComponent', () => {
  let component: ManageOrganisationProfileAddContactToSiteComponent;
  let fixture: ComponentFixture<ManageOrganisationProfileAddContactToSiteComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let activatedRouteStub: Partial<ActivatedRoute>;
  let orgSiteServiceSpy: jasmine.SpyObj<WrapperOrganisationSiteService>;
  let translateServiceStub: Partial<TranslateService>;

  beforeEach(async () => {
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigateByUrl']);
    const orgSiteServiceSpyObj = jasmine.createSpyObj(
      'WrapperOrganisationSiteService',
      ['getOrganisationSite']
    );

    activatedRouteStub = jasmine.createSpyObj('ActivatedRoute', [], {
      snapshot: { queryParams: of({ data: '{}' }) },
    });

    await TestBed.configureTestingModule({
      declarations: [ManageOrganisationProfileAddContactToSiteComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: Router, useValue: routerSpyObj },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        {
          provide: WrapperOrganisationSiteService,
          useValue: orgSiteServiceSpyObj,
        },
        { provide: TranslateService, useValue: translateServiceStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(
      ManageOrganisationProfileAddContactToSiteComponent
    );
    component = fixture.componentInstance;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    orgSiteServiceSpy = TestBed.inject(
      WrapperOrganisationSiteService
    ) as jasmine.SpyObj<WrapperOrganisationSiteService>;
    translateServiceStub = TestBed.inject(
      TranslateService
    ) as Partial<TranslateService>;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call getSiteDetails method', () => {
      spyOn(component, 'getSiteDetails');
      component.ngOnInit();
      expect(component.getSiteDetails).toHaveBeenCalled();
    });
  });

  describe('getSiteDetails', () => {
    it('should call getOrganisationSite method of orgSiteService with correct parameters', () => {
      const organisationId = 'testOrganisationId';
      const siteId = 123;
      component.organisationId = organisationId;
      component.siteId = siteId;
      orgSiteServiceSpy.getOrganisationSite.and.returnValue(
        of({} as OrganisationSiteResponse)
      );

      component.getSiteDetails();

      expect(orgSiteServiceSpy.getOrganisationSite).toHaveBeenCalledWith(
        organisationId,
        siteId
      );
    });

    it('should set siteInfo property with the response from orgSiteService', () => {
      const siteInfoResponse: OrganisationSiteResponse = {
        organisationId: '123',
        details: {
          siteId: 1,
        },
        siteName: 'test site',
        address: {},
      };
      orgSiteServiceSpy.getOrganisationSite.and.returnValue(
        of(siteInfoResponse)
      );

      component.getSiteDetails();

      expect(component.siteInfo).toEqual(siteInfoResponse);
    });

    it('should log error if orgSiteService returns an error', () => {
      const error = 'Test error';
      spyOn(console, 'log');
      orgSiteServiceSpy.getOrganisationSite.and.returnValue(throwError(error));

      component.getSiteDetails();

      expect(console.log).toHaveBeenCalledWith(error);
    });
  });

  describe('onSiteEditClick', () => {
    it('should navigate to the correct URL', () => {
      const data = { isEdit: true, siteId: 'testSiteId' };
      component.siteId = data.siteId;

      component.onSiteEditClick();

      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(
        'manage-org/profile/site/edit?data=' + JSON.stringify(data)
      );
    });
  });

  describe('Continue', () => {
    it('should call onContactAddClick method when SelectedOption is "addnewcontact"', () => {
      spyOn(component, 'onContactAddClick');
      const selectedOption = 'addnewcontact';

      component.Continue(selectedOption);

      expect(component.onContactAddClick).toHaveBeenCalled();
    });

    it('should call onContactAssignClick method when SelectedOption is "findandassigncontact"', () => {
      spyOn(component, 'onContactAssignClick');
      const selectedOption = 'findandassigncontact';

      component.Continue(selectedOption);

      expect(component.onContactAssignClick).toHaveBeenCalled();
    });

    it('should navigate to the correct URL when SelectedOption is "skip"', () => {
      const selectedOption = 'skip';
      const data = { siteId: component.siteId, siteCreate: true };

      component.Continue(selectedOption);

      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(
        `manage-org/profile/contact-operation-success/${OperationEnum.CreateSite}?data=` +
          JSON.stringify(data)
      );
    });
  });

  describe('onContactAddClick', () => {
    it('should navigate to the correct URL', () => {
      const data = {
        isEdit: false,
        contactId: 0,
        siteId: component.siteId,
        siteCreate: true,
      };

      component.onContactAddClick();

      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(
        'manage-org/profile/site/contact-edit?data=' + JSON.stringify(data)
      );
    });
  });

  describe('onContactAssignClick', () => {
    it('should navigate to the correct URL', () => {
      const data = { assigningSiteId: component.siteId, siteCreate: true };

      component.onContactAssignClick();

      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(
        'contact-assign/select?data=' + JSON.stringify(data)
      );
    });
  });
});
