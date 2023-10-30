import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmOrgServiceComponent } from './confirm-org-service.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { OrganisationService } from 'src/app/services/postgres/organisation.service';
import { WrapperOrganisationService } from 'src/app/services/wrapper/wrapper-org-service';
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
import { UIState } from 'src/app/store/ui.states';

describe('ConfirmOrgServiceComponent', () => {
  let component: ConfirmOrgServiceComponent;
  let fixture: ComponentFixture<ConfirmOrgServiceComponent>;
  let activatedRouteMock: any;
  let mockOrganisationService: any;
  let mockWrapperOrganisationService: any;
  let store: Store<UIState>;
  let actionsSubject: ActionsSubject;
  let reducerManager: ReducerManager;
  let reducerManagerDispatcher: ReducerManagerDispatcher;
  const initialState = {};
  const initialReducers = {};
  const reducerFactory = () => {};

  beforeEach(async () => {
    activatedRouteMock = {
      queryParams: {
        subscribe: jasmine.createSpy('subscribe').and.returnValue(of()),
      },
    };
    mockOrganisationService = {
      getById: jasmine.createSpy('getById').and.returnValue(of({})),
    };
    mockWrapperOrganisationService = {
      updateOrgRoles: jasmine
        .createSpy('updateOrgRoles')
        .and.returnValue(Promise.resolve()),
    };

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [ConfirmOrgServiceComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: OrganisationService, useValue: mockOrganisationService },
        {
          provide: WrapperOrganisationService,
          useValue: mockWrapperOrganisationService,
        },
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
    fixture = TestBed.createComponent(ConfirmOrgServiceComponent);
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

  it('should update table data correctly', () => {
    component.changes = {
      toAdd: [
        {
          roleName: 'Role 1',
          serviceName: 'Service 1',
          description: 'Description 1',
        },
      ],
      toAutoValid: [
        {
          roleName: 'Role 2',
          serviceName: 'Service 2',
          description: 'Description 2',
        },
      ],
      toDelete: [
        {
          roleName: 'Role 3',
          serviceName: 'Service 3',
          description: 'Description 3',
        },
      ],
    };
    component.updateTableData();
    expect(component.toAdd).toEqual([
      {
        accessRoleName: 'Role 1',
        serviceName: 'Service 1',
        description: 'Description 1',
        serviceView: true,
      },
    ]);
    expect(component.toAutoValid).toEqual([
      {
        accessRoleName: 'Role 2',
        serviceName: 'Service 2',
        description: 'Description 2',
        serviceView: true,
      },
    ]);
    expect(component.toDelete).toEqual([
      {
        accessRoleName: 'Role 3',
        serviceName: 'Service 3',
        description: 'Description 3',
        serviceView: true,
      },
    ]);
  });

  it('should filter role IDs correctly', () => {
    const roleArray = [{ roleId: '1' }, { roleId: '2' }, { roleId: '3' }];
    const filteredArray = component.filterRoleId(roleArray);
    expect(filteredArray).toEqual(['1', '2', '3']);
  });

  it('should navigate to the previous page on cancel click', () => {
    const routerSpy = spyOn(component.router, 'navigateByUrl');
    component.onCancelClick();
    expect(routerSpy).toHaveBeenCalledWith('buyer/search');
  });

  it('should navigate to the previous page on back click', () => {
    spyOn(Storage.prototype, 'removeItem');
    const routerSpy = spyOn(component.router, 'navigateByUrl');
    component.org = { ciiOrganisationId: 'orgId' };
    component.routeData = { companyHouseId: 'companyId' };
    component.onBackClick();
    expect(localStorage.removeItem).toHaveBeenCalledWith('mse_org_orgId');
    expect(routerSpy).toHaveBeenCalledWith(
      'update-org-services/confirm?data=' +
        btoa(JSON.stringify({ companyHouseId: 'companyId', Id: 'orgId' }))
    );
  });
});
