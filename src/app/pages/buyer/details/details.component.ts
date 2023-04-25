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
  schemeData: any[] = [];

  constructor(private ciiService: ciiService, private organisationService: WrapperOrganisationService,
    private router: Router, private route: ActivatedRoute, protected uiStore: Store<UIState>, protected viewportScroller: ViewportScroller,
    protected scrollHelper: ScrollHelper) {
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
      }
    });
  }

  public getSchemaName(schema: string): string {
    let selecedScheme = this.schemeData.find(s => s.scheme === schema);
    if(selecedScheme?.schemeName) {
      return selecedScheme?.schemeName;
    }
    else if (schema === 'GB-CCS') {
      return 'Internal Identifier';
    }
    else if (schema === 'GB-PPG') {
      return 'Public Procurement Organisation Number';
    }
    else {
      return '';
    }
  }

  public getId(id:string, schema: string): string {
    let selecedScheme = this.schemeData.find(s => s.scheme === schema);
    if(selecedScheme?.schemeName) {
      return id;
    }
    else if (schema === 'GB-PPG') {
      return this.convertIdToHyphenId(id);
    }
    else {
      return id;
    }
  }

  public convertIdToHyphenId(id:string): string {    
    if (id != null)  {
      return [id.slice(0, 3), '-', id.slice(3,6), '-', id.slice(6,9)].join('')
    }
    return id;
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
  }

  public onCancelClick() {
    this.router.navigateByUrl('buyer/search');
  }
}
