import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation,
  QueryList,
  ViewChild,
  ElementRef,
  ViewChildren,
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
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
import {
  OrganisationSiteInfo,
  OrganisationSiteResponse,
} from 'src/app/models/site';
import { ViewportScroller } from '@angular/common';
import { ReplaySubject, Subject } from 'rxjs';
import { ContryDetails } from 'src/app/models/contryDetails';
import { ConfigurationCore } from 'src/app/services/postgres/configurationcore.service';
import { take, takeUntil } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';
import { MatSelect } from '@angular/material/select';
import { WrapperOrganisationSiteService } from 'src/app/services/wrapper/wrapper-org-site-service';

@Component({
  selector: 'app-manage-organisation-registration-step-3',
  templateUrl: './manage-organisation-registration-step-3.component.html',
  styleUrls: ['./manage-organisation-registration-step-3.component.scss'],
  animations: [
    slideAnimation({
      close: { transform: 'translateX(12.5rem)' },
      open: { left: '-12.5rem' },
    }),
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageOrgRegStep3Component
  extends BaseComponent
  implements OnInit
{
  public item$!: Observable<any>;
  public orgGroup: string = 'manage-org/register/user';
  public schemeName: string = '';
  public selectedIdentifiers: any[] = new Array();
  public routeParams!: any;
  id!: string;
  ciiOrgId: string = '';

  countryDetails: ContryDetails[] = [];
  topCountries: ContryDetails[] = [];
  filteredCountryDetails: ReplaySubject<ContryDetails[]> = new ReplaySubject<
    ContryDetails[]
  >(1);
  public countryCodeCtrl: FormControl = new FormControl();
  public countryCode: string = '';
  protected _onDestroy = new Subject<void>();
   private orgDetails:any;
   public isInvalid:boolean=false
   public pageAccessMode:any;
  @ViewChildren('input') inputs!: QueryList<ElementRef>;
  @ViewChild('singleSelect', { static: true }) singleSelect!: MatSelect;
  @ViewChild('singleSelect')
  matselect!: MatSelect;
  constructor(
    private ciiService: ciiService,
    private router: Router,
    private route: ActivatedRoute,
    protected uiStore: Store<UIState>,
    protected viewportScroller: ViewportScroller,
    protected scrollHelper: ScrollHelper,
    private configurationCore: ConfigurationCore,
    private titleService: Title,
    private orgSiteService: WrapperOrganisationSiteService
  ) {
    super(uiStore, viewportScroller, scrollHelper);
    let queryParams = this.route.snapshot.queryParams;
    this.id = queryParams?.id || '';
    this.pageAccessMode = localStorage.getItem('organisation_type') ?? '';
  }

  async ngOnInit() {
    this.schemeName = localStorage.getItem('scheme_name') ?? '';
    this.route.params.subscribe((params) => {
      this.routeParams = params;
      if (this.id && params.scheme) {
        this.item$ = this.ciiService
          .getIdentifierDetails(params.scheme, this.id)
          .pipe(share());
        this.item$.subscribe({
          next: async (result) => {
            if (result) {
              this.countryCode = result.address.countryCode;
              this.selectedIdentifiers = result.additionalIdentifiers;
              this.orgDetails=result
              this.checkAddressDetailsEmpty(result.address.streetAddress,result.address.postalCode)
              localStorage.setItem('cii_organisation', JSON.stringify(result));
              this.countryDetails = await this.configurationCore
                .getCountryDetails()
                .toPromise();
              this.setTopCountries(false);
              this.filteredCountryDetails.next(this.countryDetails.slice());
              // listen for search field value changes
              this.countryCodeCtrl.valueChanges
                .pipe(takeUntil(this._onDestroy))
                .subscribe(() => {
                  this.filtercountryDetails();
                });
            }
          },
          error: (err) => {
            if (err.status == '404') {
              this.router.navigateByUrl(`manage-org/register/error/notfound`);
            } else if (err.status == '503'){
              this.router.navigateByUrl(`manage-org/register/error/cii`);
            } 
            else if (err.status == '409') {
              this.ciiOrgId = err.error.organisationId;
              this.setOrgIdForOrgDetails(this.ciiOrgId);
              window.location.replace(
                'manage-org/register/initial-search-status/exists'
              ); // location replace is used to avoid being in a loop when click on back button
            } else {
              this.router.navigateByUrl(`manage-org/register/error/generic`);
            }
          },
        });
      }
    });
  }

  ngAfterViewInit() {
    this.setInitialValue();
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
    this.isInvalid=false
  }

  setTopCountries(isClear: boolean) {
    if (!isClear) {
      this.topCountries = this.countryDetails.filter(
        (c) =>
          c.countryName === 'Ireland' ||
          c.countryName === 'United States' ||
          c.countryName === 'United Kingdom'
      );
    } else {
      this.topCountries = [];
    }
  }
  checkAddressDetailsEmpty(streetAddress:string,postalCode:string)
  {
      if(!(streetAddress.trim() !== '' && postalCode.trim() !== ''))
      {
       this.router.navigateByUrl(`manage-org/register/error/address-details`);
      }
    }
  /**
   * Sets the initial value after the filteredCountryDetails are loaded initially
   */
  protected setInitialValue() {
    this.filteredCountryDetails
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        console.log(this.singleSelect);
        // setting the compareWith property to a comparison function
        // triggers initializing the selection according to the initial value of
        // the form control (i.e. _initializeSelection())
        // this needs to be done after the filtercountryDetails are loaded initially
        // and after the mat-option elements are available
        this.singleSelect.compareWith = (a: ContryDetails, b: ContryDetails) =>
          a && b && a.id === b.id;
        console.log('setInitialValue2');
      });
  }

  protected filtercountryDetails() {
    if (!this.countryDetails) {
      return;
    }
    // get the search keyword
    let search = this.countryCodeCtrl.value;
    if (!search) {
      this.filteredCountryDetails.next(this.countryDetails.slice());
      this.setTopCountries(false);
      return;
    } else {
      search = search.toLowerCase();
      this.setTopCountries(true);
    }
    // filter the country
    this.filteredCountryDetails.next(
      this.countryDetails.filter(
        (countryDetail) =>
          countryDetail.countryName.toLowerCase().indexOf(search) > -1
      )
    );
  }

  setOrgIdForOrgDetails(ciiOrgId: string) {
    let orgInfoExists = sessionStorage.getItem('orgreginfo') != null;
    let orgReginfo = orgInfoExists
      ? JSON.parse(sessionStorage.getItem('orgreginfo') || '')
      : '';
    orgReginfo.ciiOrgId = ciiOrgId;
    sessionStorage.setItem('orgreginfo', JSON.stringify(orgReginfo));
  }

  public onBackClick() {
    window.history.back();
  }

  public onSubmit() {
    if(this.countryCode){
      this.orgDetails.address.countryCode=this.countryCode
      localStorage.setItem('cii_organisation', JSON.stringify(this.orgDetails));
      if (this.orgGroup === 'manage-org/register/user') {
        let organisation = JSON.parse(
          localStorage.getItem('cii_organisation') + ''
        );
        if (organisation.additionalIdentifiers.length > 0) {
          this.router.navigateByUrl(
            'manage-org/register/search/' +
              this.routeParams.scheme +
              '/' +
              this.id +
              '/additional-identifiers'
          );
        } else {
         let cii_scheme = {
            scheme:this.routeParams.scheme,
            id:this.id
          }
          localStorage.setItem('cii_scheme', JSON.stringify(cii_scheme));
          this.router.navigateByUrl(this.orgGroup);
        }
      } else {
        this.router.navigateByUrl(this.orgGroup);
      }
    }else{
      this.isInvalid=true
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
    let organisation = JSON.parse(
      localStorage.getItem('cii_organisation') + ''
    );
    organisation.additionalIdentifiers = this.selectedIdentifiers;
    localStorage.setItem('cii_organisation', JSON.stringify(organisation));
  }

  /**
   * Focus on mat select box
   */
  public setFocus():void{
    if(this.matselect) this.matselect.focus();
  }

  /**
  * on change event in mat select box
  * @param event value from html
  */
  public onChangecountry(event:string):void{
    if(event){
      this.isInvalid=false
    }
  }
}
