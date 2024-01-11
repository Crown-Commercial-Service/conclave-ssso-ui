import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';

import { BaseComponent } from 'src/app/components/base/base.component';
import { slideAnimation } from 'src/app/animations/slide.animation';
import { UIState } from 'src/app/store/ui.states';
import { ViewportScroller } from '@angular/common';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { environment } from 'src/environments/environment';
import { DataLayerService } from 'src/app/shared/data-layer.service';

@Component({
  selector: 'app-manage-organisation-registration-rightToBuy',
  templateUrl: './manage-organisation-registration-type.component.html',
  styleUrls: ['./manage-organisation-registration-type.component.scss'],
  animations: [
    slideAnimation({
      close: { 'transform': 'translateX(12.5rem)' },
      open: { left: '-12.5rem' }
    })
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManageOrgRegRightToBuyComponent extends BaseComponent {
  public isCustomMfaEnabled=environment.appSetting.customMfaEnabled;
  defaultChoice: string = "supplier";
  public formId : string = 'Register_organisation Organisation_type';

  constructor(public router: Router, protected uiStore: Store<UIState>, protected viewportScroller: ViewportScroller,
    protected scrollHelper: ScrollHelper, private dataLayerService: DataLayerService) {
    super(uiStore, viewportScroller, scrollHelper);
  }

  ngOnInit() {
    this.dataLayerService.pushPageViewEvent();
    this.dataLayerService.pushFormStartOnInitEvent(this.formId);
  }

  public onBackClick() {
    window.history.back();
    // this.router.navigateByUrl('manage-org/register/newreg'); 
  }

  public onSubmit(buttonText:string) {
    localStorage.setItem("manage-org_reg_type", this.defaultChoice);
    let regType = localStorage.getItem("manage-org_reg_type") + '';
    this.dataLayerService.pushFormSubmitEvent(this.formId);
    if (regType !== 'supplier') {
      this.router.navigateByUrl('manage-org/register/buyer-type');
    } else {
      //this.router.navigateByUrl(`manage-org/register/start`);
      this.router.navigateByUrl(`manage-org/register/search`);
    }
    this.dataLayerService.pushClickEvent(buttonText);
  }
}
