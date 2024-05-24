import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { LocationStrategy, ViewportScroller } from '@angular/common';
import { Store } from '@ngrx/store';
import { Title } from '@angular/platform-browser';
import { of } from 'rxjs';
import { ManageGroupViewComponent } from './manage-group-view-component';
import { WrapperOrganisationGroupService } from 'src/app/services/wrapper/wrapper-org--group-service';
import { SharedDataService } from 'src/app/shared/shared-data.service';
import { TranslateModule } from '@ngx-translate/core';

describe('ManageGroupViewComponent', () => {
  let component: ManageGroupViewComponent;
  let fixture: ComponentFixture<ManageGroupViewComponent>;
  let mockActivatedRoute: any;
  let mockRouter: any;
  let mockOrgGroupService: any;
  let mockLocationStrategy: any;
  let mockTitleService: any;
  let mockSharedDataService: any;

  beforeEach(async () => {
    const viewportScrollerSpy = jasmine.createSpyObj('ViewportScroller', [
      'setOffset',
    ]);

    mockActivatedRoute = {
      snapshot: {
        queryParams: {},
        queryParamMap: {
          get: (param: string) => {
            return null;
          },
        },
      },
      data: of({}),
    };

    mockRouter = {
      getCurrentNavigation: () => ({
        extras: {
          state: null,
        },
      }),
      navigateByUrl: jasmine.createSpy('navigateByUrl'),
    };

    mockOrgGroupService = {
      getOrganisationGroup: jasmine
        .createSpy('getOrganisationGroup')
        .and.returnValue(of({})),
    };

    mockLocationStrategy = {
      onPopState: jasmine.createSpy('onPopState'),
    };

    mockTitleService = {
      setTitle: jasmine.createSpy('setTitle'),
    };

    mockSharedDataService = {
      manageGroupStorage: jasmine.createSpy('manageGroupStorage'),
    };

    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [ManageGroupViewComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
        {
          provide: WrapperOrganisationGroupService,
          useValue: mockOrgGroupService,
        },
        { provide: LocationStrategy, useValue: mockLocationStrategy },
        { provide: Title, useValue: mockTitleService },
        { provide: SharedDataService, useValue: mockSharedDataService },
        { provide: Store, useValue: {} },
        { provide: ViewportScroller, useValue: viewportScrollerSpy },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageGroupViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set the page title correctly', () => {
    expect(mockTitleService.setTitle).toHaveBeenCalledWith(
      'View - Manage Groups - CCS'
    );
  });

  it('should retrieve the organisation group on component initialization', () => {
    expect(mockOrgGroupService.getOrganisationGroup).toHaveBeenCalledWith(
      component.organisationId,
      component.editingGroupId
    );
  });

  it('should navigate to the edit name page when onNameEditClick is called', () => {
    component.onNameEditClick('Change group name');
    expect(mockSharedDataService.manageGroupStorage).toHaveBeenCalledWith(
      component.group.groupName
    );
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith(
      'manage-groups/edit-name?data=' +
        JSON.stringify({
          isEdit: component.isEdit,
          groupId: component.editingGroupId,
        })
    );
  });

  it('should navigate to the edit roles page when onRoleEditClick is called', () => {
    component.onRoleEditClick('Manage group roles');
    expect(mockSharedDataService.manageGroupStorage).toHaveBeenCalledWith(
      component.group.groupName
    );
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith(
      'manage-groups/edit-roles?data=' +
        JSON.stringify({
          isEdit: component.isEdit,
          groupId: component.editingGroupId,
          roleIds: component.group.roles.map((role) => role.id),
          groupName: component.group.groupName,
        })
    );
  });

  it('should navigate to the delete group confirmation page when onDeleteClick is called', () => {
    component.onDeleteClick();
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith(
      'manage-groups/delete-group-confirm?data=' +
        JSON.stringify({
          isEdit: true,
          organisationId: component.organisationId,
          groupId: component.editingGroupId,
        })
    );
  });
});
