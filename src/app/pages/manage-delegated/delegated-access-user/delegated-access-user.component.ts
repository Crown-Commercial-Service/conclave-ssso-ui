import { ViewportScroller } from '@angular/common';
import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Role } from 'src/app/models/organisationGroup';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { WrapperOrganisationGroupService } from 'src/app/services/wrapper/wrapper-org--group-service';
import { WrapperUserDelegatedService } from 'src/app/services/wrapper/wrapper-user-delegated.service';
import { ManageDelegateService } from '../service/manage-delegate.service';

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
  @ViewChildren('input') inputs!: QueryList<ElementRef>;
  constructor(
    private route: Router,
    private DelegatedService: WrapperUserDelegatedService,
    private formbuilder: FormBuilder,
    private ManageDelegateService: ManageDelegateService,
    private orgRoleService: WrapperOrganisationGroupService,
    protected scrollHelper: ScrollHelper,
    private ActivatedRoute: ActivatedRoute,
    private titleService: Title
  ) {
    this.organisationId = localStorage.getItem('cii_organisation_id') || '';
    this.userSelectedFormData = sessionStorage.getItem('deleagted_user_details')
  }

  ngOnInit(): void {
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
      this.pageAccessMode = this.userDetails.pageaccessmode
      if (this.userSelectedFormData) {
        this.userSelectedData(this.userDetails.userName, this.organisationId)
      }
      else if (this.pageAccessMode === 'edit') {
        this.getUserDetails(this.userDetails.userName, this.organisationId, this.userDetails.startDate, this.userDetails.endDate, this.userDetails.delegationAccepted)
        this.titleService.setTitle(
          `${ 'Edit current delegated access'}   - CCS`
        );
      } else {
        this.titleService.setTitle(
          `${ 'Delegate access to a user'}   - CCS`
        );
        this.getOrgRoles()
        setTimeout(() => {
          this.patchDefaultDate()
        }, 10);
      }
    });
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
      this.DelegatedService.getEdituserDetails(userId, delegatedOrgId).subscribe({
        next: (response: any) => {
          this.getOrgRoles()
          this.RoleInfo = this.userSelectedFormData
          this.userDetails = response
          this.delegationAccepted = response.detail.delegatedOrgs[0] ?  response.detail.delegatedOrgs[0].delegationAccepted : false
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
        },
        error: (error: any) => {
          this.route.navigateByUrl('delegated-error')
        },
      });
    }, 0);
     this.formDisable()
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
      this.DelegatedService.getEdituserDetails(userId, delegatedOrgId).subscribe({
        next: (response: any) => {
          this.getOrgRoles()
          this.RoleInfo = response
          this.userDetails = response
          this.delegationAccepted = response.detail.delegatedOrgs[0] ?  response.detail.delegatedOrgs[0].delegationAccepted : delegationAcceptedFromListPage
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
        if (element.roleKey != "ORG_ADMINISTRATOR" && element.roleKey != "ORG_DEFAULT_USER" && element.roleKey != "ORG_USER_SUPPORT" && element.roleKey != "MANAGE_SUBSCRIPTIONS") {
          this.roleDataList.push({
            roleId: element.roleId,
            roleKey: element.roleKey,
            accessRoleName: element.roleName,
            serviceName: element.serviceName,
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
  public RemoveAccess(): void {
    this.userDetails.pageaccessmode = 'remove'
    sessionStorage.removeItem('deleagted_user_details')
    this.route.navigateByUrl(
      'delegated-remove-confirm?data=' + btoa(JSON.stringify(this.userDetails))
    );
  }

  /**
   * resent activation functionlity sharing data and nevigate to confimation page
   */
  public Resentactivation(): void {
    this.userDetails.pageaccessmode = 'resent'
    sessionStorage.removeItem('deleagted_user_details')
    this.route.navigateByUrl(
      'delegated-remove-confirm?data=' + btoa(JSON.stringify(this.userDetails))
    );
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
  public onSubmit(form: FormGroup) {
    this.submitted = true;
    if (this.pageAccessMode === 'edit') {
      this.edituserdetails(form)
    } else {
      this.createuserdetails(form)
    }
  }

  /**
   *create user functionlity 
  * @param form forms group value getting from html
  */
  public createuserdetails(form: FormGroup) {
    if (this.formValid(form) && (!this.StartDateValidation && !this.EndDateValidation && !this.PastDateValidation && !this.EndDateDaysValidation && this.getSelectedRoleIds(form).length != 0)) {
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
      this.userDetails.pageaccessmode = this.pageAccessMode
      let stringifyData = JSON.stringify(data)
      sessionStorage.setItem('deleagted_user_details', JSON.stringify(stringifyData))
      this.route.navigateByUrl(
        'delegate-user-confirm?data=' + btoa(JSON.stringify(data))
      );
    } else {
      this.scrollHelper.scrollToFirst('error-summary');
    }
  }

  /**
 *edit user functionlity 
 * @param form forms group value getting from html
 */
  public edituserdetails(form: FormGroup) {
    if (this.formValid(form) && (!this.StartDateValidation && !this.EndDateValidation && !this.EndDateDaysValidation && this.getSelectedRoleIds(form).length != 0)) {
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
      this.userDetails.pageaccessmode = this.pageAccessMode
      let stringifyData = JSON.stringify(data)
      sessionStorage.setItem('deleagted_user_details', JSON.stringify(stringifyData))
      this.route.navigateByUrl(
        'delegate-user-confirm?data=' + btoa(JSON.stringify(data))
      );

    } else {
      this.scrollHelper.scrollToFirst('error-summary');
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
    if(this.pageAccessMode == 'add'){
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const StartDate = this.formGroup.get('startyear').value + '-' + this.formGroup.get('startmonth').value + '-' + this.formGroup.get('startday').value;
      const date = new Date(StartDate);
      return date < today;
    }else {
      return false
    }
  }


  /**
   * return function, checking end date is having minimum 28 days and maximum 365
   * @returns boolean
   */
  public get EndDateDaysValidation() {
    if(!this.EndDateValidation){
    const StartDateForm = this.formGroup.get('startyear').value + '-' + this.formGroup.get('startmonth').value + '-' + this.formGroup.get('startday').value;
    const EndtDateForm = this.formGroup.get('endyear').value + '-' + this.formGroup.get('endmonth').value + '-' + this.formGroup.get('endday').value;
    let EndDate = new Date(EndtDateForm);
    let StartDate = new Date(StartDateForm);
    const oneDay = 86400000;
    const diffInTime = EndDate.getTime() - StartDate.getTime();
    const diffInDays = Math.round(diffInTime / oneDay);
    if (diffInDays > 365 || diffInDays < 28) {
      return true
    }
    return false
  } else{
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
  private formDisable(){
    if(this.pageAccessMode === 'edit'){
      this.formGroup.controls['startday'].disable()
      this.formGroup.controls['startmonth'].disable()
      this.formGroup.controls['startyear'].disable()
    }
  }
 
   /**
    * nevigate to last active page and clearing all the session values
    */
  public Cancel() {
    sessionStorage.removeItem('deleagted_user_details')
    window.history.back();
  }

  /**
   * breadcrums nevigaion functionlity
   * @param path getting from html
   */
  public nevigate(path:string){
    this.route.navigateByUrl(path)
    sessionStorage.removeItem('deleagted_user_details')
  }
}