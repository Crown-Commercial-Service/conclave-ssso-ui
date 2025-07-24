import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ManageOrganisationRegisterationCiiComponent } from './manage-organisation-registeration-cii.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideRouter } from '@angular/router';

// This is needed to determine whether the API dependant tests need to run or not.
const isCI = (window as any).__karma__?.config?.env?.CI === 'true';

describe('ManageOrganisationRegisterationCiiComponent', () => {
  let component: ManageOrganisationRegisterationCiiComponent;
  let fixture: ComponentFixture<ManageOrganisationRegisterationCiiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageOrganisationRegisterationCiiComponent],
      imports: [TranslateModule.forRoot()],
      providers: [provideRouter([]),],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(
      ManageOrganisationRegisterationCiiComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  (isCI ? xit : it)('should render the breadcrumb navigation correctly', () => {
    const breadcrumbLinks = fixture.nativeElement.querySelectorAll(
      '.govuk-breadcrumbs__link'
    );
    expect(breadcrumbLinks.length).toBe(9);
  });

  it('should display the "unavailable registry" message', () => {
    const unavailableMessage =
      fixture.nativeElement.querySelector('.govuk-body-l');
    expect(unavailableMessage.textContent).toContain(
      'The registry you have selected is currently unavailable.'
    );

    const searchLink = fixture.nativeElement.querySelector(
      '#searchWithDifferentIdLink'
    );
    expect(searchLink.textContent).toContain(
      'Search with a different organisation ID'
    );
    expect(searchLink.getAttribute('routerLink')).toBe(
      '/manage-org/register/search'
    );
  });
});
