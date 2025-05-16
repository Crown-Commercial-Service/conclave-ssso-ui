import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewportScroller } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { BaseComponent } from 'src/app/components/base/base.component';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { UIState } from 'src/app/store/ui.states';
import { ManageOrgRegNotifyAdminComponent } from './manage-reg-organisation-admin-notify.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('ManageOrgRegNotifyAdminComponent', () => {
  let component: ManageOrgRegNotifyAdminComponent;
  let fixture: ComponentFixture<ManageOrgRegNotifyAdminComponent>;
  let uiStoreSpy: jasmine.SpyObj<Store<UIState>>;
  let viewportScrollerSpy: jasmine.SpyObj<ViewportScroller>;
  let scrollHelperSpy: jasmine.SpyObj<ScrollHelper>;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;

  beforeEach(async () => {
    uiStoreSpy = jasmine.createSpyObj('Store', ['dispatch']);
    viewportScrollerSpy = jasmine.createSpyObj('ViewportScroller', [
      'scrollToPosition',
    ]);
    scrollHelperSpy = jasmine.createSpyObj('ScrollHelper', ['scrollToTop']);
    activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', ['queryParams']);
    activatedRouteSpy.queryParams = of({ data: 'eyJ0eXBlIjogMSJ9' });

    await TestBed.configureTestingModule({
      declarations: [ManageOrgRegNotifyAdminComponent],
      imports: [TranslateModule.forRoot(), RouterTestingModule],
      providers: [
        { provide: Store, useValue: uiStoreSpy },
        { provide: ViewportScroller, useValue: viewportScrollerSpy },
        { provide: ScrollHelper, useValue: scrollHelperSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageOrgRegNotifyAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set orgName from sessionStorage', () => {
    spyOn(sessionStorage, 'getItem').and.returnValue('Example Org');
    component.ngOnInit();
    expect(component.orgName).toBe('Example Org');
  });

  it('should navigate back when back button is clicked', () => {
    spyOn(window.history, 'back');
    component.back();
    expect(window.history.back).toHaveBeenCalled();
  });

  it('should display the correct breadcrumbs when pageAccessMode is not 0', () => {
    component.pageAccessMode = 1;
    fixture.detectChanges();
    const breadcrumbs = fixture.nativeElement.querySelectorAll(
      '.govuk-breadcrumbs__list-item'
    );
    expect(breadcrumbs.length).toBe(10);
    expect(breadcrumbs[0].textContent.trim()).toBe('REGITERATION_HOME');
    expect(breadcrumbs[1].textContent.trim()).toBe('CREATE_ACC');
    expect(breadcrumbs[2].textContent.trim()).toBe(
      'ENTER_DETAIL'
    );
    expect(breadcrumbs[3].textContent.trim()).toBe('REG_ORG');
    expect(breadcrumbs[4].textContent.trim()).toBe(
      'ORG_ADMIN'
    );
    expect(breadcrumbs[5].textContent.trim()).toBe('2FA_SETUP');
    expect(breadcrumbs[6].textContent.trim()).toBe('ORG_TYPE');
    expect(breadcrumbs[7].textContent.trim()).toBe('ORG_DETAILS');
  });

  it('should display the correct breadcrumbs when pageAccessMode is 0', () => {
    component.pageAccessMode = 0;
    fixture.detectChanges();
    const breadcrumbs = fixture.nativeElement.querySelectorAll(
      '.govuk-breadcrumbs__list-item'
    );
    expect(breadcrumbs.length).toBe(5);
    expect(breadcrumbs[0].textContent.trim()).toBe('REGITERATION_HOME');
    expect(breadcrumbs[1].textContent.trim()).toBe('CREATE_ACC');
    expect(breadcrumbs[2].textContent.trim()).toBe(
      'ENTER_DETAIL'
    );
    expect(breadcrumbs[3].textContent.trim()).toBe(
      'ORG_ALREADY_REG'
    );
    expect(breadcrumbs[4].textContent.trim()).toBe('NOTIFICATION_SENT');
  });

  it('should display a message about access being granted', () => {
    fixture.detectChanges();
    const message = fixture.nativeElement.querySelector('p');
    expect(message.textContent.trim()).toBe(
      'Once access has been granted you will be able to continue creating your account'
    );
  });

  it('should display a link to the homepage', () => {
    fixture.detectChanges();
    const link = fixture.nativeElement.querySelector('.navigation-text');
    expect(link.textContent.trim()).toBe(
      'Return to the Crown Commercial Services homepage'
    );
    expect(link.getAttribute('href')).toBe(
      'https://www.crowncommercial.gov.uk'
    );
  });
});
