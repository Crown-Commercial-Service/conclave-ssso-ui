import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DelegatedUserConfirmComponent } from './delegated-user-confirm.component';
import { environment } from 'src/environments/environment';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';

describe('DelegatedUserConfirmComponent', () => {
  let component: DelegatedUserConfirmComponent;
  let fixture: ComponentFixture<DelegatedUserConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        TranslateModule.forRoot(),
      ],
      declarations: [DelegatedUserConfirmComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DelegatedUserConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the component correctly', () => {
    expect(component.userInfo).toEqual({});
    expect(component.UserSelectedinfo).toBeUndefined();
    expect(component.pageAccessMode).toEqual('');
    expect(component.hideSimplifyRole).toBeFalsy();
    expect(component.delegationRolesTable.currentPage).toEqual(1);
    expect(component.delegationRolesTable.pageCount).toEqual(0);
    expect(component.delegationRolesTable.pageSize).toEqual(
      environment.listPageSize
    );
    expect(component.delegationRolesTable.rolesTableHeaders).toEqual(['NAME']);
    expect(component.delegationRolesTable.rolesColumnsToDisplay).toEqual([
      'accessRoleName',
    ]);
    expect(component.delegationRolesTable.data).toEqual('');
    expect(component.delegationRolesTable.pageName).toEqual('Contactadmin');
  });

  it('should call the createDelegateUser method when pageAccessMode is "add" and onSubmit is called', () => {
    spyOn(component, 'createDelegateUser');
    component.pageAccessMode = 'add';
    component.onSubmit('Continue');
    expect(component.createDelegateUser).toHaveBeenCalled();
  });

  it('should call the updateDelegatedUser method when pageAccessMode is "edit" and onSubmit is called', () => {
    spyOn(component, 'updateDelegatedUser');
    component.pageAccessMode = 'edit';
    component.onSubmit('Continue');
    expect(component.updateDelegatedUser).toHaveBeenCalled();
  });

  it('should navigate to "home" when onClickNevigation is called with path "home"', () => {
    spyOn(component.route, 'navigateByUrl');
    component.onClickNevigation('home');
    expect(component.route.navigateByUrl).toHaveBeenCalledWith('home');
  });

  it('should navigate to "delegated-access" when onClickNevigation is called with path "delegated-access"', () => {
    spyOn(component.route, 'navigateByUrl');
    component.onClickNevigation('delegated-access');
    expect(component.route.navigateByUrl).toHaveBeenCalledWith(
      'delegated-access'
    );
  });

  it('should navigate back in history when Cancel is called', () => {
    spyOn(window.history, 'back');
    component.Cancel('Cancel');
    expect(window.history.back).toHaveBeenCalled();
  });

  it('should display the correct breadcrumbs', () => {
    const breadcrumbs = fixture.nativeElement.querySelectorAll(
      '.govuk-breadcrumbs__link'
    );
    expect(breadcrumbs[0].textContent).toContain('ADMINISTRATOR_DASHBOARD');
    expect(breadcrumbs[1].textContent).toContain('Delegated access');
    expect(breadcrumbs[2].textContent).toContain('Confirm delegation');
  });
});
