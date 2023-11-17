import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserListResponse } from 'src/app/models/user';
import { WrapperUserDelegatedService } from 'src/app/services/wrapper/wrapper-user-delegated.service';
import { DataLayerService } from 'src/app/shared/data-layer.service';

@Component({
  selector: 'app-delegated-user-activation',
  templateUrl: './delegated-user-activation.component.html',
  styleUrls: ['./delegated-user-activation.component.scss'],
})
export class DelegatedUserActivationComponent implements OnInit {
  
  public userActivation:any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private DelegatedService: WrapperUserDelegatedService,
    private dataLayerService: DataLayerService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((para: any) => {
      this.DelegatedService.activateUser(para.activationcode).subscribe({
        next: (userResponse: any) => {
         this.userActivation = true
        },
        error: (error: any) => {
          this.userActivation = false
        },
      });
    });
    this.router.events.subscribe(value => {
      this.dataLayerService.pushEvent({ 
          event: "page_view" ,
          page_location: this.router.url.toString(),
          user_name: localStorage.getItem("user_name"),
          cii_organisataion_id: localStorage.getItem("cii_organisation_id"),
      });
    })
  }
}
