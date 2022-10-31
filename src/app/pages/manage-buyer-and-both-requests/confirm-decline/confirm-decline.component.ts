import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Role } from 'src/app/models/organisationGroup';
import { WrapperOrganisationGroupService } from 'src/app/services/wrapper/wrapper-org--group-service';
import { WrapperUserDelegatedService } from 'src/app/services/wrapper/wrapper-user-delegated.service';

@Component({
  selector: 'app-confirm-decline',
  templateUrl: './confirm-decline.component.html',
  styleUrls: ['./confirm-decline.component.scss'],
})
export class ConfirmDeclineComponent implements OnInit {
  private organisationId: string;

  constructor(private route: ActivatedRoute, private router: Router) {
    this.organisationId = localStorage.getItem('cii_organisation_id') || '';
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((para: any) => {
      let RouteData = JSON.parse(atob(para.data));
    });
  }

  public confirmAndDecline(): void {
    // let UserSelectedinfo:any;
    // this.DelegatedService.createDelegatedUser(UserSelectedinfo).subscribe({
    //   next: (roleListResponse: any) => {
    //     this.router.navigateByUrl('buyer-and-both-success');
    //   },
    //   error: (error: any) => {
    //     this.route.navigateByUrl('delegated-error')
    //   },
    // });
    let data = {
      status: 'decline',
    };
    this.router.navigateByUrl(
      'buyer-and-both-success?data=' + btoa(JSON.stringify(data))
    );
  }

  public Back(): void {
    window.history.back();
  }
}
