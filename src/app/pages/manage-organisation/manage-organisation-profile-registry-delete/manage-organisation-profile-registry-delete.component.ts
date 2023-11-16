import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { share } from 'rxjs/operators';
import { slideAnimation } from 'src/app/animations/slide.animation';

import { BaseComponent } from 'src/app/components/base/base.component';
import { UIState } from 'src/app/store/ui.states';
import { ciiService } from 'src/app/services/cii/cii.service';
import { Observable } from 'rxjs';
import { WrapperUserService } from 'src/app/services/wrapper/wrapper-user.service';
import { UserProfileResponseInfo } from 'src/app/models/user';
import { TokenService } from 'src/app/services/auth/token.service';
import { ViewportScroller } from '@angular/common';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { DataLayerService } from 'src/app/shared/data-layer.service';

@Component({
  selector: 'app-manage-organisation-profile-registry-delete',
  templateUrl: './manage-organisation-profile-registry-delete.component.html',
  styleUrls: ['./manage-organisation-profile-registry-delete.component.scss'],
  animations: [
    slideAnimation({
      close: { 'transform': 'translateX(12.5rem)' },
      open: { left: '-12.5rem' }
    })
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManageOrganisationRegistryDeleteComponent extends BaseComponent implements OnInit {

  public item$!: Observable<any>;
  public organisationId: string;
  public routeParams!: any;

  constructor(private ciiService: ciiService, private wrapperService: WrapperUserService, private router: Router,
    private route: ActivatedRoute, protected uiStore: Store<UIState>, private readonly tokenService: TokenService,
    protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper, private dataLayerService: DataLayerService) {
    super(uiStore, viewportScroller, scrollHelper);
    this.organisationId = JSON.parse(localStorage.getItem('organisation_id') + '');
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.routeParams = params;
      if (params.id && params.scheme) {
        this.item$ = this.ciiService.getOrganisationIdentifierDetails(this.tokenService.getCiiOrgId(), params.scheme, params.id).pipe(share());
      }
    });
    this.router.events.subscribe(value => {
      this.dataLayerService.pushEvent({ 
       event: "page_view" ,
       page_location: this.router.url.toString(),
       user_name: localStorage.getItem("user_name"),
       cii_organisataion_id: localStorage.getItem("cii_organisation_id"),
       organisationId: this.routeParams.this.organisationId,
       scheme: this.routeParams.this.scheme,
       id: this.routeParams.this.id,
     });
    })
  }

  public onSubmit() {
    this.ciiService.deleteRegistry(this.tokenService.getCiiOrgId(), this.routeParams.scheme, this.routeParams.id)
      .subscribe((data) => {
        this.router.navigateByUrl('manage-org/profile/' + this.organisationId + '/registry/delete/confirmation/' + this.routeParams.scheme + '/' + this.routeParams.id);
      }, (error) => {
        console.log(error);
      });
      this.pushDataLayerEvent();
  }

  public goBack() {
    this.router.navigateByUrl('manage-org/profile');
    this.pushDataLayerEvent();
  }

  pushDataLayerEvent() {
		this.dataLayerService.pushEvent({ 
		  event: "cta_button_click" ,
		  page_location: "Remove Registry - Manage Organisation"
		});
	  }
}
