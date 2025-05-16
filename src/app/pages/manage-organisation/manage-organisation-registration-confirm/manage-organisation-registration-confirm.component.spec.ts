import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { UserService } from 'src/app/services/postgres/user.service';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { ViewportScroller } from '@angular/common';
import { ManageOrgRegConfirmComponent } from './manage-organisation-registration-confirm.component';
import { TranslateModule } from '@ngx-translate/core';

describe('ManageOrgRegConfirmComponent', () => {
  let component: ManageOrgRegConfirmComponent;
  let fixture: ComponentFixture<ManageOrgRegConfirmComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let storeSpy: jasmine.SpyObj<Store<any>>;
  let mockActivatedRoute: any;

  beforeEach(() => {
    const userServiceSpyObj = jasmine.createSpyObj('UserService', [
      'resendUserActivationEmail',
    ]);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigateByUrl']);
    mockActivatedRoute = { queryParams: of({ data: 'test-data' }) };

    const storeSpyObj = jasmine.createSpyObj('Store', ['select']);

    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [ManageOrgRegConfirmComponent],
      providers: [
        { provide: UserService, useValue: userServiceSpyObj },
        { provide: Router, useValue: routerSpyObj },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Store, useValue: storeSpyObj },
        ViewportScroller,
        ScrollHelper,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageOrgRegConfirmComponent);
    component = fixture.componentInstance;
    userServiceSpy = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    storeSpy = TestBed.inject(Store) as jasmine.SpyObj<Store<any>>;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set emailAddress from localStorage', () => {
    spyOn(localStorage, 'getItem').and.returnValue('mockEmailAddress');

    fixture.detectChanges();

    expect(component.emailAddress).toEqual('mockEmailAddress');
  });

  it('should navigate to the confirm org page', () => {
    spyOn(localStorage, 'getItem').and.returnValue(
      JSON.stringify({ scheme: 'mockScheme', schemeID: 'mockSchemeID' })
    );

    component.goConfirmOrgPage();

    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(
      'manage-org/register/search/mockScheme?id=' +
        encodeURIComponent('mockSchemeID')
    );
  });

  it('should navigate to the registration schema page', () => {
    spyOn(localStorage, 'getItem').and.returnValue(
      JSON.stringify({ scheme: 'mockScheme', id: 'mockID' })
    );

    component.goToRegSchema();

    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(
      'manage-org/register/search/mockScheme/mockID/additional-identifiers'
    );
  });

  it('should call resendActivationLink method and navigate when resend link is clicked', () => {
    component.resendActivationLink();

    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(
      'manage-org/register/confirm?rs'
    );
  });
});
