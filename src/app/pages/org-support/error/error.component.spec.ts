import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { ViewportScroller } from '@angular/common';
import { OrgSupportErrorComponent } from './error.component';
import { UIState } from 'src/app/store/ui.states';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { environment } from 'src/environments/environment';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';

describe('OrgSupportErrorComponent', () => {
  let component: OrgSupportErrorComponent;
  let fixture: ComponentFixture<OrgSupportErrorComponent>;
  let storeMock: Partial<Store<UIState>>;
  let viewportScroller: jasmine.SpyObj<ViewportScroller>;
  let scrollHelperMock: Partial<ScrollHelper>;
  let activatedRouteMock: any;

  beforeEach(async () => {
    const viewportScrollerSpy = jasmine.createSpyObj('ViewportScroller', [
      'setOffset',
    ]);

    storeMock = {};
    scrollHelperMock = {};
    activatedRouteMock = {
      snapshot: {
        queryParams: {
          errCode: 'ERROR_CANNOT_REMOVE_ADMIN_ROLE_OR_GROUP_OF_LAST_ADMIN',
        },
      },
    };

    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule],
      declarations: [OrgSupportErrorComponent],
      providers: [
        { provide: Store, useValue: storeMock },
        { provide: ViewportScroller, useValue: viewportScrollerSpy },
        { provide: ScrollHelper, useValue: {} },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgSupportErrorComponent);
    component = fixture.componentInstance;
    viewportScroller = TestBed.inject(
      ViewportScroller
    ) as jasmine.SpyObj<ViewportScroller>;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set errorCode from query parameters', () => {
    expect(component.errorCode).toEqual(
      'ERROR_CANNOT_REMOVE_ADMIN_ROLE_OR_GROUP_OF_LAST_ADMIN'
    );
  });

  it('should display the breadcrumb navigation correctly', () => {
    const breadcrumbItems = fixture.nativeElement.querySelectorAll(
      '.govuk-breadcrumbs__list-item'
    );
    expect(breadcrumbItems.length).toBe(3);

    expect(
      breadcrumbItems[0].querySelector('.govuk-breadcrumbs__link').textContent
    ).toContain('ADMINISTRATOR_DASHBOARD');
    expect(
      breadcrumbItems[1].querySelector('.govuk-breadcrumbs__link').textContent
    ).toContain('Organisation user support');
    expect(
      breadcrumbItems[2].querySelector('.govuk-breadcrumbs__link').textContent
    ).toContain('Error');
  });

  it('should display the error message based on the errorCode', () => {
    const errorMessage = fixture.nativeElement.querySelector(
      '.govuk-error-summary__list li'
    );
    expect(errorMessage.textContent).toContain(
      'Cannot unassign admin role of the last administrator of the organisation.'
    );
  });

  it('should display the contact link correctly', () => {
    const contactLink = fixture.nativeElement.querySelector('.contact-ccs a');
    expect(contactLink.href).toBe(environment.uri.ccsContactUrl);
    expect(contactLink.target).toBe('_blank');
  });
});
