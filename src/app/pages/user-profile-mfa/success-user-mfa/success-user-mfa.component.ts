import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataLayerService } from 'src/app/shared/data-layer.service';

@Component({
  selector: 'app-success-user-mfa',
  templateUrl: './success-user-mfa.component.html',
  styleUrls: ['./success-user-mfa.component.scss']
})
export class SuccessUserMfaComponent implements OnInit {
  public decodedData: any = {};
  public sendError: boolean=false
  isOrgAdmin: boolean = false;

  constructor(private route: ActivatedRoute, private router: Router, private dataLayerService: DataLayerService) { }

  ngOnInit(): void {
    this.isOrgAdmin = JSON.parse(localStorage.getItem('isOrgAdmin') || 'false');
    this.route.queryParams.subscribe((para:any)=>{
      if(para.data){
        let RouteData = JSON.parse(atob(para.data));
        this.decodedData=RouteData
      }else if(para.error){
        this.sendError=true
      }
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
