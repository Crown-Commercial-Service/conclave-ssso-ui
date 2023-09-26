import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { DelegatedUserListComponent } from './delegated-user-list.component';
import { WrapperUserDelegatedService } from 'src/app/services/wrapper/wrapper-user-delegated.service';
import { UserListResponse } from 'src/app/models/user';

describe('DelegatedUserListComponent', () => {
  let component: DelegatedUserListComponent;
  let fixture: ComponentFixture<DelegatedUserListComponent>;
  let debugElement: DebugElement;
  let htmlElement: HTMLElement;
  let wrapperUserDelegatedService: WrapperUserDelegatedService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DelegatedUserListComponent],
      imports: [RouterTestingModule, FormsModule, TranslateModule.forRoot()],
      providers: [WrapperUserDelegatedService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DelegatedUserListComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    htmlElement = debugElement.nativeElement;
    wrapperUserDelegatedService = TestBed.inject(WrapperUserDelegatedService);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct table headers for current users', () => {
    component.currentUserstableConfig = {
      usersTableHeaders: [
        'NAME',
        'EMAIL',
        'Start date',
        'End date',
        'Organisation',
      ],
      usersColumnsToDisplay: [
        'name',
        'userName',
        'startDate',
        'endDate',
        'originOrganisation',
      ],
      userList: '',
      pageName: 'Delegatedaccess',
      hyperTextrray: ['Remove', 'Edit'],
    };
    fixture.detectChanges();
    const tableHeaders = htmlElement.querySelectorAll('.govuk-table__header');
    expect(tableHeaders.length).toBe(5);
    expect(tableHeaders[0].textContent).toContain('NAME');
    expect(tableHeaders[1].textContent).toContain('EMAIL');
    expect(tableHeaders[2].textContent).toContain('Start date');
    expect(tableHeaders[3].textContent).toContain('End date');
    expect(tableHeaders[4].textContent).toContain('Organisation');
  });

  it('should display the correct table headers for expired users', () => {
    component.expiredUserstableConfig = {
      usersTableHeaders: ['NAME', 'EMAIL', 'Expiry date', 'Organisation'],
      usersColumnsToDisplay: [
        'name',
        'userName',
        'endDate',
        'originOrganisation',
      ],
      userList: '',
      pageName: 'Delegatedaccess',
      hyperTextrray: ['View'],
    };
    fixture.detectChanges();
    const tableHeaders = htmlElement.querySelectorAll('.govuk-table__header');
    expect(tableHeaders.length).toBe(4);
    expect(tableHeaders[0].textContent).toContain('NAME');
    expect(tableHeaders[1].textContent).toContain('EMAIL');
    expect(tableHeaders[2].textContent).toContain('Expiry date');
    expect(tableHeaders[3].textContent).toContain('Organisation');
  });

  it('should call WrapperUserDelegatedService.GetCurrentUsers on component initialization', () => {
    spyOn(wrapperUserDelegatedService, 'GetCurrentUsers').and.returnValue(
      of({})
    );
    component.ngOnInit();
    expect(wrapperUserDelegatedService.GetCurrentUsers).toHaveBeenCalled();
  });

  it('should call WrapperUserDelegatedService.GetExpiredUsers when search button is clicked', () => {
    spyOn(wrapperUserDelegatedService, 'GetExpiredUsers').and.returnValue(
      of({})
    );
    const searchButton = htmlElement.querySelector('button');
    searchButton?.click();
    expect(wrapperUserDelegatedService.GetExpiredUsers).toHaveBeenCalled();
  });
});
