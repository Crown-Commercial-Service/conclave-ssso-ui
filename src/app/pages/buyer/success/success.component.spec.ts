import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BuyerSuccessComponent } from './success.component';
import { Store } from '@ngrx/store';
import { UIState } from 'src/app/store/ui.states';
import { ViewportScroller } from '@angular/common';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideRouter } from '@angular/router';


describe('BuyerSuccessComponent', () => {
  let component: BuyerSuccessComponent;
  let fixture: ComponentFixture<BuyerSuccessComponent>;

  beforeEach(async () => {
    const viewportScrollerSpy = jasmine.createSpyObj('ViewportScroller', [
      'setOffset',
    ]);

    await TestBed.configureTestingModule({
      declarations: [BuyerSuccessComponent],
      imports:[],
      providers: [
        provideRouter([]),        
        { provide: Store, useValue: {} },
        { provide: ViewportScroller, useValue: viewportScrollerSpy },
        { provide: ScrollHelper, useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyerSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the breadcrumb navigation', () => {
    const breadcrumbElements = fixture.nativeElement.querySelectorAll(
      '.govuk-breadcrumbs__link'
    );
    expect(breadcrumbElements.length).toBe(3);

    const firstBreadcrumbLink = breadcrumbElements[0];
    expect(firstBreadcrumbLink.textContent).toContain(
      'Administrator dashboard'
    );
    expect(firstBreadcrumbLink.getAttribute('routerLink')).toBe('/home');

    const secondBreadcrumbLink = breadcrumbElements[1];
    expect(secondBreadcrumbLink.textContent).toContain(
      'Manage service eligibility'
    );
    expect(secondBreadcrumbLink.getAttribute('routerLink')).toBe(
      '/buyer-supplier/search'
    );

    const thirdBreadcrumbLink = breadcrumbElements[2];
    expect(thirdBreadcrumbLink.textContent).toContain('Success');
  });

  it('should display the success message', () => {
    const successMessageElement =
      fixture.nativeElement.querySelector('.govuk-body-l');
    expect(successMessageElement.textContent).toContain(
      'You have successfully saved the changes'
    );
  });

  it('should display the link to return to the previous page', () => {
    const returnLinkElement =
      fixture.nativeElement.querySelector('.navigation-text');
    expect(returnLinkElement.textContent).toContain(
      'Return to Manage service eligibility'
    );
    //expect(returnLinkElement.getAttribute('ng-reflect-router-link')).toBe('/buyer-supplier/search');
  });
});
