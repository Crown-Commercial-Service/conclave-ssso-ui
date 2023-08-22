import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { share } from 'rxjs/operators';

import { BaseComponent } from 'src/app/components/base/base.component';
import { slideAnimation } from 'src/app/animations/slide.animation';
import { UIState } from 'src/app/store/ui.states';
import { ciiService } from 'src/app/services/cii/cii.service';
import { User } from 'src/app/models/user';
import { TokenService } from 'src/app/services/auth/token.service';
import { ViewportScroller } from '@angular/common';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { CiiOrgIdentifiersDto } from 'src/app/models/org';

@Component({
  selector: 'app-manage-organisation-profile-registry-confirm',
  templateUrl: './manage-organisation-profile-registry-confirm.component.html',
  styleUrls: ['./manage-organisation-profile-registry-confirm.component.scss'],
  animations: [
    slideAnimation({
      close: { 'transform': 'translateX(12.5rem)' },
      open: { left: '-12.5rem' }
    })
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManageOrganisationRegistryConfirmComponent extends BaseComponent implements OnInit {

  public item$!: Observable<any>;
  public detailValidityOption: string = 'CorrectOrganisation';
  public schemeName: string = '';
  public selectedIdentifiers: any[] = new Array();
  public routeParams!: any;
  public organisationId: string;
  public user!: User;
  id!: string;

  constructor(private ciiService: ciiService, private router: Router, private route: ActivatedRoute, protected uiStore: Store<UIState>,
    private readonly tokenService: TokenService, protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper) {
    super(uiStore, viewportScroller, scrollHelper);
    this.organisationId = localStorage.getItem('cii_organisation_id') || '';
    let queryParams = this.route.snapshot.queryParams;
    this.id = queryParams?.id || '';
  }

  ngOnInit() {
    this.router.navigateByUrl(`manage-org/profile/${this.organisationId}/registry/error/ciidown`);
    this.schemeName = localStorage.getItem('scheme_name') ?? '';
    this.route.params.subscribe(params => {
      this.routeParams = params;
      if (this.id && params.scheme) {
        const ciiOrgId = this.tokenService.getCiiOrgId();
        this.item$ = this.ciiService.getOrganisationIdentifierDetails(ciiOrgId, params.scheme, this.id).pipe(share());
        this.item$.subscribe({
          next: result => {
            if (this.isExistsInCurrentRegistration(result.identifier.id)) {
              this.router.navigateByUrl(`manage-org/profile/${this.organisationId}/registry/error/exists`);
            }
          },
          error: err => {
            if (err.status == '404') {
              this.router.navigateByUrl(`manage-org/profile/${this.organisationId}/registry/error/notfound`);
            } else if (err.status == '409') {
              this.router.navigateByUrl(`manage-org/profile/${this.organisationId}/registry/error/existsInConclave`);
            } else if (err.status == '503') {
              this.router.navigateByUrl(`manage-org/profile/${this.organisationId}/registry/error/ciidown`);
            }
            else {
              this.router.navigateByUrl(`manage-org/profile/${this.organisationId}/registry/error/generic`);
            }
          }
        });
      }
    });
  }

  public onSubmit() {
    if (this.detailValidityOption === 'CorrectOrganisation') {
      this.ciiService.addRegistry(this.organisationId, this.routeParams.scheme, this.id).subscribe((data) => {
        this.router.navigateByUrl('manage-org/profile/' + this.organisationId + '/registry/confirmation/' + this.routeParams.scheme + '/' + this.id);
      },
        (error) => {
          console.log(error);
        });
    } else if (this.detailValidityOption === 'WrongAddress') {
      this.router.navigateByUrl(`manage-org/profile/${this.organisationId}/registry/search/wrong-details`);
    } else {
      this.router.navigateByUrl(`manage-org/profile/${this.organisationId}/registry/search/not-my-org`);
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

  // CII service doesn't provide this validation and we have to do our own
  isExistsInCurrentRegistration(identifier: string): boolean {
    const registry: CiiOrgIdentifiersDto = JSON.parse(localStorage.getItem('cii_registries') + '');
    if (registry && (registry.identifier?.id === identifier ||
      registry.additionalIdentifiers?.some((additionalIdentifier) => additionalIdentifier.id === identifier))) {
      return true;
    }
    return false;
  }

}
