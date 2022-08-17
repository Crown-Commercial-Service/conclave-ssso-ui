import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WrapperUserDelegatedService } from 'src/app/services/wrapper/wrapper-user-delegated.service';

@Component({
  selector: 'app-delegated-organisation',
  templateUrl: './delegated-organisation.component.html',
  styleUrls: ['./delegated-organisation.component.scss'],
})
export class DelegatedOrganisationComponent implements OnInit {

 public organisationList:any=[]
 public userDetails:any={}
 public radioSelected:any;
  constructor(
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private delegatedService: WrapperUserDelegatedService
  ) {}

  ngOnInit(): void {
    this.getDelegatedOrganisation()
  }

  private getDelegatedOrganisation(): void {
    this.delegatedService.getDeligatedOrg('delegatedusertest2@yopmail.com').subscribe({
      next: (data: any) => {
         this.userDetails=data
        this.organisationList=data.detail.delegatedOrgs
        console.log("data",data)
      },
      error: (error: any) => {
        console.log("error",error)
      },
    });
  }

  onSubmit() {
    console.log("radioSelected",this.radioSelected)
    this.radioSelected=null
  }
  Cancel() {}
}
