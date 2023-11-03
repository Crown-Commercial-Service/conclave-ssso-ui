import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
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
import { ContactGridInfo, ContactGridInfoWithLink } from 'src/app/models/contactInfo';
import { WrapperOrganisationSiteService } from 'src/app/services/wrapper/wrapper-org-site-service';
import { OrganisationSite, SiteGridInfo, SiteGridInfoWithLink } from 'src/app/models/site';
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
    contactData: ContactGridInfoWithLink[];
    siteData: SiteGridInfoWithLink[];
    registries: CiiOrgIdentifiersDto;
    contactAddAnother: any;
    additionalIdentifiers: CiiAdditionalIdentifier[];
    contactTableHeaders = ['CONTACT_REASON', 'NAME', 'EMAIL', 'TELEPHONE_NUMBER', 'MOBILE_NUMBER', 'FAX', 'WEB_URL'];
    contactColumnsToDisplay = ['contactReason', 'name', 'email', 'phoneNumber', 'mobileNumber', 'fax', 'webUrl'];
    siteTableHeaders = ['SITE_NAME', 'STREET_ADDRESS', 'POSTAL_CODE', 'COUNTRY_CODE'];
    siteColumnsToDisplay = ['siteName', 'streetAddress', 'postalCode', 'countryCode'];
    registriesTableDisplayedColumns: string[] = ['authority', 'id', 'type', 'actions'];
    organisation: any;
    public idps: any = [];
    public orgIdps: any[] = [];
    changedIdpList: { id: number, enabled: boolean, connectionName: string, name: string }[] = [];
    ccsContactUrl: string = environment.uri.ccsContactUrl;
    schemeData: any[] = [];
    public idpStatus = environment.appSetting.hideIDP
    public detailsData: any = [
        'Send messages to multiple contacts in your organisation. You can also send targeted communications to specific users.',
        "Manage information about your organisation's specific business locations. For instance, you can add details about your head office and additional sites to organise deliveries.",
        'Save the information you used to register your organisation for instance your Companies House Number or Dun & Bradstreet Number.',
    ];
    submitted: boolean = false;
    @ViewChildren('input') inputs!: QueryList<ElementRef>;
    pponSchema: string = 'GB-PPG';
    selectedOption:string = "";
    originalSelectedOption : string = "";
    isMfaOptionChanged : boolean = false;
    



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
        const ciiOrgId = this.tokenService.getCiiOrgId();
        this.schemeData = await this.ciiService.getSchemes().toPromise() as any[];
        var org = await this.organisationService.getOrganisation(this.ciiOrganisationId).toPromise().catch(e => {
        });
        if (org) {
            this.org = org;
            if (this.org.detail?.isMfaRequired)
            {
                this.selectedOption = "required"
            }
            else 
            {
                this.selectedOption = "optional"
            }
            this.originalSelectedOption = this.selectedOption;
            this.idps = await this.configWrapperService.getIdentityProviders().toPromise().catch();
            this.orgIdps = await this.organisationGroupService.getOrganisationIdentityProviders(ciiOrgId).toPromise().catch();
            this.idps = this.idps.filter((x : IdentityProvider) => x.connectionName != 'none');

            this.idps.forEach((idp: any,index: any, arr: any) => {
                this.orgIdps.forEach((element: any) => {
                    if (idp.connectionName == element.connectionName) {
                        idp.enabled = true;
                    }
                });
            });

            await this.orgContactService.getOrganisationContacts(this.ciiOrganisationId).toPromise().then(orgContactListInfo => {
                if (orgContactListInfo != null) {
                    this.contactData = this.contactHelper.getContactGridInfoListWithLink(orgContactListInfo.contactPoints);
                }
                if (orgContactListInfo.contactPoints && orgContactListInfo.contactPoints.length > 0) {
                    this.contactAddAnother = true;
                  } else {
                    this.contactAddAnother = false;
                  }
            }).catch(e => {
            });


            await this.ciiService.getOrgDetails(ciiOrgId).toPromise().then((data: any) => {
                localStorage.setItem('cii_registries', JSON.stringify(data));
                this.registries = data;
                data.additionalIdentifiers.forEach((Identifier:any)=>{
                 if(Identifier.scheme != this.pponSchema){
                    this.additionalIdentifiers.push(Identifier)
                  }   
                })
            }).catch(e => {
            });

            await this.wrapperOrgSiteService.getOrganisationSites(this.ciiOrganisationId).toPromise().then(orgContactListInfo => {

                if (orgContactListInfo != null) {
                    this.siteData = orgContactListInfo.sites.map((site: OrganisationSite) => {
                        let data = {
                            'isEdit': true,
                            'siteId': site.details.siteId
                        };
                        let queryParams =
                            {data: JSON.stringify(data)}
                    
                        let siteGridInfo: SiteGridInfoWithLink = {
                            siteId: site.details.siteId,
                            siteName: site.siteName,
                            streetAddress: site.address.streetAddress,
                            postalCode: site.address.postalCode,
                            countryCode: site.address.countryCode,
                            countryName: site.address.countryName,
                            locality: site.address.locality,
                            region: site.address.region,
                            routeLink : `/manage-org/profile/site/edit`,
                            routeData: queryParams
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
            'contactId': 0,
            'contactAddAnother': this.contactAddAnother
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

    public generateRegistryRemoveRoute(row: any): string {
        return `/manage-org/profile/${this.ciiOrganisationId}/registry/delete/${row.scheme}/${row.id}`;
      }

    public onIdentityProviderChange(e: any, row: any) {
        var selectedItem = this.idps.find((x: any) => x.id === row.id);
        if (selectedItem) {
            selectedItem.enabled = e.target.checked;
        }

        var dataIndex = this.changedIdpList.map(function (item) { return item.id; }).indexOf(row.id);
        if (dataIndex > -1) {
            this.changedIdpList.splice(dataIndex, 1);
        }
        else {
            this.changedIdpList.push({ id: row.id, enabled: e.target.checked, name: row.name, connectionName: row.connectionName });
        }
    }

    get isIdpChanged(): boolean {
        return this.changedIdpList.length > 0;
    }

    get isValid(): boolean {
        return this.idps.find((x: any) => x.enabled === true) ? true : false;
    }
    public onRadioChange ()
    {
        this.isMfaOptionChanged = false;
       if (this.selectedOption != this.originalSelectedOption)
       {
            this.isMfaOptionChanged = true;
       }
    }

    public onSaveChanges() {
        this.submitted = true;
        const ciiOrgId = this.tokenService.getCiiOrgId();
        var isMfaRequired = false;
        let identityProviderSummary: IdentityProviderSummary = {
            ciiOrganisationId: ciiOrgId,
            changedOrgIdentityProviders: this.changedIdpList
        }
        if (this.selectedOption == "required")
        {
            isMfaRequired = true
        }
        if (!this.isIdpChanged && !this.isMfaOptionChanged || !this.isValid) {
            this.setFocus();
            return;
        }
        if (this.isIdpChanged && !this.isMfaOptionChanged)
        {
                  
            this.organisationGroupService.enableIdentityProvider(identityProviderSummary).subscribe(data => {
                        this.router.navigateByUrl(`manage-org/profile/success`);
                    });

        }
        else if (!this.isIdpChanged && this.isMfaOptionChanged )
        {
            this.organisationService.updateOrganisationMfaSettings(ciiOrgId,isMfaRequired).subscribe(data =>{
            this.router.navigateByUrl('manage-org-mfa-update-success?data='+JSON.stringify(this.selectedOption));
            });


        }
        else if (this.isIdpChanged && this.isMfaOptionChanged)
        {
            this.performApiCalls(identityProviderSummary,ciiOrgId,isMfaRequired);
           
        }

    }

    setFocus() {
        this.inputs.toArray().find(x => x.nativeElement.id = 'orgRoleControl_1')?.nativeElement.focus();
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
  public  async  performApiCalls(identityProviderSummary:any,ciiOrgId:string,isMfaRequired:boolean) {
        try {
          const idpResponse = await this.organisationGroupService.enableIdentityProvider(identityProviderSummary).toPromise();
          const mfaResponse = await this.organisationService.updateOrganisationMfaSettings(ciiOrgId, isMfaRequired).toPromise();
      
          if (idpResponse && mfaResponse) {
            this.router.navigateByUrl('manage-org-mfa-update-success?data=' + JSON.stringify(this.selectedOption));
          } else {
            console.log('One or more API calls failed.');
          }
        } catch (error) {

          console.log('An error occurred during API calls:', error);
        }
      }

}