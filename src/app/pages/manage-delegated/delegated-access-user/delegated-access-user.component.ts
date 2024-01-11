import { ViewportScroller } from '@angular/common';
import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Role, ServiceRoleGroup } from 'src/app/models/organisationGroup';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { WrapperOrganisationGroupService } from 'src/app/services/wrapper/wrapper-org--group-service';
import { WrapperUserDelegatedService } from 'src/app/services/wrapper/wrapper-user-delegated.service';
import { environment } from 'src/environments/environment';
import { ManageDelegateService } from '../service/manage-delegate.service';
import { DataLayerService } from 'src/app/shared/data-layer.service';

@Component({
  selector: 'app-delegated-access-user',
  templateUrl: './delegated-access-user.component.html',
  styleUrls: ['./delegated-access-user.component.scss'],
})
export class DelegatedAccessUserComponent implements OnInit {
  public formGroup: FormGroup | any;
  public errors = true;
  public submitted: boolean = false;
  public userDetails: any = {}
  public roleDataList: any[] = [];
  public pageAccessMode: string = '';
  public assignedRoleDataList: any[] = [];
  public delegationAccepted: boolean = false;
  private organisationId: string;
  private RoleInfo: any = []
  private userSelectedFormData: any;
  public hideSimplifyRole = environment.appSetting.hideSimplifyRole;
  private userId:number= 0
  public eventLogForActiveUser: any = {
    delegationAuditEventDetails: {
      currentPage: 0,
      pageCount: 0,
      rowCount: 0,
      organisationId: '',
      delegationAuditEventServiceRoleGroupList: [],
    },
    usersTableHeaders: ['Owner', 'Event', 'Date'],
    usersColumnsToDisplay: ['owner', 'event', 'date'],
    currentPage: 1,
    pageCount: 0,
    pageName:"eventLog",
    pageSize: environment.listPageSize,
  };
  public isStartDateDisabled:boolean=false;
  public pastDateValidationMessage="The start date cannot be in the past";
  public formId : string = 'delegated_access';
  @ViewChildren('input') inputs!: QueryList<ElementRef>;
  constructor(
    private route: Router,
    private DelegatedApiService: WrapperUserDelegatedService,
    private formbuilder: FormBuilder,
    private ManageDelegateService: ManageDelegateService,
    private orgRoleService: WrapperOrganisationGroupService,
    protected scrollHelper: ScrollHelper,
    private ActivatedRoute: ActivatedRoute,
    private titleService: Title,
    private DelegatedService: ManageDelegateService,
    private dataLayerService: DataLayerService,
    private router: Router,
  ) {
    this.organisationId = localStorage.getItem('cii_organisation_id') || '';
    this.userSelectedFormData = sessionStorage.getItem('deleagted_user_details')
    this.eventLogForActiveUser.delegationAuditEventDetails = {
      currentPage: this.eventLogForActiveUser.currentPage,
      pageCount: 0,
      rowCount: 0,
      organisationId: this.organisationId,
      delegationAuditEventServiceRoleGroupList: [],
    };
  }

  ngOnInit(): void {
    this.dataLayerService.pushPageViewEvent();

    this.formGroup = this.formbuilder.group({
      startday: ['', [Validators.required]],
      startmonth: ['', [Validators.required]],
      startyear: ['', [Validators.required]],
      endday: ['', [Validators.required]],
      endmonth: ['', [Validators.required]],
      endyear: ['', [Validators.required]],
    });
    this.ActivatedRoute.queryParams.subscribe((para: any) => {
      this.userDetails = JSON.parse(atob(para.data));
      this.userDetails.userName = decodeURIComponent(unescape(this.userDetails.userName));
      this.userId = this.userDetails.id
      this.pageAccessMode = this.userDetails.pageaccessmode
      if (this.userSelectedFormData) {
        this.userSelectedData(this.userDetails.userName, this.organisationId)
      }
      else if (this.pageAccessMode === 'edit') {
        this.getUserDetails(this.userDetails.userName, this.organisationId, this.userDetails.startDate, this.userDetails.endDate, this.userDetails.delegationAccepted)
        this.titleService.setTitle(
          `${'Edit current delegated access'}   - CCS`
        );
      } else {
        this.titleService.setTitle(
          `${'Delegate access to a user'}   - CCS`
        );
        this.getOrgRoles()
        setTimeout(() => {
          this.patchDefaultDate()
        }, 10);
      }
    });
    this.dataLayerService.pushFormStartEvent(this.formId, this.formGroup);
  }

  /**
   * patch default value when user add. start date is today. and end date is after 365 days
   */
  private patchDefaultDate() {
    let startDate = new Date()
    let endDate = new Date(startDate)
    endDate.setDate(startDate.getDate() + 365)
    this.formGroup.patchValue({
      startday: startDate.getDate(),
      startmonth: startDate.getMonth() + 1,
      startyear: startDate.getFullYear(),
      endday: endDate.getDate(),
      endmonth: endDate.getMonth() + 1,
      endyear: endDate.getFullYear()
    });
  }

  /**
   * After click the cancel button from confirmation function will execute 
   * @param userId from confirmation page
   * @param delegatedOrgId from confirmation page
   */
  private userSelectedData(userId: string, delegatedOrgId: string): void {
    let data = JSON.parse(this.userSelectedFormData)
    this.userSelectedFormData = JSON.parse(data)
    setTimeout(() => {
      this.DelegatedApiService.getEdituserDetails(userId, delegatedOrgId).subscribe({
        next: (response: any) => {
          this.getOrgRoles()
          this.RoleInfo = this.userSelectedFormData
          this.userDetails = response
          this.delegationAccepted = response.detail.delegatedOrgs[0] ? response.detail.delegatedOrgs[0].delegationAccepted : false
          const startDate = this.userSelectedFormData.detail.startDate.split('-')
          const endDate = this.userSelectedFormData.detail.endDate.split('-')
          this.formGroup.patchValue({
            startday: startDate[2],
            startmonth: startDate[1],
            startyear: startDate[0],
            endday: endDate[2],
            endmonth: endDate[1],
            endyear: endDate[0]
          });
          this.formDisable()
        },
        error: (error: any) => {
          this.route.navigateByUrl('delegated-error')
        },
      });
    }, 0);
  }

  /**
   * getting already delegated user details functionlity.
   * @param userId getting from router params
   * @param delegatedOrgId getting from router params
   * @param startDateFromListPage getting from router params
   * @param endDateFromListPage getting from router params
   * @param delegationAcceptedFromListPage getting from router params
   */
  public getUserDetails(userId: string, delegatedOrgId: string, startDateFromListPage: any, endDateFromListPage: any, delegationAcceptedFromListPage: any) {
    setTimeout(() => {
      this.DelegatedApiService.getEdituserDetails(userId, delegatedOrgId).subscribe({
        next: (response: any) => {
          this.getOrgRoles()
          this.RoleInfo = response
          this.userDetails = response
          this.delegationAccepted = response.detail.delegatedOrgs[0] ? response.detail.delegatedOrgs[0].delegationAccepted : delegationAcceptedFromListPage
          const startDate = startDateFromListPage.split('-')
          const endDate = endDateFromListPage.split('-')
          this.formGroup.patchValue({
            startday: startDate[2].slice(0, 2),
            startmonth: startDate[1],
            startyear: startDate[0],
            endday: endDate[2].slice(0, 2),
            endmonth: endDate[1],
            endyear: endDate[0]
          });
          this.formDisable()
        },
        error: (error: any) => {
          this.route.navigateByUrl('delegated-error')
        },
      });
    }, 10);
  }

  /**
   * getting roles based on admin organisation
   */
  public getOrgRoles(): void {
    this.orgRoleService.getOrganisationRoles(this.organisationId).toPromise().then((orgRoles: Role[]) => {
      orgRoles.forEach((element) => {

        let orgAdmin = "ORG_ADMINISTRATOR"
        let defaultUser = "ORG_DEFAULT_USER"
        let userSupport = "ORG_USER_SUPPORT"
        let manageSubscription = "MANAGE_SUBSCRIPTIONS"
        let dataMigration = "DATA_MIGRATION"

        if (element.roleKey != orgAdmin && element.roleKey != defaultUser && element.roleKey != userSupport 
          && element.roleKey != manageSubscription && element.roleKey != dataMigration) {
          this.roleDataList.push({
            roleId: element.roleId,
            roleKey: element.roleKey,
            accessRoleName: element.roleName,
            serviceName: element.serviceName,
            description: element.description
          });
          if (this.userSelectedFormData) {
            this.formGroup.addControl(
              'orgRoleControl_' + element.roleId,
              this.formbuilder.control(this.patchRoleMatches(element.roleId))
            );
          }
          else if (this.pageAccessMode === 'edit') {
            this.formGroup.addControl(
              'orgRoleControl_' + element.roleId,
              this.formbuilder.control(this.RoleMatch(element.roleId))
            );
          } else {
            this.formGroup.addControl(
              'orgRoleControl_' + element.roleId,
              this.formbuilder.control(false)
            );
          }
        }
      });
      if (this.pageAccessMode === 'edit'){
        this.getEventLogDetailsForActiveUser()
      }     
    });
  }

  /**
   * return role match functionlity
   */
  public RoleMatch(roleId: any) {
    const result = this.RoleInfo.detail.rolePermissionInfo.find((rols: any) => rols.roleId === roleId);
    if (result) {
      return true
    }
    else {
      return false
    }
  }

  /**
   * after click the cancel button from confirmation page, function will excute
   * @param roleId 
   * @returns 
   */
  public patchRoleMatches(roleId: any) {
    const result = this.RoleInfo.roleDetails.find((rols: any) => rols.roleId === roleId);
    if (result) {
      return true
    }
    else {
      return false
    }
  }

  /**
   * core function for, patch the selected value
   * @param form 
   * @returns 
   */
  public getSelectedRoleDetails(form: FormGroup) {
    let selectedRoleIds: number[] = [];
    this.roleDataList.map((role) => {
      if (form.get('orgRoleControl_' + role.roleId)?.value === true) {
        selectedRoleIds.push(role);
      }
    });
    return selectedRoleIds;
  }

  /**
   * remove functionlity sharing data and nevigate to confimation page
   */
  public RemoveAccess(buttonText:string): void {
    this.userDetails.pageaccessmode = 'remove'
    sessionStorage.removeItem('deleagted_user_details');
    this.userDetails.userName = escape(encodeURIComponent(this.userDetails.userName));
    this.route.navigateByUrl(
      'delegated-remove-confirm?data=' + btoa(JSON.stringify(this.userDetails))
    );
    this.pushDataLayerEvent(buttonText);
  }

  /**
   * resent activation functionlity sharing data and nevigate to confimation page
   */
  public Resentactivation(): void {
    this.userDetails.pageaccessmode = 'resent'
    sessionStorage.removeItem('deleagted_user_details');
    this.userDetails.userName = escape(encodeURIComponent(this.userDetails.userName));
    this.route.navigateByUrl(
      'delegated-remove-confirm?data=' + btoa(JSON.stringify(this.userDetails))
    );
  }

  getQueryData(): string {
    this.userDetails.pageaccessmode = 'resent'
    sessionStorage.removeItem('deleagted_user_details');
    return btoa(JSON.stringify(this.userDetails));
  }

  /**
   * form vlidation, core function
   * @param form 
   * @returns 
   */
  formValid(form: FormGroup): Boolean {
    if (form == null) return false;
    if (form.controls == null) return false;
    return form.valid;
  }

  /**
   * submit functionlity, chosing page edit or add
   * @param form forms group value getting from html
   */
  public onSubmit(form: FormGroup,buttonText:string) {
    this.submitted = true;
    if (this.pageAccessMode === 'edit') {
      this.edituserdetails(form)
    } else {
      this.createuserdetails(form)
    }
    this.pushDataLayerEvent(buttonText);
  }

  /**
   *create user functionlity 
  * @param form forms group value getting from html
  */
  public createuserdetails(form: FormGroup) {
    if (this.formValid(form) && this.checkGetValidator(form)) {
      const StartDateForm = this.formGroup.get('startyear').value + '-' + this.formGroup.get('startmonth').value + '-' + this.formGroup.get('startday').value;
      const EndtDateForm = this.formGroup.get('endyear').value + '-' + this.formGroup.get('endmonth').value + '-' + this.formGroup.get('endday').value;
      let data = {
        userName: this.userDetails.userName,
        detail: {
          delegatedOrgId: this.organisationId,
          roleIds: this.getSelectedRoleIds(form),
          startDate: StartDateForm,
          endDate: EndtDateForm,
        },
        roleDetails: this.getSelectedRoleDetails(form),
        userDetails: this.userDetails,
      };
      this.userDetails.pageaccessmode = this.pageAccessMode;
      data.userName = escape(encodeURIComponent(data.userName));
      data.userDetails.userName = escape(encodeURIComponent(data.userDetails.userName));
      let stringifyData = JSON.stringify(data)
      this.dataLayerService.pushFormSubmitEvent(this.formId);
      sessionStorage.setItem('deleagted_user_details', JSON.stringify(stringifyData));
      this.route.navigateByUrl(
        'delegate-user-confirm?data=' + btoa(JSON.stringify(data))
      );
    } else {
      this.scrollHelper.scrollToFirst('error-summary');
      this.dataLayerService.pushFormErrorEvent(this.formId);
    }
  }

  private checkGetValidator(form: FormGroup) {
    return (!this.StartDateValidation && !this.EndDateValidation && !this.PastDateValidation && !this.EndDateDaysValidation && this.getSelectedRoleIds(form).length != 0)
  }

  /**
 *edit user functionlity 
 * @param form forms group value getting from html
 */
  public edituserdetails(form: FormGroup) {
    if (this.formValid(form) && (!this.StartDateValidation &&!this.PastDateValidation && !this.EndDateValidation && !this.EndDateDaysValidation && this.getSelectedRoleIds(form).length != 0)) {
      const StartDateForm = this.formGroup.get('startyear').value + '-' + this.formGroup.get('startmonth').value + '-' + this.formGroup.get('startday').value;
      const EndtDateForm = this.formGroup.get('endyear').value + '-' + this.formGroup.get('endmonth').value + '-' + this.formGroup.get('endday').value;
      let data = {
        userName: this.userDetails.userName,
        detail: {
          delegatedOrgId: this.organisationId,
          roleIds: this.getSelectedRoleIds(form),
          startDate: StartDateForm,
          endDate: EndtDateForm,
        },
        roleDetails: this.getSelectedRoleDetails(form),
        userDetails: this.userDetails,
      };
      this.userDetails.pageaccessmode = this.pageAccessMode;
      data.userDetails.userName = escape(encodeURIComponent(data.userDetails.userName));
      data.userName = escape(encodeURIComponent(data.userName));
      let stringifyData = JSON.stringify(data)
      this.dataLayerService.pushFormSubmitEvent(this.formId);
      sessionStorage.setItem('deleagted_user_details', JSON.stringify(stringifyData));
      this.route.navigateByUrl(
        'delegate-user-confirm?data=' + btoa(JSON.stringify(data))
      );

    } else {
      this.scrollHelper.scrollToFirst('error-summary');
      this.dataLayerService.pushFormErrorEvent(this.formId);
    }
  }

  /**
   * after errror showing, scroll functionlity
   */
  ngAfterViewChecked() {
    this.scrollHelper.doScroll();
  }

  /**
   * return function used start date validation
   * @returns boolean
   */
  public get StartDateValidation() {
    const StartDate = this.formGroup.get('startyear').value + '-' + this.formGroup.get('startmonth').value + '-' + this.formGroup.get('startday').value;
    let IsInValidDate: any = new Date(StartDate)
    let days = new Date(this.formGroup.get('startyear').value, this.formGroup.get('startmonth').value, 0).getDate()
    if (IsInValidDate == 'Invalid Date' || days < this.formGroup.get('startday').value) {
      return true;
    } else {
      return false;
    }
  }


  /**
   * return function used end date validation
   * @returns boolean
   */
  public get EndDateValidation() {
    const EndtDate = this.formGroup.get('endyear').value + '-' + this.formGroup.get('endmonth').value + '-' + this.formGroup.get('endday').value;
    let days = new Date(this.formGroup.get('endyear').value, this.formGroup.get('endmonth').value, 0).getDate()
    let IsInValidDate: any = new Date(EndtDate)
    if (IsInValidDate == 'Invalid Date' || days < this.formGroup.get('endday').value) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * return function, checking start date is past or not
   * @returns boolean
   */
  public get PastDateValidation() {
    if(this.pageAccessMode === 'edit' && this.isStartDateDisabled)
    {
        return false;
    }
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const StartDate = this.formGroup.get('startyear').value + '-' + this.formGroup.get('startmonth').value + '-' + this.formGroup.get('startday').value;
      const date = new Date(StartDate);
      date.setHours(0, 0, 0, 0);
      if(this.pageAccessMode==='edit')
      {
        if(date<=today)
        {
          this.pastDateValidationMessage="The start date cannot be today or in the past";
        }
        return date <= today;
      }
      else{
      return date < today;
      }
  }


  /**
   * return function, checking end date is having minimum 28 days and maximum 365
   * @returns boolean
   */
  public get EndDateDaysValidation() {
    if (!this.EndDateValidation) {
      const StartDateForm = this.formGroup.get('startyear').value + '-' + this.formGroup.get('startmonth').value + '-' + this.formGroup.get('startday').value;
      const EndtDateForm = this.formGroup.get('endyear').value + '-' + this.formGroup.get('endmonth').value + '-' + this.formGroup.get('endday').value;
      let EndDate = new Date(EndtDateForm);
      let StartDate = new Date(StartDateForm);
      const oneDay = 86400000;
      const diffInTime = EndDate.getTime() - StartDate.getTime();
      const diffInDays = Math.round(diffInTime / oneDay);
      if (diffInDays > 365 || diffInDays < 1) {
        return true
      }
      return false
    } else {
      return false
    }
  }

  /**
   * input focus functionlity
   * @param inputIndex input index value
   */
  public setFocus(inputIndex: string) {
    this.ManageDelegateService.SetInputFocus(inputIndex)
  }

  /**
   * date input focus functionlity
   * @param data input date for find index opf string
   * @param box box count
   * @param form form value
   */
  public ValueChanged(data: string, box: string, form: string): void {
    this.ManageDelegateService.ValueChanged(data, box, form);
  }

  /**
   * date input focus functionlity
   * @param data input date for find index opf string
   * @param box box count
   * @param form form value
   */
  public tiggerBackspace(data: string, box: string, form: string): void {
    this.ManageDelegateService.tiggerBackspace(data, box, form);
  }

  /**
   * role id merge and return function
   * @param form forms group value
   * @returns seleted form
   */
  public getSelectedRoleIds(form: FormGroup) {
    let selectedRoleIds: number[] = [];
    this.roleDataList.map((role) => {
      if (form.get('orgRoleControl_' + role.roleId)?.value === true) {
        selectedRoleIds.push(role.roleId);
      }
    });
    return selectedRoleIds;
  }

  /**
    * forms disable function used in edit scenerio
    */
  private formDisable() {
    if (this.pageAccessMode === 'edit') {
      const today = new Date();
      today.setHours(0,0,0,0);
      const StartDateForm = this.formGroup.get('startyear').value + '-' + this.formGroup.get('startmonth').value + '-' + this.formGroup.get('startday').value;
      const startDate=new Date(StartDateForm);
      startDate.setHours(0,0,0,0);
      if(startDate<=today || this.delegationAccepted)
      {
        this.isStartDateDisabled=true;
      this.formGroup.controls['startday'].disable()
      this.formGroup.controls['startmonth'].disable()
      this.formGroup.controls['startyear'].disable()
      }
      else
      {
        this.isStartDateDisabled=false;
      }
    }
  }

  /**
   * nevigate to last active page and clearing all the session values
   */
  public Cancel(buttonText:string) {
    sessionStorage.removeItem('deleagted_user_details')
    window.history.back();
    this.pushDataLayerEvent(buttonText);
  }

  /**
   * breadcrums nevigaion functionlity
   * @param path getting from html
   */
  public nevigate(path: string) {
    this.route.navigateByUrl(path)
    sessionStorage.removeItem('deleagted_user_details')
  }

  public setPageOrganisationEventLogs(pageNumber: any) {
    this.eventLogForActiveUser.currentPage = pageNumber;
    this.getEventLogDetailsForActiveUser();
  }

  private getEventLogDetailsForActiveUser(): void {
    this.DelegatedApiService.getDelegatedEventLogs(this.eventLogForActiveUser.pageSize, this.eventLogForActiveUser.currentPage, this.userId,this.organisationId).subscribe((response) => {
    this.eventLogForActiveUser.delegationAuditEventDetails.delegationAuditEventServiceRoleGroupList = this.DelegatedService.matchDelegatedDetailsOne(response.delegationAuditEventServiceRoleGroupList)
    this.eventLogForActiveUser.pageCount =  response.pageCount;
    })
  }

  pushDataLayerEvent(buttonText:string) {
    this.dataLayerService.pushClickEvent(buttonText);
   }
}