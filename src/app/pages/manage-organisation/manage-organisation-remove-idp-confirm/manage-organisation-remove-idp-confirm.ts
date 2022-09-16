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

    constructor(protected uiStore: Store<UIState>, private router: Router, private organisationGroupService: WrapperOrganisationGroupService,
        private organisationService: OrganisationService, private readonly tokenService: TokenService, private activatedRoute: ActivatedRoute,
        protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper) {

        super(uiStore, viewportScroller, scrollHelper);
        let queryParams = this.activatedRoute.snapshot.queryParams;
        if (queryParams.data) {
            this.changedIdpList = JSON.parse(queryParams.data);
        }
    }

    ngOnInit() {
        const ciiOrgId = this.tokenService.getCiiOrgId();
        this.idpNames = this.changedIdpList.filter(x => x.enabled === false).map(x => x.name).join(', ');
        const idpIds = this.changedIdpList.filter(x => x.enabled === false).map(x => x.id);

        this.organisationService.getUserAffectedByRemovedIdps(ciiOrgId, idpIds).subscribe(data => {
            this.affectedUsers = data;
        });
    }

    onRemoveIdpConfirmClick() {
        const ciiOrgId = this.tokenService.getCiiOrgId();

        let identityProviderSummary: IdentityProviderSummary = {
            ciiOrganisationId: ciiOrgId,
            changedOrgIdentityProviders: this.changedIdpList
        }
        this.organisationGroupService.enableIdentityProvider(identityProviderSummary).subscribe(data => {
            this.router.navigateByUrl(`manage-org/profile/success`);
        });
    }

    onCancelClick() {
        this.router.navigateByUrl('/manage-org/profile');
    }
}