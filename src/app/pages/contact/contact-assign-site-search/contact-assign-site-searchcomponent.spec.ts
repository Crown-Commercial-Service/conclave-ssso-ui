import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { ContactAssignSiteSearchComponent } from './contact-assign-site-searchcomponent';
import { WrapperOrganisationSiteService } from 'src/app/services/wrapper/wrapper-org-site-service';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { TranslateModule } from '@ngx-translate/core';
import { SiteGridInfo } from 'src/app/models/site';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('ContactAssignSiteSearchComponent', () => {
  let component: ContactAssignSiteSearchComponent;
  let fixture: ComponentFixture<ContactAssignSiteSearchComponent>;
  let router: Router;
  let activatedRoute: ActivatedRoute;
  let wrapperSiteService: WrapperOrganisationSiteService;
 

  beforeEach(async () => {
    const wrapperSiteServiceSpy = jasmine.createSpyObj('WrapperOrganisationSiteService', [
      'getOrganisationSites',
    ]);

    await TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
      ],
      declarations: [ContactAssignSiteSearchComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),  
        { provide: Store, useFactory: () => ({}) }],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactAssignSiteSearchComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    activatedRoute = TestBed.inject(ActivatedRoute);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to contact-assign on onContinue when selectedSiteId is set', () => {
    spyOn(router, 'navigateByUrl');
    component.selectedSiteId = 1;
    component.organisationId = 'orgId';
    component.onContinue('Continue');
    expect(router.navigateByUrl).toHaveBeenCalledWith(
      'contact-assign?data={"assigningOrgId":"orgId","contactSiteId":1}'
    );
  });

  it('should navigate to contact-assign/select on onCancelClick', () => {
    spyOn(router, 'navigateByUrl');
    component.organisationId = 'orgId';
    component.selectedSiteId = 2;
    component.onCancelClick();
    expect(router.navigateByUrl).toHaveBeenCalledWith(
      'contact-assign/select?data={"assigningOrgId":"orgId","contactSiteId":2}'
    );
  });

  it('should go back in history on onBack', () => {
    spyOn(window.history, 'back');
    component.onBack('Back');
    expect(window.history.back).toHaveBeenCalled();
  });
});
