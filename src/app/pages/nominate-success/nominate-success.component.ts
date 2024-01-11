import { ViewportScroller } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { BaseComponent } from 'src/app/components/base/base.component';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { DataLayerService } from 'src/app/shared/data-layer.service';
import { SharedDataService } from 'src/app/shared/shared-data.service';
import { UIState } from 'src/app/store/ui.states';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-nominate-success',
  templateUrl: './nominate-success.component.html',
  styleUrls: ['./nominate-success.component.scss'],
})
export class NominateSuccessComponent extends BaseComponent implements OnDestroy
{
  private subscription: Subscription | undefined;
  public emailAddress: any;
  public pageAccessMode:any;
  public isCustomMfaEnabled=environment.appSetting.customMfaEnabled;
  constructor(
    private route: ActivatedRoute,
    private dataService: SharedDataService,
    protected uiStore: Store<UIState>,
    protected viewportScroller: ViewportScroller,
    protected scrollHelper: ScrollHelper,
    private ActivatedRoute: ActivatedRoute,
    private router: Router,
    private dataLayerService: DataLayerService
  ) {
    super(uiStore, viewportScroller, scrollHelper);
    this.dataService.NominiData.subscribe((data) => {
      if (data) {
        sessionStorage.setItem('emailAddress', data);
        this.emailAddress = sessionStorage.getItem('emailAddress');
      } else {
        this.emailAddress = sessionStorage.getItem('emailAddress');
      }
    });
    this.ActivatedRoute.queryParams.subscribe((para: any) => {
      this.pageAccessMode = JSON.parse(atob(para.data));
    });
  }

  ngOnInit() {
    this.dataLayerService.pushPageViewEvent();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  public goToNominate(){
    this.router.navigateByUrl(`/nominate?data=` + btoa(JSON.stringify(this.pageAccessMode)));
  }
  

  public goConfirmOrgPage():void{
    const schemeDetails = JSON.parse(localStorage.getItem('schemeDetails') || '');
    this.router.navigateByUrl(
      `manage-org/register/search/${schemeDetails.scheme}?id=${encodeURIComponent(
        schemeDetails.schemeID
      )}`
    );
  }
}
