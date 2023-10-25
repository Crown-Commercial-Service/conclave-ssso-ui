import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { Store, StoreModule } from '@ngrx/store';
import { ViewportScroller } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { UserContactDeleteConfirmComponent } from './user-contact-delete-confirm-component';
import { WrapperUserContactService } from 'src/app/services/wrapper/wrapper-user-contact.service';
import { UIState } from 'src/app/store/ui.states';
import { BaseComponent } from 'src/app/components/base/base.component';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { SessionStorageKey } from 'src/app/constants/constant';
import { OperationEnum } from 'src/app/constants/enum';

describe('UserContactDeleteConfirmComponent', () => {
  let component: UserContactDeleteConfirmComponent;
  let fixture: ComponentFixture<UserContactDeleteConfirmComponent>;
  let activatedRoute: ActivatedRoute;
  let wrapperUserContactService: WrapperUserContactService;
  let viewportScroller: jasmine.SpyObj<ViewportScroller>;
  let scrollHelper: ScrollHelper;
  let store: Store<UIState>;

  beforeEach(async () => {
    const viewportScrollerSpy = jasmine.createSpyObj('ViewportScroller', [
      'setOffset',
    ]);

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        StoreModule.forRoot({}),
        TranslateModule.forRoot(),
      ],
      declarations: [UserContactDeleteConfirmComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParams: {
                data: JSON.stringify({
                  contactId: 1,
                }),
              },
            },
          },
        },
        {
          provide: WrapperUserContactService,
          useValue: {
            deleteUserContact: () => of({}),
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
    fixture = TestBed.createComponent(UserContactDeleteConfirmComponent);
    component = fixture.componentInstance;
    activatedRoute = TestBed.inject(ActivatedRoute);
    wrapperUserContactService = TestBed.inject(WrapperUserContactService);
    store = TestBed.inject(Store);
    viewportScroller = TestBed.inject(
      ViewportScroller
    ) as jasmine.SpyObj<ViewportScroller>;
    scrollHelper = TestBed.inject(ScrollHelper);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the userName and contactId from the query params', () => {
    expect(component.userName).toEqual(
      sessionStorage.getItem(SessionStorageKey.UserContactUsername) ?? ''
    );
    expect(component.contactId).toEqual(1);
  });

  it('should navigate to the user contact edit page on cancel click', () => {
    spyOn(component.router, 'navigateByUrl');
    component.onCancelClick();
    expect(component.router.navigateByUrl).toHaveBeenCalledWith(
      'user-contact-edit?data={"isEdit":true,"contactId":1}'
    );
  });

  it('should render the page title and buttons in the correct language', () => {
    const pageTitle = fixture.debugElement.query(By.css('h1')).nativeElement;
    expect(pageTitle.textContent.trim()).toBe('CONFIRM_CONTACT_DELETE');

    const confirmBtn = fixture.debugElement.query(
      By.css('.govuk-button--warning')
    ).nativeElement;
    expect(confirmBtn.textContent.trim()).toBe('CONFIRM_DELETE_BTN');

    const cancelBtn = fixture.debugElement.query(
      By.css('.govuk-button--secondary')
    ).nativeElement;
    expect(cancelBtn.textContent.trim()).toBe('CANCEL_BTN');
  });
});
