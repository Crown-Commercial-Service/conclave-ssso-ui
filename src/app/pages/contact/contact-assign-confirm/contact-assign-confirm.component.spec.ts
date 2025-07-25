import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { ContactAssignConfirmComponent } from './contact-assign-confirm-component';
import { WrapperSiteContactService } from 'src/app/services/wrapper/wrapper-site-contact-service';
import { WrapperOrganisationContactService } from 'src/app/services/wrapper/wrapper-org-contact-service';
import { UIState } from 'src/app/store/ui.states';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';


describe('ContactAssignConfirmComponent', () => {
  let component: ContactAssignConfirmComponent;
  let fixture: ComponentFixture<ContactAssignConfirmComponent>;
  let router: Router;
  let activatedRoute: ActivatedRoute;
  let siteContactService: WrapperSiteContactService;
  let orgContactService: WrapperOrganisationContactService;
  let viewportScroller: ViewportScroller;

  beforeEach(async () => {
    const viewportScrollerSpy = jasmine.createSpyObj('ViewportScroller', [
      'setOffset',
    ]);

    await TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
      ],

      declarations: [ContactAssignConfirmComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),  
        WrapperSiteContactService,
        WrapperOrganisationContactService,
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { queryParams: { data: '{}' } } },
        },
        {
          provide: Store,
          useFactory: () => ({}),
        },
        { provide: ViewportScroller, useValue: viewportScrollerSpy },
        { provide: ScrollHelper, useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(ContactAssignConfirmComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    activatedRoute = TestBed.inject(ActivatedRoute);
    siteContactService = TestBed.inject(WrapperSiteContactService);
    orgContactService = TestBed.inject(WrapperOrganisationContactService);
    viewportScroller = TestBed.inject(
      ViewportScroller
    ) as jasmine.SpyObj<ViewportScroller>;
    fixture.detectChanges();
  });
 

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('site on confirm click', () => {
    spyOn(siteContactService, 'assignSiteContact').and.returnValue(of());
    component.assigningSiteId = 1;
    component.onConfirmClick('Confirm');
    expect(siteContactService.assignSiteContact).toHaveBeenCalled();
  });

  it('organization on confirm click', () => {
    spyOn(orgContactService, 'assignOrgContact').and.returnValue(of());
    component.assigningSiteId = 0;
    component.onConfirmClick('Confirm');
    expect(orgContactService.assignOrgContact).toHaveBeenCalled();
  });

  it('Go to success page on success', () => {
    spyOn(router, 'navigateByUrl');
    component.assigningSiteId = 1;
    component.assigningOrgId = 'orgId';
    component.siteCreate = true;
    component.onSuccess();
    expect(router.navigateByUrl).toHaveBeenCalledWith(
      'contact-assign/success?data={"assigningSiteId":1,"assigningOrgId":"orgId","siteCreate":true}'
    );
  });

  it('Go to error page on error', () => {
    spyOn(router, 'navigateByUrl');
    component.assigningSiteId = 123;
    component.assigningOrgId = 'test org';
    component.onError('Test error code');
    expect(router.navigateByUrl).toHaveBeenCalledWith(
      'contact-assign/error?data={"assigningSiteId":123,"assigningOrgId":"test org","errorCode":"Test error code"}'
    );
  });

  it('cancel click', () => {
    spyOn(window.history, 'back');
    component.onCancelClick('Cancel');
    expect(window.history.back).toHaveBeenCalled();
  });
});