import { ViewportScroller } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { BaseComponent } from "src/app/components/base/base.component";
import { ScrollHelper } from "src/app/services/helper/scroll-helper.services";
import { DataLayerService } from "src/app/shared/data-layer.service";
import { SessionService } from "src/app/shared/session.service";
import { UIState } from "src/app/store/ui.states";
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-manage-org-notify-admin',
    templateUrl: './manage-reg-organisation-admin-notify.component.html',
    styleUrls: ['./manage-reg-organisation-admin-notify.component.scss']
})

export class ManageOrgRegNotifyAdminComponent implements OnInit {

    orgName: string = '';
    public pageAccessMode:any;
    public isCustomMfaEnabled=environment.appSetting.customMfaEnabled;

    constructor(protected uiStore: Store<UIState>,
        protected viewportScroller: ViewportScroller,private sessionService:SessionService, protected scrollHelper: ScrollHelper,private ActivatedRoute: ActivatedRoute, private router: Router, private dataLayerService: DataLayerService) {
            this.ActivatedRoute.queryParams.subscribe((para: any) => {
                if(para.data != undefined){
                    this.pageAccessMode = JSON.parse(atob(para.data));
                  } else {
                    this.pageAccessMode = null
                  }
              });
    }

    ngOnInit() {
        this.router.events.subscribe(value => {
            this.dataLayerService.pushEvent({ 
             event: "page_view" ,
             page_location: this.router.url.toString(),
             user_name: this.sessionService.decrypt('user_name'),
             cii_organisataion_id: localStorage.getItem("cii_organisation_id"),
           });
        })
        this.orgName = sessionStorage.getItem('RegExistsingOrgName') || '';
    }

    public back():void{
        window.history.back()
    }
}