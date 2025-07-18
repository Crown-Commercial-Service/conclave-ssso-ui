import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ViewportScroller } from '@angular/common';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { ManageOrgRegNotRegisteredComponent } from './manage-reg-organisation-not-registered.component';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideRouter } from '@angular/router';

// This is needed to determine whether the API dependant tests need to run or not.
const isCI = (window as any).__karma__?.config?.env?.CI === 'true';

describe('ManageOrgRegNotRegisteredComponent', () => {
  let component: ManageOrgRegNotRegisteredComponent;
  let fixture: ComponentFixture<ManageOrgRegNotRegisteredComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageOrgRegNotRegisteredComponent],
      imports: [
        ReactiveFormsModule,
        TranslateModule.forRoot(),
        FormsModule,
      ],
      providers: [
        provideRouter([]),
        { provide: Store, useFactory: () => ({}) },
        ViewportScroller,
        ScrollHelper,
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageOrgRegNotRegisteredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to manage-org/register/newreg when onContinueNotRegistered is called', () => {
    const routerSpy = spyOn(component.router, 'navigateByUrl');
    component.onContinueNotRegistered();
    expect(routerSpy).toHaveBeenCalledWith('manage-org/register/newreg');
  });

  (isCI ? xit : it)('should navigate to manage-org/register/type when onContinueClick is called with adminSelectionMode=useradmin', () => {
    const routerSpy = spyOn(component.router, 'navigateByUrl');
    component.adminSelectionMode = 'useradmin';
    component.onContinueClick('Continue');
    expect(routerSpy).toHaveBeenCalledWith('manage-reg-organisation-mfa');
  });

  it('should navigate to /nominate?data=xxxx when onContinueClick is called with adminSelectionMode=nominateadmin', () => {
    const routerSpy = spyOn(component.router, 'navigateByUrl');
    component.adminSelectionMode = 'nominateadmin';
    component.onContinueClick('Continue');
    expect(routerSpy).toHaveBeenCalledWith(
      '/nominate?data=' + btoa(JSON.stringify(1))
    );
  });

  it('should navigate to manage-org/register/find-your-administrator when onContinueClick is called with adminSelectionMode=unkownadmin', () => {
    const routerSpy = spyOn(component.router, 'navigateByUrl');
    component.adminSelectionMode = 'unkownadmin';
    component.onContinueClick('Continue');
    expect(routerSpy).toHaveBeenCalledWith(
      'manage-org/register/find-your-administrator'
    );
  });

  it('should navigate back in history when goBack is called', () => {
    const historySpy = spyOn(window.history, 'back');
    component.goBack();
    expect(historySpy).toHaveBeenCalled();
  });
});
