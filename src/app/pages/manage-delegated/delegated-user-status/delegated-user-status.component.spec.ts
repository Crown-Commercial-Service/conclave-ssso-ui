import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { DelegatedUserStatusComponent } from './delegated-user-status.component';

describe('DelegatedUserStatusComponent', () => {
  let component: DelegatedUserStatusComponent;
  let fixture: ComponentFixture<DelegatedUserStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, TranslateModule.forRoot()],
      declarations: [DelegatedUserStatusComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DelegatedUserStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct breadcrumb links', () => {
    const breadcrumbLinks = fixture.debugElement.queryAll(
      By.css('.govuk-breadcrumbs__link')
    );
    expect(breadcrumbLinks.length).toBe(4);

    expect(breadcrumbLinks[0].nativeElement.getAttribute('routerLink')).toBe(
      '/home'
    );
    expect(breadcrumbLinks[0].nativeElement.textContent.trim()).toBe(
      'ADMINISTRATOR_DASHBOARD'
    );

    expect(breadcrumbLinks[1].nativeElement.getAttribute('routerLink')).toBe(
      '/delegated-access'
    );
    expect(breadcrumbLinks[1].nativeElement.textContent.trim()).toBe(
      'Delegated access'
    );

    expect(breadcrumbLinks[2].nativeElement.getAttribute('routerLink')).toBe(
      '/find-delegated-user'
    );
    expect(breadcrumbLinks[2].nativeElement.textContent.trim()).toBe(
      'Find a user'
    );

    expect(breadcrumbLinks[3].nativeElement.textContent.trim()).toBe(
      component.UserStatus.Breadcrumb
    );
  });

  it('should display the correct header and description', () => {
    const header = fixture.debugElement.query(
      By.css('.page-title')
    ).nativeElement;
    const description = fixture.debugElement.query(
      By.css('.govuk-body-l')
    ).nativeElement;

    expect(header.textContent.trim()).toBe(component.UserStatus.header);
    expect(description.textContent.trim()).toBe(
      component.UserStatus.Description
    );
  });

  it('should display user information when status is 003', () => {
    component.UserStatus.status = '003';
    component.UserStatus.event = {
      name: 'John Doe',
      userName: 'johndoe@example.com',
      originOrganisation: 'Example Organization',
    };
    fixture.detectChanges();

    const name = fixture.debugElement.query(
      By.css('.govuk-body')
    ).nativeElement;
    const email = fixture.debugElement.queryAll(By.css('.govuk-body'))[1]
      .nativeElement;
    const org = fixture.debugElement.queryAll(By.css('.govuk-body'))[2]
      .nativeElement;

    expect(name.textContent.trim()).toBe('Name: John Doe');
    expect(email.textContent.trim()).toBe('Email address: johndoe@example.com');
    expect(org.textContent.trim()).toBe(
      "User's Organisation: Example Organization"
    );
  });

  it('should disable date inputs when status is 003', () => {
    component.UserStatus.status = '003';
    fixture.detectChanges();

    const startDayInput = fixture.debugElement.query(
      By.css('#start-day')
    ).nativeElement;
    const startMonthInput = fixture.debugElement.query(
      By.css('#start-month')
    ).nativeElement;
    const startYearInput = fixture.debugElement.query(
      By.css('#start-year')
    ).nativeElement;

    const endDayInput = fixture.debugElement.query(
      By.css('#end-day')
    ).nativeElement;
    const endMonthInput = fixture.debugElement.query(
      By.css('#end-month')
    ).nativeElement;
    const endYearInput = fixture.debugElement.query(
      By.css('#end-year')
    ).nativeElement;

    expect(startDayInput.getAttribute('disabled')).toBeTruthy();
    expect(startMonthInput.getAttribute('disabled')).toBeTruthy();
    expect(startYearInput.getAttribute('disabled')).toBeTruthy();

    expect(endDayInput.getAttribute('disabled')).toBeTruthy();
    expect(endMonthInput.getAttribute('disabled')).toBeTruthy();
    expect(endYearInput.getAttribute('disabled')).toBeTruthy();
  });

  it('should display the correct permissions checkboxes', () => {
    const checkboxes = fixture.debugElement.queryAll(
      By.css('.govuk-checkboxes__input')
    );

    expect(checkboxes.length).toBe(component.roleDataList.length);

    for (let i = 0; i < checkboxes.length; i++) {
      const checkbox = checkboxes[i].nativeElement;
      const label = fixture.debugElement.queryAll(
        By.css('.govuk-checkboxes__label')
      )[i].nativeElement;

      expect(checkbox.getAttribute('id')).toBe(
        `orgRoleControl_${component.roleDataList[i].roleId}`
      );
      expect(label.textContent.trim()).toBe(
        component.roleDataList[i].accessRoleName
      );
    }
  });

  it('should navigate back when Back button is clicked', () => {
    const backButton = fixture.debugElement.query(
      By.css('.govuk-button--secondary')
    );
    spyOn(component, 'Back');

    backButton.triggerEventHandler('click', null);
    expect(component.Back).toHaveBeenCalled();
  });
});
