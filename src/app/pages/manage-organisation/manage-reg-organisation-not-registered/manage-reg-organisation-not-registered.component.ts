import { ViewportScroller } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { BaseComponent } from "src/app/components/base/base.component";
import { ScrollHelper } from "src/app/services/helper/scroll-helper.services";
import { OrganisationService } from "src/app/services/postgres/organisation.service";
import { DataLayerService } from "src/app/shared/data-layer.service";
import { SessionService } from "src/app/shared/session.service";
import { UIState } from "src/app/store/ui.states";
import { environment } from "src/environments/environment";

@Component({
    selector: 'app-manage-reg-organisation-not-registered',
    templateUrl: './manage-reg-organisation-not-registered.component.html',
    styleUrls: ['./manage-reg-organisation-not-registered.component.scss']
})

export class ManageOrgRegNotRegisteredComponent extends BaseComponent {

    adminSelectionMode : string = 'useradmin';
    contactUrl = environment.uri.ccsContactUrl;
    
    constructor(public router: Router, protected uiStore: Store<UIState>,
        protected viewportScroller: ViewportScroller,private sessionService:SessionService, protected scrollHelper: ScrollHelper, private dataLayerService: DataLayerService) {
        super(uiStore, viewportScroller, scrollHelper);
    }

    ngOnInit() {
        this.dataLayerService.pushPageViewEvent();
    }

    public onContinueNotRegistered() {
        this.router.navigateByUrl(`manage-org/register/newreg`);
    }
    
    onContinueClick(buttonText: string){
        switch (this.adminSelectionMode){
            case "useradmin":{
                this.router.navigateByUrl(environment.appSetting.customMfaEnabled
                    ? 'manage-reg-organisation-mfa'
                    : 'manage-org/register/type'
                  );
                break
            }
            case "nominateadmin":{
                this.router.navigateByUrl(`/nominate?data=` + btoa(JSON.stringify(1)));
                break
            }
            case "unkownadmin":{
                this.router.navigateByUrl(`manage-org/register/find-your-administrator`);
                break
            }
        }

        this.dataLayerService.pushClickEvent(buttonText)
    }

    goBack() {
        window.history.back();
    }

}