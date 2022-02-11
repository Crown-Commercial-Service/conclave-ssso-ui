import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, map, share, timeout } from 'rxjs/operators';

import { BaseComponent } from 'src/app/components/base/base.component';
import { slideAnimation } from 'src/app/animations/slide.animation';
import { Scheme } from '../../../models/scheme';
import { UIState } from 'src/app/store/ui.states';
import { ciiService } from 'src/app/services/cii/cii.service';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-manage-organisation-registration-step-3',
  templateUrl: './manage-organisation-registration-step-3.component.html',
  styleUrls: ['./manage-organisation-registration-step-3.component.scss'],
  animations: [
    slideAnimation({
      close: { 'transform': 'translateX(12.5rem)' },
      open: { left: '-12.5rem' }
    })
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManageOrgRegStep3Component extends BaseComponent implements OnInit {

  public item$!: Observable<any>;
  public orgGroup: string = 'manage-org/register/user';
  public schemeName: string = '';
  public selectedIdentifiers: any[] = new Array();
  public routeParams!: any;
  id!: string;
  ciiOrgId: string = '';

  constructor(private ciiService: ciiService, private router: Router, private route: ActivatedRoute, protected uiStore: Store<UIState>, protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper) {
    super(uiStore, viewportScroller, scrollHelper);
    let queryParams = this.route.snapshot.queryParams;
    this.id = queryParams?.id || '';
  }

  ngOnInit() {
    this.schemeName = localStorage.getItem('scheme_name') ?? '';
    this.route.params.subscribe(params => {
      this.routeParams = params;
      if (this.id && params.scheme) {
        this.item$ = this.ciiService.getIdentifierDetails(params.scheme, this.id).pipe(share());
        this.item$.subscribe({
          next: result => {
            if (result) {
              this.selectedIdentifiers = result.additionalIdentifiers;
              localStorage.setItem('cii_organisation', JSON.stringify(result));
            }
          },
          error: err => {
            if (err.status == '404') {
              this.router.navigateByUrl(`manage-org/register/error/notfound`);
            } else if (err.status == '409') {
              this.ciiOrgId = err.error.organisationId;
              this.setOrgIdForOrgDetails(this.ciiOrgId);
              window.location.replace('manage-org/register/initial-search-status/exists');
              //this.router.navigateByUrl('manage-org/register/initial-search-status/exists');
            } else {
              this.router.navigateByUrl(`manage-org/register/error/generic`);
            }
          }
        });
      }
    });
  }

  setOrgIdForOrgDetails(ciiOrgId: string) {
    let orgInfoExists = sessionStorage.getItem('orgreginfo') != null;
    let orgReginfo = orgInfoExists ? JSON.parse(sessionStorage.getItem('orgreginfo') || '') : '';
    orgReginfo.ciiOrgId = ciiOrgId;
    sessionStorage.setItem('orgreginfo', JSON.stringify(orgReginfo));
  }

  public onBackClick() {
    this.router.navigateByUrl('manage-org/register/search');
  }

  public onSubmit() {
    if (this.orgGroup === 'manage-org/register/user') {
      let organisation = JSON.parse(localStorage.getItem('cii_organisation') + '');
      if (organisation.additionalIdentifiers.length > 0) {
        this.router.navigateByUrl('manage-org/register/search/' + this.routeParams.scheme + '/' + this.id + '/additional-identifiers');
      } else {
        this.router.navigateByUrl(this.orgGroup);
      }
    } else {
      this.router.navigateByUrl(this.orgGroup);
    }
  }

  public onChange(event: any, additionalIdentifier: any) {
    if (event.currentTarget.checked) {
      this.selectedIdentifiers.push(additionalIdentifier);
    } else {
      for (let i = 0; i < this.selectedIdentifiers.length; i++) {
        if (this.selectedIdentifiers[i].id === additionalIdentifier.id) {
          this.selectedIdentifiers.splice(i, 1);
        }
      }
    }
    let organisation = JSON.parse(localStorage.getItem('cii_organisation') + '');
    organisation.additionalIdentifiers = this.selectedIdentifiers;
    localStorage.setItem('cii_organisation', JSON.stringify(organisation));
  }

}
