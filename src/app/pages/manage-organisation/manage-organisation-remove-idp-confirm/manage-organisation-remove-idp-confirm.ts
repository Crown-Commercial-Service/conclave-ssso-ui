import { Component } from "@angular/core";
import { OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { BaseComponent } from "src/app/components/base/base.component";
import { UIState } from "src/app/store/ui.states";
import { slideAnimation } from "src/app/animations/slide.animation";
import { ActivatedRoute, Router } from "@angular/router";
import { ScrollHelper } from "src/app/services/helper/scroll-helper.services";
import { ViewportScroller } from "@angular/common";
import { IdentityProviderSummary } from "src/app/models/identityProvider";
import { TokenService } from "src/app/services/auth/token.service";
import { WrapperOrganisationGroupService } from "src/app/services/wrapper/wrapper-org--group-service";
import { OrganisationService } from "src/app/services/postgres/organisation.service";
import { DataLayerService } from "src/app/shared/data-layer.service";

@Component({
    selector: 'app-manage-user-delete-confirm',
    templateUrl: 'manage-organisation-remove-idp-confirm.html',
    styleUrls: ['manage-organisation-remove-idp-confirm.scss'],
    animations: [
        slideAnimation({
            close: { 'transform': 'translateX(12.5rem)' },
            open: { left: '-12.5rem' }
        })
    ]
})
export class ManageOrganisationRemoveIdpConfirmComponent extends BaseComponent implements OnInit {

    changedIdpList: { id: number, enabled: boolean, connectionName: string, name: string }[] = [];
    idpNames: string = '';
    affectedUsers: number = 0;

    constructor(protected uiStore: Store<UIState>, public router: Router, public organisationGroupService: WrapperOrganisationGroupService,
        public organisationService: OrganisationService, private readonly tokenService: TokenService, private activatedRoute: ActivatedRoute,
        protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper, private dataLayerService: DataLayerService) {

        super(uiStore, viewportScroller, scrollHelper);
        let queryParams = this.activatedRoute.snapshot.queryParams;
        if (queryParams.data) {
            this.changedIdpList = JSON.parse(atob(queryParams.data));
        }
    }

    ngOnInit() {
        const ciiOrgId = this.tokenService.getCiiOrgId();
        this.idpNames = this.changedIdpList.filter(x => x.enabled === false).map(x => x.name).join(', ');
        const idpIds = this.changedIdpList.filter(x => x.enabled === false).map(x => x.id);
        this.organisationService.getUserAffectedByRemovedIdps(ciiOrgId, idpIds).subscribe(data => {
            this.affectedUsers = data;
        });
        this.dataLayerService.pushPageViewEvent();
    }

    onRemoveIdpConfirmClick(buttonText:string) {
        const ciiOrgId = this.tokenService.getCiiOrgId();

        let identityProviderSummary: IdentityProviderSummary = {
            ciiOrganisationId: ciiOrgId,
            changedOrgIdentityProviders: this.changedIdpList
        }
        this.organisationGroupService.enableIdentityProvider(identityProviderSummary).subscribe(data => {
            this.router.navigateByUrl(`manage-org/profile/success`);
        });
        this.pushDataLayerEvent(buttonText);
    }

    onCancelClick(buttonText:string) {
        this.router.navigateByUrl('/manage-org/profile');
        this.pushDataLayerEvent(buttonText);
    }

    pushDataLayerEvent(buttonText:string) {
		this.dataLayerService.pushClickEvent(buttonText)
	  }
}