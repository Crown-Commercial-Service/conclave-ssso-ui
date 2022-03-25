import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { BaseComponent } from 'src/app/components/base/base.component';
import { UIState } from 'src/app/store/ui.states';
import { ciiService } from 'src/app/services/cii/cii.service';
import { TokenService } from 'src/app/services/auth/token.service';
import { WrapperOrganisationService } from 'src/app/services/wrapper/wrapper-org-service';
import { WrapperOrganisationGroupService } from 'src/app/services/wrapper/wrapper-org--group-service';
import { IdentityProvider, IdentityProviderSummary } from 'src/app/models/identityProvider';
import { WrapperConfigurationService } from 'src/app/services/wrapper/wrapper-configuration.service';
import { WrapperOrganisationContactService } from 'src/app/services/wrapper/wrapper-org-contact-service';
import { ContactGridInfo } from 'src/app/models/contactInfo';
import { WrapperOrganisationSiteService } from 'src/app/services/wrapper/wrapper-org-site-service';
import { OrganisationSite, SiteGridInfo } from 'src/app/models/site';
import { ContactHelper } from 'src/app/services/helper/contact-helper.service';
import { ViewportScroller } from '@angular/common';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { environment } from 'src/environments/environment';
import { OrganisationDto } from 'src/app/models/organisation';
import { CiiAdditionalIdentifier, CiiOrgIdentifiersDto } from 'src/app/models/org';

@Component({
    selector: 'app-manage-organisation-profile',
    templateUrl: './manage-organisation-profile.component.html',
    styleUrls: ['./manage-organisation-profile.component.scss']
})
export class ManageOrganisationProfileComponent extends BaseComponent implements OnInit {

    org: OrganisationDto;
    ciiOrganisationId: string;
    contactData: ContactGridInfo[];
    siteData: SiteGridInfo[];
    registries: CiiOrgIdentifiersDto;
    additionalIdentifiers: CiiAdditionalIdentifier[];
    contactTableHeaders = ['CONTACT_REASON', 'NAME', 'EMAIL', 'TELEPHONE_NUMBER','MOBILE_NUMBER', 'FAX', 'WEB_URL'];
    contactColumnsToDisplay = ['contactReason', 'name', 'email', 'phoneNumber','mobileNumber', 'fax', 'webUrl'];
    siteTableHeaders = ['SITE_NAME', 'STREET_ADDRESS', 'POSTAL_CODE', 'COUNTRY_CODE'];
    siteColumnsToDisplay = ['siteName', 'streetAddress', 'postalCode', 'countryCode'];
    registriesTableDisplayedColumns: string[] = ['authority', 'id', 'type', 'actions'];
    organisation: any;
    public idps: any;
    public orgIdps: any[] = [];
    changedIdpList: { id: number, enabled: boolean, connectionName: string, name: string }[] = [];
    ccsContactUrl : string = environment.uri.ccsContactUrl;
    schemeData: any[] = [];
    public detailsData: any = [
        'Send messages to multiple contacts in your organisation. You can also send targeted communications to specific users.',
        "Manage information about your organisation's specific business locations. For instance, you can add details about your head office and additional sites to organise deliveries.",
        'Save the information you used to register your organisation for instance your Companies House Number or Dun & Bradstreet Number.',
    ];

    constructor(private organisationService: WrapperOrganisationService, private ciiService: ciiService,
        private configWrapperService: WrapperConfigurationService, private router: Router, private contactHelper: ContactHelper,
        protected uiStore: Store<UIState>, private readonly tokenService: TokenService, private organisationGroupService: WrapperOrganisationGroupService,
        private orgContactService: WrapperOrganisationContactService, private wrapperOrgSiteService: WrapperOrganisationSiteService,
        protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper) {
        super(uiStore, viewportScroller, scrollHelper);
        this.contactData = [];
        this.siteData = [];
        this.registries = {};
        this.additionalIdentifiers = [];
        this.ciiOrganisationId = localStorage.getItem('cii_organisation_id') || '';
        this.org = {};
    }

    async ngOnInit() {
        let tempData: IdentityProvider[] = []
        const ciiOrgId = this.tokenService.getCiiOrgId();
        this.schemeData = await this.ciiService.getSchemes().toPromise() as any[];
        var org = await this.organisationService.getOrganisation(this.ciiOrganisationId).toPromise().catch(e => {
        });
        if (org) {
            this.org = org;
            this.idps = await this.configWrapperService.getIdentityProviders().toPromise().catch();
            this.orgIdps = await this.organisationGroupService.getOrganisationIdentityProviders(ciiOrgId).toPromise().catch();

            this.idps.forEach((idp: any) => {
                this.orgIdps.forEach((element: any) => {
                    if (idp.connectionName == element.connectionName) {
                        idp.enabled = true;
                    }
                });
            });

            await this.orgContactService.getOrganisationContacts(this.ciiOrganisationId).toPromise().then(orgContactListInfo => {
                if (orgContactListInfo != null) {
                    this.contactData = this.contactHelper.getContactGridInfoList(orgContactListInfo.contactPoints);
                    console.log("this.contactData",this.contactData)
                }
            }).catch(e => {
            });


            await this.ciiService.getOrgDetails(ciiOrgId).toPromise().then((data: any) => {
                localStorage.setItem('cii_registries', JSON.stringify(data));
                this.registries = data;
                this.additionalIdentifiers = data.additionalIdentifiers;
            }).catch(e => {
            });

            await this.wrapperOrgSiteService.getOrganisationSites(this.ciiOrganisationId).toPromise().then(orgContactListInfo => {

                if (orgContactListInfo != null) {
                    this.siteData = orgContactListInfo.sites.map((site: OrganisationSite) => {
                        let siteGridInfo: SiteGridInfo = {
                            siteId: site.details.siteId,
                            siteName: site.siteName,
                            streetAddress: site.address.streetAddress,
                            postalCode: site.address.postalCode,
                            countryCode: site.address.countryCode,
                            countryName:site.address.countryName,
                            locality: site.address.locality,
                            region: site.address.region,
                        };
                        return siteGridInfo;
                    });
                }
            }).catch(e => {
            });
        }
        this.idps.map((f: IdentityProvider) => {
            if (f.name === 'User ID and password') {
                tempData.push(f)
            }
        })
        this.idps = tempData
    }

    public onContactAddClick() {
        let data = {
            'isEdit': false,
            'contactId': 0
        };
        this.router.navigateByUrl('manage-org/profile/contact-edit?data=' + JSON.stringify(data));
    }

    public onContactEditClick(contactDetail: ContactGridInfo) {
        let data = {
            'isEdit': true,
            'contactId': contactDetail.contactId
        };
        this.router.navigateByUrl('manage-org/profile/contact-edit?data=' + JSON.stringify(data));
    }

    public onSiteAddClick() {
        let data = {
            'isEdit': false,
            'siteId': 0
        };
        this.router.navigateByUrl('manage-org/profile/site/edit?data=' + JSON.stringify(data));
    }

    public onSiteEditClick(orgSite: SiteGridInfo) {
        let data = {
            'isEdit': true,
            'siteId': orgSite.siteId
        };
        this.router.navigateByUrl('manage-org/profile/site/edit?data=' + JSON.stringify(data));
    }

    public onRegistryAddClick() {
        this.router.navigateByUrl(`manage-org/profile/${this.ciiOrganisationId}/registry/search`);
    }

    public onRegistryEditClick(row: any) {
        this.router.navigateByUrl(`manage-org/profile/${this.ciiOrganisationId}/registry/${row.scheme}/${row.id}`);
    }

    public onRegistryRemoveClick(row: any) {
        this.router.navigateByUrl(`manage-org/profile/${this.ciiOrganisationId}/registry/delete/${row.scheme}/${row.id}`);
    }

    public onIdentityProviderChange(e: any, row: any) {
        var dataIndex = this.changedIdpList.map(function (item) { return item.id; }).indexOf(row.id);
        if (dataIndex > -1) {
            this.changedIdpList.splice(dataIndex, 1);
        }
        else {
            this.changedIdpList.push({ id: row.id, enabled: e.target.checked, name: row.name, connectionName: row.connectionName });
        }
    }

    public onSaveChanges() {
        const ciiOrgId = this.tokenService.getCiiOrgId();
        let identityProviderSummary: IdentityProviderSummary = {
            ciiOrganisationId: ciiOrgId,
            changedOrgIdentityProviders: this.changedIdpList
        }
        this.organisationGroupService.enableIdentityProvider(identityProviderSummary).subscribe(data => {
            this.router.navigateByUrl(`manage-org/profile/success`);
        });

    }

    public onCancel() {
        this.router.navigateByUrl(`home`);
    }

    public getSchemaName(schema: string): string {
        let selecedScheme = this.schemeData.find(s => s.scheme === schema);
        return selecedScheme?.schemeName;
    }

    public onContactAssignClick() {
        let data = {
          'assigningOrgId': this.ciiOrganisationId
        };
        this.router.navigateByUrl('contact-assign/select?data=' + JSON.stringify(data));
      }

}
