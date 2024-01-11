import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataLayerService } from 'src/app/shared/data-layer.service';
import { environment } from "src/environments/environment";

@Component({
  selector: 'app-manage-organisation-registeration-cii',
  templateUrl: './manage-organisation-registeration-cii.component.html',
  styleUrls: ['./manage-organisation-registeration-cii.component.scss']
})
export class ManageOrganisationRegisterationCiiComponent implements OnInit {
  public buyerFlow:any
  public isCustomMfaEnabled=environment.appSetting.customMfaEnabled
  constructor(private router: Router, private dataLayerService: DataLayerService) {
   this.buyerFlow = localStorage.getItem('organisation_type') ?? '';
   }

  ngOnInit(): void {
    this.dataLayerService.pushPageViewEvent();
  }

}
