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

@Component({
  selector: 'app-confirm-org-type',
  templateUrl: './confirm-org-type.component.html',
  styleUrls: ['./confirm-org-type.component.scss'],
  animations: [
    slideAnimation({
      close: { transform: 'translateX(12.5rem)' },
      open: { left: '-12.5rem' },
    }),
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmOrgTypeComponent extends BaseComponent {
  public org: any;
  public org$!: Observable<any>;
  public changes: any;
  public routeData: any = {};
  constructor(
    private cf: ChangeDetectorRef,
    private organisationService: OrganisationService,
    private wrapperOrgService: WrapperOrganisationService,
    private router: Router,
    private route: ActivatedRoute,
    protected uiStore: Store<UIState>,
    protected viewportScroller: ViewportScroller,
    protected scrollHelper: ScrollHelper
  ) {
    super(uiStore, viewportScroller, scrollHelper);
    this.route.queryParams.subscribe((params) => {
      this.routeData = JSON.parse(atob(params.data));
      if (this.routeData.ciiOrganisationId) {
        this.org$ = this.organisationService
          .getById(this.routeData.ciiOrganisationId)
          .pipe(share());
        this.org$.subscribe({
          next: (data) => {
            this.org = data;
            this.changes = JSON.parse(
              localStorage.getItem(`mse_org_${this.org.ciiOrganisationId}`) + ''
            );
            console.log('this.changes', this.changes);
          },
        });
      }
    });
  }

  public onSubmitClick() {
    const model = {
      orgType: parseInt(this.changes.orgType),
      rolesToDelete: this.changes.toDelete,
      rolesToAdd: this.changes.toAdd,
      rolesToAutoValid: this.changes.toAutoValid,
      companyHouseId: this.routeData.companyHouseId,
    };

    this.wrapperOrgService
      .updateOrgRoles(
        this.org.ciiOrganisationId,
        JSON.stringify(model),
        'validation/auto/switch'
      )
      .toPromise()
      .then(() => {
        this.router.navigateByUrl(
          `update-org-type/buyer-success/${this.org.ciiOrganisationId}`
        );
      })
      .catch((error) => {
        console.log(error);
        this.router.navigateByUrl(`buyer/error`);
      });
  }

  public onCancelClick() {
    this.router.navigateByUrl('buyer/search');
  }

  public onBackClick() {
    if (this.org && this.org.ciiOrganisationId) {
      localStorage.removeItem(`mse_org_${this.org.ciiOrganisationId}`);
      let data = {
        companyHouseId: this.routeData.companyHouseId,
        Id: this.org.ciiOrganisationId,
      };
      this.router.navigateByUrl(
        'update-org-type/confirm?data=' + btoa(JSON.stringify(data))
      );
    }
  }
}
