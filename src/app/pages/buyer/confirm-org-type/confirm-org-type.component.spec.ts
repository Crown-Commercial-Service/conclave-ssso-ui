import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmOrgTypeComponent } from './confirm-org-type.component';
import { ActivatedRoute, Router } from '@angular/router';
import { OrganisationService } from 'src/app/services/postgres/organisation.service';
import { WrapperOrganisationService } from 'src/app/services/wrapper/wrapper-org-service';
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
import { ViewportScroller } from '@angular/common';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { Observable, of } from 'rxjs';

describe('ConfirmOrgTypeComponent', () => {
  let component: ConfirmOrgTypeComponent;
  let fixture: ComponentFixture<ConfirmOrgTypeComponent>;
  let mockRouter: any;
  let mockActivatedRoute: any;
  let mockOrganisationService: any;
  let mockWrapperOrgService: any;
  let mockViewportScroller: any;
  let mockScrollHelper: any;
  let store: Store<UIState>;
  let actionsSubject: ActionsSubject;
  let reducerManager: ReducerManager;
  let reducerManagerDispatcher: ReducerManagerDispatcher;
  const initialState = {};
  const initialReducers = {};
  const reducerFactory = () => {};

  beforeEach(async () => {
    mockRouter = { navigateByUrl: jest.fn() };
    mockActivatedRoute = { queryParams: of({ data: 'test-data' }) };
    mockOrganisationService = { getById: jest.fn() };
    mockWrapperOrgService = { updateOrgRoles: jest.fn() };
    mockViewportScroller = {
      scrollToPosition: jest.fn(),
      setOffset: jest.fn(),
    };
    mockScrollHelper = { scrollToElement: jest.fn() };

    await TestBed.configureTestingModule({
      declarations: [ConfirmOrgTypeComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: OrganisationService, useValue: mockOrganisationService },
        {
          provide: WrapperOrganisationService,
          useValue: mockWrapperOrgService,
        },
        { provide: ViewportScroller, useValue: mockViewportScroller },
        { provide: ScrollHelper, useValue: mockScrollHelper },
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
    fixture = TestBed.createComponent(ConfirmOrgTypeComponent);
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

  it('should navigate to the previous page on back click', () => {
    component.org = { ciiOrganisationId: 1 };
    component.onBackClick();
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith(
      'update-org-type/confirm?data=eyJJZCI6MX0='
    );
  });
});
