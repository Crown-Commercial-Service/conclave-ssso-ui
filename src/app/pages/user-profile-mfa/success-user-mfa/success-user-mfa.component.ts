import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataLayerService } from 'src/app/shared/data-layer.service';
import { SessionService } from 'src/app/shared/session.service';

@Component({
    selector: 'app-success-user-mfa',
    templateUrl: './success-user-mfa.component.html',
    styleUrls: ['./success-user-mfa.component.scss'],
    standalone: false
})
export class SuccessUserMfaComponent implements OnInit {
  public decodedData: any = {};
  public sendError: boolean=false
  isOrgAdmin: boolean = false;

  constructor(private route: ActivatedRoute, private router: Router, private dataLayerService: DataLayerService,private sessionService:SessionService) { }

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
    this.dataLayerService.pushPageViewEvent();
  }
}
