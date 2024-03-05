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
import { SessionService } from 'src/app/shared/session.service';

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

  constructor(private ciiService: ciiService, private organisationService: WrapperOrganisationService,private SharedDataService:SharedDataService,
    private router: Router, private route: ActivatedRoute, protected uiStore: Store<UIState>, protected viewportScroller: ViewportScroller,
    protected scrollHelper: ScrollHelper, private dataLayerService: DataLayerService, private sessionService:SessionService) {
    super(uiStore, viewportScroller, scrollHelper);
    this.registries = {};
  }

  async ngOnInit() {
    this.route.params.subscribe(async params => {
      if (params.id) {
        this.selectedOrgId = params.id;
        setTimeout(() => {
        this.getOrgDetails(params.id)
        }, 500);
      }
    });
    this.dataLayerService.pushPageViewEvent({id: this.selectedOrgId});
  }

  public async getOrgDetails(id:any){
    this.org = await this.organisationService.getOrganisation(id).toPromise();

  }

  public convertIdToHyphenId(id:string): string {    
  return this.SharedDataService.convertIdToHyphenId(id)
  }

  public onContinueClick(buttonText:string) {
    if(environment.appSetting.hideAutoValidation){
    //  this.router.navigateByUrl(`buyer/confirm/${this.selectedOrgId}`);
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
    this.pushDataLayerEvent(buttonText);
  }

  public onCancelClick(buttonText:string) {
    this.router.navigateByUrl('buyer-supplier/search');
    this.pushDataLayerEvent(buttonText);
  }

  pushDataLayerEvent(buttonText:string) {
   this.dataLayerService.pushClickEvent(buttonText);
  }
}
