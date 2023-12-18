import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ViewportScroller } from '@angular/common';
import { UIState } from 'src/app/store/ui.states';
import { OperationEnum } from 'src/app/constants/enum';
import { WrapperOrganisationSiteService } from 'src/app/services/wrapper/wrapper-org-site-service';
import { OrganisationSiteInfo, OrganisationSiteResponse } from 'src/app/models/site';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { WrapperSiteContactService } from 'src/app/services/wrapper/wrapper-site-contact-service';
import { ContactGridInfo, ContactGridInfoWithLink, SiteContactInfoList } from 'src/app/models/contactInfo';
import { ContactHelper } from 'src/app/services/helper/contact-helper.service';
import { Title } from '@angular/platform-browser';
import { FormBaseComponent } from 'src/app/components/form-base/form-base.component';
import { ContryDetails } from 'src/app/models/contryDetails';
import { WrapperConfigurationService } from 'src/app/services/wrapper/wrapper-configuration.service';
import { ReplaySubject, Subject } from 'rxjs';
import { MatSelect } from '@angular/material/select';
import { take, takeUntil } from 'rxjs/operators';
import { DataLayerService } from 'src/app/shared/data-layer.service';
import { SessionService } from 'src/app/shared/session.service';
import { LoadingIndicatorService } from 'src/app/services/helper/loading-indicator.service';

@Component({
  selector: 'app-manage-organisation-profile-site-edit',
  templateUrl: './manage-organisation-profile-site-edit.component.html',
  styleUrls: ['./manage-organisation-profile-site-edit.component.scss']
})
export class ManageOrganisationSiteEditComponent extends FormBaseComponent implements OnInit {
  submitted!: boolean;
  isEdit: boolean = false;
  siteId: number = 0;
  public serverError: string = '';
  public dublicateSiteName=''
  organisationId: string;
  contactAddAnother :boolean = false;
  contactTableHeaders = ['CONTACT_REASON', 'NAME', 'EMAIL', 'TELEPHONE_NUMBER','MOBILE_NUMBER','FAX', 'WEB_URL'];
  contactColumnsToDisplay = ['contactReason', 'name', 'email', 'phoneNumber','mobileNumber','fax', 'webUrl'];
  contactData: ContactGridInfo[];
  countryDetails: ContryDetails[] = [];
  topCountries: ContryDetails[] = [];
  filteredCountryDetails: ReplaySubject<ContryDetails[]> = new ReplaySubject<ContryDetails[]>(1);

  public bankFilterCtrl: FormControl = new FormControl();
  protected _onDestroy = new Subject<void>();
  public formId : string = 'Manage_organisation Edit_site';

  @ViewChildren('input') inputs!: QueryList<ElementRef>;
  @ViewChild('singleSelect', { static: true }) singleSelect!: MatSelect;

  constructor(private formBuilder: FormBuilder, private router: Router, private activatedRoute: ActivatedRoute,private sessionService:SessionService,
    protected uiStore: Store<UIState>, protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper,
    public orgSiteService: WrapperOrganisationSiteService, private siteContactService: WrapperSiteContactService,
    private contactHelper: ContactHelper, private titleService: Title, private wrapperConfigService: WrapperConfigurationService, private dataLayerService: DataLayerService,
    private loadingIndicatorService: LoadingIndicatorService) {
    super(viewportScroller, formBuilder.group({                                        
      name: ['', Validators.compose([Validators.required,Validators.pattern(/^[ A-Za-z0-9@().,;:'/#&+-]*$/),Validators.maxLength(256), Validators.minLength(3)])],
      streetAddress: ['', Validators.compose([Validators.required,Validators.pattern(/^[ A-Za-z0-9@().,;:'/#&+-]*$/),Validators.maxLength(256), Validators.minLength(1)])],
      locality: ['', Validators.compose([Validators.pattern(/^[ A-Za-z0-9.,'/&-]*$/),Validators.maxLength(256)])],
      region: [''],                                                            
      postalCode: ['', Validators.compose([Validators.required])],
      countryCode: ['', Validators.compose([Validators.required])],
    }));
    let queryParams = this.activatedRoute.snapshot.queryParams;
    if (queryParams.data) {
      let routeData = JSON.parse(queryParams.data);
      this.isEdit = routeData['isEdit'];
      this.siteId = routeData['siteId'];
    }
    this.contactData = [];
    this.organisationId = localStorage.getItem('cii_organisation_id') || '';
  }

  async ngOnInit() {
    this.router.events.subscribe(value => {
      this.dataLayerService.pushEvent({ 
          event: "page_view" ,
          page_location: this.router.url.toString(),
          user_name: this.sessionService.decrypt('user_name'),
          cii_organisataion_id: localStorage.getItem("cii_organisation_id"),
      });
    })
    this.titleService.setTitle(`${this.isEdit ? "Edit" : "Add"} - Site - CCS`);
    this.countryDetails = await this.wrapperConfigService.getCountryDetails().toPromise();
    this.setTopCountries(false);
    this.filteredCountryDetails.next(this.countryDetails.slice());

    // listen for search field value changes
    this.bankFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterBanks();
      });
    if (this.isEdit) {  
      this.loadingIndicatorService.isLoading.next(true);
      this.loadingIndicatorService.isCustomLoading.next(true);
      
      this.orgSiteService.getOrganisationSite(this.organisationId, this.siteId).subscribe(
        {
          next: (siteInfo: OrganisationSiteResponse) => {
            console.log("siteInfo",siteInfo)
            this.formGroup.setValue({
              name: siteInfo.siteName,
              streetAddress: siteInfo.address.streetAddress,
              locality: siteInfo.address.locality,
              region: siteInfo.address.region,
              postalCode: siteInfo.address.postalCode,
              countryCode: this.countryDetails.find(s => s.countryCode == siteInfo.address.countryCode),
            });
            this.getSiteContacts();
            this.onFormValueChange();
            
            this.loadingIndicatorService.isLoading.next(false);
            this.loadingIndicatorService.isCustomLoading.next(false);
          },
          error: (error: any) => {
            console.log(error);
            
            this.loadingIndicatorService.isLoading.next(false);
            this.loadingIndicatorService.isCustomLoading.next(false);
          },
        });
    }
    else {
      this.onFormValueChange();
    }
    this.dataLayerService.pushFormStartEvent(this.formId);
  }

  ngAfterViewInit() {
    this.setInitialValue();
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  setTopCountries(isClear: boolean) {
    if (!isClear) {
      this.topCountries = this.countryDetails.filter(c => c.countryName === "Ireland" || c.countryName === "United States" || c.countryName === "United Kingdom");
    }
    else {
      this.topCountries = [];
    }
  }

  /**
   * Sets the initial value after the filteredBanks are loaded initially
   */
  protected setInitialValue() {
    this.filteredCountryDetails
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        // setting the compareWith property to a comparison function
        // triggers initializing the selection according to the initial value of
        // the form control (i.e. _initializeSelection())
        // this needs to be done after the filteredBanks are loaded initially
        // and after the mat-option elements are available
        this.singleSelect.compareWith = (a: ContryDetails, b: ContryDetails) => a && b && a.id === b.id;
      });
  }

  protected filterBanks() {
    if (!this.countryDetails) {
      return;
    }
    // get the search keyword
    let search = this.bankFilterCtrl.value;
    if (!search) {
      this.filteredCountryDetails.next(this.countryDetails.slice());
      this.setTopCountries(false);
      return;
    } else {
      search = search.toLowerCase();
      this.setTopCountries(true);
    }
    // filter the banks
    this.filteredCountryDetails.next(
      this.countryDetails.filter(countryDetail => countryDetail.countryName.toLowerCase().indexOf(search) > -1)
    );
  }

  getSiteContacts() {
    this.siteContactService.getSiteContacts(this.organisationId, this.siteId).subscribe({
      next: (siteContactListInfo: SiteContactInfoList) => {
        if (siteContactListInfo != null) {
          this.contactData = this.contactHelper.getContactGridInfoList(siteContactListInfo.contactPoints);
          this.contactData.forEach((f)=>{
            let data = {
              'isEdit': true,
              'contactId': f.contactId,
              'siteId': this.siteId
            };
            let queryParams = {data: JSON.stringify(data)}
            f.routeLink = `/manage-org/profile/site/contact-edit`,
            f.routeData = queryParams
          })
        }
        if (siteContactListInfo.contactPoints && siteContactListInfo.contactPoints.length > 0) {
          this.contactAddAnother = true;
        } else {
          this.contactAddAnother = false;
        }
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  ngAfterViewChecked() {
    this.scrollHelper.doScroll();
  }

  scrollToAnchor(elementId: string): void {
    this.viewportScroller.scrollToAnchor(elementId);
  }

  setFocus(inputIndex: number) {
    this.inputs.toArray()[inputIndex].nativeElement.focus();
  }

  public onSubmit(form: FormGroup) {
    this.submitted = true;
    if (this.formValid(form)) {
      this.serverError = '';
      this.dublicateSiteName=form.get('name')?.value
      let orgSiteInfo: OrganisationSiteInfo = {
        siteName: form.get('name')?.value,
        address: {
          streetAddress: form.get('streetAddress')?.value,
          locality: form.get('locality')?.value,
          region: form.get('region')?.value,
          postalCode: form.get('postalCode')?.value,
          countryCode: form.get('countryCode')?.value?.countryCode,
        }
      };

      this.dataLayerService.pushFormSubmitEvent(this.formId);
      if (this.isEdit) {
        this.orgSiteService.updateOrganisationSite(this.organisationId, this.siteId, orgSiteInfo).subscribe(
          {
            next: () => {
              this.router.navigateByUrl(`manage-org/profile/contact-operation-success/${OperationEnum.UpdateSite}`);
              this.submitted = false;
            },
            error: (error: any) => {
              // var errorObject: ValidationErrors = {};
              // errorObject['error'] = true;
              // form.controls['countryCode'].setErrors(errorObject);
              this.serverError = error.error;
              if(error.status==409){
                this.serverError="INVALID_SITE_NAME"
              }
              this.scrollHelper.scrollToFirst('error-summary');
              return;
            }
          });
      }
      else {
        {
          this.orgSiteService.createOrganisationSite(this.organisationId, orgSiteInfo).subscribe(
            {
              next: (siteId) => {
                let data = {
                  'isEdit': false,
                  'siteId': siteId
                };
                this.router.navigateByUrl('manage-org/profile/site/add-contact-to-site?data=' + JSON.stringify(data));
                // this.router.navigateByUrl(`manage-org/profile/contact-operation-success/${OperationEnum.CreateSite}`);
                this.submitted = false;
              },
              
              error: (error: any) => {
                console.log(error);
                // var errorObject: ValidationErrors = {};
                // errorObject['error'] = true;
                // form.controls['countryCode'].setErrors(errorObject);
                this.serverError = error.error;
                this.scrollHelper.scrollToFirst('error-summary');
                this.dataLayerService.pushFormErrorEvent(this.formId);
                if(error.status==409){
                  this.serverError="INVALID_SITE_NAME"
                }
                return;
              }
            });
        }
      }
    }
    else {
      this.scrollHelper.scrollToFirst('error-summary');
     this.dataLayerService.pushFormErrorEvent(this.formId);
    }
  }

  public formValid(form: FormGroup): Boolean {
    if (form == null) return false;
    if (form.controls == null) return false;
    return form.valid;
  }

  onCancelClick() {
    this.router.navigateByUrl('manage-org/profile');
    this.pushDataLayerEvent();
  }

  onDeleteClick() {
    let data = {
      'organisationId': this.organisationId,
      'siteId': this.siteId
    };
    this.router.navigateByUrl('manage-org/profile/site/delete?data=' + JSON.stringify(data));
  }

  getQueryData(): string {
    const data = {
      'organisationId': this.organisationId,
      'siteId': this.siteId
    };
    return JSON.stringify(data);
  }
  
  public onContactAddClick() {
    let data = {
      'isEdit': false,
      'contactId': 0,
      'siteId': this.siteId,
      'siteCreate':false,
      'ContactAdd':true,
      'contactAddAnother':this.contactAddAnother,
    };
    this.router.navigateByUrl('manage-org/profile/site/contact-edit?data=' + JSON.stringify(data));
    this.pushDataLayerEvent();
  }

  public onContactAssignClick() {
    let data = {
      'assigningSiteId': this.siteId
    };
    this.router.navigateByUrl('contact-assign/select?data=' + JSON.stringify(data));
    this.pushDataLayerEvent();
  }

  onContactEditClick(contactInfo: ContactGridInfoWithLink) {
    let data = {
      'isEdit': true,
      'contactId': contactInfo.contactId,
      'siteId': this.siteId
    };
    this.router.navigateByUrl('manage-org/profile/site/contact-edit?data=' + JSON.stringify(data));
  }

  public formValueChanged(){
   this.serverError=''
  }

  pushDataLayerEvent() {
		this.dataLayerService.pushEvent({ 
		  event: "cta_button_click" ,
		  page_location: "Add/Edit - Site"
		});
	  }
}
