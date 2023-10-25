import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BuyerErrorComponent } from './error.component';
import { Store } from '@ngrx/store';

describe('BuyerErrorComponent', () => {
  let component: BuyerErrorComponent;
  let fixture: ComponentFixture<BuyerErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [BuyerErrorComponent],
      providers: [{ provide: Store, useFactory: () => ({}) }],
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
      'a[routerLink="/buyer/search"]'
    );
    expect(backButton).toBeTruthy();
    expect(backButton.textContent).toContain('Back');
  });
});
