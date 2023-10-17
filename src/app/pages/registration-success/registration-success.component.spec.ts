import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { RegistrationSuccessComponent } from './registration-success.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  Store,
  StateObservable,
  ActionsSubject,
  ReducerManager,
  ReducerManagerDispatcher,
  INITIAL_STATE,
  INITIAL_REDUCERS,
  REDUCER_FACTORY,
} from '@ngrx/store';

describe('RegistrationSuccessComponent', () => {
  let component: RegistrationSuccessComponent;
  let fixture: ComponentFixture<RegistrationSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      declarations: [RegistrationSuccessComponent],
      providers: [
        Store,
        StateObservable,
        ActionsSubject,
        ReducerManager,
        ReducerManagerDispatcher,
        { provide: INITIAL_STATE, useValue: {} },
        { provide: INITIAL_REDUCERS, useValue: {} },
        { provide: REDUCER_FACTORY, useValue: () => {} },
      ],
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
