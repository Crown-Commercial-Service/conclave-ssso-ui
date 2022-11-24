import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-success-right-to-buy',
  templateUrl: './success-right-to-buy.component.html',
  styleUrls: ['./success-right-to-buy.component.scss']
})
export class SuccessRightToBuyComponent implements OnInit {

  constructor(private router:Router,private route: ActivatedRoute) { }
  
  public routeDetails:any = {}
  ngOnInit(): void {
    this.route.queryParams.subscribe(async (para: any) => {
      this.routeDetails = JSON.parse(atob(para.data));
    })
  }

}
