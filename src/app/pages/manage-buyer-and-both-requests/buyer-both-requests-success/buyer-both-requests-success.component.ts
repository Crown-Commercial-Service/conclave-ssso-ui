import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-buyer-both-requests-success',
  templateUrl: './buyer-both-requests-success.component.html',
  styleUrls: ['./buyer-both-requests-success.component.scss'],
})
export class BuyerBothRequestsSuccessComponent implements OnInit {
  public routeDetails:any;
  constructor(private route: ActivatedRoute, private router: Router, private titleService: Title) {
    this.route.queryParams.subscribe((para: any) => {
      this.routeDetails = JSON.parse(atob(para.data));
      console.log("this.routeDetails",this.routeDetails)
      switch (this.routeDetails.status) {
        case "accept": {
          this.titleService.setTitle(
            `${ 'Accept right to buy status – success' }  - CCS`
          );
          break;
        }
        case 'decline': {
          this.titleService.setTitle(
            `${ 'Decline right to buy status – success' }  - CCS`
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

  ngOnInit(): void {}

  public returnToRequests() {
    this.router.navigateByUrl('manage-buyer-both');
  }

  public returnToDashBoard() {
    this.router.navigateByUrl('home');
  }
}
