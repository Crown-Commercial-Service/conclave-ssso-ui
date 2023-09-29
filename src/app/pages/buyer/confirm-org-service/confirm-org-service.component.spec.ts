import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmOrgServiceComponent } from './confirm-org-service.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { OrganisationService } from 'src/app/services/postgres/organisation.service';
import { WrapperOrganisationService } from 'src/app/services/wrapper/wrapper-org-service';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';

describe('ConfirmOrgServiceComponent', () => {
  let component: ConfirmOrgServiceComponent;
  let fixture: ComponentFixture<ConfirmOrgServiceComponent>;
  let mockActivatedRoute: any;
  let mockOrganisationService: any;
  let mockWrapperOrganisationService: any;
  let mockStore: any;

  beforeEach(async () => {
    mockActivatedRoute = {
      queryParams: of({ data: 'someData' }),
    };

    mockOrganisationService = {
      getById: jest.fn().mockReturnValue(of({})),
    };

    mockWrapperOrganisationService = {
      updateOrgRoles: jest.fn().mockReturnValue(Promise.resolve()),
    };

    mockStore = {
      dispatch: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [ConfirmOrgServiceComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: OrganisationService, useValue: mockOrganisationService },
        {
          provide: WrapperOrganisationService,
          useValue: mockWrapperOrganisationService,
        },
        { provide: Store, useValue: mockStore },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmOrgServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call the updateTableData method on subscription', () => {
    component.changes = { toAdd: [], toAutoValid: [], toDelete: [] };
    component.org = { ciiOrganisationId: 'orgId' };
    component.updateTableData = jest.fn();

    expect(component.updateTableData).toHaveBeenCalled();
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
    const routerSpy = jest.spyOn(component.router, 'navigateByUrl');

    component.onCancelClick();

    expect(routerSpy).toHaveBeenCalledWith('buyer/search');
  });

  it('should navigate to the previous page on back click', () => {
    const localStorageSpy = jest.spyOn(localStorage, 'removeItem');
    const routerSpy = jest.spyOn(component.router, 'navigateByUrl');

    component.org = { ciiOrganisationId: 'orgId' };
    component.routeData = { companyHouseId: 'companyId' };
    component.onBackClick();

    expect(localStorageSpy).toHaveBeenCalledWith('mse_org_orgId');
    expect(routerSpy).toHaveBeenCalledWith(
      'update-org-services/confirm?data=' +
        btoa(JSON.stringify({ companyHouseId: 'companyId', Id: 'orgId' }))
    );
  });

  it('should call the wrapperOrgService updateOrgRoles method on submit click', async () => {
    const updateOrgRolesSpy = jest
      .spyOn(component.wrapperOrgService, 'updateOrgRoles')
      .mockImplementation(jest.fn());
    const routerSpy = jest.spyOn(component.router, 'navigateByUrl');

    component.org = { ciiOrganisationId: 'orgId' };
    component.changes = {
      orgType: '1',
      toAdd: [],
      toAutoValid: [],
      toDelete: [],
    };

    await component.onSubmitClick();

    expect(updateOrgRolesSpy).toHaveBeenCalledWith(
      'orgId',
      'validation/auto/switch/service-role-groups'
    );
    expect(routerSpy).toHaveBeenCalledWith('org-service/success/orgId');
  });
});
