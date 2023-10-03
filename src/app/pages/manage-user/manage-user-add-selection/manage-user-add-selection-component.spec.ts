import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
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
import { TranslateModule } from '@ngx-translate/core';

import { UIState } from 'src/app/store/ui.states';
import { ManageUserAddSelectionComponent } from './manage-user-add-selection-component';

describe('ManageUserAddSelectionComponent', () => {
  let component: ManageUserAddSelectionComponent;
  let fixture: ComponentFixture<ManageUserAddSelectionComponent>;
  let store: Store<UIState>;
  let actionsSubject: ActionsSubject;
  let reducerManager: ReducerManager;
  let reducerManagerDispatcher: ReducerManagerDispatcher;
  const initialState = {};
  const initialReducers = {};
  const reducerFactory = () => {};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        Store,
        StateObservable,
        ActionsSubject,
        ReducerManager,
        ReducerManagerDispatcher,
        { provide: INITIAL_STATE, useValue: initialState },
        { provide: INITIAL_REDUCERS, useValue: initialReducers },
        { provide: REDUCER_FACTORY, useValue: reducerFactory },
      ],
      declarations: [ManageUserAddSelectionComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageUserAddSelectionComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    actionsSubject = TestBed.inject(ActionsSubject);
    reducerManager = TestBed.inject(ReducerManager);
    reducerManagerDispatcher = TestBed.inject(ReducerManagerDispatcher);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the selectionForm with required validators', () => {
    expect(component.selectionForm).toBeDefined();
    expect(component.selectionForm.controls.selection).toBeDefined();
    expect(component.selectionForm.controls.selection.value).toBe('');
    expect(component.selectionForm.controls.selection.valid).toBeFalsy();
    expect(
      component.selectionForm.controls.selection.errors?.required
    ).toBeTruthy();
  });

  it('should set focus on the input element', () => {
    const inputIndex = 0;
    const inputElement =
      fixture.nativeElement.querySelectorAll('input')[inputIndex];
    jest.spyOn(inputElement, 'focus');
    component.setFocus(inputIndex);
    expect(inputElement.focus).toHaveBeenCalled();
  });

  it('should navigate to add-user/details when "Single User" is selected', () => {
    const routerSpy = jest.spyOn(component.router, 'navigateByUrl');
    component.onSubmit(component.selectionForm);
    component.selectionForm.controls.selection.setValue('singleUser');
    component.onSubmit(component.selectionForm);
    expect(routerSpy).toHaveBeenCalledWith('manage-users/add-user/details');
  });

  it('should navigate to bulk-users when "Multiple Users" is selected', () => {
    const routerSpy = jest.spyOn(component.router, 'navigateByUrl');
    component.selectionForm.controls.selection.setValue('multipleUsers');
    component.onSubmit(component.selectionForm);
    expect(routerSpy).toHaveBeenCalledWith('manage-users/bulk-users');
  });

  it('should cancel and navigate to manage-users when onCancelClick is called', () => {
    const routerSpy = jest.spyOn(component.router, 'navigateByUrl');
    component.onCancelClick();
    expect(routerSpy).toHaveBeenCalledWith('manage-users');
  });
});
