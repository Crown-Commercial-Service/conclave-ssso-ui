import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
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
  selector: 'app-auto-validation-buyer-success',
  templateUrl: './auto-validation-buyer-success.component.html',
  styleUrls: ['./auto-validation-buyer-success.component.scss'],
  animations: [
    slideAnimation({
      close: { transform: 'translateX(12.5rem)' },
      open: { left: '-12.5rem' },
    }),
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutoValidationBuyerSuccessComponent implements OnDestroy {
  public org: any;
  public org$!: Observable<any>;
  public changes: any;
  public organisationService: OrganisationService;

  constructor(
    private cf: ChangeDetectorRef,
    organisationService: OrganisationService,
    private wrapperOrgService: WrapperOrganisationService,
    private router: Router,
    private route: ActivatedRoute,
    protected uiStore: Store<UIState>,
    protected scrollHelper: ScrollHelper
  ) {
    this.organisationService = organisationService;
    this.route.params.subscribe((params) => {
      if (params.id) {
        this.org$ = this.organisationService.getById(params.id).pipe(share());
        this.org$.subscribe({
          next: (data) => {
            this.org = data;
            this.changes = JSON.parse(
              localStorage.getItem(`mse_org_${this.org.ciiOrganisationId}`) + ''
            );
            if (!this.changes) {
              this.router.navigateByUrl('home');
              return;
            }
          },
        });
      }
    });
  }
  ngOnDestroy(): void {
    localStorage.removeItem('defaultRole');
    localStorage.removeItem(`mse_org_${this.org.ciiOrganisationId}`);
  }

  public onBackClick() {
    localStorage.removeItem(`mse_org_${this.org.ciiOrganisationId}`);
    this.router.navigateByUrl(
      'update-org-type/confirm/' + this.org.ciiOrganisationId
    );
  }
}
