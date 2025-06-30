import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { RegistrationSuccessComponent } from './registration-success.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('RegistrationSuccessComponent', () => {
  let component: RegistrationSuccessComponent;
  let fixture: ComponentFixture<RegistrationSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      declarations: [RegistrationSuccessComponent],
      providers: [        
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
