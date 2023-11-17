import { ViewportScroller } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { timeout } from 'rxjs/operators';
import { slideAnimation } from 'src/app/animations/slide.animation';

import { BaseComponent } from 'src/app/components/base/base.component';
import { Data } from 'src/app/models/data';
import { dataService } from 'src/app/services/data/data.service';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { DataLayerService } from 'src/app/shared/data-layer.service';
import { SharedDataService } from 'src/app/shared/shared-data.service';
import { UIState } from 'src/app/store/ui.states';

@Component({
  selector: 'app-manage-organisation-registration-step-1',
  templateUrl: './manage-organisation-registration-step-1.component.html',
  styleUrls: ['./manage-organisation-registration-step-1.component.scss'],
  animations: [
    slideAnimation({
      close: { transform: 'translateX(12.5rem)' },
      open: { left: '-12.5rem' },
    }),
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageOrgRegStep1Component
  extends BaseComponent
  implements OnInit
{
  schemeDetails = [
    {
      name: 'Companies House registered number',
      id: 'GB-COH',
    },
    {
      name: 'Dun and Bradstreet number',
      id: 'US-DUN',
    },
    {
      name: 'Charity Commission for England and Wales number',
      id: 'GB-CHC',
    },
    {
      name: 'Office of The Scottish Charity Regulator (OSCR) number',
      id: 'GB-SC',
    },
    {
      name: 'The Charity Commission for Northern Ireland number',
      id: 'GB-NIC',
    },
    {
      name: 'National Health Service Organisations Registry number',
      id: 'GB-NHS',
    },
    {
      name: 'Department for Education Unique Reference Number (URN)',
      id: 'GB-EDU',
    },
  ];

  constructor(
    private dataService: dataService,
    private router: Router,
    protected uiStore: Store<UIState>,
    protected viewportScroller: ViewportScroller,
    protected scrollHelper: ScrollHelper,
    private SharedDataService:SharedDataService,
    private dataLayerService: DataLayerService
  ) {
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
    this.router.navigateByUrl(`manage-org/register/initial-search`);
  }

    /**
   * checking whether scheme should show or not
   * @param item getting scheme from html
   * @returns returning boolean true or false
   */
    public checkShowStatus(item:any){
      return this.SharedDataService.checkBlockedSchemeText(item)
     }
}
