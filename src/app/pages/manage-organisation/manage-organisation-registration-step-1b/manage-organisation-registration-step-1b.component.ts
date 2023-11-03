import { ViewportScroller } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { slideAnimation } from 'src/app/animations/slide.animation';
import { BaseComponent } from 'src/app/components/base/base.component';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { DataLayerService } from 'src/app/shared/data-layer.service';
import { UIState } from 'src/app/store/ui.states';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-manage-organisation-registration-step-1b',
  templateUrl: './manage-organisation-registration-step-1b.component.html',
  styleUrls: ['./manage-organisation-registration-step-1b.component.scss'],
  animations: [
    slideAnimation({
      close: { 'transform': 'translateX(12.5rem)' },
      open: { left: '-12.5rem' }
    })
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManageOrgRegStep1BComponent extends BaseComponent implements OnInit {
  ccsContactUrl: string = environment.uri.ccsContactUrl;
  constructor(private router: Router, protected uiStore: Store<UIState>,
    protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper, private dataLayerService: DataLayerService) {
    super(uiStore, viewportScroller, scrollHelper);
  }

  ngOnInit() {
    this.router.events.subscribe(value => {
      this.dataLayerService.pushEvent({ 
       event: "page_view" ,
       page_location: this.router.url.toString(),
       user_name: localStorage.getItem("user_name"),
       cii_organisataion_id: localStorage.getItem("cii_organisation_id"),
     });
    })
   }

  public onClick() {
    this.router.navigateByUrl(`manage-org/register/search`);
  }

  public onBackClick() {
    let regType = localStorage.getItem("manage-org_reg_type") + '';
    if (regType !== 'supplier') {
      this.router.navigateByUrl('manage-org/register/buyer-type');
    } else {
      this.router.navigateByUrl(`manage-org/register/type`);
    }
  }
}