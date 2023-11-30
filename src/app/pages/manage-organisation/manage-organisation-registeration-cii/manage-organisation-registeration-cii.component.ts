import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataLayerService } from 'src/app/shared/data-layer.service';
import { SessionService } from 'src/app/shared/session.service';
import { environment } from "src/environments/environment";

@Component({
  selector: 'app-manage-organisation-registeration-cii',
  templateUrl: './manage-organisation-registeration-cii.component.html',
  styleUrls: ['./manage-organisation-registeration-cii.component.scss']
})
export class ManageOrganisationRegisterationCiiComponent implements OnInit {
  public buyerFlow:any
  public isCustomMfaEnabled=environment.appSetting.customMfaEnabled
  constructor(private router: Router, private dataLayerService: DataLayerService,private sessionService:SessionService) {
   this.buyerFlow = localStorage.getItem('organisation_type') ?? '';
   }

  ngOnInit(): void {
    this.router.events.subscribe(value => {
      this.dataLayerService.pushEvent({ 
       event: "page_view" ,
       page_location: this.router.url.toString(),
       user_name: this.sessionService.decrypt('user_name'),
       cii_organisataion_id: localStorage.getItem("cii_organisation_id"),
     });
    })
  }

}
