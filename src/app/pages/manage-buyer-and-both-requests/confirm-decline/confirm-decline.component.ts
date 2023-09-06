import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ManualValidationStatus } from 'src/app/constants/enum';
import { Role } from 'src/app/models/organisationGroup';
import { WrapperBuyerBothService } from 'src/app/services/wrapper/wrapper-buyer-both.service';
import { WrapperOrganisationGroupService } from 'src/app/services/wrapper/wrapper-org--group-service';
import { WrapperUserDelegatedService } from 'src/app/services/wrapper/wrapper-user-delegated.service';

@Component({
  selector: 'app-confirm-decline',
  templateUrl: './confirm-decline.component.html',
  styleUrls: ['./confirm-decline.component.scss'],
})
export class ConfirmDeclineComponent implements OnInit {
  private organisationId: string;
  public routeDetails:any;

  constructor(private route: ActivatedRoute, private router: Router,
    private wrapperBuyerAndBothService:WrapperBuyerBothService) {
    this.organisationId = localStorage.getItem('cii_organisation_id') || '';
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((para: any) => {
      this.routeDetails = JSON.parse(atob(para.data));
    });
  }

  public confirmAndDecline(): void {
    this.wrapperBuyerAndBothService.manualValidation(this.routeDetails.organisationId, ManualValidationStatus.decline).subscribe({
      next: (response: any) => {
        this.router.navigateByUrl('decline-success');
      },
      error: (error: any) => {
        this.router.navigateByUrl('buyer-and-both-fail');
      },
    });
    let data = {
      status: 'decline',
      organisationId: this.routeDetails.organisationId,
      organisationName: this.routeDetails.organisationName
    };
    this.router.navigateByUrl(
      'decline-success?data=' + btoa(JSON.stringify(data))
    );
  }

  public Back(): void {
    window.history.back();
  }
}
