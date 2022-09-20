import { ViewportScroller } from '@angular/common';
import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
    private ActivatedRoute: ActivatedRoute
  ) {
    this.organisationId = localStorage.getItem('cii_organisation_id') || '';
    this.userSelectedFormData = sessionStorage.getItem('deleagted_user_details')
  }

  ngOnInit(): void {
    this.ActivatedRoute.queryParams.subscribe((para: any) => {
      this.userDetails = JSON.parse(atob(para.data));
      this.pageAccessMode = this.userDetails.pageaccessmode
      if (this.userSelectedFormData) {
        this.userSelectedData(this.userDetails.userName, this.organisationId)
      }
      else if (this.pageAccessMode === 'edit') {
        this.getUserDetails(this.userDetails.userName, this.organisationId, this.userDetails.startDate, this.userDetails.endDate, this.userDetails.delegationAccepted)
      } else {
        this.getOrgRoles()
        setTimeout(() => {
          this.patchDefaultDate()
        }, 10);
      }
    });
    this.formGroup = this.formbuilder.group({
      startday: ['', [Validators.required]],
      startmonth: ['', [Validators.required]],
      startyear: ['', [Validators.required]],
      endday: ['', [Validators.required]],
      endmonth: ['', [Validators.required]],
      endyear: ['', [Validators.required]],
    });
  }

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
    }, 10);
  }


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
          this.formGroup.controls['startday'].disable()
          this.formGroup.controls['startmonth'].disable()
          this.formGroup.controls['startyear'].disable()
        },
        error: (error: any) => {
          this.route.navigateByUrl('delegated-error')
        },
      });
    }, 10);
  }

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


  public RoleMatch(roleId: any) {
    const result = this.RoleInfo.detail.rolePermissionInfo.find((rols: any) => rols.roleId === roleId);
    if (result) {
      return true
    }
    else {
      return false
    }
  }


  public patchRoleMatches(roleId: any) {
    const result = this.RoleInfo.roleDetails.find((rols: any) => rols.roleId === roleId);
    if (result) {
      return true
    }
    else {
      return false
    }
  }

  public getSelectedRoleDetails(form: FormGroup) {
    let selectedRoleIds: number[] = [];
    this.roleDataList.map((role) => {
      if (form.get('orgRoleControl_' + role.roleId)?.value === true) {
        selectedRoleIds.push(role);
      }
    });
    return selectedRoleIds;
  }


  public RemoveAccess(): void {
    this.userDetails.pageaccessmode = 'remove'
    sessionStorage.removeItem('deleagted_user_details')
    this.route.navigateByUrl(
      'delegated-remove-confirm?data=' + btoa(JSON.stringify(this.userDetails))
    );
  }

  public Resentactivation(): void {
    this.userDetails.pageaccessmode = 'resent'
    sessionStorage.removeItem('deleagted_user_details')
    this.route.navigateByUrl(
      'delegated-remove-confirm?data=' + btoa(JSON.stringify(this.userDetails))
    );
  }

  formValid(form: FormGroup): Boolean {
    if (form == null) return false;
    if (form.controls == null) return false;
    return form.valid;
  }


  public onSubmit(form: FormGroup) {
    this.submitted = true;
    if (this.pageAccessMode === 'edit') {
      this.edituserdetails(form)
    } else {
      this.createuserdetails(form)
    }
  }

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



  ngAfterViewChecked() {
    this.scrollHelper.doScroll();
  }



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

  public get PastDateValidation() {
    if(!this.StartDateValidation){
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const StartDate = this.formGroup.get('startyear').value + '-' + this.formGroup.get('startmonth').value + '-' + this.formGroup.get('startday').value;
    const date = new Date(StartDate);
    return date < today;
   } else {
    return false
   }
  }

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

  public setFocus(inputIndex: string) {
    this.ManageDelegateService.SetInputFocus(inputIndex)
  }


  public ValueChanged(data: string, box: string, form: string): void {
    this.ManageDelegateService.ValueChanged(data, box, form);
  }

  public tiggerBackspace(data: string, box: string, form: string): void {
    this.ManageDelegateService.tiggerBackspace(data, box, form);
  }


  public getSelectedRoleIds(form: FormGroup) {
    let selectedRoleIds: number[] = [];
    this.roleDataList.map((role) => {
      if (form.get('orgRoleControl_' + role.roleId)?.value === true) {
        selectedRoleIds.push(role.roleId);
      }
    });
    return selectedRoleIds;
  }




  public Cancel() {
    sessionStorage.removeItem('deleagted_user_details')
    window.history.back();
  }

  public nevigate(path:string){
    this.route.navigateByUrl(path)
    sessionStorage.removeItem('deleagted_user_details')
  }
}