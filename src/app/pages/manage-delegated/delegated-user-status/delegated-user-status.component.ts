import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Role } from 'src/app/models/organisationGroup';
import { WrapperOrganisationGroupService } from 'src/app/services/wrapper/wrapper-org--group-service';
import { WrapperUserDelegatedService } from 'src/app/services/wrapper/wrapper-user-delegated.service';

@Component({
  selector: 'app-delegated-user-status',
  templateUrl: './delegated-user-status.component.html',
  styleUrls: ['./delegated-user-status.component.scss'],
})
export class DelegatedUserStatusComponent implements OnInit {
  public formGroup: FormGroup | any;
  private organisationId: string;
  public roleDataList: any[] = [];
  public assignedRoleDataList: any[] = [];
  public userInfo:any={}
  public UserStatus = {
    header: '',
    Description: '',
    Breadcrumb: '',
    status: '',
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orgRoleService: WrapperOrganisationGroupService,
    private formbuilder: FormBuilder,
    private DelegatedService: WrapperUserDelegatedService,
    ) {
    this.organisationId = localStorage.getItem('cii_organisation_id') || '';
    }
 
  ngOnInit(): void {
    this.route.queryParams.subscribe((para: any) => {
      let RouteData = JSON.parse(atob(para.data));
      switch (RouteData.status) {
        case '001': {
          this.UserStatus = RouteData;
          break;
        }
        case '002': {
          this.UserStatus = RouteData;
          break;
        }
        case '003': {
          this.UserStatus = RouteData;
          this.UserStatus.Description =
            'View details of expired delegated access for the user. If you want to reinstate delegated access to this user, please use “Delegate to an external user” button on the previous page.';
          this.formGroup = this.formbuilder.group({
            startday: [{value: '', disabled: true}, [Validators.required]],
            startmonth: [{value: '', disabled: true}, [Validators.required]],
            startyear: [{value: '', disabled: true}, [Validators.required]],
            endday: [{value: '', disabled: true}, [Validators.required]],
            endmonth: [{value: '', disabled: true}, [Validators.required]],
            endyear: [{value: '', disabled: true}, [Validators.required]],
          });
          this.getUserDetails(RouteData.event.userName)
          //statements;
          break;
        }
        default: {
          //statements;
          break;
        }
      }
    });
  }


  public getUserDetails(userId: string) {
    setTimeout(() => {
      this.DelegatedService.getEdituserDetails(userId, this.organisationId).subscribe({
        next: (response: any) => {
          this.userInfo=response
          const startDate=response.detail.delegatedOrgs[0].startDate.split('-')
          const endDate=response.detail.delegatedOrgs[0].endDate.split('-')
          this.formGroup.patchValue({
            startday: startDate[2].slice(0, 2),
            startmonth: startDate[1],
            startyear: startDate[0],
            endday:  endDate[2].slice(0, 2),
            endmonth:endDate[1],
            endyear:endDate[0]
          });
          // this.formGroup.controls['startday'].disable()
          // this.formGroup.controls['startmonth'].disable()
          // this.formGroup.controls['startyear'].disable()
          this.getOrgRoles()
        },
        error: (error: any) => { 
          this.router.navigateByUrl('delegated-error')
        },
      });
    }, 10);
  }
  public getOrgRoles(): void {
    this.orgRoleService.getOrganisationRoles(this.organisationId).toPromise() .then((response: Role[])=>{
      let orgRoles=response
      orgRoles.forEach((f)=>{
        this.userInfo.detail.rolePermissionInfo.forEach((element:any) => {
          if(element.roleId === f.roleId){
            this.roleDataList.push({
              roleId: f.roleId,
              roleKey: f.roleKey,
              accessRoleName: f.roleName,
              serviceName: f.serviceName,
            });
            this.formGroup.addControl(
              'orgRoleControl_' + element.roleId,
              this.formbuilder.control(true)
            );
          }
        });
      })
    })
  }

  public BackToDelegated():void {
    this.router.navigateByUrl('delegated-access');
  }
  public BackToDashboard():void {
    this.router.navigateByUrl('home');
  }
  public Back():void{
    window.history.back();
  }
}
