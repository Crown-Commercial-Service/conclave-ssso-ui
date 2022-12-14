import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ManualValidationStatus } from 'src/app/constants/enum';
import { WrapperBuyerBothService } from 'src/app/services/wrapper/wrapper-buyer-both.service';

@Component({
  selector: 'app-confirm-accept',
  templateUrl: './confirm-accept.component.html',
  styleUrls: ['./confirm-accept.component.scss']
})
export class ConfirmAcceptComponent implements OnInit {

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

  public confirm(): void {
    this.wrapperBuyerAndBothService.manualValidation(this.routeDetails.organisationId, ManualValidationStatus.approve).subscribe({
      next: (response: any) => {
        this.router.navigateByUrl('buyer-and-both-success');
      },
      error: (error: any) => {
        this.router.navigateByUrl('buyer-and-both-fail');
      },
    });
    let data = {
      status: 'accept',
      organisationId: this.routeDetails.organisationId,
      organisationName: this.routeDetails.organisationName
    };
    this.router.navigateByUrl(
      'buyer-and-both-success?data=' + btoa(JSON.stringify(data))
    );
  }

  public Back(): void {
    window.history.back();
  }

}
