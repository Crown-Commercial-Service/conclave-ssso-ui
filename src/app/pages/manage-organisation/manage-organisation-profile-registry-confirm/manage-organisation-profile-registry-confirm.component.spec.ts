import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { ManageOrganisationRegistryConfirmComponent } from './manage-organisation-profile-registry-confirm.component';
import { Store } from '@ngrx/store';
import { TokenService } from 'src/app/services/auth/token.service';
import { ciiService } from 'src/app/services/cii/cii.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('ManageOrganisationRegistryConfirmComponent', () => {
  let component: ManageOrganisationRegistryConfirmComponent;
  let fixture: ComponentFixture<ManageOrganisationRegistryConfirmComponent>;
  let router: Router;
  let activatedRouteStub: Partial<ActivatedRoute>;
  let ciiServiceMock: jasmine.SpyObj<ciiService>;;
  
  let localStore: any = {
    scheme_name: 'test-scheme-name',
    cii_organisation_id: 'test-org-id',
  };

  beforeEach(async () => {
    activatedRouteStub = jasmine.createSpyObj('ActivatedRoute', [], {
      snapshot: { queryParams: { id: '123', organisationId:'test-org-id' } },
      params: of({ scheme: 'GB-COH' }),
    });

    ciiServiceMock = jasmine.createSpyObj('ciiService', [
      'getOrganisationIdentifierDetails',
      'addRegistry'
    ]);
    ciiServiceMock.getOrganisationIdentifierDetails.and.returnValue(of({}));
    ciiServiceMock.addRegistry.and.returnValue(of({}));

    spyOn(localStorage, 'getItem').and.callFake((key) =>
      key in localStore ? localStore[key] : null
    );

    await TestBed.configureTestingModule({
      imports: [],
      declarations: [ManageOrganisationRegistryConfirmComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Store, useFactory: () => ({}) },
        TokenService,
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: ciiService, useValue: ciiServiceMock },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(
      ManageOrganisationRegistryConfirmComponent
    );
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
        
    // spyOn(
    //   ciiServicee,
    //   'getOrganisationIdentifierDetails'
    // ).and.returnValue(of({}));
    // spyOn(ciiServicee, 'addRegistry').and.returnValue(of({}));

    fixture.detectChanges();
  });

  it('should create the component', () => {    
    expect(component).toBeTruthy();
  });

  it('should initialize the component', () => {    
    expect(component.organisationId).toBe('test-org-id');
    expect(component.id).toBe('123');
    expect(component.schemeName).toBe('test-scheme-name');
  });

  it('should handle form submission correctly', () => {
    spyOn(router, 'navigateByUrl');

    component.detailValidityOption = 'CorrectOrganisation';
    component.onSubmit('Continue');

    expect(component.ciiService.addRegistry).toHaveBeenCalledWith(
      'test-org-id',
      'GB-COH',
      '123'
    );

    expect(router.navigateByUrl).toHaveBeenCalledWith(
      'manage-org/profile/test-org-id/registry/confirmation/GB-COH/123'
    );
  });
});
