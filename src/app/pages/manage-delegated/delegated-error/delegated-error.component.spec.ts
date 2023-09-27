import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DelegatedErrorComponent } from './delegated-error.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

describe('DelegatedErrorComponent', () => {
  let component: DelegatedErrorComponent;
  let fixture: ComponentFixture<DelegatedErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [DelegatedErrorComponent],
      providers: [TranslateService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DelegatedErrorComponent);
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
    const errorSummary = compiledTemplate.querySelector(
      '.govuk-error-summary__title'
    );
    const errorLink = compiledTemplate.querySelector(
      '.govuk-error-summary__list a'
    );

    expect(errorSummary.textContent).toContain('ERROR_SUMMARY');
    expect(errorLink.textContent).toContain(errorMessage);
  });
});
