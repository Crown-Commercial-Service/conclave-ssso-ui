import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { ManageOrganisationRemoveIdpConfirmComponent } from './manage-organisation-remove-idp-confirm';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TokenService } from 'src/app/services/auth/token.service';
import { TranslateModule } from '@ngx-translate/core';

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
        RouterTestingModule,
        HttpClientTestingModule,
        TranslateModule.forRoot(),
      ],
      declarations: [ManageOrganisationRemoveIdpConfirmComponent],
      providers: [
        { provide: Store, useFactory: () => ({}) },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        TokenService,
      ],
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

    component.onRemoveIdpConfirmClick();

    expect(
      component.organisationGroupService.enableIdentityProvider
    ).toHaveBeenCalled();
    expect(component.router.navigateByUrl).toHaveBeenCalledWith(
      'manage-org/profile/success'
    );
  });

  it('should navigate to manage-org/profile on onCancelClick', () => {
    spyOn(component.router, 'navigateByUrl');

    component.onCancelClick();

    expect(component.router.navigateByUrl).toHaveBeenCalledWith(
      '/manage-org/profile'
    );
  });
});
