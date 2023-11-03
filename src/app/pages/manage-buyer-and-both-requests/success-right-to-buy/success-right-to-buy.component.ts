import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataLayerService } from 'src/app/shared/data-layer.service';

@Component({
  selector: 'app-success-right-to-buy',
  templateUrl: './success-right-to-buy.component.html',
  styleUrls: ['./success-right-to-buy.component.scss']
})
export class SuccessRightToBuyComponent implements OnInit {

  constructor(private router:Router,private route: ActivatedRoute, private dataLayerService: DataLayerService) { }
  
  public routeDetails:any = {}
  ngOnInit(): void {
    this.route.queryParams.subscribe(async (para: any) => {
      this.routeDetails = JSON.parse(atob(para.data));
    })
    this.router.events.subscribe(value => {
      this.dataLayerService.pushEvent({ 
          event: "page_view" ,
          page_location: this.router.url.toString(),
          user_name: localStorage.getItem("user_name"),
          cii_organisataion_id: localStorage.getItem("cii_organisation_id"),
      });
    })
  }

}
