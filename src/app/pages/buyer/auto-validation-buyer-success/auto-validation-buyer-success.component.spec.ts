import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AutoValidationBuyerSuccessComponent } from './auto-validation-buyer-success.component';
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
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { ViewportScroller } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AutoValidationBuyerSuccessComponent', () => {
  let component: AutoValidationBuyerSuccessComponent;
  let fixture: ComponentFixture<AutoValidationBuyerSuccessComponent>;
  let router: Router;
  let organisationService: OrganisationService;
  let wrapperOrgService: WrapperOrganisationService;
  let store: Store<UIState>;
  let scrollHelper: ScrollHelper;
  let actionsSubject: ActionsSubject;
  let reducerManager: ReducerManager;
  let reducerManagerDispatcher: ReducerManagerDispatcher;
  const initialState = {};
  const initialReducers = {};
  const reducerFactory = () => {};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AutoValidationBuyerSuccessComponent],
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [
        OrganisationService,
        WrapperOrganisationService,
        Store,
        StateObservable,
        ActionsSubject,
        ReducerManager,
        ReducerManagerDispatcher,
        ScrollHelper,
        ViewportScroller,
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: '1' }),
          },
        },
        { provide: INITIAL_STATE, useValue: initialState },
        { provide: INITIAL_REDUCERS, useValue: initialReducers },
        { provide: REDUCER_FACTORY, useValue: reducerFactory },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoValidationBuyerSuccessComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    organisationService = TestBed.inject(OrganisationService);
    wrapperOrgService = TestBed.inject(WrapperOrganisationService);
    store = TestBed.inject(Store);
    scrollHelper = TestBed.inject(ScrollHelper);
    actionsSubject = TestBed.inject(ActionsSubject);
    reducerManager = TestBed.inject(ReducerManager);
    reducerManagerDispatcher = TestBed.inject(ReducerManagerDispatcher);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should remove items from local storage on component destroy', () => {
    jest.spyOn(localStorage, 'removeItem');
    component.org = { ciiOrganisationId: '1' };
    jest.spyOn(Storage.prototype, 'removeItem');

    component.ngOnDestroy();

    expect(localStorage.removeItem).toHaveBeenCalledWith('defaultRole');
    expect(localStorage.removeItem).toHaveBeenCalledWith('mse_org_1');
  });

  it('should navigate to update-org-type/confirm on back click', () => {
    jest.spyOn(router, 'navigateByUrl');
    component.org = { ciiOrganisationId: '1' };
    jest.spyOn(Storage.prototype, 'removeItem');

    component.onBackClick();

    expect(localStorage.removeItem).toHaveBeenCalledWith('mse_org_1');
    expect(router.navigateByUrl).toHaveBeenCalledWith(
      'update-org-type/confirm/1'
    );
  });
});
