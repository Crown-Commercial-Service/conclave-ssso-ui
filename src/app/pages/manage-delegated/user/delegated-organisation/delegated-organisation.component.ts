import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WrapperUserDelegatedService } from 'src/app/services/wrapper/wrapper-user-delegated.service';
import { environment } from 'src/environments/environment';
import { ManageDelegateService } from '../../service/manage-delegate.service';

@Component({
  selector: 'app-delegated-organisation',
  templateUrl: './delegated-organisation.component.html',
  styleUrls: ['./delegated-organisation.component.scss'],
})
export class DelegatedOrganisationComponent implements OnInit {
  public organisationList: any = [];
  public userDetails: any = {};
  public primaryRoleSelected: any;
  public secondaryRoleSelected: any;
  private roleData:any;
  private roleInfo: any;
  private isDeleagation:boolean=environment.appSetting.hideDelegation

  constructor(
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private delegatedService: WrapperUserDelegatedService,
    private DelegateService: ManageDelegateService,
  ) {
    if(this.isDeleagation === true){
      this.route.navigateByUrl('/home');
      return
     }
     this.activatedRoute.queryParams.subscribe((para: any) => {
     if(para.data === "reload"){
      this.roleInfo=0
      this.primaryRoleSelected = 'primaryselected';
      this.roleData=0
     }
    });
  }

  ngOnInit(): void {
    if (
      this.DelegateService.getDelegatedOrg == '0' ||
      this.DelegateService.getDelegatedOrg == null || this.DelegateService.getDelegatedOrg == ''
    ) {
      this.roleInfo=0
      this.primaryRoleSelected = 'primaryselected';
      this.roleData=0
    } else {
      this.secondaryRoleSelected = this.DelegateService.getDelegatedOrg;
      this.roleInfo=this.DelegateService.getDelegatedOrg;
      this.roleData=this.DelegateService.getDelegatedOrg
    }
    this.getDelegatedOrganisation();
  }

    public  get isDisabled(){
      if(this.roleData == this.roleInfo){
         return true
      }else{
         return false
      }
    }

  private getDelegatedOrganisation(): void {
    this.delegatedService.getDeligatedOrg().subscribe({
      next: (data: any) => {
        let orgDetails = data.detail.delegatedOrgs.find((element: { delegatedOrgId: string; })=> element.delegatedOrgId == localStorage.getItem('permission_organisation_id') || "" )
        if(orgDetails === undefined && this.roleData != 0){
          this.DelegateService.setDelegatedOrg(0,'delegated-organisation?data=reload');
        } 
        this.userDetails = data;
        this.organisationList = data.detail.delegatedOrgs;
      },
      error: (error: any) => {
        console.log('error', error);
      },
    });
  }

  public setPrimaryOrg() {
    this.secondaryRoleSelected = null;
    this.roleInfo = 0; 
  }

  public setSecondaryOrg(orgDetails: any) {
    this.primaryRoleSelected = null;
    this.roleInfo = orgDetails.delegatedOrgId;
  }
  onSubmit() {
    this.DelegateService.setDelegatedOrg(this.roleInfo,'home');
  }
  public Cancel() {
    window.history.back();
  }
}
