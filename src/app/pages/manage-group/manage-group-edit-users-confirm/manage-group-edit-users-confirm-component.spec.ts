import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ViewportScroller } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { ManageGroupEditUsersConfirmComponent } from './manage-group-edit-users-confirm-component';
import { WrapperOrganisationGroupService } from 'src/app/services/wrapper/wrapper-org--group-service';
import { of } from 'rxjs';
import { OperationEnum } from 'src/app/constants/enum';

describe('ManageGroupEditUsersConfirmComponent', () => {
  let component: ManageGroupEditUsersConfirmComponent;
  let fixture: ComponentFixture<ManageGroupEditUsersConfirmComponent>;
  let router: Router;
  let activatedRoute: ActivatedRoute;
  let titleService: Title;
  let orgGroupService: WrapperOrganisationGroupService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        StoreModule.forRoot({}),
        TranslateModule.forRoot(),
      ],
      declarations: [ManageGroupEditUsersConfirmComponent],
      providers: [
        ViewportScroller,
        WrapperOrganisationGroupService,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParams: {
                data: JSON.stringify({
                  isEdit: true,
                  groupId: 1,
                  groupName: 'Test Group',
                }),
              },
            },
          },
        },
        {
          provide: Title,
          useValue: {
            setTitle: jasmine.createSpy('setTitle'),
          },
        },
        {
          provide: WrapperOrganisationGroupService,
          useValue: {
            patchUpdateOrganisationGroup: jasmine
              .createSpy('patchUpdateOrganisationGroup')
              .and.returnValue(of({})),
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageGroupEditUsersConfirmComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    activatedRoute = TestBed.inject(ActivatedRoute);
    titleService = TestBed.inject(Title);
    orgGroupService = TestBed.inject(WrapperOrganisationGroupService);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set the page title on initialization', () => {
    expect(titleService.setTitle).toHaveBeenCalledWith(
      'Confirm - Add/Remove Users - Manage Groups - CCS'
    );
  });

  it('should navigate to edit group page on "Go to Edit Group" button click', () => {
    spyOn(component, 'onGoToEditGroupClick');
    const goToEditGroupButton = fixture.nativeElement.querySelector(
      '.govuk-breadcrumbs__link.edit-group'
    );
    goToEditGroupButton.click();
    expect(component.onGoToEditGroupClick).toHaveBeenCalled();
  });

  it('should clear session storage on "Confirm" button click and navigate to success page for edit', () => {
    spyOn(component, 'clearSessionStorageGroupUserData');
    spyOn(router, 'navigateByUrl');
    const confirmButton = fixture.nativeElement.querySelector(
      '.govuk-button--primary'
    );
    confirmButton.click();
    expect(orgGroupService.patchUpdateOrganisationGroup).toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalledWith(
      `manage-groups/operation-success/${OperationEnum.GroupUserUpdate}?data={"isEdit":true,"groupId":1}`
    );
    expect(component.clearSessionStorageGroupUserData).toHaveBeenCalled();
  });

  it('should clear session storage on "Confirm" button click and navigate to edit roles page for add users', () => {
    spyOn(component, 'clearSessionStorageGroupUserData');
    spyOn(router, 'navigateByUrl');
    component.isEdit = false;
    fixture.detectChanges();
    const confirmButton = fixture.nativeElement.querySelector(
      '.govuk-button--primary'
    );
    confirmButton.click();
    expect(orgGroupService.patchUpdateOrganisationGroup).toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalledWith(
      'manage-groups/edit-roles?data={"isEdit":false,"groupId":1,"roleIds":[],"userCount":0,"groupName":"Test Group"}'
    );
    expect(component.clearSessionStorageGroupUserData).toHaveBeenCalled();
  });

  it('should navigate to edit users page on "Select Different User" button click', () => {
    spyOn(router, 'navigateByUrl');
    const selectDifferentUserButton = fixture.nativeElement.querySelector(
      '.govuk-button--secondary'
    );
    selectDifferentUserButton.click();
    expect(router.navigateByUrl).toHaveBeenCalledWith(
      'manage-groups/edit-users?data={"isEdit":true,"groupId":1,"groupName":"Test Group"}'
    );
  });
});
