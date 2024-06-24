import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManageUserConfirmResetPasswordComponent } from './manage-user-confirm-reset-password-component';
import { Store, StoreModule } from '@ngrx/store';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ViewportScroller } from '@angular/common';
import { DataLayerService } from 'src/app/shared/data-layer.service';
import { SessionService } from 'src/app/shared/session.service';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { WrapperUserService } from 'src/app/services/wrapper/wrapper-user.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SessionStorageKey } from 'src/app/constants/constant';
import { OperationEnum } from 'src/app/constants/enum';
import { TranslateModule } from '@ngx-translate/core';

describe('ManageUserConfirmResetPasswordComponent', () => {
  let component: ManageUserConfirmResetPasswordComponent;
  let fixture: ComponentFixture<ManageUserConfirmResetPasswordComponent>;
  let router: Router;
  let userService: jasmine.SpyObj<WrapperUserService>;
  let dataLayerService: jasmine.SpyObj<DataLayerService>;

  beforeEach(async () => {
    const userServiceSpy = jasmine.createSpyObj('WrapperUserService', ['resetUserPassword']);
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
      declarations: [ManageUserConfirmResetPasswordComponent],
      imports: [StoreModule.forRoot({}),
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: WrapperUserService, useValue: userServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: DataLayerService, useValue: dataLayerServiceSpy },
        { provide: SessionService },
        { provide: ScrollHelper },
        { provide: ViewportScroller},
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        Store
      ],    
    }).compileComponents();

    fixture = TestBed.createComponent(ManageUserConfirmResetPasswordComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    userService = TestBed.inject(WrapperUserService) as jasmine.SpyObj<WrapperUserService>;
    dataLayerService = TestBed.inject(DataLayerService) as jasmine.SpyObj<DataLayerService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call pushPageViewEvent on ngOnInit', () => {
    component.ngOnInit();
    expect(dataLayerService.pushPageViewEvent).toHaveBeenCalled();
  });

  it('should call resetUserPassword and navigate on onConfirmClick', () => {
    userService.resetUserPassword.and.returnValue(of(null));
    const buttonText = 'Confirm';

    component.onConfirmClick(buttonText);

    expect(userService.resetUserPassword).toHaveBeenCalledWith(component.userName, 'Manage-user-account');
    expect(router.navigateByUrl).toHaveBeenCalledWith(`operation-success/${OperationEnum.UserPasswordChange}`);
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
