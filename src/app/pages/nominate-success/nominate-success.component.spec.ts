import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject, of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

import { SharedDataService } from 'src/app/shared/shared-data.service';
import { UIState } from 'src/app/store/ui.states';
import { NominateSuccessComponent } from './nominate-success.component';

describe('NominateSuccessComponent', () => {
  let component: NominateSuccessComponent;
  let fixture: ComponentFixture<NominateSuccessComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;
  let sharedDataServiceSpy: jasmine.SpyObj<SharedDataService>;
  let storeSpy: jasmine.SpyObj<Store<UIState>>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
    activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', [], {
      queryParams: of({ data: 'eyJzdGF0dXMiOiIxIn0=' }),
    });
    sharedDataServiceSpy = jasmine.createSpyObj(
      'SharedDataService',
      ['NominiData'],
      {
        NominiData: of('test@example.com'),
      }
    );
    storeSpy = jasmine.createSpyObj('Store', ['dispatch', 'select']);

    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [NominateSuccessComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: SharedDataService, useValue: sharedDataServiceSpy },
        { provide: Store, useValue: storeSpy },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NominateSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to the nominate route when goToNominate is called', () => {
    component.goToNominate();
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(
      '/nominate?data=eyJzdGF0dXMiOiIxIn0='
    );
  });

  it('should navigate to the search route when goConfirmOrgPage is called', () => {
    localStorage.setItem(
      'schemeDetails',
      JSON.stringify({ scheme: 'test-scheme', schemeID: 'test-scheme-id' })
    );
    component.goConfirmOrgPage();
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(
      'manage-org/register/search/test-scheme?id=test-scheme-id'
    );
  });

  it('should render the correct breadcrumb navigation bar when pageAccessMode is 1', () => {
    component.pageAccessMode = 1;
    fixture.detectChanges();
    const breadcrumbItems = fixture.nativeElement.querySelectorAll(
      '.govuk-breadcrumbs__list-item'
    );
    expect(breadcrumbItems.length).toEqual(7);
    expect(breadcrumbItems[0].textContent.trim()).toEqual('REGITERATION_HOME');
    expect(breadcrumbItems[1].textContent.trim()).toEqual('CREATE_ACC');
    expect(breadcrumbItems[2].textContent.trim()).toEqual('ENTER_DETAIL');
    expect(breadcrumbItems[3].textContent.trim()).toEqual('REG_ORG');
    expect(breadcrumbItems[4].textContent.trim()).toEqual('ORG_ADMIN');
    expect(breadcrumbItems[5].textContent.trim()).toEqual('NOMINATE');
  });

  it('should render the correct breadcrumb navigation bar when pageAccessMode is 0', () => {
    component.pageAccessMode = 0;
    fixture.detectChanges();
    const breadcrumbItems = fixture.nativeElement.querySelectorAll(
      '.govuk-breadcrumbs__list-item'
    );
    expect(breadcrumbItems.length).toEqual(12);
    expect(breadcrumbItems[0].textContent.trim()).toEqual('REGITERATION_HOME');
    expect(breadcrumbItems[1].textContent.trim()).toEqual('CREATE_ACC');
    expect(breadcrumbItems[2].textContent.trim()).toEqual('ENTER_DETAIL');
    expect(breadcrumbItems[3].textContent.trim()).toEqual('REG_ORG');
    expect(breadcrumbItems[4].textContent.trim()).toEqual('ORG_ADMIN');
    expect(breadcrumbItems[5].textContent.trim()).toEqual('2FA_SETUP');
    expect(breadcrumbItems[6].textContent.trim()).toEqual('ORG_TYPE');
    expect(breadcrumbItems[7].textContent.trim()).toEqual(
      'ORG_DETAILS'
    );
    expect(breadcrumbItems[8].textContent.trim()).toEqual('CONFIRM_ORG_DETAILS');
    expect(breadcrumbItems[9].textContent.trim()).toEqual('CREATE_ADMIN_ACC');
    expect(breadcrumbItems[10].textContent.trim()).toEqual('NOMINATE');
  });

  it('should render the correct email address in the template', () => {
    component.emailAddress = 'test@example.com';
    fixture.detectChanges();
    const emailElement = fixture.nativeElement.querySelector('.govuk-body-l');
    expect(emailElement.textContent.trim()).toEqual(
      'An email has been sent to test@example.com to register the organisation.'
    );
  });

  it('should render the correct text in the template', () => {
    fixture.detectChanges();
    const textElements = fixture.nativeElement.querySelectorAll('.govuk-body');
    expect(textElements[0].textContent.trim()).toEqual(
      'This person will be required to complete the organisation registration process before you can continue with your sign up process.'
    );
  });
});
