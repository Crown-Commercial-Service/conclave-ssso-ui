import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ViewportScroller } from '@angular/common';
import { of } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ManageGroupErrorComponent } from './manage-group-error.component';
import { RollbarErrorService } from 'src/app/shared/rollbar-error.service';
import { TokenService } from 'src/app/services/auth/token.service';
import { RollbarService, rollbarFactory } from 'src/app/logging/rollbar';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ManageGroupErrorComponent', () => {
  let component: ManageGroupErrorComponent;
  let fixture: ComponentFixture<ManageGroupErrorComponent>;
  let router: Router;
  let activatedRoute: ActivatedRoute;
  let translateService: TranslateService;
  let sessionStore: any = {
    Gname: 'test-name',
  };

  beforeEach(async () => {
    const viewportScrollerSpy = jasmine.createSpyObj('ViewportScroller', [
      'setOffset',
    ]);

    spyOn(sessionStorage, 'getItem').and.callFake((key) =>
      key in sessionStore ? sessionStore[key] : null
    );

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        TranslateModule.forRoot(),
        HttpClientTestingModule,
      ],
      declarations: [ManageGroupErrorComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParams: {
                data: JSON.stringify({ groupId: 1 }),
              },
            },
          },
        },
        {
          provide: Store,
          useValue: {
            dispatch: jasmine.createSpy('dispatch'),
          },
        },
        {
          provide: ViewportScroller,
          useValue: viewportScrollerSpy,
        },
        AuthService,
        RollbarErrorService,
        TokenService,
        { provide: RollbarService, useValue: rollbarFactory() },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageGroupErrorComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    activatedRoute = TestBed.inject(ActivatedRoute);
    translateService = TestBed.inject(TranslateService);
    spyOn(router, 'navigateByUrl');
    spyOn(window.history, 'back');
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize component properties', () => {
    expect(component.editingGroupId).toBe(1);
    expect(component.routeData).toEqual({ groupId: 1 });
    expect(component.showRoleView).toBeFalsy();
    expect(component.groupName).toBe('test-name');
  });

  it('should navigate back to manage-groups view with correct data', () => {
    component.editingGroupId = 1;
    component.navigateBackToGroups();
    expect(router.navigateByUrl).toHaveBeenCalledWith(
      'manage-groups/view?data={"isEdit":true,"groupId":1}'
    );
  });

  it('should navigate back in history when onBack() is called', () => {
    component.onBack();
    expect(window.history.back).toHaveBeenCalled();
  });

  it('should display the correct breadcrumb links and error message', () => {
    component.showRoleView = true;
    component.groupName = 'Test Group';
    fixture.detectChanges();

    const breadcrumbLinks = fixture.nativeElement.querySelectorAll(
      '.govuk-breadcrumbs__link'
    );
    expect(breadcrumbLinks.length).toBe(4);
    expect(breadcrumbLinks[0].getAttribute('routerLink')).toBe('/home');
    expect(breadcrumbLinks[1].getAttribute('routerLink')).toBe(
      '/manage-groups'
    );
    expect(breadcrumbLinks[2].textContent).toContain('Confirm roles for group');
    expect(breadcrumbLinks[2].textContent).toContain('Test Group');
    expect(breadcrumbLinks[3].textContent).toContain('Error');

    const errorMessage = fixture.nativeElement.querySelector(
      '.govuk-error-summary__body a'
    );
    expect(errorMessage.textContent).toContain(
      'This group is configured with multifactor'
    );
    expect(errorMessage.textContent).toContain('roles');
  });
});
