import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ViewportScroller } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ManageGroupOperationSuccessComponent } from './manage-group-operation-success-component';
import { BaseComponent } from 'src/app/components/base/base.component';
import { SharedDataService } from 'src/app/shared/shared-data.service';
import { WrapperOrganisationGroupService } from 'src/app/services/wrapper/wrapper-org--group-service';
import { OperationEnum } from 'src/app/constants/enum';

describe('ManageGroupOperationSuccessComponent', () => {
  let component: ManageGroupOperationSuccessComponent;
  let fixture: ComponentFixture<ManageGroupOperationSuccessComponent>;
  let router: Router;
  let activatedRoute: ActivatedRoute;
  let titleService: Title;
  let sharedDataService: SharedDataService;
  let wrapperOrganisationGroupService: WrapperOrganisationGroupService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageGroupOperationSuccessComponent],
      imports: [
        RouterTestingModule,
        StoreModule.forRoot({}),
        TranslateModule.forRoot(),
        HttpClientTestingModule,
      ],
      providers: [
        Title,
        SharedDataService,
        WrapperOrganisationGroupService,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '1',
              },
              queryParams: {},
            },
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageGroupOperationSuccessComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    activatedRoute = TestBed.inject(ActivatedRoute);
    titleService = TestBed.inject(Title);
    sharedDataService = TestBed.inject(SharedDataService);
    wrapperOrganisationGroupService = TestBed.inject(
      WrapperOrganisationGroupService
    );
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set the page title based on the operation', () => {
    spyOn(titleService, 'setTitle');
    component.operation = OperationEnum.GroupAdd;
    component.ngOnInit();
    fixture.detectChanges();

    expect(titleService.setTitle).toHaveBeenCalledWith(
      'Success - Create - Manage Groups - CCS'
    );
  });

  it('should navigate to the group view page when onNavigateToGroupClick is called', () => {
    spyOn(router, 'navigateByUrl');
    component.groupId = '123';
    component.onNavigateToGroupClick();

    expect(router.navigateByUrl).toHaveBeenCalledWith(
      'manage-groups/view?data={"isEdit":true,"groupId":"123"}'
    );
  });

  it('should navigate to the home page when onNavigateTohome is called', () => {
    spyOn(router, 'navigateByUrl');
    component.onNavigateTohome();

    expect(router.navigateByUrl).toHaveBeenCalledWith('/home');
  });

  it('should navigate to the manage groups page when onNavigateTomanageGroup is called', () => {
    spyOn(router, 'navigateByUrl');
    component.onNavigateTomanageGroup();

    expect(router.navigateByUrl).toHaveBeenCalledWith('/manage-groups');
  });

  it('should set the current page for pendingVerificationUser and call getListOfUsersGivenAccess when setPagePendingUsers is called', () => {
    spyOn(component, 'getListOfUsersGivenAccess');
    component.pendingVerificationUser = {
      currentPage: 1,
      pageCount: 5,
      rowCount: 10,
      groupUser: [],
    };
    component.setPagePendingUsers(2);

    expect(component.pendingVerificationUser.currentPage).toBe(2);
  });

  it('should set the current page for verifiedUser and call getListOfUserRequiredAccess when setPageApprovedUsers is called', () => {
    spyOn(component, 'getListOfUserRequiredAccess');
    component.verifiedUser = {
      currentPage: 1,
      pageCount: 5,
      rowCount: 10,
      groupUser: [],
    };
    component.setPageApprovedUsers(2);

    expect(component.verifiedUser.currentPage).toBe(2);
  });

  it('should get the list of users required access when getUserList is called for group operation', () => {
    spyOn(component, 'getListOfUserRequiredAccess');
    spyOn(component, 'isGroupOperation').and.returnValue(true);
    component.getUserList();

    expect(component.getListOfUserRequiredAccess).toHaveBeenCalled();
  });

  it('should not get the list of users required access when getUserList is called for non-group operation', () => {
    spyOn(component, 'getListOfUserRequiredAccess');
    spyOn(component, 'isGroupOperation').and.returnValue(false);
    component.getUserList();

    expect(component.getListOfUserRequiredAccess).not.toHaveBeenCalled();
  });

  it('should toggle the accordion status when toggleAccordion is called', () => {
    component.accordinData = {
      showAccordin1: false,
      showAccordin2: false,
    };

    component.toggleAccordion('accordin1');
    expect(component.accordinData.showAccordin1).toBe(true);

    component.toggleAccordion('accordin1');
    expect(component.accordinData.showAccordin1).toBe(false);

    component.toggleAccordion('accordin2');
    expect(component.accordinData.showAccordin2).toBe(true);

    component.toggleAccordion('accordin2');
    expect(component.accordinData.showAccordin2).toBe(false);
  });
});
