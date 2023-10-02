import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { BuyerConfirmComponent } from './confirm.component';
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
import { UIState } from 'src/app/store/ui.states';

describe('BuyerConfirmComponent', () => {
  let component: BuyerConfirmComponent;
  let fixture: ComponentFixture<BuyerConfirmComponent>;
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
        HttpClientTestingModule,
      ],
      declarations: [BuyerConfirmComponent],
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
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyerConfirmComponent);
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

  it('should initialize form and roles', () => {
    expect(component.userProfileForm instanceof FormGroup).toBeTruthy();
    expect(component.orgRoles).toEqual([]);
    expect(component.eRoles).toEqual([]);
    expect(component.roles).toEqual([]);
    expect(component.rolesToAdd).toEqual([]);
    expect(component.rolesToDelete).toEqual([]);
  });

  it('should handle onChange method correctly', () => {
    const event = { target: { checked: true } };
    let defaultValue = true;
    const role = { enabled: true };

    component.onChange(event, defaultValue, role);

    expect(component.rolesToDelete).toEqual([]);

    event.target.checked = false;
    component.onChange(event, defaultValue, role);

    expect(component.rolesToDelete).toEqual([role]);

    defaultValue = false;

    component.onChange(event, defaultValue, role);

    expect(component.rolesToAdd).toEqual([]);

    event.target.checked = true;
    component.onChange(event, defaultValue, role);

    expect(component.rolesToAdd).toEqual([role]);
  });

  it('should handle onSubmitClick method correctly', () => {
    component.organisation = { ciiOrganisationId: '123', rightToBuy: true };
    component.rolesToDelete = [{ roleName: 'role1' }];
    component.rolesToAdd = [{ roleName: 'role2' }];
    component.verified = true;

    jest.spyOn(Storage.prototype, 'setItem');
    jest.spyOn(component.router, 'navigateByUrl');

    component.onSubmitClick();

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'mse_org_123',
      JSON.stringify({
        org: { ciiOrganisationId: '123', rightToBuy: true },
        toDelete: [{ roleName: 'role1' }],
        toAdd: [{ roleName: 'role2' }],
        rightToBuy: true,
        hasChanges: true,
      })
    );
    expect(component.router.navigateByUrl).toHaveBeenCalledWith(
      'buyer/confirm-changes/123'
    );
  });

  it('should handle onCancelClick method correctly', () => {
    component.organisation = { ciiOrganisationId: '123' };

    jest.spyOn(Storage.prototype, 'removeItem');

    jest.spyOn(component.router, 'navigateByUrl');

    component.onCancelClick();

    expect(localStorage.removeItem).toHaveBeenCalledWith('mse_org_123');
    expect(component.router.navigateByUrl).toHaveBeenCalledWith('buyer/search');
  });
});
