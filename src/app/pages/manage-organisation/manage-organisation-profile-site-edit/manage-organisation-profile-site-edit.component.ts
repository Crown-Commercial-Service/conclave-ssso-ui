import { ChangeDetectionStrategy, Component, ElementRef, OnInit, QueryList, ViewChildren, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Location, ViewportScroller } from '@angular/common';
import { slideAnimation } from 'src/app/animations/slide.animation';

import { BaseComponent } from 'src/app/components/base/base.component';
import { UIState } from 'src/app/store/ui.states';
import { OperationEnum } from 'src/app/constants/enum';
import { WrapperOrganisationSiteService } from 'src/app/services/wrapper/wrapper-org-site-service';
import { OrganisationSiteInfo, OrganisationSiteResponse } from 'src/app/models/site';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { WrapperSiteContactService } from 'src/app/services/wrapper/wrapper-site-contact-service';
import { ContactGridInfo, SiteContactInfoList } from 'src/app/models/contactInfo';
import { ContactHelper } from 'src/app/services/helper/contact-helper.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-manage-organisation-profile-site-edit',
  templateUrl: './manage-organisation-profile-site-edit.component.html',
  styleUrls: ['./manage-organisation-profile-site-edit.component.scss'],
  animations: [
    slideAnimation({
      close: { 'transform': 'translateX(12.5rem)' },
      open: { left: '-12.5rem' }
    })
  ]
})
export class ManageOrganisationSiteEditComponent extends BaseComponent implements OnInit {
  siteForm: FormGroup;
  submitted!: boolean;
  isEdit: boolean = false;
  siteId: number = 0;
  public serverError: string = '';
  organisationId: string;
  contactTableHeaders = ['CONTACT_REASON', 'NAME', 'EMAIL', 'TELEPHONE_NUMBER', 'FAX', 'WEB_URL'];
  contactColumnsToDisplay = ['contactReason', 'name', 'email', 'phoneNumber', 'fax', 'webUrl'];
  contactData: ContactGridInfo[];

  @ViewChildren('input') inputs!: QueryList<ElementRef>;

  constructor(private formBuilder: FormBuilder, private router: Router, private activatedRoute: ActivatedRoute,
    protected uiStore: Store<UIState>, protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper,
    private orgSiteService: WrapperOrganisationSiteService, private siteContactService: WrapperSiteContactService,
    private contactHelper: ContactHelper, private titleService: Title) {
    super(uiStore, viewportScroller, scrollHelper);
    let queryParams = this.activatedRoute.snapshot.queryParams;
    if (queryParams.data) {
      let routeData = JSON.parse(queryParams.data);
      this.isEdit = routeData['isEdit'];
      this.siteId = routeData['siteId'];
    }
    this.contactData = [];
    this.organisationId = localStorage.getItem('cii_organisation_id') || '';
    this.siteForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required])],
      streetAddress: ['', Validators.compose([Validators.required])],
      locality: ['', null],
      region: ['', null],
      postalCode: ['', Validators.compose([Validators.required])],
      countryCode: ['', Validators.compose([Validators.required])],
    });
  }

  ngOnInit() {
    this.titleService.setTitle(`${this.isEdit ? "Edit" : "Add"} - Site - CCS`);
    if (this.isEdit) {
      this.orgSiteService.getOrganisationSite(this.organisationId, this.siteId).subscribe(
        {
          next: (siteInfo: OrganisationSiteResponse) => {
            this.siteForm.setValue({
              name: siteInfo.siteName,
              streetAddress: siteInfo.address.streetAddress,
              locality: siteInfo.address.locality,
              region: siteInfo.address.region,
              postalCode: siteInfo.address.postalCode,
              countryCode: siteInfo.address.countryCode,
            });
            this.getSiteContacts();
          },
          error: (error: any) => {
            console.log(error);
          }
        });
    }
  }

  getSiteContacts() {
    this.siteContactService.getSiteContacts(this.organisationId, this.siteId).subscribe({
      next: (siteContactListInfo: SiteContactInfoList) => {
        if (siteContactListInfo != null) {
          this.contactData = this.contactHelper.getContactGridInfoList(siteContactListInfo.contactPoints);
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
      let orgSiteInfo: OrganisationSiteInfo = {
        siteName: form.get('name')?.value,
        address: {
          streetAddress: form.get('streetAddress')?.value,
          locality: form.get('locality')?.value,
          region: form.get('region')?.value,
          postalCode: form.get('postalCode')?.value,
          countryCode: form.get('countryCode')?.value,
        }
      };

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
              this.scrollHelper.scrollToFirst('error-summary');
              return;
            }
          });
      }
      else {
        {
          this.orgSiteService.createOrganisationSite(this.organisationId, orgSiteInfo).subscribe(
            {
              next: () => {
                this.router.navigateByUrl(`manage-org/profile/contact-operation-success/${OperationEnum.CreateSite}`);
                this.submitted = false;
              },
              error: (error: any) => {
                console.log(error);
                // var errorObject: ValidationErrors = {};
                // errorObject['error'] = true;
                // form.controls['countryCode'].setErrors(errorObject);
                this.serverError = error.error;
                this.scrollHelper.scrollToFirst('error-summary');
                return;
              }
            });
        }
      }
    }
    else {
      this.scrollHelper.scrollToFirst('error-summary');
    }
  }

  public formValid(form: FormGroup): Boolean {
    if (form == null) return false;
    if (form.controls == null) return false;
    return form.valid;
  }

  onCancelClick() {
    this.router.navigateByUrl('manage-org/profile');
  }

  onDeleteClick() {
    let data = {
      'organisationId': this.organisationId,
      'siteId': this.siteId
    };
    this.router.navigateByUrl('manage-org/profile/site/delete?data=' + JSON.stringify(data));
  }

  public onContactAddClick() {
    let data = {
      'isEdit': false,
      'contactId': 0,
      'siteId': this.siteId
    };
    this.router.navigateByUrl('manage-org/profile/site/contact-edit?data=' + JSON.stringify(data));
  }

  public onContactAssignClick() {
    let data = {
      'assigningSiteId': this.siteId
    };
    this.router.navigateByUrl('contact-assign/select?data=' + JSON.stringify(data));
  }

  onContactEditClick(contactInfo: ContactGridInfo) {
    let data = {
      'isEdit': true,
      'contactId': contactInfo.contactId,
      'siteId': this.siteId
    };
    this.router.navigateByUrl('manage-org/profile/site/contact-edit?data=' + JSON.stringify(data));
  }
}
