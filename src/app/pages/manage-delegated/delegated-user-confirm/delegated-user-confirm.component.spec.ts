import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DelegatedUserConfirmComponent } from './delegated-user-confirm.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { WrapperUserDelegatedService } from 'src/app/services/wrapper/wrapper-user-delegated.service';
import { of, throwError } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

describe('DelegatedUserConfirmComponent', () => {
  let component: DelegatedUserConfirmComponent;
  let fixture: ComponentFixture<DelegatedUserConfirmComponent>;
  let mockRouter: any;
  let mockTitleService: any;
  let mockDelegatedService: any;

  beforeEach(async () => {
    const activatedRouteStub = () => ({
      queryParams: {
        subscribe: (f: any) => f(atob(JSON.stringify({ userDetails: {} }))),
      },
    });

    mockRouter = jasmine.createSpyObj(['navigateByUrl']);

    mockTitleService = jasmine.createSpyObj(['setTitle']);

    mockDelegatedService = jasmine.createSpyObj([
      'createDelegatedUser',
      'updateDelegatedUser',
    ]);

    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [DelegatedUserConfirmComponent],
      providers: [
        { provide: ActivatedRoute, useFactory: activatedRouteStub },
        { provide: Router, useValue: mockRouter },
        { provide: Title, useValue: mockTitleService },
        {
          provide: WrapperUserDelegatedService,
          useValue: mockDelegatedService,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DelegatedUserConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set the page title', () => {
      component.pageAccessMode = 'edit';
      component.ngOnInit();
      expect(mockTitleService.setTitle).toHaveBeenCalledWith(
        'Confirm Delegation - CCS'
      );
    });

    it('should call getSelectedRole method', () => {
      spyOn(component, 'getSelectedRole');
      component.ngOnInit();
      expect(component.getSelectedRole).toHaveBeenCalled();
    });
  });

  describe('onSubmit', () => {
    it('should call updateDelegatedUser method if pageAccessMode is "edit"', () => {
      component.pageAccessMode = 'edit';
      spyOn(component, 'updateDelegatedUser');
      component.onSubmit();
      expect(component.updateDelegatedUser).toHaveBeenCalled();
    });

    it('should call createDelegateUser method if pageAccessMode is not "edit"', () => {
      component.pageAccessMode = 'add';
      spyOn(component, 'createDelegateUser');
      component.onSubmit();
      expect(component.createDelegateUser).toHaveBeenCalled();
    });
  });

  describe('exchangeGroupAndRole', () => {
    it('should exchange group and role ids if hideSimplifyRole is false', () => {
      component.hideSimplifyRole = false;
      component.UserSelectedinfo = { detail: { roleIds: [1, 2, 3] } };
      component.exchangeGroupAndRole();
      expect(component.UserSelectedinfo.detail.serviceRoleGroupIds).toEqual([
        1, 2, 3,
      ]);
      expect(component.UserSelectedinfo.detail.roleIds).toBeUndefined();
    });
  });

  describe('onClickNevigation', () => {
    it('should navigate to the specified path', () => {
      spyOn(component.route, 'navigateByUrl');
      component.onClickNevigation('home');
      expect(component.route.navigateByUrl).toHaveBeenCalledWith('home');
    });
  });

  describe('Cancel', () => {
    it('should navigate back in history', () => {
      spyOn(window.history, 'back');
      component.Cancel();
      expect(window.history.back).toHaveBeenCalled();
    });
  });
});
