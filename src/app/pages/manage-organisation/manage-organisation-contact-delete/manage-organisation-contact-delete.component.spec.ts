import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { ViewportScroller } from '@angular/common';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { WrapperOrganisationContactService } from 'src/app/services/wrapper/wrapper-org-contact-service';
import { WrapperSiteContactService } from 'src/app/services/wrapper/wrapper-site-contact-service';
import { BaseComponent } from 'src/app/components/base/base.component';
import { UIState } from 'src/app/store/ui.states';
import { OperationEnum } from 'src/app/constants/enum';
import { ManageOrganisationContactDeleteComponent } from './manage-organisation-contact-delete.component';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ManageOrganisationContactDeleteComponent', () => {
  let component: ManageOrganisationContactDeleteComponent;
  let fixture: ComponentFixture<ManageOrganisationContactDeleteComponent>;
  let router: Router;
  let activatedRoute: ActivatedRoute;
  let contactService: WrapperOrganisationContactService;
  let siteContactService: WrapperSiteContactService;

  beforeEach(async () => {
    const viewportScrollerSpy = jasmine.createSpyObj('ViewportScroller', [
      'setOffset',
    ]);

    await TestBed.configureTestingModule({
      declarations: [ManageOrganisationContactDeleteComponent],
      imports: [ TranslateModule.forRoot()],
      providers: [
        provideRouter([]),
        {
          provide: Store,
          useValue: {
            dispatch: jasmine.createSpy('dispatch'),
            select: jasmine.createSpy('select'),
          },
        },
        {
          provide: ViewportScroller,
          useValue: viewportScrollerSpy,
        },
        {
          provide: ScrollHelper,
          useValue: {},
        },
        {
          provide: WrapperOrganisationContactService,
          useValue: jasmine.createSpyObj('WrapperOrganisationContactService', [
            'deleteOrganisationContact',
          ]),
        },
        {
          provide: WrapperSiteContactService,
          useValue: jasmine.createSpyObj('WrapperSiteContactService', [
            'deleteSiteContact',
          ]),
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParams: {
                data: JSON.stringify({ contactId: 123, siteId: 456 }),
              },
            },
            queryParams: of({ isNewTab: 'false' })
          },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageOrganisationContactDeleteComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    activatedRoute = TestBed.inject(ActivatedRoute);
    contactService = TestBed.inject(WrapperOrganisationContactService);
    siteContactService = TestBed.inject(WrapperSiteContactService);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the breadcrumbs correctly', () => {
    const breadcrumbsList = fixture.debugElement.queryAll(
      By.css('.govuk-breadcrumbs__list-item')
    );
    const breadcrumbsLinks = fixture.debugElement.queryAll(
      By.css('.govuk-breadcrumbs__link')
    );

    expect(breadcrumbsList.length).toBe(4);
    expect(breadcrumbsLinks[0].nativeElement.getAttribute('routerLink')).toBe(
      '/home'
    );
    expect(breadcrumbsLinks[1].nativeElement.getAttribute('routerLink')).toBe(
      '/manage-org/profile'
    );
    // expect(breadcrumbsLinks[2].nativeElement.getAttribute('routerLink')).toBe(
    //   '/manage-org/profile/contact-ed'
    // );
    expect(breadcrumbsLinks[3].nativeElement.textContent).toBe(
      'DELETE_CONTACT'
    );
  });

  it('should call onDeleteConfirmClick method when confirm delete button is clicked', () => {
    spyOn(component, 'onDeleteConfirmClick');
    const confirmDeleteBtn = fixture.debugElement.query(
      By.css('.govuk-button--warning')
    );

    confirmDeleteBtn.triggerEventHandler('click', null);

    expect(component.onDeleteConfirmClick).toHaveBeenCalled();
  });

  it('should call onBack method when cancel button is clicked', () => {
    spyOn(component, 'onBack');
    const cancelBtn = fixture.debugElement.query(
      By.css('.govuk-button--secondary')
    );

    expect(cancelBtn).toBeTruthy();
    // cancelBtn.triggerEventHandler('click', null);

    cancelBtn.nativeElement.click(); 
    fixture.detectChanges();

    expect(component.onBack).toHaveBeenCalled();
  });

  it('should navigate back in history when onBack is called', () => {
    spyOn(window.history, 'back');
    component.onBack('Cancel');

    expect(window.history.back).toHaveBeenCalled();
  });
});
