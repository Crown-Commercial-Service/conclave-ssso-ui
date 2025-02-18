import { ViewportScroller } from "@angular/common";
import { Component, ElementRef, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { BaseComponent } from "src/app/components/base/base.component";
import { ScrollHelper } from "src/app/services/helper/scroll-helper.services";
import { OrganisationService } from "src/app/services/postgres/organisation.service";
import { DataLayerService } from "src/app/shared/data-layer.service";
import { SessionService } from "src/app/shared/session.service";
import { DetailsToggleService } from "src/app/shared/shared-details-toggle.service";
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
    public linkText : string = 'Administrator Setup - Help content'
    
    constructor(public router: Router, protected uiStore: Store<UIState>,
        protected viewportScroller: ViewportScroller,private sessionService:SessionService, protected scrollHelper: ScrollHelper, private dataLayerService: DataLayerService,  private elementRef: ElementRef,
        private detailsToggleService : DetailsToggleService) {
        super(uiStore, viewportScroller, scrollHelper);
    }

    ngOnInit() {
        this.dataLayerService.pushPageViewEvent();
    }

    ngAfterViewInit() {
        const detailsElement = this.elementRef.nativeElement.querySelector('details');
    
        this.detailsToggleService.addToggleListener(detailsElement, (isOpen: boolean) => {
          if (isOpen) {
            this.dataLayerService.pushEvent({
              event: "accordion_use",
              interaction_type: "open",
              link_text: this.linkText
            })
          } else {
            this.dataLayerService.pushEvent({
              event: "accordion_use",
              interaction_type: "close",
              link_text: this.linkText
            })
          }
        });
       
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
    ngOnDestroy() {
        const detailsElement = this.elementRef.nativeElement.querySelector('details');
        this.detailsToggleService.removeToggleListener(detailsElement);
      }

}