import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, share, timeout } from 'rxjs/operators';

import { BaseComponent } from 'src/app/components/base/base.component';
import { slideAnimation } from 'src/app/animations/slide.animation';
import { Scheme } from '../../../models/scheme';
import { UIState } from 'src/app/store/ui.states';
import { ciiService } from 'src/app/services/cii/cii.service';
import { ViewportScroller } from '@angular/common';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';

@Component({
    selector: 'app-manage-organisation-profile-registry-search',
    templateUrl: './manage-organisation-profile-registry-search.component.html',
    styleUrls: ['./manage-organisation-profile-registry-search.component.scss'],
    animations: [
        slideAnimation({
            close: { 'transform': 'translateX(12.5rem)' },
            open: { left: '-12.5rem' }
        })
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManageOrganisationRegistrySearchComponent extends BaseComponent implements OnInit {

  public items$!: Observable<any>;
  public scheme!: string;
  public schemeSubject: BehaviorSubject<string> = new BehaviorSubject<string>('GB-COH');
  public schemeSubjectObs: Observable<string> = this.schemeSubject.asObservable();
  public schemeName!: string;
  public txtValue!: string;
  public organisationId!: number;
  submitted: boolean = false;
  public orgId!: string;

  constructor(private ref: ChangeDetectorRef, private ciiService: ciiService, private router: Router, private route: ActivatedRoute, protected uiStore: Store<UIState>, protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper) {
    super(uiStore,viewportScroller,scrollHelper);
    this.organisationId = parseInt(this.route.snapshot.paramMap.get('organisationId') || '0');
    this.txtValue = '';
    this.orgId = JSON.parse(localStorage.getItem('organisation_id') + '');
  }

  ngOnInit() {
    this.items$ = this.ciiService.getSchemes().pipe(share());
    this.items$.subscribe({
      next: result => {
        console.log(result);
          this.scheme = result[0].scheme;
          this.schemeName = result[0].schemeName;
          localStorage.setItem('scheme_name', JSON.stringify(this.schemeName));
      }
    });
  }

  public onSubmit() {
    this.submitted = true;
    if (this.txtValue && this.txtValue.length > 0 && this.isValid()) {
      // localStorage.setItem('scheme_name', JSON.stringify(this.schemeName));
      this.router.navigateByUrl(`manage-org/profile/${this.organisationId}/registry/search/${this.scheme}/${this.txtValue}`);
    }
  }

  public onSelect(item: any) {
    this.schemeSubject.next(item.scheme);
    var el = document.getElementById(item.scheme) as HTMLInputElement;
    if (el) {
      el.checked = true;
    }
    this.scheme = item.scheme;
    this.submitted = false;
    this.txtValue == '';
    localStorage.setItem('scheme', this.scheme);
    localStorage.setItem('scheme_name', JSON.stringify(item.schemeName));
    setTimeout(() => {
      this.ref.detectChanges();
    }, 5000);
  }

  public isValid(): boolean {
    const registries = JSON.parse(localStorage.getItem('cii_registries')+'');
    if (registries) {
      if (Array.isArray(registries) && registries[0]) {
        if (registries[0].identifier && registries[0].identifier.id === this.txtValue) {
          return false;
        }
        if (registries[0].additionalIdentifiers) {
          const match = registries[0].additionalIdentifiers.find((x: { id: string; }) => x.id === this.txtValue);
          if (match) {
            return false;
          }
        }
      } else {
        if (registries.identifier && registries.identifier.id === this.txtValue) {
          return false;
        }
      }
    }
    return true;
  }

}
