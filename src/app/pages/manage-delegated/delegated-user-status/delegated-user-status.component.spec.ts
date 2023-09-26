import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { DelegatedUserStatusComponent } from './delegated-user-status.component';
import { ManageDelegateService } from '../service/manage-delegate.service';
import { WrapperUserDelegatedService } from 'src/app/services/wrapper/wrapper-user-delegated.service';
import { WrapperOrganisationGroupService } from 'src/app/services/wrapper/wrapper-org--group-service';
import { environment } from '../../../../environments/environment';

describe('DelegatedUserStatusComponent', () => {
  let component: DelegatedUserStatusComponent;
  let fixture: ComponentFixture<DelegatedUserStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        TranslateModule.forRoot(),
      ],
      declarations: [DelegatedUserStatusComponent],
      providers: [
        ManageDelegateService,
        WrapperUserDelegatedService,
        WrapperOrganisationGroupService,
      ],
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

  it('should initialize formGroup', () => {
    expect(component.formGroup).toBeDefined();
  });

  it('should initialize roleDataList', () => {
    expect(component.roleDataList).toEqual([]);
  });

  it('should initialize assignedRoleDataList', () => {
    expect(component.assignedRoleDataList).toEqual([]);
  });

  it('should initialize UserStatus', () => {
    expect(component.UserStatus).toEqual({
      header: '',
      Description: '',
      Breadcrumb: '',
      status: '',
    });
  });

  it('should initialize eventLog', () => {
    expect(component.eventLog).toEqual({
      usersTableHeaders: ['Owner', 'Event', 'Date'],
      usersColumnsToDisplay: ['owner', 'event', 'date'],
      currentPage: 1,
      pageCount: 0,
      pageName: 'eventLog',
      pageSize: environment.listPageSize,
      delegationAuditEventDetails: {
        currentPage: 0,
        pageCount: 0,
        rowCount: 0,
        organisationId: '',
        delegationAuditEventServiceRoleGroupList: [],
      },
    });
  });

  it('should set hideSimplifyRole based on environment setting', () => {
    expect(component.hideSimplifyRole).toBe(
      environment.appSetting.hideSimplifyRole
    );
  });
});
