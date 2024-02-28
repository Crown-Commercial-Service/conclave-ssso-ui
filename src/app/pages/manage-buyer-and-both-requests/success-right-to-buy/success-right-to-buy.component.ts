import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataLayerService } from 'src/app/shared/data-layer.service';
import { SessionService } from 'src/app/shared/session.service';

@Component({
  selector: 'app-success-right-to-buy',
  templateUrl: './success-right-to-buy.component.html',
  styleUrls: ['./success-right-to-buy.component.scss']
})
export class SuccessRightToBuyComponent implements OnInit {

  constructor(private sessionService:SessionService,private router:Router,private route: ActivatedRoute, private dataLayerService: DataLayerService) { }
  
  public routeDetails:any = {}
  ngOnInit(): void {
    this.route.queryParams.subscribe(async (para: any) => {
      this.routeDetails = JSON.parse(decodeURIComponent(atob(para.data)));
    })
    this.dataLayerService.pushPageViewEvent();
  }

}
