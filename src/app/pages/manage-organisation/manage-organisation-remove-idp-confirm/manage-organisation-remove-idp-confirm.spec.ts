import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { ManageOrganisationRemoveIdpConfirmComponent } from './manage-organisation-remove-idp-confirm';
import { TokenService } from 'src/app/services/auth/token.service';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('ManageOrganisationRemoveIdpConfirmComponent', () => {
  let component: ManageOrganisationRemoveIdpConfirmComponent;
  let fixture: ComponentFixture<ManageOrganisationRemoveIdpConfirmComponent>;
  let mockStore: jasmine.SpyObj<Store<any>>;

  const mockData = [
    { id: 1, enabled: true, connectionName: 'conn1', name: 'name1' },
    { id: 2, enabled: false, connectionName: 'conn2', name: 'name2' },
  ];

  beforeEach(async () => {
    const mockActivatedRoute = {
      snapshot: {
        queryParams: {
          data: btoa(JSON.stringify(mockData)),
        },
      },
    };

    await TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
      ],
      declarations: [ManageOrganisationRemoveIdpConfirmComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Store, useFactory: () => ({}) },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        TokenService,
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    mockStore = TestBed.inject(Store) as jasmine.SpyObj<Store<any>>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(
      ManageOrganisationRemoveIdpConfirmComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize component properties correctly', () => {
    expect(component.changedIdpList).toEqual(mockData);
    expect(component.idpNames).toBe('name2');
    expect(component.affectedUsers).toBe(0);
  });

  it('should call the organisation service to get affected users on ngOnInit', () => {
    const mockAffectedUsers = 5;
    spyOn(
      component.organisationService,
      'getUserAffectedByRemovedIdps'
    ).and.returnValue(of(mockAffectedUsers));

    component.ngOnInit();

    expect(component.affectedUsers).toBe(mockAffectedUsers);
  });

  it('should call the organisation group service to enable identity provider on onRemoveIdpConfirmClick', () => {
    spyOn(
      component.organisationGroupService,
      'enableIdentityProvider'
    ).and.returnValue(of({}));
    spyOn(component.router, 'navigateByUrl');

    component.onRemoveIdpConfirmClick('Yes');

    expect(
      component.organisationGroupService.enableIdentityProvider
    ).toHaveBeenCalled();
    expect(component.router.navigateByUrl).toHaveBeenCalledWith(
      'manage-org/profile/success'
    );
  });

  it('should navigate to manage-org/profile on onCancelClick', () => {
    spyOn(component.router, 'navigateByUrl');

    component.onCancelClick('No');

    expect(component.router.navigateByUrl).toHaveBeenCalledWith(
      '/manage-org/profile'
    );
  });
});
