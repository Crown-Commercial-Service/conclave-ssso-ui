import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ManageUserProfilesComponent } from './manage-user-profiles-component';
import { Store, StoreModule } from '@ngrx/store';
import { Router, ActivatedRoute } from '@angular/router';
import { of, BehaviorSubject } from 'rxjs';
import { ViewportScroller } from '@angular/common';
import { WrapperOrganisationService } from 'src/app/services/wrapper/wrapper-org-service';
import { AuditLoggerService } from 'src/app/services/postgres/logger.service';
import { DataLayerService } from 'src/app/shared/data-layer.service';
import { SessionService } from 'src/app/shared/session.service';
import { SharedDataService } from 'src/app/shared/shared-data.service';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { LoadingIndicatorService } from 'src/app/services/helper/loading-indicator.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CheckBoxUserListGridSource, UserListInfo } from "src/app/models/user";
import { SessionStorageKey } from 'src/app/constants/constant';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';

describe('ManageUserProfilesComponent', () => {
  let component: ManageUserProfilesComponent;
  let fixture: ComponentFixture<ManageUserProfilesComponent>;
  let wrapperOrganisationService: jasmine.SpyObj<WrapperOrganisationService>;
  let auditLoggerService: jasmine.SpyObj<AuditLoggerService>;
  let dataLayerService: jasmine.SpyObj<DataLayerService>;
  let router: jasmine.SpyObj<Router>;
  let sharedDataService: jasmine.SpyObj<SharedDataService>;
  let loadingIndicatorService: jasmine.SpyObj<LoadingIndicatorService>;
  let activatedRoute: ActivatedRoute;
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

//   const auditLoggerServiceSpy = {
//     getUsers: jasmine.createSpy('createLog').and.returnValue(
//       of({
        
//       })
//     ),
//   };

  beforeEach(waitForAsync(() => {
    //const wrapperOrganisationServiceSpy = jasmine.createSpyObj('WrapperOrganisationService', ['getUsers']);
    auditLoggerService = jasmine.createSpyObj('AuditLoggerService', ['createLog']);
    dataLayerService = jasmine.createSpyObj('DataLayerService', ['pushPageViewEvent', 'pushClickEvent']);
    router = jasmine.createSpyObj('Router', ['navigateByUrl', 'parseUrl']);
    sharedDataService = jasmine.createSpyObj('SharedDataService', ['storeUserDetails']);
    loadingIndicatorService = jasmine.createSpyObj('LoadingIndicatorService', ['isLoading', 'isCustomLoading']);
    
    activatedRoute = new ActivatedRoute();

    TestBed.configureTestingModule({
      declarations: [ManageUserProfilesComponent],
      imports: [StoreModule.forRoot({}),
        TranslateModule.forRoot(),        
      ],
      providers: [
        { provide: WrapperOrganisationService, useValue: mockWrapperOrganisationService },
        { provide: AuditLoggerService, useValue: auditLoggerService },
        { provide: DataLayerService, useValue: dataLayerService },
        { provide: Router, useValue: router},
        { provide: SharedDataService, useValue: sharedDataService },
        { provide: LoadingIndicatorService, useValue: loadingIndicatorService },
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: ViewportScroller },
        { provide: ScrollHelper },
        { provide: SessionService },
        { provide: Store }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
    
    

    // Mock local storage and session storage
    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
        if (key === 'cii_organisation_id') {
          return 'testOrgId';
        }
        return null;
    });

    spyOn(localStorage, 'removeItem');
    spyOn(sessionStorage, 'removeItem');
    spyOn(sessionStorage, 'setItem');
    spyOn(localStorage, 'setItem');

    loadingIndicatorService.isLoading = new BehaviorSubject<boolean>(false);
    loadingIndicatorService.isCustomLoading = new BehaviorSubject<boolean>(false);

    fixture = TestBed.createComponent(ManageUserProfilesComponent);
    component = fixture.componentInstance;

    
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize organisationId and userList correctly', () => {
    expect(component.organisationId).toBe('testOrgId');
    expect(component.userList.organisationId).toBe('testOrgId');
    expect(component.userList.userList).toEqual([]);
  });

//   it('should call pushPageViewEvent and createLog on ngOnInit', waitForAsync(() => {
//     auditLoggerService.createLog.and.returnValue(of({}));
//     component.ngOnInit();
//     expect(dataLayerService.pushPageViewEvent).toHaveBeenCalled();
//     expect(auditLoggerService.createLog).toHaveBeenCalledWith({
//       eventName: "Access",
//       applicationName: "Manage-user-account",
//       referenceData: `UI-Log`
//     });
//   }));

//   it('should call getOrganisationUsers and set loading states on ngOnInit', waitForAsync(() => {
//     auditLoggerService.createLog.and.returnValue(of({}));
//     const getOrganisationUsersSpy = spyOn(component, 'getOrganisationUsers').and.callThrough();
//     component.ngOnInit();
//     expect(loadingIndicatorService.isLoading.next).toHaveBeenCalledWith(true);
//     expect(loadingIndicatorService.isCustomLoading).toHaveBeenCalledWith(true);
//     expect(getOrganisationUsersSpy).toHaveBeenCalled();
//     expect(loadingIndicatorService.isLoading.next).toHaveBeenCalledWith(false);
//     expect(loadingIndicatorService.isCustomLoading.next).toHaveBeenCalledWith(false);
//   }));

  it('should navigate to the correct URL on onAddClick', () => {    
    component.isBulkUpload = false;
    component.onAddClick('Add');
    console.log(router);
   expect(router.navigateByUrl).toHaveBeenCalledWith('manage-users/add-user-selection');

    component.isBulkUpload = true;
    component.onAddClick('Add');
    expect(router.navigateByUrl).toHaveBeenCalledWith('manage-users/add-user/details');
    expect(dataLayerService.pushClickEvent).toHaveBeenCalledWith('Add');
  });

  it('should update searchingUserName on searchTextChanged', () => {
    const event = { target: { value: 'testUser' } };
    component.searchTextChanged(event);
    expect(component.searchingUserName).toBe('testUser');
  });

  it('should call getOrganisationUsers on onSearchClick', () => {
    const getOrganisationUsersSpy = spyOn(component, 'getOrganisationUsers').and.callThrough();
    component.onSearchClick();
    expect(component.searchSumbited).toBeTrue();
    expect(component.currentPage).toBe(1);
    expect(getOrganisationUsersSpy).toHaveBeenCalled();
  });

  it('should call getOrganisationUsers on setPage', () => {
    const getOrganisationUsersSpy = spyOn(component, 'getOrganisationUsers').and.callThrough();
    component.setPage(2);
    expect(component.currentPage).toBe(2);
    expect(getOrganisationUsersSpy).toHaveBeenCalled();
  });

  it('should navigate to the correct URL and store user details on onEditRow', () => {
    const dataRow = { userName: 'testUser', routeLink: '', routeData: {} } as UserListInfo;
    component.onEditRow(dataRow);
    expect(sharedDataService.storeUserDetails).toHaveBeenCalledWith(JSON.stringify({ 'rowData': dataRow.userName }));
    expect(localStorage.setItem).toHaveBeenCalledWith('ManageUserUserName', dataRow.userName);
    expect(sessionStorage.setItem).toHaveBeenCalledWith(SessionStorageKey.ManageUserUserName, dataRow.userName);
    expect(router.navigateByUrl).toHaveBeenCalledWith('manage-users/add-user/details?data=' + btoa(JSON.stringify({ 'isEdit': true, 'name': dataRow.userName })));
  });
});
