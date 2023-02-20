import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
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
  public UserStatus:any = {
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
    private titleService: Title,
    ) {
    this.organisationId = localStorage.getItem('cii_organisation_id') || '';
    }
 
  ngOnInit(): void {
    this.route.queryParams.subscribe((para: any) => {
      let RouteData = JSON.parse(atob(para.data));
      RouteData.event.userName = decodeURIComponent(unescape(RouteData.event.userName));
      switch (RouteData.status) {
        case '001': {
          this.UserStatus = RouteData;
          this.titleService.setTitle(
            `${ 'User from your Organisation'}   - CCS`
          );
          break;
        }
        case '002': {
          this.UserStatus = RouteData;
          this.titleService.setTitle(
            `${ 'User not found'}  - CCS`
          );
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
          this.titleService.setTitle(
            `${ 'View expired delegated access' }  - CCS`
          );
          this.getUserDetails(RouteData)
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


  public getUserDetails(response: any) {
    const startDate=response.event.startDate.split('-')
    const endDate=response.event.endDate.split('-')
    this.formGroup.patchValue({
      startday: startDate[2].slice(0, 2),
      startmonth: startDate[1],
      startyear: startDate[0],
      endday:  endDate[2].slice(0, 2),
      endmonth:endDate[1],
      endyear:endDate[0]
    });
    this.getOrgRoles(response)
  }
  public getOrgRoles(roleResponse:any): void {
    this.orgRoleService.getOrganisationRoles(this.organisationId).toPromise() .then((response: Role[])=>{
      let orgRoles=response
      orgRoles.forEach((f)=>{
        roleResponse.event.rolePermissionInfo.forEach((element:any) => {
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
    this.router.navigateByUrl('find-delegated-user');
  }
  public BackToDashboard():void {
    this.router.navigateByUrl('home');
  }
  public Back():void{
    sessionStorage.setItem('activetab','expiredusers')
    window.history.back();
  }
  public goToDelegatedAccessPage(){
    sessionStorage.setItem('activetab','expiredusers')
    this.router.navigateByUrl('delegated-access');
  }
}
