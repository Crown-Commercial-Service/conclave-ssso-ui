import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ManageGroupEditRolesConfirmComponent } from './manage-group-edit-roles-confirm-component';
import { Store } from '@ngrx/store';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ManageGroupEditRolesConfirmComponent', () => {
  let component: ManageGroupEditRolesConfirmComponent;
  let fixture: ComponentFixture<ManageGroupEditRolesConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageGroupEditRolesConfirmComponent],
      imports: [
        TranslateModule.forRoot(),
        RouterTestingModule,
        HttpClientTestingModule,
      ],
      providers: [{ provide: Store, useFactory: () => ({}) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageGroupEditRolesConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display correct breadcrumbs', () => {
    component.isEdit = true;
    component.groupName = 'Test Group';

    fixture.detectChanges();

    const breadcrumbs = fixture.nativeElement.querySelectorAll(
      '.govuk-breadcrumbs__link'
    );

    expect(breadcrumbs.length).toBe(4);
    expect(breadcrumbs[0].textContent).toContain('ADMINISTRATOR_DASHBOARD');
    expect(breadcrumbs[1].textContent).toContain('MANAGE_GROUPS');
    expect(breadcrumbs[2].textContent).toContain('EDIT_GROUP');
    expect(breadcrumbs[3].textContent).toContain(
      'Confirm services for group Test Group'
    );
  });

  it('should display correct page title', () => {
    component.isEdit = true;
    component.groupName = 'Test Group';

    fixture.detectChanges();

    const pageTitle = fixture.nativeElement.querySelector('.page-title');

    expect(pageTitle.textContent).toContain(
      'Confirm you want to add the following services to group Test Group'
    );
  });

  it('should display roles added to group', () => {
    component.addingRoles = [
      { roleId: 1, roleKey: 'role1', roleName: 'Role 1' },
      { roleId: 2, roleKey: 'role2', roleName: 'Role 2' },
    ];

    fixture.detectChanges();

    const rolesAddedSection =
      fixture.nativeElement.querySelector('.govuk-heading-s');

    expect(rolesAddedSection.textContent).toContain('Services added to group');
  });
});
