import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { DataLayerService } from 'src/app/shared/data-layer.service';

@Component({
  selector: 'app-buyer-both-requests-success',
  templateUrl: './buyer-both-requests-success.component.html',
  styleUrls: ['./buyer-both-requests-success.component.scss'],
})
export class BuyerBothRequestsSuccessComponent implements OnInit {
  public routeDetails: any = {};
  constructor(
    public route: ActivatedRoute,
    private router: Router,
    private titleService: Title,
    private dataLayerService: DataLayerService
  ) {
    this.route.queryParams.subscribe((para: any) => {
      this.routeDetails = JSON.parse(atob(para.data));
      switch (this.routeDetails.status) {
        case 'accept': {
          this.titleService.setTitle(
            `Accept right to buy status – success - CCS`
          );
          break;
        }
        case 'decline': {
          this.titleService.setTitle(
            `Decline right to buy status – success - CCS`
          );
          break;
        }
        default: {
          //statements;
          break;
        }
      }
    });
  }

  ngOnInit(): void {
    this.dataLayerService.pushPageViewEvent();
  }

  public returnToRequests() {
    this.router.navigateByUrl('manage-buyer-both');
  }

  public returnToDashBoard() {
    this.router.navigateByUrl('home');
  }
}
