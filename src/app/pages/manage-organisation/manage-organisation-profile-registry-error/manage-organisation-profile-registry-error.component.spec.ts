import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManageOrganisationRegistryErrorComponent } from './manage-organisation-profile-registry-error.component';
import { Store } from '@ngrx/store';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

describe('ManageOrganisationRegistryErrorComponent', () => {
  let component: ManageOrganisationRegistryErrorComponent;
  let fixture: ComponentFixture<ManageOrganisationRegistryErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageOrganisationRegistryErrorComponent],
      imports: [],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Store, useFactory: () => ({}) }],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageOrganisationRegistryErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct breadcrumbs based on the reason', () => {
    component.reason = 'wrong';
    fixture.detectChanges();
    const breadcrumbs = fixture.nativeElement.querySelectorAll(
      '.govuk-breadcrumbs__link'
    );
    expect(breadcrumbs.length).toBe(3);
    expect(breadcrumbs[0].textContent).toContain('Administrator dashboard');
    expect(breadcrumbs[1].textContent).toContain('Manage your organisation');
    expect(breadcrumbs[2].textContent).toContain('Registry already used');
  });

  it('should display the correct message for the "existsInConclave" reason', () => {
    component.reason = 'wrong';
    fixture.detectChanges();
    const message = fixture.nativeElement.querySelector('.govuk-body-l');
    expect(message.textContent).toContain(
      'This Organisation is already registered for Public Procurement Gateway. Contact your Organisation Administrator'
    );
  });
});
