import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';

import { BaseComponent } from 'src/app/components/base/base.component';
import { slideAnimation } from 'src/app/animations/slide.animation';
import { UIState } from 'src/app/store/ui.states';
import { OrganisationService } from 'src/app/services/postgres/organisation.service';
import { Observable } from 'rxjs';
import { share } from 'rxjs/operators';
import { WrapperOrganisationService } from 'src/app/services/wrapper/wrapper-org-service';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { ViewportScroller } from '@angular/common';
import { DataLayerService } from 'src/app/shared/data-layer.service';
import { SessionService } from 'src/app/shared/session.service';

@Component({
  selector: 'app-buyer-confirm-changes',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss'],
  animations: [
    slideAnimation({
      close: { transform: 'translateX(12.5rem)' },
      open: { left: '-12.5rem' },
    }),
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuyerConfirmChangesComponent extends BaseComponent {
  public org: any;
  public org$!: Observable<any>;
  public changes: any;
  private id!: string;

  constructor(
    private cf: ChangeDetectorRef,
    private organisationService: OrganisationService,
    private wrapperOrgService: WrapperOrganisationService,
    public router: Router,
    private route: ActivatedRoute,
    protected uiStore: Store<UIState>,
    protected viewportScroller: ViewportScroller,
    protected scrollHelper: ScrollHelper,
    private dataLayerService: DataLayerService,
    private sessionService:SessionService
  ) {
    super(uiStore, viewportScroller, scrollHelper);
    this.route.params.subscribe((params) => {
      if (params.id) {
        this.id = params.id;
        this.org$ = this.organisationService.getById(params.id).pipe(share());
        this.org$.subscribe({
          next: (data) => {
            this.org = data;
            this.changes = JSON.parse(
              localStorage.getItem(`mse_org_${this.org.ciiOrganisationId}`) + ''
            );
          },
        });
      }
    });
  }

  ngOnInit() {
    this.dataLayerService.pushPageViewEvent({id: this.id});
  }

  pushDataLayerEvent() {
    this.dataLayerService.pushEvent({ 
      event: "cta_button_click" ,
      page_location: "Review - Manage Buyers"
    });
  }

  public onSubmitClick() {
    const model = {
      orgType: parseInt(this.changes.orgType),
      rolesToDelete: this.changes.toDelete,
      rolesToAdd: this.changes.toAdd,
    };
    this.wrapperOrgService
      .updateOrgRoles(
        this.org.ciiOrganisationId,
        JSON.stringify(model),
        'roles'
      )
      .toPromise()
      .then(() => {
        localStorage.removeItem(`mse_org_${this.org.ciiOrganisationId}`);
        this.router.navigateByUrl(`buyer/success`);
      })
      .catch((error) => {
        console.log(error);
        this.router.navigateByUrl(`buyer/error`);
      });
      this.pushDataLayerEvent();
  }

  public onCancelClick() {
    this.router.navigateByUrl('buyer-supplier/search');
  }

  public onBackClick() {
    localStorage.removeItem(`mse_org_${this.org.ciiOrganisationId}`);
    this.router.navigateByUrl('buyer/confirm/' + this.org.ciiOrganisationId);
    this.pushDataLayerEvent();
  }
}
