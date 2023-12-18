import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WrapperUserDelegatedService } from 'src/app/services/wrapper/wrapper-user-delegated.service';
import { DataLayerService } from 'src/app/shared/data-layer.service';
import { SessionService } from 'src/app/shared/session.service';

@Component({
  selector: 'app-delegated-remove-confirm',
  templateUrl: './delegated-remove-confirm.component.html',
  styleUrls: ['./delegated-remove-confirm.component.scss'],
})
export class DelegatedRemoveConfirmComponent implements OnInit {
  public organisationId: string;
  public RouteData:any = {};
  constructor(private sessionService:SessionService,public router: Router, private route: ActivatedRoute, public DelegatedService: WrapperUserDelegatedService, private dataLayerService: DataLayerService) {
    this.organisationId = localStorage.getItem('cii_organisation_id') || '';
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((para: any) => {
      this.RouteData = JSON.parse(atob(para.data));
      this.RouteData.userName = decodeURIComponent(unescape(this.RouteData.userName));
    });
    this.dataLayerService.pushPageViewEvent();
  }

  public ConfirmRemoveUser(){
    let data ={
      status:'delete',
      userName:this.RouteData.userName
    }
    this.DelegatedService.deleteDelegatedUser(this.RouteData.userName,this.organisationId).subscribe({
      next: (responce: any) => {
      data.userName = escape(encodeURIComponent(data.userName));
      this.router.navigateByUrl('delegated-success?data=' +btoa(JSON.stringify(data)))
      },
      error: (error: any) => { 
      this.router.navigateByUrl('delegated-error')
      }
    });
    this.pushDataLayerEvent();
  }


  public ConfirmResentLink(){
    let data ={
      status:'resent',
      userName:this.RouteData.userName
    }
    this.DelegatedService.resentActivationLink(this.RouteData.userName,this.organisationId).subscribe({
      next: (responce: any) => {
      data.userName = escape(encodeURIComponent(data.userName));
      this.router.navigateByUrl('delegated-success?data=' +btoa(JSON.stringify(data)));
      },
      error: (error: any) => { 
      this.router.navigateByUrl('delegated-error')
      }
    });
    this.pushDataLayerEvent();
  }

  public Cancel():void{
    window.history.back();
    this.pushDataLayerEvent();
  }

  pushDataLayerEvent() {
    this.dataLayerService.pushEvent({ 
      event: "cta_button_click" ,
      page_location: "delegated-remove-confirm"
    });
  }
}
