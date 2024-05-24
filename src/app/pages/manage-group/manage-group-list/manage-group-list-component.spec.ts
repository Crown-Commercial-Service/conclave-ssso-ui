import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ViewportScroller } from '@angular/common';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ManageGroupListComponent } from './manage-group-list-component';
import { WrapperOrganisationGroupService } from 'src/app/services/wrapper/wrapper-org--group-service';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { Group, GroupList } from 'src/app/models/organisationGroup';

describe('ManageGroupListComponent', () => {
  let component: ManageGroupListComponent;
  let fixture: ComponentFixture<ManageGroupListComponent>;
  let groupService: WrapperOrganisationGroupService;
  let store: Store<any>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        TranslateModule.forRoot(),
        HttpClientTestingModule,
      ],
      declarations: [ManageGroupListComponent],
      providers: [
        WrapperOrganisationGroupService,
        ViewportScroller,
        ScrollHelper,
        {
          provide: Store,
          useValue: {
            dispatch: jasmine.createSpy('dispatch'),
            select: jasmine.createSpy('select'),
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageGroupListComponent);
    component = fixture.componentInstance;
    groupService = TestBed.inject(WrapperOrganisationGroupService);
    store = TestBed.inject(Store);
    router = TestBed.inject(Router);

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the component', () => {
    spyOn(component, 'getOrganisationUsers');
    component.ngOnInit();
    expect(component.getOrganisationUsers).toHaveBeenCalled();
  });

  it('should get organization groups', () => {
    const groupList: GroupList = {
      organisationId: '123',
      groupList: [
        {
          serviceRoleGroups: 'role groups',
          groupId: 1,
          mfaEnabled: false,
          groupName: 'group name 1',
        },
        {
          serviceRoleGroups: 'role groups',
          groupId: 2,
          mfaEnabled: false,
          groupName: 'group name 2',
        },
      ],
    };
    spyOn(groupService, 'getOrganisationGroups').and.returnValue(of(groupList));
    component.getOrganisationUsers();
    expect(component.groupList).toEqual(groupList);
  });

  it('should navigate to add group page on add button click', () => {
    spyOn(router, 'navigateByUrl');

    component.onAddClick('Create Group');
    expect(router.navigateByUrl).toHaveBeenCalledWith(
      'manage-groups/edit-name?data=' +
        JSON.stringify({ isEdit: false, groupId: 0 })
    );
  });

  it('should update search text on search text change', () => {
    const event = { target: { value: 'Group 1' } };
    component.searchTextChanged(event);
    expect(component.searchText).toEqual('Group 1');
  });

  it('should search for groups on search button click', () => {
    spyOn(component, 'getOrganisationUsers');
    component.onSearchClick();
    expect(component.searchSumbited).toBe(true);
    expect(component.getOrganisationUsers).toHaveBeenCalled();
  });

  it('should navigate to edit group page on edit button click', () => {
    spyOn(router, 'navigateByUrl');

    const group: Group = {
      serviceRoleGroups: 'role groups',
      groupId: 1,
      mfaEnabled: false,
      groupName: 'group name 1',
    };
    component.onEditRow(group);
    expect(router.navigateByUrl).toHaveBeenCalledWith(
      'manage-groups/view?data=' + JSON.stringify({ isEdit: true, groupId: 1 })
    );
  });
});
