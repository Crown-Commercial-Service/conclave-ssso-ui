import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-buyer-both-requests-success',
  templateUrl: './buyer-both-requests-success.component.html',
  styleUrls: ['./buyer-both-requests-success.component.scss'],
})
export class BuyerBothRequestsSuccessComponent implements OnInit {
  public routeDetails:any;
  constructor(private route: ActivatedRoute, private router: Router) {
    this.route.queryParams.subscribe((para: any) => {
      this.routeDetails = JSON.parse(atob(para.data));
      console.log("RouteData",this.routeDetails)
    });
  }

  ngOnInit(): void {}

  public returnToRequests() {
    this.router.navigateByUrl('manage-buyer-both');
  }

  public returnToRDashBoard() {
    this.router.navigateByUrl('home');
  }
}
