import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistrationSuccessComponent } from './registration-success.component';
import { provideMockStore } from '@ngrx/store/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

describe('RegistrationSuccessComponent', () => {
  let component: RegistrationSuccessComponent;
  let fixture: ComponentFixture<RegistrationSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [],
      declarations: [RegistrationSuccessComponent],
      providers: [      
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),  
        provideMockStore({
          initialState: {}, 
        }),
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the success message', () => {
    const successMessage = fixture.nativeElement.querySelector('.govuk-body-l');
    expect(successMessage.textContent).toContain(
      'You have successfully created an account.'
    );
  });

  it('should contain a link to the homepage', () => {
    const homepageLink = fixture.nativeElement.querySelector('a');
    expect(homepageLink).toBeTruthy();
    expect(homepageLink.href).toContain('/');
    expect(homepageLink.textContent).toContain(
      'Return to the Crown Commercial Services homepage'
    );
  });
});
