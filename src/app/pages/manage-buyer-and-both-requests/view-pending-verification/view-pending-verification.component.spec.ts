import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { ViewPendingVerificationComponent } from './view-pending-verification.component';

describe('ViewPendingVerificationComponent', () => {
  let component: ViewPendingVerificationComponent;
  let fixture: ComponentFixture<ViewPendingVerificationComponent>;
  let activatedRouteMock: any;
  let routerMock: any;

  beforeEach(async () => {
    activatedRouteMock = {
      queryParams: of({ data: 'mockData' }),
    };

    routerMock = {
      navigateByUrl: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [ViewPendingVerificationComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: Router, useValue: routerMock },
        TranslateService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPendingVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to manage-buyer-both when goBack is called and lastRoute is "view-verified"', () => {
    component.lastRoute = 'view-verified';
    component.goBack();
    expect(routerMock.navigateByUrl).toHaveBeenCalledWith('manage-buyer-both');
  });

  it('should go back in history when goBack is called and lastRoute is not "view-verified"', () => {
    component.lastRoute = 'other-route';
    component.goBack();
    expect(window.history.back).toHaveBeenCalled();
  });

  it('should call the openEmailWindow method with the correct data when openEmailWindow is called', () => {
    const openSpy = jest.spyOn(window, 'open');
    const data = { userName: 'test@example.com' };
    component.openEmailWindow(data);
    expect(openSpy).toHaveBeenCalledWith('mailto:test@example.com');
  });

  it('should render the organization name correctly', () => {
    component.routeDetails = { organisationName: 'Test Organization' };
    fixture.detectChanges();
    const organizationNameElement = fixture.nativeElement.querySelector(
      '.govuk-body-l strong'
    );
    expect(organizationNameElement.textContent).toContain('Test Organization');
  });

  it('should render the organization type correctly', () => {
    component.routeDetails = { organisationType: 1 };
    fixture.detectChanges();
    const organizationTypeElement = fixture.nativeElement.querySelector(
      '.govuk-body-l strong'
    );
    expect(organizationTypeElement.textContent).toContain('Buyer');
  });
});
