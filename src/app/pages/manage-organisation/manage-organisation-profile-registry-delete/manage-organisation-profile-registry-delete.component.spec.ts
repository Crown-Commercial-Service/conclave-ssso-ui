import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { ManageOrganisationRegistryDeleteComponent } from './manage-organisation-profile-registry-delete.component';
import { ciiService } from 'src/app/services/cii/cii.service';
import { WrapperUserService } from 'src/app/services/wrapper/wrapper-user.service';
import { TokenService } from 'src/app/services/auth/token.service';
import { ViewportScroller } from '@angular/common';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { TranslateModule } from '@ngx-translate/core';

describe('ManageOrganisationRegistryDeleteComponent', () => {
  let component: ManageOrganisationRegistryDeleteComponent;
  let fixture: ComponentFixture<ManageOrganisationRegistryDeleteComponent>;
  let router: Router;
  let ciiServiceMock: jasmine.SpyObj<ciiService>;
  let wrapperServiceMock: jasmine.SpyObj<WrapperUserService>;
  let tokenServiceMock: jasmine.SpyObj<TokenService>;

  beforeEach(async () => {
    const viewportScrollerSpy = jasmine.createSpyObj('ViewportScroller', [
      'setOffset',
    ]);

    const ciiServiceSpy = jasmine.createSpyObj('ciiService', [
      'getOrganisationIdentifierDetails',
      'deleteRegistry',
    ]);
    const wrapperServiceSpy = jasmine.createSpyObj('WrapperUserService', ['']);
    const tokenServiceSpy = jasmine.createSpyObj('TokenService', [
      'getCiiOrgId',
    ]);

    await TestBed.configureTestingModule({
      declarations: [ManageOrganisationRegistryDeleteComponent],
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      providers: [
        { provide: ciiService, useValue: ciiServiceSpy },
        { provide: WrapperUserService, useValue: wrapperServiceSpy },
        { provide: TokenService, useValue: tokenServiceSpy },
        { provide: ViewportScroller, useValue: viewportScrollerSpy },
        { provide: ScrollHelper, useValue: {} },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: '123', scheme: 'XYZ' }),
          },
        },
        {
          provide: Store,
          useValue: {
            select: () => of(),
            dispatch: () => {},
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(
      ManageOrganisationRegistryDeleteComponent
    );
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    ciiServiceMock = TestBed.inject(ciiService) as jasmine.SpyObj<ciiService>;
    wrapperServiceMock = TestBed.inject(
      WrapperUserService
    ) as jasmine.SpyObj<WrapperUserService>;
    tokenServiceMock = TestBed.inject(
      TokenService
    ) as jasmine.SpyObj<TokenService>;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch item details on component initialization', () => {
    ciiServiceMock.getOrganisationIdentifierDetails.and.returnValue(of({}));
    component.ngOnInit();
    expect(
      ciiServiceMock.getOrganisationIdentifierDetails
    ).toHaveBeenCalledWith(tokenServiceMock.getCiiOrgId(), 'XYZ', '123');
    expect(component.item$).toBeDefined();
  });

  it('should navigate to confirmation page on form submission', () => {
    ciiServiceMock.deleteRegistry.and.returnValue(of({}));
    const navigateSpy = spyOn(router, 'navigateByUrl');
    component.onSubmit();
    expect(ciiServiceMock.deleteRegistry).toHaveBeenCalledWith(
      tokenServiceMock.getCiiOrgId(),
      'XYZ',
      '123'
    );
    expect(navigateSpy).toHaveBeenCalledWith(
      'manage-org/profile/' +
        component.organisationId +
        '/registry/delete/confirmation/XYZ/123'
    );
  });

  it('should navigate back to manage-org/profile on cancel button click', () => {
    const navigateSpy = spyOn(router, 'navigateByUrl');
    component.goBack();
    expect(navigateSpy).toHaveBeenCalledWith('manage-org/profile');
  });
});
