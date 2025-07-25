import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { ManageOrgRegFailureComponent } from './manage-organisation-registration-failure.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

describe('ManageOrgRegFailureComponent', () => {
  let component: ManageOrgRegFailureComponent;
  let fixture: ComponentFixture<ManageOrgRegFailureComponent>;
  let mockStore: jasmine.SpyObj<Store>;

  beforeEach(async () => {
    mockStore = jasmine.createSpyObj('Store', ['select']);
    await TestBed.configureTestingModule({
      declarations: [ManageOrgRegFailureComponent],
      imports: [],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Store, useValue: mockStore }],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageOrgRegFailureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct error message', () => {
    const errorMessage =
      fixture.nativeElement.querySelector('.govuk-body-l').textContent;
    expect(errorMessage).toContain(
      'Organisation with this registry ID is already registered in Public Procurement Gateway'
    );
  });

  it('should open a new tab with the CCS contact page when "Contact CCS" link is clicked', () => {
    const contactLink = fixture.nativeElement.querySelector('#contactCCSLink');
    contactLink.click();
    expect(contactLink.href).toBe('https://www.crowncommercial.gov.uk/contact');
    expect(contactLink.target).toBe('_blank');
  });
});
