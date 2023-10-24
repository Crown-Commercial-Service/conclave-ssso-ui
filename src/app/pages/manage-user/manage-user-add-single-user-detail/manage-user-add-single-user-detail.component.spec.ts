import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ManageUserAddSingleUserDetailComponent } from './manage-user-add-single-user-detail.component';
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
import { AuthService } from '../../../services/auth/auth.service';
import { RollbarErrorService } from 'src/app/shared/rollbar-error.service';
import { TokenService } from 'src/app/services/auth/token.service';
import { RollbarService, rollbarFactory } from 'src/app/logging/rollbar';

describe('ManageUserAddSingleUserDetailComponent', () => {
  let component: ManageUserAddSingleUserDetailComponent;
  let fixture: ComponentFixture<ManageUserAddSingleUserDetailComponent>;
  const initialState = {};
  const initialReducers = {};
  const reducerFactory = () => {};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        TranslateModule.forRoot(),
        HttpClientTestingModule,
      ],
      declarations: [ManageUserAddSingleUserDetailComponent],
      providers: [
        Store,
        StateObservable,
        ActionsSubject,
        ReducerManager,
        ReducerManagerDispatcher,
        { provide: INITIAL_STATE, useValue: initialState },
        { provide: INITIAL_REDUCERS, useValue: initialReducers },
        { provide: REDUCER_FACTORY, useValue: reducerFactory },
        AuthService,
        RollbarErrorService,
        TokenService,
        { provide: RollbarService, useValue: rollbarFactory() },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageUserAddSingleUserDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the breadcrumbs correctly', () => {
    const breadcrumbs = fixture.nativeElement.querySelectorAll(
      '.govuk-breadcrumbs__link'
    );
    expect(breadcrumbs.length).toBe(3);
    expect(breadcrumbs[0].textContent).toContain('ADMINISTRATOR_DASHBOARD');
    expect(breadcrumbs[1].textContent).toContain('MANAGE_YOUR_USER_ACCOUNTS');
    expect(breadcrumbs[2].textContent).toContain('CREATE_NEW_USER_ACCOUNT');
  });

  it('should render the page title correctly', () => {
    const pageTitle = fixture.nativeElement.querySelector('.page-title');
    expect(pageTitle.textContent).toContain('CREATE_NEW_USER_ACCOUNT');
  });

  it('should render the form inputs correctly', () => {
    const formInputs = fixture.nativeElement.querySelectorAll('.govuk-input');
    expect(formInputs.length).toBe(3);

    expect(formInputs[0].id).toBe('first-name');
    expect(formInputs[0].name).toBe('first-name');

    expect(formInputs[1].id).toBe('last-name');
    expect(formInputs[1].name).toBe('last-name');

    expect(formInputs[2].id).toBe('email');
    expect(formInputs[2].name).toBe('email');
  });

  it('should call onSubmit method when the form is submitted', () => {
    spyOn(component, 'onSubmit');
    const form = fixture.nativeElement.querySelector('form');
    form.dispatchEvent(new Event('submit'));
    expect(component.onSubmit).toHaveBeenCalled();
  });

  it('should call onCancelClick method when the cancel button is clicked', () => {
    spyOn(component, 'onCancelClick');
    const cancelButton = fixture.nativeElement.querySelector(
      '.govuk-button--secondary'
    );
    cancelButton.click();
    expect(component.onCancelClick).toHaveBeenCalled();
  });
});
