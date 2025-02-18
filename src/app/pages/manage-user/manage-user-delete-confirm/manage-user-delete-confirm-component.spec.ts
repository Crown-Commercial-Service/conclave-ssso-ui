import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManageUserDeleteConfirmComponent } from './manage-user-delete-confirm-component';
import { Store, StoreModule } from '@ngrx/store';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ViewportScroller } from '@angular/common';
import { DataLayerService } from 'src/app/shared/data-layer.service';
import { SessionService } from 'src/app/shared/session.service';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { WrapperUserService } from 'src/app/services/wrapper/wrapper-user.service';
import { SessionStorageKey } from 'src/app/constants/constant';
import { OperationEnum } from 'src/app/constants/enum';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ManageUserDeleteConfirmComponent', () => {
  let component: ManageUserDeleteConfirmComponent;
  let fixture: ComponentFixture<ManageUserDeleteConfirmComponent>;
  let router: Router;
  let wrapperUserService: jasmine.SpyObj<WrapperUserService>;
  let dataLayerService: jasmine.SpyObj<DataLayerService>;

  beforeEach(async () => {
    const wrapperUserServiceSpy = jasmine.createSpyObj('WrapperUserService', ['deleteUser']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
    const dataLayerServiceSpy = jasmine.createSpyObj('DataLayerService', ['pushPageViewEvent', 'pushClickEvent']);
    
    const activatedRouteStub = {
      snapshot: {
        paramMap: {
          get: (key: string) => 'testValue'
        }
      }
    };

    await TestBed.configureTestingModule({
      declarations: [ManageUserDeleteConfirmComponent],
      imports: [StoreModule.forRoot({}),
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: WrapperUserService, useValue: wrapperUserServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: DataLayerService, useValue: dataLayerServiceSpy },
        { provide: SessionService },
        { provide: ScrollHelper },
        { provide: ViewportScroller },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        Store
      ],    
      schemas: [NO_ERRORS_SCHEMA]  
    }).compileComponents();

    // Mock session storage and local storage
    spyOn(sessionStorage, 'getItem').and.callFake((key: string) => {
        if (key === SessionStorageKey.ManageUserUserName) {
          return 'testUser';
        }
        return null;
      });
      spyOn(localStorage, 'getItem').and.callFake((key: string) => {
        if (key === 'ManageUserUserName') {
          return 'testUser';
        }
        return null;
      });
      spyOn(sessionStorage, 'setItem');
      spyOn(localStorage, 'setItem');

    fixture = TestBed.createComponent(ManageUserDeleteConfirmComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    wrapperUserService = TestBed.inject(WrapperUserService) as jasmine.SpyObj<WrapperUserService>;
    dataLayerService = TestBed.inject(DataLayerService) as jasmine.SpyObj<DataLayerService>;    
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize userName from sessionStorage and localStorage', () => {
    expect(component.userName).toBe('testUser');
  });

  it('should call pushPageViewEvent on ngOnInit', () => {
    component.ngOnInit();
    expect(dataLayerService.pushPageViewEvent).toHaveBeenCalled();
  });

  it('should call deleteUser and navigate on onDeleteConfirmClick', () => {
    wrapperUserService.deleteUser.and.returnValue(of(null));
    const buttonText = 'Confirm';

    component.onDeleteConfirmClick(buttonText);

    expect(wrapperUserService.deleteUser).toHaveBeenCalledWith(component.userName);
    expect(sessionStorage.setItem).toHaveBeenCalledWith(SessionStorageKey.OperationSuccessUserName, component.userName);
    expect(localStorage.setItem).toHaveBeenCalledWith('OperationSuccessUserName', component.userName);
    expect(router.navigateByUrl).toHaveBeenCalledWith(`operation-success/${OperationEnum.UserDelete}`);
    expect(dataLayerService.pushClickEvent).toHaveBeenCalledWith(buttonText);
  });

  it('should navigate back and push click event on onCancelClick', () => {
    spyOn(window.history, 'back');
    const buttonText = 'Cancel';

    component.onCancelClick(buttonText);

    expect(window.history.back).toHaveBeenCalled();
    expect(dataLayerService.pushClickEvent).toHaveBeenCalledWith(buttonText);
  });
});
