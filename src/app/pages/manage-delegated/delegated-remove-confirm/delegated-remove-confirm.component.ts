import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WrapperUserDelegatedService } from 'src/app/services/wrapper/wrapper-user-delegated.service';

@Component({
  selector: 'app-delegated-remove-confirm',
  templateUrl: './delegated-remove-confirm.component.html',
  styleUrls: ['./delegated-remove-confirm.component.scss'],
})
export class DelegatedRemoveConfirmComponent implements OnInit {
  private organisationId: string;
  public RouteData:any;
  constructor(private router: Router, private route: ActivatedRoute,private DelegatedService: WrapperUserDelegatedService) {
    this.organisationId = localStorage.getItem('cii_organisation_id') || '';
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((para: any) => {
      this.RouteData = JSON.parse(atob(para.data));
      console.log("RouteData",this.RouteData)
    });
  }

  public ConfirmRemoveUser(){
    this.DelegatedService.deleteDelegatedUser(this.RouteData.userName,this.organisationId).subscribe({
      next: (data: any) => {
        console.log("data", data)
      },
      error: (error: any) => { },
    });
  }
}
