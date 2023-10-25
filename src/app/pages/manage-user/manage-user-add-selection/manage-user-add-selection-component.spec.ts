import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ViewportScroller } from '@angular/common';
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
import { FormBuilder } from '@angular/forms';
import { QueryList, ElementRef } from '@angular/core';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { TranslateModule } from '@ngx-translate/core';

import { ManageUserAddSelectionComponent } from './manage-user-add-selection-component';

describe('ManageUserAddSelectionComponent', () => {
  let component: ManageUserAddSelectionComponent;
  let fixture: ComponentFixture<ManageUserAddSelectionComponent>;
  const initialState = {};
  const initialReducers = {};
  const reducerFactory = () => {};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageUserAddSelectionComponent],
      imports: [
        RouterTestingModule,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        ViewportScroller,
        Store,
        StateObservable,
        ActionsSubject,
        ReducerManager,
        ReducerManagerDispatcher,
        { provide: INITIAL_STATE, useValue: initialState },
        { provide: INITIAL_REDUCERS, useValue: initialReducers },
        { provide: REDUCER_FACTORY, useValue: reducerFactory },
        FormBuilder,
        ScrollHelper,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageUserAddSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the selection form with default values', () => {
    expect(component.selectionForm.value).toEqual({ selection: '' });
  });

  it('should set focus on input element with given index', () => {
    const inputIndex = 0;
    const inputs: QueryList<ElementRef> = component.inputs;
    spyOn(inputs.toArray()[inputIndex].nativeElement, 'focus');
    component.setFocus(inputIndex);
    expect(inputs.toArray()[inputIndex].nativeElement.focus).toHaveBeenCalled();
  });

  it('should navigate to add-user/details when "singleUser" option is selected and form is valid', () => {
    spyOn(component.router, 'navigateByUrl');
    component.selectionForm.patchValue({ selection: 'singleUser' });
    component.onSubmit(component.selectionForm);
    expect(component.router.navigateByUrl).toHaveBeenCalledWith(
      'manage-users/add-user/details'
    );
  });

  it('should navigate to bulk-users when "multipleUsers" option is selected and form is valid', () => {
    spyOn(component.router, 'navigateByUrl');
    component.selectionForm.patchValue({ selection: 'multipleUsers' });
    component.onSubmit(component.selectionForm);
    expect(component.router.navigateByUrl).toHaveBeenCalledWith(
      'manage-users/bulk-users'
    );
  });

  it('should not navigate when form is invalid', () => {
    spyOn(component.router, 'navigateByUrl');
    component.submitted = true;
    component.onSubmit(component.selectionForm);
    expect(component.router.navigateByUrl).not.toHaveBeenCalled();
  });

  it('should navigate to manage-users when cancel button is clicked', () => {
    spyOn(component.router, 'navigateByUrl');
    component.onCancelClick();
    expect(component.router.navigateByUrl).toHaveBeenCalledWith('manage-users');
  });
});
