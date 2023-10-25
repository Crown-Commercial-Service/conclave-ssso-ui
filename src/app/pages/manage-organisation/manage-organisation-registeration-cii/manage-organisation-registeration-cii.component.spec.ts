import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ManageOrganisationRegisterationCiiComponent } from './manage-organisation-registeration-cii.component';

describe('ManageOrganisationRegisterationCiiComponent', () => {
  let component: ManageOrganisationRegisterationCiiComponent;
  let fixture: ComponentFixture<ManageOrganisationRegisterationCiiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageOrganisationRegisterationCiiComponent],
      imports: [TranslateModule.forRoot(), RouterTestingModule],
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

  it('should render the breadcrumb navigation correctly', () => {
    const breadcrumbLinks = fixture.nativeElement.querySelectorAll(
      '.govuk-breadcrumbs__link'
    );
    expect(breadcrumbLinks.length).toBe(8);
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
