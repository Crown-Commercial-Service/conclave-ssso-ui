import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ManualValidationStatus } from 'src/app/constants/enum';
import { WrapperBuyerBothService } from 'src/app/services/wrapper/wrapper-buyer-both.service';
import { DataLayerService } from 'src/app/shared/data-layer.service';
import { SessionService } from 'src/app/shared/session.service';

@Component({
  selector: 'app-remove-right-to-buy',
  templateUrl: './remove-right-to-buy.component.html',
  styleUrls: ['./remove-right-to-buy.component.scss']
})
export class RemoveRightToBuyComponent implements OnInit {

  constructor(private sessionService:SessionService,private router:Router,private route: ActivatedRoute,private wrapperBuyerAndBothService:WrapperBuyerBothService, private dataLayerService: DataLayerService) { }
  public routeDetails:any = {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(async (para: any) => {
      this.routeDetails = JSON.parse(atob(para.data));
    })
    this.dataLayerService.pushPageViewEvent();
  }

 public Back():void {
    window.history.back();
    this.pushDataLayerEvent();
  }

  public confirm(){
    let data = {
      status: 'remove',
      orgName: this.routeDetails.orgName
    };
    this.wrapperBuyerAndBothService.manualValidation(this.routeDetails.id, ManualValidationStatus.remove).subscribe({
      next: (response: any) => {
        this.router.navigateByUrl(
          'remove-right-to-buy-success?data=' + btoa(JSON.stringify(data))
        );
      },
      error: (error: any) => {
        this.router.navigateByUrl('buyer-and-both-fail');
      },
    });
    this.pushDataLayerEvent();
  }

  pushDataLayerEvent() {
    this.dataLayerService.pushEvent({ 
      event: "cta_button_click" ,
      page_location: "Remove right to buy status"
    });
  }
}
