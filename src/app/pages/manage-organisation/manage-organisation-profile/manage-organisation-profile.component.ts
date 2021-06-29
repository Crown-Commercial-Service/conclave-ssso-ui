import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { slideAnimation } from 'src/app/animations/slide.animation';
import { BaseComponent } from 'src/app/components/base/base.component';
import { UIState } from 'src/app/store/ui.states';
import { Organisation } from 'src/app/models/organisation';
import { ContactDetails, Address, ContactType } from 'src/app/models/contactDetail';
import { contactService } from 'src/app/services/contact/contact.service';
import { OrganisationService } from 'src/app/services/postgres/organisation.service';
import { ciiService } from 'src/app/services/cii/cii.service';
import { WrapperUserService } from 'src/app/services/wrapper/wrapper-user.service';
import { User } from 'src/app/models/user';
import { TokenService } from 'src/app/services/auth/token.service';
import { WebsiteService } from 'src/app/services/postgres/website.service';
import { WrapperOrganisationService } from 'src/app/services/wrapper/wrapper-org-service';
import { Role } from 'src/app/models/organisationGroup';
import { WrapperOrganisationGroupService } from 'src/app/services/wrapper/wrapper-org--group-service';
import { share } from 'rxjs/operators';
import { IdentityProvider, IdentityProviderSummary } from 'src/app/models/identityProvider';
import { WrapperConfigurationService } from 'src/app/services/wrapper/wrapper-configuration.service';
import { WrapperOrganisationContactService } from 'src/app/services/wrapper/wrapper-org-contact-service';
import { ContactGridInfo, OrganisationContactInfoList } from 'src/app/models/contactInfo';
import { WrapperOrganisationSiteService } from 'src/app/services/wrapper/wrapper-org-site-service';
import { OrganisationSite, OrganisationSiteInfoList, SiteGridInfo } from 'src/app/models/site';
import { ContactHelper } from 'src/app/services/helper/contact-helper.service';
import { ViewportScroller } from '@angular/common';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { FormGroup } from '@angular/forms';
import { CiiDto } from 'src/app/models/org';

@Component({
    selector: 'app-manage-organisation-profile',
    templateUrl: './manage-organisation-profile.component.html',
    styleUrls: ['./manage-organisation-profile.component.scss']
})
export class ManageOrganisationProfileComponent extends BaseComponent implements OnInit {

    org: any;
    organisationId!: number;
    ciiOrganisationId: string;
    contactData: ContactGridInfo[];
    organisationAddress: Address;
    siteData: SiteGridInfo[];
    registries: any[];
    additionalIdentifiers: any[];
    contactTableHeaders = ['CONTACT_REASON', 'NAME', 'EMAIL', 'TELEPHONE_NUMBER'];
    contactColumnsToDisplay = ['contactReason', 'name', 'email', 'phoneNumber'];
    siteTableHeaders = ['SITE_NAME', 'STREET_ADDRESS', 'POSTAL_CODE', 'COUNTRY_CODE'];
    siteColumnsToDisplay = ['siteName', 'streetAddress', 'postalCode', 'countryCode'];
    registriesTableDisplayedColumns: string[] = ['authority', 'id', 'type', 'actions'];
    organisation: any;
    public idps: any;
    public orgIdps: any[] = [];
    changedIdpList: { id: number, enabled: boolean, connectionName: string, name: string }[] = [];

    constructor(private contactService: contactService, private websiteService: WebsiteService,
        private organisationService: OrganisationService, private ciiService: ciiService,
        private configWrapperService: WrapperConfigurationService, private wrapperService: WrapperUserService,
        private router: Router, private route: ActivatedRoute, private contactHelper: ContactHelper,
        protected uiStore: Store<UIState>, private readonly tokenService: TokenService,
        private organisationGroupService: WrapperOrganisationGroupService,
        private orgContactService: WrapperOrganisationContactService,
        private wrapperOrgSiteService: WrapperOrganisationSiteService, protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper) {
        super(uiStore, viewportScroller, scrollHelper);
        this.contactData = [];
        this.organisationAddress = {};
        this.siteData = [];
        this.registries = [];
        this.additionalIdentifiers = [];
        this.ciiOrganisationId = localStorage.getItem('cii_organisation_id') || '';
    }

    async ngOnInit() {
        const ciiOrgId = this.tokenService.getCiiOrgId();

        var org = await this.organisationService.getById(ciiOrgId).toPromise().catch(e => {
        });
        if (org) {
            this.organisationId = org.organisationId;
            this.organisationAddress = org.address;
            this.org = org;
            this.idps = await this.configWrapperService.getIdentityProviders().toPromise().catch();
            this.orgIdps = await this.organisationGroupService.getOrganisationIdentityProviders(ciiOrgId).toPromise().catch();

            this.idps.forEach((idp: any) => {
                // console.log(element);
                // idp.enabled = true;
                this.orgIdps.forEach((element: any) => {
                    if (idp.connectionName == element.connectionName) {
                        idp.enabled = true;
                    }
                });
            });

            // this.organisation$ = this.organisationService.getById(this.organisationId);
            localStorage.setItem('organisation_id', this.organisationId + '');
            await this.contactService.getContacts(org.organisationId).toPromise().then(data => {
                if (data && data.length > 0) {
                    var orgContact = data.find(c => c.contactType == ContactType.Organisation);
                    if (orgContact && orgContact.address) {
                        this.organisationAddress = orgContact.address;
                    }
                }
            }).catch(e => {
            });

            await this.orgContactService.getOrganisationContacts(this.ciiOrganisationId).toPromise().then(orgContactListInfo => {
                if (orgContactListInfo != null) {
                    this.contactData = this.contactHelper.getContactGridInfoList(orgContactListInfo.contactPoints);
                }
            }).catch(e => {
            });


            await this.ciiService.getOrgs(ciiOrgId).toPromise().then((data: any) => {
                localStorage.setItem('cii_registries', JSON.stringify(data));
                this.registries = data;
                this.additionalIdentifiers = data[0].additionalIdentifiers;
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
                            locality: site.address.locality,
                            region: site.address.region,
                        };
                        return siteGridInfo;
                    });
                }
            }).catch(e => {
            });
        }
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
        this.router.navigateByUrl(`manage-org/profile/${this.organisationId}/registry/search`);
    }

    public onRegistryEditClick(row: any) {
        this.router.navigateByUrl(`manage-org/profile/${this.organisationId}/registry/${row.scheme}/${row.id}`);
    }

    public onRegistryRemoveClick(row: any) {
        this.router.navigateByUrl(`manage-org/profile/${this.organisationId}/registry/delete/${row.scheme}/${row.id}`);
    }

    public onIdentityProviderChange(e: any, row: any) {
        // const accesstoken = this.tokenService.getDecodedAccessToken();
        // this.organisationGroupService.enableIdentityProvider(accesstoken.ciiOrgId, row.connectionName, !row.enabled).subscribe(data => {

        // });
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

    public isPrimary(row: any): boolean {
        if (!this.registries) return true;
        let index = this.registries.indexOf(row);
        if (index === -1) {
            return false;
        }
        if (index >= 1) {
            return false;
        }
        return true;
    }

    public getSchemaName(schema: string): string {
        switch (schema) {
            case 'GB-COH': {
                return 'Companies House';
            }
            case 'US-DUN': {
                return 'Dun & Bradstreet';
            }
            case 'GB-CHC': {
                return 'Charities Commission for England and Wales';
            }
            case 'GB-SC': {
                return 'Scottish Charities Commission';
            }
            case 'GB-NIC': {
                return 'Northern Ireland Charities Commission';
            }
            default: {
                return '';
            }
        }
    }

}
