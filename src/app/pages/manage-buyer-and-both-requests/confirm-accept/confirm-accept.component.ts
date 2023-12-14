import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ManualValidationStatus } from 'src/app/constants/enum';
import { WrapperBuyerBothService } from 'src/app/services/wrapper/wrapper-buyer-both.service';
import { DataLayerService } from 'src/app/shared/data-layer.service';
import { SessionService } from 'src/app/shared/session.service';

@Component({
  selector: 'app-confirm-accept',
  templateUrl: './confirm-accept.component.html',
  styleUrls: ['./confirm-accept.component.scss']
})
export class ConfirmAcceptComponent implements OnInit {

  private organisationId: string;
  public routeDetails:any;

  constructor(private route: ActivatedRoute, private router: Router, private sessionService:SessionService,
    private wrapperBuyerAndBothService:WrapperBuyerBothService, private dataLayerService: DataLayerService) {
    this.organisationId = localStorage.getItem('cii_organisation_id') || '';
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((para: any) => {
      this.routeDetails = JSON.parse(atob(para.data));
    });
    this.router.events.subscribe(value => {
      this.dataLayerService.pushEvent({ 
          event: "page_view" ,
          page_location: this.router.url.toString(),
          user_name: this.sessionService.decrypt('user_name'),
          cii_organisataion_id: localStorage.getItem("cii_organisation_id"),
      });
    })
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
    this.pushDataLayerEvent();
  }

  public Back(): void {
    window.history.back();
    this.pushDataLayerEvent();
  }

  pushDataLayerEvent() {
    this.dataLayerService.pushEvent({ 
      event: "cta_button_click" ,
      page_location: "Approve right to buy status"
    });
  }

}
