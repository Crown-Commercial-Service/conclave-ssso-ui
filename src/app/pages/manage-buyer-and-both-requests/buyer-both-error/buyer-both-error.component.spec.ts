import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BuyerBothErrorComponent } from './buyer-both-error.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

describe('BuyerBothErrorComponent', () => {
  let component: BuyerBothErrorComponent;
  let fixture: ComponentFixture<BuyerBothErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [BuyerBothErrorComponent],
      providers: [TranslateService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyerBothErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the error message', () => {
    const errorMessage =
      'An unexpected error has occurred. Please try again in a few minutes';
    const compiledTemplate = fixture.nativeElement;
    const errorSummaryElement = compiledTemplate.querySelector(
      '.govuk-error-summary__body'
    );
    const errorMessageElement = errorSummaryElement.querySelector('a');

    expect(errorMessageElement.textContent.trim()).toBe(errorMessage);
  });
});
