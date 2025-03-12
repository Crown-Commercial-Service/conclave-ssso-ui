import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { UIState } from 'src/app/store/ui.states';
import { ViewportScroller } from '@angular/common';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { SessionStorageKey } from 'src/app/constants/constant';
import { OrgSupportSuccessComponent } from './success.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('OrgSupportSuccessComponent', () => {
  let component: OrgSupportSuccessComponent;
  let fixture: ComponentFixture<OrgSupportSuccessComponent>;
  let store: Store<UIState>;
  let viewportScroller: jasmine.SpyObj<ViewportScroller>;
  let scrollHelper: ScrollHelper;
  let activatedRoute: ActivatedRoute;

  beforeEach(async () => {
    const viewportScrollerSpy = jasmine.createSpyObj('ViewportScroller', [
      'setOffset',
    ]);

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [OrgSupportSuccessComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({
              rpwd: true,
              rmfa: false,
              chrole: 'assign',
            }),
          },
        },
        {
          provide: Store,
          useValue: {
            select: () => of(false),
          },
        },
        {
          provide: ViewportScroller,
          useValue: viewportScrollerSpy,
        },
        {
          provide: ScrollHelper,
          useValue: {
            scrollToTop: () => {},
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgSupportSuccessComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    viewportScroller = TestBed.inject(
      ViewportScroller
    ) as jasmine.SpyObj<ViewportScroller>;
    scrollHelper = TestBed.inject(ScrollHelper);
    activatedRoute = TestBed.inject(ActivatedRoute);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct breadcrumb links', () => {
    const breadcrumbLinks = fixture.nativeElement.querySelectorAll(
      '.govuk-breadcrumbs__link'
    );
    expect(breadcrumbLinks.length).toBe(3);
    expect(breadcrumbLinks[0].getAttribute('routerLink')).toBe('/home');
    expect(breadcrumbLinks[1].getAttribute('routerLink')).toBe(
      '/org-support/search'
    );
    expect(breadcrumbLinks[2].textContent).toBe('Success');
  });

  it('should display the correct success message', () => {
    const successMessage = fixture.nativeElement.querySelector('.govuk-body-l');
    expect(successMessage.textContent).toBe(
      'You have successfully assigned admin role for .\n Password reset email has been sent to .'
    );
  });

  it('should display the correct "Return to Organisation user support" link', () => {
    const link = fixture.nativeElement.querySelector('.navigation-text');    
    expect(link.getAttribute('ng-reflect-router-link')).toBe('/org-support/search');
    expect(link.textContent).toBe('Return to Organisation user support');
  });

  it('should remove the OrgUserSupportUserName from session storage on destroy', () => {
    spyOn(sessionStorage, 'removeItem');
    component.ngOnDestroy();
    expect(sessionStorage.removeItem).toHaveBeenCalledWith(
      SessionStorageKey.OrgUserSupportUserName
    );
  });
});
