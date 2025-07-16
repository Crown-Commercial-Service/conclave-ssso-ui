import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BuyerErrorComponent } from './error.component';
import { Store } from '@ngrx/store';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideRouter } from '@angular/router';

describe('BuyerErrorComponent', () => {
  let component: BuyerErrorComponent;
  let fixture: ComponentFixture<BuyerErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [],
      declarations: [BuyerErrorComponent],
      providers: [
        provideRouter([]),
        { provide: Store, useFactory: () => ({}) }],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyerErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the error message', () => {
    const errorMessage = fixture.nativeElement.querySelector(
      '.govuk-heading-xl.page-title'
    );
    expect(errorMessage.textContent).toContain(
      'An unexpected error has occured. Please try again in a few minutes'
    );
  });

  it('should have a link to contact CCS', () => {
    const contactLink = fixture.nativeElement.querySelector(
      'a[href="https://www.crowncommercial.gov.uk/contact"]'
    );
    expect(contactLink).toBeTruthy();
    expect(contactLink.textContent).toContain('Contact CCS');
    expect(contactLink.target).toBe('_blank');
  });

  it('should have a link to go back to the buyer search page', () => {
    const backButton = fixture.nativeElement.querySelector(
      'a[routerLink="/buyer-supplier/search"]'
    );
    expect(backButton).toBeTruthy();
    expect(backButton.textContent).toContain('Back');
  });
});
