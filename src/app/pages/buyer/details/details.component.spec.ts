import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
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
import { ViewportScroller } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { BuyerDetailsComponent } from './details.component';
import { UIState } from 'src/app/store/ui.states';
import { ciiService } from 'src/app/services/cii/cii.service';
import { WrapperOrganisationService } from 'src/app/services/wrapper/wrapper-org-service';
import { SharedDataService } from 'src/app/shared/shared-data.service';

describe('BuyerDetailsComponent', () => {
  let component: BuyerDetailsComponent;
  let fixture: ComponentFixture<BuyerDetailsComponent>;
  let activatedRouteStub: Partial<ActivatedRoute>;
  let routerStub: Partial<Router>;
  let viewportScrollerStub: Partial<ViewportScroller>;
  let ciiServiceStub: Partial<ciiService>;
  let organisationServiceStub: Partial<WrapperOrganisationService>;
  let sharedDataServiceStub: Partial<SharedDataService>;
  let store: Store<UIState>;
  let actionsSubject: ActionsSubject;
  let reducerManager: ReducerManager;
  let reducerManagerDispatcher: ReducerManagerDispatcher;
  const initialState = {};
  const initialReducers = {};
  const reducerFactory = () => {};

  beforeEach(async () => {
    activatedRouteStub = {
      params: of({ id: '1' }),
    };
    routerStub = {
      navigateByUrl: jasmine.createSpy('navigateByUrl'),
    };
    viewportScrollerStub = {};
    ciiServiceStub = {
      getSchemes: jasmine.createSpy('getSchemes').and.returnValue(of([])),
      getOrgDetails: jasmine.createSpy('getOrgDetails').and.returnValue(
        of({
          identifier: { scheme: 'GB-CCS', id: '123' },
          additionalIdentifiers: [
            { scheme: 'ABC', id: '456' },
            { scheme: 'XYZ', id: '789' },
          ],
        })
      ),
    };
    organisationServiceStub = {
      getOrganisation: jasmine.createSpy('getOrganisation').and.returnValue(
        of({
          identifier: { legalName: 'Test Org' },
          address: {
            streetAddress: '123 Street',
            locality: 'City',
            region: 'State',
            postalCode: '12345',
            countryName: 'Country',
          },
        })
      ),
    };
    sharedDataServiceStub = {
      getId: jasmine.createSpy('getId').and.returnValue('ABC-123'),
      convertIdToHyphenId: jasmine.createSpy('convertIdToHyphenId').and.returnValue('ABC-123'),
    };

    await TestBed.configureTestingModule({
      declarations: [BuyerDetailsComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: Router, useValue: routerStub },
        { provide: ViewportScroller, useValue: viewportScrollerStub },
        { provide: ciiService, useValue: ciiServiceStub },
        { provide: WrapperOrganisationService, useValue: organisationServiceStub },
        { provide: SharedDataService, useValue: sharedDataServiceStub },
        Store,
        StateObservable,
        ActionsSubject,
        ReducerManager,
        ReducerManagerDispatcher,
        ViewportScroller,
        { provide: ActivatedRoute, useValue: { params: of({ id: '1' }) } },
        { provide: INITIAL_STATE, useValue: initialState },
        { provide: INITIAL_REDUCERS, useValue: initialReducers },
        { provide: REDUCER_FACTORY, useValue: reducerFactory },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyerDetailsComponent);
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

  it('should navigate to the search page on cancel button click', () => {
    const cancelButton = fixture.debugElement.query(By.css('.govuk-button--secondary')).nativeElement;
    cancelButton.click();
    expect(routerStub.navigateByUrl).toHaveBeenCalledWith('buyer-supplier/search');
  });
});