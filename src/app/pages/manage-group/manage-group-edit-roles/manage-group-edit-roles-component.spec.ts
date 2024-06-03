import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ViewportScroller } from '@angular/common';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { ManageGroupEditRolesComponent } from './manage-group-edit-roles-component';
import { UIState } from 'src/app/store/ui.states';
import { WrapperOrganisationGroupService } from 'src/app/services/wrapper/wrapper-org--group-service';
import { SharedDataService } from 'src/app/shared/shared-data.service';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';

describe('ManageGroupEditRolesComponent', () => {
  let component: ManageGroupEditRolesComponent;
  let fixture: ComponentFixture<ManageGroupEditRolesComponent>;
  let mockStore: jasmine.SpyObj<Store<UIState>>;
  let mockOrgGroupService: jasmine.SpyObj<WrapperOrganisationGroupService>;
  let mockSharedDataService: jasmine.SpyObj<SharedDataService>;
  let routerStub: Partial<Router>;
  let localStore: any = {
    cii_organisation_id: 'test-org-id',
  };

  const mockRoleListResponse = [
    {
      roleId: 1,
      roleKey: 'ROLE_1',
      roleName: 'Role 1',
      description: 'Role 1 Description',
    },
    {
      roleId: 2,
      roleKey: 'ROLE_2',
      roleName: 'Role 2',
      description: 'Role 2 Description',
    },
    {
      roleId: 3,
      roleKey: 'ROLE_3',
      roleName: 'Role 3',
      description: 'Role 3 Description',
    },
  ];

  beforeEach(async () => {
    mockStore = jasmine.createSpyObj('Store', ['dispatch', 'pipe']);
    mockOrgGroupService = jasmine.createSpyObj(
      'WrapperOrganisationGroupService',
      ['getOrganisationRoles']
    );
    mockSharedDataService = jasmine.createSpyObj('SharedDataService', [
      'storeRoleForGroup',
    ]);
    routerStub = {
      navigateByUrl: jasmine.createSpy('navigateByUrl'),
    };

    spyOn(localStorage, 'getItem').and.callFake((key) =>
      key in localStore ? localStore[key] : null
    );

    await TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, TranslateModule.forRoot()],
      declarations: [ManageGroupEditRolesComponent],
      providers: [
        { provide: Router, useValue: routerStub },
        { provide: Store, useValue: mockStore },
        {
          provide: WrapperOrganisationGroupService,
          useValue: mockOrgGroupService,
        },
        { provide: SharedDataService, useValue: mockSharedDataService },
        ViewportScroller,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParams: {},
            },
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageGroupEditRolesComponent);
    component = fixture.componentInstance;

    mockOrgGroupService.getOrganisationRoles.and.returnValue(
      of(mockRoleListResponse)
    );

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the component properly', () => {
    component.isEdit = true;
    component.editingGroupId = 1;
    component.roleIds = [1, 2, 3];
    component.groupName = 'Test Group';
    component.addingRoles = [
      {
        roleId: 4,
        roleKey: 'ROLE_4',
        roleName: 'Role 4',
        description: 'Role 4 Description',
      },
    ];
    component.removingRoles = [
      {
        roleId: 5,
        roleKey: 'ROLE_5',
        roleName: 'Role 5',
        description: 'Role 5 Description',
      },
    ];
    component.userCount = 10;

    component.ngOnInit();

    fixture.detectChanges();

    expect(component.organisationId).toBe('test-org-id');
    expect(component.titleService.getTitle()).toBe(
      'Add or remove services - Manage Groups - CCS'
    );
    expect(component.orgRoleList).toEqual(mockRoleListResponse);
    expect(component.roleGridSource.length).toBe(mockRoleListResponse.length);

    expect(component.formGroup.controls['role']).toBeTruthy();
  });

  it('should handle checkbox click properly', () => {
    const mockDataRow = {
      roleId: 1,
      roleKey: 'ROLE_1',
      roleName: 'Role 1',
      description: 'Role 1 Description',
      serviceView: true,
    };

    component.onCheckBoxClickRow(mockDataRow, true);

    expect(component.addingRoles.length).toBe(1);
    expect(component.addingRoles[0]).toEqual(mockDataRow);

    component.onCheckBoxClickRow(mockDataRow, false);

    expect(component.removingRoles.length).toBe(0);
  });

  it('should handle continue click properly', () => {
    component.onContinueClick('Continue');

    expect(component.sharedDataService.storeRoleForGroup).toHaveBeenCalledWith(
      JSON.stringify({
        isEdit: component.isEdit,
        groupId: component.editingGroupId,
        roleIds: component.roleIds,
        addingRoles: component.addingRoles,
        removingRoles: component.removingRoles,
        userCount: component.userCount,
        groupName: component.groupName,
      })
    );

    expect(routerStub.navigateByUrl).toHaveBeenCalledWith(
      'manage-groups/edit-roles-confirm?data=' +
        JSON.stringify({ isEdit: component.isEdit })
    );
  });

  it('should handle cancel click properly', () => {
    component.onCancelClick('Cancel');

    expect(routerStub.navigateByUrl).toHaveBeenCalledWith(
      'manage-groups/view?data=' +
        JSON.stringify({ isEdit: true, groupId: component.editingGroupId })
    );
  });
});
