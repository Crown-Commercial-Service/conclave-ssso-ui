import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { ViewportScroller } from '@angular/common';
import { Store } from '@ngrx/store';
import { Title } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { ManageGroupEditUsersComponent } from './manage-group-edit-users-component';
import { WrapperOrganisationService } from 'src/app/services/wrapper/wrapper-org-service';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { SharedDataService } from 'src/app/shared/shared-data.service';
import { BehaviorSubject } from 'rxjs';
import { CheckBoxUserListGridSource, UserListInfo } from 'src/app/models/user';

describe('ManageGroupEditUsersComponent', () => {
  let component: ManageGroupEditUsersComponent;
  let fixture: ComponentFixture<ManageGroupEditUsersComponent>;
  let mockSharedDataService: {
    ManageGroup: BehaviorSubject<any>;
    manageGroupStorage: (p: string) => void;
  };

  const mockActivatedRoute = {
    snapshot: {
      queryParams: {
        data: JSON.stringify({
          isEdit: true,
          groupId: 123,
          groupType: 1,
        }),
      },
    },
  };

  const mockRouter = {
    navigateByUrl: jasmine.createSpy('navigateByUrl'),
  };

  const mockTitleService = {
    setTitle: jasmine.createSpy('setTitle'),
  };

  const mockUserList: CheckBoxUserListGridSource[] = [
    {
      name: 'user 1',
      userName: 'user1',
      isAdmin: false,
      isDisable: false,
      isDormant: false
    },
    {
      name: 'user 2',
      userName: 'user2',
      isAdmin: true,
      isDisable: false,
      isDormant: false
    },
  ];

  const mockWrapperOrganisationService = {
    getUsers: jasmine.createSpy('getUsers').and.returnValue(
      of({
        userList: mockUserList,
      })
    ),
  };

  beforeEach(async () => {
    const viewportScrollerSpy = jasmine.createSpyObj('ViewportScroller', [
      'setOffset',
    ]);
    const scrollHelperSpy = jasmine.createSpyObj('ScrollHelper', ['doScroll']);
    mockSharedDataService = {
      ManageGroup: new BehaviorSubject<any>(null),
      manageGroupStorage: (game: string) => {},
    };

    await TestBed.configureTestingModule({
      declarations: [ManageGroupEditUsersComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
        { provide: ViewportScroller, useValue: {} },
        { provide: Store, useValue: {} },
        { provide: Title, useValue: mockTitleService },
        {
          provide: WrapperOrganisationService,
          useValue: mockWrapperOrganisationService,
        },
        { provide: SharedDataService, useValue: mockSharedDataService },
        { provide: ViewportScroller, useValue: viewportScrollerSpy },
        { provide: ScrollHelper, useValue: scrollHelperSpy },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageGroupEditUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize properties correctly', () => {
    expect(component.isEdit).toBeTrue();
    expect(component.editingGroupId).toBe(123);
    expect(component.groupType).toBe(1);
  });

  it('should navigate to the correct URL on cancel click', () => {
    component.onCancelClick('Cancel');
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith(
      'manage-groups/view?data=' +
        JSON.stringify({ isEdit: true, groupId: 123 })
    );
  });

  it('should populate userGridSource with organization users on ngOnInit', () => {
    const wrapperOrganisationService = TestBed.inject(
      WrapperOrganisationService
    );

    component.ngOnInit();
    expect(wrapperOrganisationService.getUsers).toHaveBeenCalledWith(
      component.organisationId,
      component.searchingUserName,
      component.currentPage,
      component.pageSize,
      true
    );
    expect(component.userGridSource).toEqual(
      mockUserList.map((user) => ({ ...user, isChecked: false }))
    );
  });

  it('should add a user to addingUsers array when checkbox is clicked and isChecked is true', () => {
    const mockUser: CheckBoxUserListGridSource = {
      name: 'John Doe',
      userName: 'johndoe',
      isAdmin: false,
      isDisable: false,
      isDormant: false
    };
    component.onCheckBoxClickRow({ ...mockUser, isChecked: true });

    const { isDisable, ...removedUser } = mockUser;

    expect(component.addingUsers).toEqual([removedUser]);
  });

  it('should remove a user from addingUsers array when checkbox is clicked and isChecked is false', () => {
    const mockUser = {
      name: 'John Doe',
      userName: 'johndoe',
      isAdmin: false,
      isDisable: false,
      isDormant: false
    };
    component.addingUsers = [mockUser];
    component.onCheckBoxClickRow({ ...mockUser, isChecked: false });
    expect(component.addingUsers).toEqual([]);
  });

  it('should remove a user from removingUsers array when checkbox is clicked and isChecked is true', () => {
    const mockUser : CheckBoxUserListGridSource = {
      name: 'John Doe',
      userName: 'johndoe',
      isAdmin: false,
      isDormant: false,
      isDisable: false
    };
    component.removingUsers = [mockUser];
    component.onCheckBoxClickRow({ ...mockUser, isChecked: true });
    expect(component.removingUsers).toEqual([]);
  });

  it('should add a user to removingUsers array when checkbox is clicked and isChecked is false', () => {
    const mockUser: CheckBoxUserListGridSource = {
      name: 'Test user',
      userName: 'testuser',
      isAdmin: false,
      isDisable: false,
      isDormant: false
    };
    component.onCheckBoxClickRow({ ...mockUser, isChecked: false });

    const { isDisable, ...removedUser } = mockUser;

    expect(component.removingUsers).toEqual([removedUser]);
  });

  it('should navigate to the confirmation page on continue click', () => {
    component.onContinueClick('Continue');
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith(
      'manage-groups/edit-users-confirm?data=' +
        JSON.stringify({ isEdit: true, groupId: 123 })
    );
  });
});
