import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { Observable, of } from 'rxjs';
import {
  Store,
  StateObservable,
  ActionsSubject,
  ReducerManager,  
  INITIAL_STATE,
  INITIAL_REDUCERS,
  REDUCER_FACTORY,
} from '@ngrx/store';
import { UIState } from 'src/app/store/ui.states';

import { OrganisationService } from 'src/app/services/postgres/organisation.service';
import { BuyerConfirmChangesComponent } from './confirm.component';
import { provideMockStore } from '@ngrx/store/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('BuyerConfirmChangesComponent', () => {
  let component: BuyerConfirmChangesComponent;
  let fixture: ComponentFixture<BuyerConfirmChangesComponent>;
  let store: Store<UIState>;
  let actionsSubject: ActionsSubject;
  let reducerManager: ReducerManager;  
  const initialState = {};
  const initialReducers = {};
  const reducerFactory = () => {};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [],
      declarations: [BuyerConfirmChangesComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),  
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: 1 }),
          },
        },
        Store,
        StateObservable,
        ActionsSubject,
        ReducerManager,
        provideMockStore({initialState: {},}),
        { provide: INITIAL_STATE, useValue: initialState },
        { provide: INITIAL_REDUCERS, useValue: initialReducers },
        { provide: REDUCER_FACTORY, useValue: reducerFactory },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyerConfirmChangesComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    actionsSubject = TestBed.inject(ActionsSubject);
    reducerManager = TestBed.inject(ReducerManager);    
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize org and org$ variables', () => {
    expect(component.org).toBeUndefined();
    expect(component.org$).toBeInstanceOf(Observable);
  });

  // it('should navigate to the confirm page with the correct ID when onBackClick is called', () => {
  //   const routerSpy = spyOn(component.router, 'navigateByUrl');

  //   component.org = { ciiOrganisationId: 1 };

  //   component.onBackClick();

  //   expect(routerSpy).toHaveBeenCalledWith('buyer/confirm/1');
  // });
});
