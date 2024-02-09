import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { from, Observable, throwError } from 'rxjs';
import { catchError, map, share, timeout } from 'rxjs/operators';

import { BaseComponent } from 'src/app/components/base/base.component';
import { slideAnimation } from 'src/app/animations/slide.animation';
import { Scheme } from '../../../models/scheme';
import { UIState } from 'src/app/store/ui.states';
import { ciiService } from 'src/app/services/cii/cii.service';
import { WrapperUserService } from 'src/app/services/wrapper/wrapper-user.service';
import { User } from 'src/app/models/user';
import { TokenService } from 'src/app/services/auth/token.service';
import { ViewportScroller } from '@angular/common';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { DataLayerService } from 'src/app/shared/data-layer.service';
import { SessionService } from 'src/app/shared/session.service';

@Component({
  selector: 'app-manage-organisation-profile-registry-confirm-additional-identifiers',
  templateUrl: './manage-organisation-profile-registry-confirm-additional-identifiers.component.html',
  styleUrls: ['./manage-organisation-profile-registry-confirm-additional-identifiers.component.scss'],
  animations: [
    slideAnimation({
      close: { 'transform': 'translateX(12.5rem)' },
      open: { left: '-12.5rem' }
    })
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManageOrganisationRegistryConfirmAdditionalDetailsComponent extends BaseComponent implements OnInit {

  public item$!: Observable<any>;
  public orgGroup: string = 'manage-org/register/user';
  public schemeName: string = '';
  public selectedIdentifiers: any[] = new Array();
  public routeParams!: any;
  public organisationId!: string;
  public user!: User;
  public orgId!: string;

  constructor(private ciiService: ciiService,private sessionService:SessionService, private wrapperService: WrapperUserService, private router: Router, private route: ActivatedRoute, protected uiStore: Store<UIState>, private readonly tokenService: TokenService, protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper, private dataLayerService: DataLayerService) {
    super(uiStore, viewportScroller, scrollHelper);
    this.organisationId = JSON.parse(localStorage.getItem('organisation_id') + '');
    this.orgId = JSON.parse(localStorage.getItem('organisation_id') + '');
  }

  ngOnInit() {
    this.schemeName = localStorage.getItem('scheme_name') ?? '';
    this.route.params.subscribe(params => {
      this.routeParams = params;
      if (params.id && params.scheme) {

        const ciiOrgId = this.tokenService.getCiiOrgId();
        this.item$ = this.ciiService.getOrganisationIdentifierDetails(ciiOrgId, params.scheme, params.id).pipe(share());
        this.item$.subscribe({
          next: result => {
            if (result.error) {
              if (result.message == 'Error 400') {
                this.router.navigateByUrl(`manage-org/register/error/notfound`);
              } else if (result.message == 'Error 401') {
                this.router.navigateByUrl(`manage-org/register/error/generic`);
              } else if (result.message == 'Error 403') {
                this.router.navigateByUrl(`manage-org/register/error/generic`);
              } else if (result.message == 'Error 404') {
                this.router.navigateByUrl(`manage-org/register/error/notfound`);
              } else if (result.message == 'Error 405') {
                this.router.navigateByUrl(`manage-org/register/error`);
              } else {
                this.router.navigateByUrl(`manage-org/register/error/generic`);
              }
            } else {
              // this.selectedIdentifiers = result.additionalIdentifiers;
              this.selectedIdentifiers = [...result.additionalIdentifiers];
              // Object.assign(result.additionalIdentifiers, this.selectedIdentifiers);
              localStorage.setItem('cii_organisation', JSON.stringify(result));
            }
          }, error: err => {
            if (err.status) {
              if (err.status == '400' || err.status == '404') {
                this.router.navigateByUrl(`manage-org/profile/${this.organisationId}/registry/error/notfound`, { replaceUrl: true });
              }
              else if (err.status == '405') {
                this.router.navigateByUrl(`manage-org/profile/${this.organisationId}/registry/error/`, { replaceUrl: true });
              } else {
                this.router.navigateByUrl(`manage-org/profile/${this.organisationId}/registry/error/generic`, { replaceUrl: true });
              }
            }
            // this.router.navigateByUrl(`manage-org/register/error/generic`);
          }
        });
      }
    });
    
    this.dataLayerService.pushPageViewEvent({
      scheme: this.routeParams.scheme,
       id: this.routeParams.id,
       organisationId: this.routeParams.this.organisationId,
    });
  }

  public goBack(buttonText:string) {
    this.router.navigateByUrl('manage-org/profile/' + this.organisationId + '/registry/search/' + this.routeParams.scheme + '/' + this.routeParams.id);
    this.pushDataLayerEvent(buttonText);
  }

  public onSubmit(buttonText:string) {
    let organisation = JSON.parse(localStorage.getItem('cii_organisation') + '');
    organisation.additionalIdentifiers = this.selectedIdentifiers;
    localStorage.setItem('cii_organisation', JSON.stringify(organisation));
    this.ciiService.addRegistry(this.organisationId, this.routeParams.scheme, this.routeParams.id).subscribe((data) => {
      this.router.navigateByUrl('manage-org/profile/' + this.organisationId + '/registry/confirmation/' + this.routeParams.scheme + '/' + this.routeParams.id);
    },
      (error) => {
        console.log(error);
      });
      this.pushDataLayerEvent(buttonText);
  }

  pushDataLayerEvent(buttonText:string) {
		this.dataLayerService.pushClickEvent(buttonText)
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
  }

  public getSchemaName(schema: string): string {
    switch (schema) {
      case 'GB-COH': {
        return 'Companies House';
      }
      case 'US-DUN': {
        return 'Dun & Bradstreet';
      }
      case 'GB-CHC': {
        return 'Charities Commission for England and Wales';
      }
      case 'GB-SC': {
        return 'Scottish Charities Commission';
      }
      case 'GB-NIC': {
        return 'Northern Ireland Charities Commission';
      }
      default: {
        return '';
      }
    }
  }

}
