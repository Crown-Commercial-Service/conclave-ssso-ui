import { ViewportScroller } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { BaseComponent } from "src/app/components/base/base.component";
import { ScrollHelper } from "src/app/services/helper/scroll-helper.services";
import { DataLayerService } from "src/app/shared/data-layer.service";
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
        protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper,private ActivatedRoute: ActivatedRoute, private router: Router, private dataLayerService: DataLayerService) {
            this.ActivatedRoute.queryParams.subscribe((para: any) => {
                if(para.data != undefined){
                    this.pageAccessMode = JSON.parse(atob(para.data));
                  } else {
                    this.pageAccessMode = null
                  }
              });
    }

    ngOnInit() {
        this.dataLayerService.pushPageViewEvent();
        this.orgName = sessionStorage.getItem('RegExistsingOrgName') || '';
    }

    public back():void{
        window.history.back()
    }
}