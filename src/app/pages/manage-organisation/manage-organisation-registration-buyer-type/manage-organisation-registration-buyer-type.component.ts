import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';

import { BaseComponent } from 'src/app/components/base/base.component';
import { slideAnimation } from 'src/app/animations/slide.animation';
import { UIState } from 'src/app/store/ui.states';
import { ViewportScroller } from '@angular/common';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { environment } from 'src/environments/environment';
import { DataLayerService } from 'src/app/shared/data-layer.service';

@Component({
  selector: 'app-manage-organisation-registration-buyer-type',
  templateUrl: './manage-organisation-registration-buyer-type.component.html',
  styleUrls: ['./manage-organisation-registration-buyer-type.component.scss'],
  animations: [
    slideAnimation({
      close: { 'transform': 'translateX(12.5rem)' },
      open: { left: '-12.5rem' }
    })
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManageOrgRegBuyerTypeComponent extends BaseComponent implements OnInit {
  
  public isCustomMfaEnabled=environment.appSetting.customMfaEnabled;
  defaultChoice: string = "Central Government";
  public formId : string = 'Register_organisation Buyer_type';

  constructor(private router: Router, private route: ActivatedRoute, protected uiStore: Store<UIState>,
    protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper, private dataLayerService: DataLayerService) {
    super(uiStore,viewportScroller,scrollHelper);
  }

  ngOnInit() {
    this.dataLayerService.pushPageViewEvent();
    this.dataLayerService.pushFormStartOnInitEvent(this.formId);
  }

  onBack(){
    window.history.back();
  }
  

  public onSubmit() {
    localStorage.setItem("manage-org_buyer_type", this.defaultChoice);
    //this.router.navigateByUrl(`manage-org/register/start`);
    this.dataLayerService.pushFormSubmitEvent(this.formId);
    this.router.navigateByUrl(`manage-org/register/search?data=` + btoa(JSON.stringify(3)));
  }
}
