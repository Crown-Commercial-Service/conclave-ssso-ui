import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';

import { BaseComponent } from 'src/app/components/base/base.component';
import { UIState } from 'src/app/store/ui.states';
import { ciiService } from 'src/app/services/cii/cii.service';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { ViewportScroller } from '@angular/common';
import { WrapperOrganisationService } from 'src/app/services/wrapper/wrapper-org-service';
import { CiiAdditionalIdentifier, CiiOrgIdentifiersDto } from 'src/app/models/org';
import { environment } from 'src/environments/environment';
import { SharedDataService } from 'src/app/shared/shared-data.service';
import { DataLayerService } from 'src/app/shared/data-layer.service';

@Component({
  selector: 'app-buyer-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class BuyerDetailsComponent extends BaseComponent implements OnInit {

  public org: any;
  public registries: CiiOrgIdentifiersDto;
  public additionalIdentifiers?: CiiAdditionalIdentifier[];
  public selectedOrgId: string = '';
  public schemeData: any[] = [];
  public registriesTableDetails = {
    headerText : ["Registry","ID",""],
    data : [{
      name:'',
      id:'',
      legalName:'',
      type:''
    } ]
  }
  constructor(private ciiService: ciiService, private organisationService: WrapperOrganisationService,private SharedDataService:SharedDataService,
    private router: Router, private route: ActivatedRoute, protected uiStore: Store<UIState>, protected viewportScroller: ViewportScroller,
    protected scrollHelper: ScrollHelper, private dataLayerService: DataLayerService) {
    super(uiStore, viewportScroller, scrollHelper);
    this.registries = {};
  }

  async ngOnInit() {
    this.route.params.subscribe(async params => {
      if (params.id) {
        this.selectedOrgId = params.id;
        this.schemeData = await this.ciiService.getSchemes().toPromise() as any[];
        this.org = await this.organisationService.getOrganisation(params.id).toPromise();
        // Passing true to get hidden identifier for manage services eligibility page
        this.registries = await this.ciiService.getOrgDetails(params.id, true).toPromise();
        if (this.registries != undefined) {
          this.additionalIdentifiers = this.registries?.additionalIdentifiers;
        }
        this.setRegistriesTableDetails()
      }
    });
    this.router.events.subscribe(value => {
      this.dataLayerService.pushEvent({ 
          event: "page_view" ,
          page_location: this.router.url.toString(),
          user_name: localStorage.getItem("user_name"),
          cii_organisataion_id: localStorage.getItem("cii_organisation_id"),
          id: this.selectedOrgId
      });
    })
  }

 public setRegistriesTableDetails(){
  this.registriesTableDetails.data.forEach((f)=>{
    f.name = this.getSchemaName(this.registries.identifier?.scheme)
    f.id = this.registries.identifier?.id
    f.type = 'Primary',
    f.legalName = ''
  })

  this.additionalIdentifiers?.forEach(((f)=>{
    let data = {
      name : this.getSchemaName(f.scheme),
      id : this.getId(f.id, f.scheme),
      type : '',
      legalName : '',
    }
    this.registriesTableDetails.data.push(data)
  }))
 }

  public getSchemaName(schema: any): string {
    let selecedScheme = this.schemeData.find(s => s.scheme === schema);    
    if (schema === 'GB-CCS') {
      return 'Internal Identifier';
    }
    else if(selecedScheme?.schemeName) {
      return selecedScheme?.schemeName;
    }
    else {
      return '';
    }
  }

  public getId(id:string, schema: string): string {
    return this.SharedDataService.getId(id,schema)
   }

  public convertIdToHyphenId(id:string): string {    
  return this.SharedDataService.convertIdToHyphenId(id)
  }

  public onContinueClick() {
    if(environment.appSetting.hideAutoValidation){
     this.router.navigateByUrl(`buyer/confirm/${this.selectedOrgId}`);
    }
    else if (environment.appSetting.hideSimplifyRole) {
      let data = {
        companyHouseId:this.registries.identifier?.id,
        Id:this.selectedOrgId
      }
      this.router.navigateByUrl('update-org-type/confirm?data=' + btoa(JSON.stringify(data)));

    } else {
      let data = {
        companyHouseId:this.registries.identifier?.id,
        Id:this.selectedOrgId
      }
      this.router.navigateByUrl('update-org-services/confirm?data=' + btoa(JSON.stringify(data)));
    }
    this.pushDataLayerEvent();
  }

  public onCancelClick() {
    this.router.navigateByUrl('buyer-supplier/search');
    this.pushDataLayerEvent();
  }

  pushDataLayerEvent() {
    this.dataLayerService.pushEvent({ 
      event: "cta_button_click" ,
      page_location: "Review - Manage Buyers"
    });
  }
}
