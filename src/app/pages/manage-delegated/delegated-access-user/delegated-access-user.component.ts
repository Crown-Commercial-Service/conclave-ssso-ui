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
  public pageAccessMode:string='';
  public assignedRoleDataList: any[] = [];
  public delegationAccepted:boolean=false;
  private organisationId: string;
  private RoleInfo:any=[]
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
  }

  ngOnInit(): void {
    this.ActivatedRoute.queryParams.subscribe((para: any) => {
      this.userDetails = JSON.parse(atob(para.data));
      this.pageAccessMode=this.userDetails.pageaccessmode
      if(this.pageAccessMode === 'edit'){
        this.getUserDetails(this.userDetails.userName,this.organisationId)
      }else{
        this.getOrgRoles()
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

  public getUserDetails(userId: string, delegatedOrgId: string) {
    setTimeout(() => {
      this.DelegatedService.getEdituserDetails(userId, delegatedOrgId).subscribe({
        next: (response: any) => {
         this.getOrgRoles()
          this.RoleInfo=response 
          this.userDetails=response
          this.delegationAccepted=response.detail.delegatedOrgs[0].delegationAccepted
          console.log("delegationAccepted",this.delegationAccepted)
          const startDate=this.userDetails.detail.delegatedOrgs[0].startDate.split('-')
          const endDate=this.userDetails.detail.delegatedOrgs[0].endDate.split('-')
          this.formGroup.patchValue({
            startday: startDate[2].slice(0, 2),
            startmonth: startDate[1],
            startyear: startDate[0],
            endday:  endDate[2].slice(0, 2),
            endmonth:endDate[1],
            endyear:endDate[0]
          });
          this.formGroup.controls['startday'].disable()
          this.formGroup.controls['startmonth'].disable(
          )
          this.formGroup.controls['startyear'].disable()
        },
        error: (error: any) => { 
          this.route.navigateByUrl('delegated-error')
        },
      });
    }, 10);
  }

  public getOrgRoles(): void {
      this.orgRoleService.getOrganisationRoles(this.organisationId).toPromise() .then((orgRoles: Role[]) => {
          orgRoles.forEach((element) => {
            this.roleDataList.push({
              roleId: element.roleId,
              roleKey: element.roleKey,
              accessRoleName: element.roleName,
              serviceName: element.serviceName,
            });
            if(this.pageAccessMode === 'edit'){
              this.formGroup.addControl(
                'orgRoleControl_' + element.roleId,
                this.formbuilder.control(this.RoleMatch(element.roleId))
              );
            }else{
              this.formGroup.addControl(
                'orgRoleControl_' + element.roleId,
                this.formbuilder.control(false)
              );
            }
          });
      });

  }


  public  RoleMatch(roleId:any){
   const result = this.RoleInfo.detail.rolePermissionInfo.find((rols:any) => rols.roleId === roleId);
   if(result){
    return true
   }
   else{
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
    this.userDetails.pageaccessmode='remove'
    this.route.navigateByUrl(
      'delegated-remove-confirm?data=' + btoa(JSON.stringify(this.userDetails))
    );
  }

  public Resentactivation():void{
    this.userDetails.pageaccessmode='resent'
    this.route.navigateByUrl(
      'delegated-remove-confirm?data=' + btoa(JSON.stringify(this.userDetails))
    );
  }

  formValid(form: FormGroup): Boolean {
    if (form == null) return false;
    if (form.controls == null) return false;
    return form.valid;
  }


  public onSubmit(form: FormGroup){
    this.submitted = true;
    if(this.pageAccessMode === 'edit'){
      this.edituserdetails(form)
    }else{
      this.createuserdetails(form)
    }
  }

public createuserdetails(form:FormGroup){
  if (this.formValid(form) && (!this.StartDateValidation && !this.EndDateValidation && !this.PastDateValidation && !this.EndDateDaysValidation && this.getSelectedRoleIds(form).length != 0)) {
    const StartDateForm = this.formGroup.get('startyear').value + '-' + this.formGroup.get('startmonth').value + '-' + this.formGroup.get('startday').value;
    const EndtDateForm = this.formGroup.get('endyear').value + '-' + this.formGroup.get('endmonth').value + '-' + this.formGroup.get('endday').value;
    let EndDate = new Date(EndtDateForm);
    let StartDate = new Date(StartDateForm);
    let data = {
      userName: this.userDetails.userName,
      detail: {
        delegatedOrgId: this.organisationId,
        roleIds: this.getSelectedRoleIds(form),
        startDate: StartDate,
        endDate: EndDate,
      },
      roleDetails:this.getSelectedRoleDetails(form),
      userDetails:this.userDetails,
    };
    this.userDetails.pageaccessmode=this.pageAccessMode
    this.route.navigateByUrl(
      'delegate-user-confirm?data=' + btoa(JSON.stringify(data))
    );

} else {
  this.scrollHelper.scrollToFirst('error-summary');
}
}

public edituserdetails(form:FormGroup){
  if (this.formValid(form) && (!this.StartDateValidation && !this.EndDateValidation && !this.EndDateDaysValidation && this.getSelectedRoleIds(form).length != 0)) {
    const StartDateForm = this.formGroup.get('startyear').value + '-' + this.formGroup.get('startmonth').value + '-' + this.formGroup.get('startday').value;
    const EndtDateForm = this.formGroup.get('endyear').value + '-' + this.formGroup.get('endmonth').value + '-' + this.formGroup.get('endday').value;
    let EndDate = new Date(EndtDateForm);
    let StartDate = new Date(StartDateForm);
    let data = {
      userName: this.userDetails.userName,
      detail: {
        delegatedOrgId: this.organisationId,
        roleIds: this.getSelectedRoleIds(form),
        startDate: StartDate,
        endDate: EndDate,
      },
      roleDetails:this.getSelectedRoleDetails(form),
      userDetails:this.userDetails,
    };
    this.userDetails.pageaccessmode=this.pageAccessMode
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
    if (IsInValidDate == 'Invalid Date') {
      return true;
    } else {
      return false;
    }
  }



  public get EndDateValidation() {
    const EndtDate = this.formGroup.get('endyear').value + '-' + this.formGroup.get('endmonth').value + '-' + this.formGroup.get('endday').value;
    let IsInValidDate: any = new Date(EndtDate)
    if (IsInValidDate == 'Invalid Date') {
      return true;
    } else {
      return false;
    }
  }

  public get PastDateValidation() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const StartDate = this.formGroup.get('startyear').value + '-' + this.formGroup.get('startmonth').value + '-' + this.formGroup.get('startday').value;
    const date = new Date(StartDate);
    return date < today;
  }

  public get EndDateDaysValidation() {
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
    window.history.back();
  }
}
