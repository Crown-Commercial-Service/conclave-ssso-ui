import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { SuccessRightToBuyComponent } from './success-right-to-buy.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

describe('SuccessRightToBuyComponent', () => {
  let component: SuccessRightToBuyComponent;
  let fixture: ComponentFixture<SuccessRightToBuyComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let activatedRouteStub: any;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    activatedRouteStub = {
      queryParams: {
        subscribe: jasmine.createSpy(),
      },
    };

    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [SuccessRightToBuyComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        TranslateService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccessRightToBuyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to query params on init', () => {
    spyOn(component, 'ngOnInit');
    component.ngOnInit();
    expect(component.ngOnInit).toHaveBeenCalled();
    expect(activatedRouteStub.queryParams.subscribe).toHaveBeenCalled();
  });

  it('should set routeDetails on query params subscription', () => {
    const queryParams = { data: btoa(JSON.stringify({ orgName: 'Test Org' })) };
    activatedRouteStub.queryParams.subscribe.and.callFake(
      (callback: any) => {
        callback(queryParams);
      }
    );
    component.ngOnInit();
    expect(component.routeDetails.orgName).toEqual('Test Org');
  });

  it('should render the breadcrumb links', () => {
    const breadcrumbLinks = fixture.nativeElement.querySelectorAll(
      '.govuk-breadcrumbs__link'
    );
    expect(breadcrumbLinks.length).toEqual(3);
    expect(breadcrumbLinks[0].textContent).toContain('ADMINISTRATOR_DASHBOARD');
    expect(breadcrumbLinks[1].textContent).toContain(
      'Manage Buyer status requests'
    );
    expect(breadcrumbLinks[2].textContent).toContain('Success');
  });

  it('should render the page title with the org name', () => {
    const pageTitle = fixture.nativeElement.querySelector('.page-title');
    expect(pageTitle.textContent).toContain(
      'You have removed the right to buy for the organisation'
    );
  });

  it('should render the navigation links', () => {
    const navigationLinks =
      fixture.nativeElement.querySelectorAll('.navigation-text');
    expect(navigationLinks.length).toEqual(2);
    expect(navigationLinks[0].textContent).toContain(
      'Return to Manage Buyer status requests'
    );
    expect(navigationLinks[1].textContent).toContain('Return to the dashboard');
  });
});