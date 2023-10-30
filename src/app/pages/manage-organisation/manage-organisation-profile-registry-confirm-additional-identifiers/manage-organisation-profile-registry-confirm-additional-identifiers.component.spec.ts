import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ManageOrganisationRegistryConfirmAdditionalDetailsComponent } from './manage-organisation-profile-registry-confirm-additional-identifiers.component';
import { ciiService } from 'src/app/services/cii/cii.service';
import { WrapperUserService } from 'src/app/services/wrapper/wrapper-user.service';
import { TokenService } from 'src/app/services/auth/token.service';
import { ViewportScroller } from '@angular/common';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { StoreModule } from '@ngrx/store';

describe('ManageOrganisationRegistryConfirmAdditionalDetailsComponent', () => {
  let component: ManageOrganisationRegistryConfirmAdditionalDetailsComponent;
  let fixture: ComponentFixture<ManageOrganisationRegistryConfirmAdditionalDetailsComponent>;
  let mockCiiService: jasmine.SpyObj<ciiService>;
  let mockWrapperService: jasmine.SpyObj<WrapperUserService>;
  let mockRouter: Router;
  let mockActivatedRoute: any;
  let mockTokenService: jasmine.SpyObj<TokenService>;

  beforeEach(async () => {
    const viewportScrollerSpy = jasmine.createSpyObj('ViewportScroller', [
      'setOffset',
    ]);

    mockCiiService = jasmine.createSpyObj('ciiService', [
      'getOrganisationIdentifierDetails',
      'addRegistry',
    ]);
    mockWrapperService = jasmine.createSpyObj('WrapperUserService', [], {
      organisationId: 'org123',
    });
    mockRouter = jasmine.createSpyObj('Router', ['navigateByUrl']);
    mockActivatedRoute = {
      params: of({ id: '123', scheme: 'GB-COH' }),
    };

    await TestBed.configureTestingModule({
      declarations: [
        ManageOrganisationRegistryConfirmAdditionalDetailsComponent,
      ],
      imports: [RouterTestingModule, StoreModule.forRoot({})],
      providers: [
        { provide: ciiService, useValue: mockCiiService },
        { provide: WrapperUserService, useValue: mockWrapperService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        TokenService,
        { provide: ViewportScroller, useValue: viewportScrollerSpy },
        { provide: ScrollHelper, useValue: {} },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(
      ManageOrganisationRegistryConfirmAdditionalDetailsComponent
    );
    component = fixture.componentInstance;

    localStorage.setItem('cii_organisation_id', 'ciiOrgId');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load organization identifier details and handle success', () => {
    const mockIdentifierDetails = {
      additionalIdentifiers: [
        { id: '123', scheme: 'GB-COH', legalName: 'Company A' },
        { id: '456', scheme: 'US-DUN', legalName: 'Company B' },
      ],
    };
    mockCiiService.getOrganisationIdentifierDetails.and.returnValue(
      of(mockIdentifierDetails)
    );

    component.ngOnInit();

    expect(
      mockCiiService.getOrganisationIdentifierDetails
    ).toHaveBeenCalledWith('ciiOrgId', 'GB-COH', '123');
    expect(component.item$).toBeDefined();
    component.item$.subscribe((result) => {
      expect(result).toEqual(mockIdentifierDetails);
      expect(component.selectedIdentifiers).toEqual(
        mockIdentifierDetails.additionalIdentifiers
      );
    });
    expect(mockRouter.navigateByUrl).not.toHaveBeenCalled();
  });

  it('should add or remove selected identifier on checkbox change', () => {
    const mockIdentifier1 = {
      id: '123',
      scheme: 'GB-COH',
      legalName: 'Company A',
    };
    const mockIdentifier2 = {
      id: '456',
      scheme: 'US-DUN',
      legalName: 'Company B',
    };

    component.onChange({ currentTarget: { checked: true } }, mockIdentifier1);
    expect(component.selectedIdentifiers).toEqual([mockIdentifier1]);

    component.onChange({ currentTarget: { checked: true } }, mockIdentifier2);
    expect(component.selectedIdentifiers).toEqual([
      mockIdentifier1,
      mockIdentifier2,
    ]);

    component.onChange({ currentTarget: { checked: false } }, mockIdentifier1);
    expect(component.selectedIdentifiers).toEqual([mockIdentifier2]);

    component.onChange({ currentTarget: { checked: false } }, mockIdentifier2);
    expect(component.selectedIdentifiers).toEqual([]);
  });

  it('should return schema name correctly', () => {
    expect(component.getSchemaName('GB-COH')).toBe('Companies House');
    expect(component.getSchemaName('US-DUN')).toBe('Dun & Bradstreet');
    expect(component.getSchemaName('GB-CHC')).toBe(
      'Charities Commission for England and Wales'
    );
    expect(component.getSchemaName('GB-SC')).toBe(
      'Scottish Charities Commission'
    );
    expect(component.getSchemaName('GB-NIC')).toBe(
      'Northern Ireland Charities Commission'
    );
    expect(component.getSchemaName('')).toBe('');
  });
});
