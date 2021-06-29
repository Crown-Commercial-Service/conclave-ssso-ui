import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BaseComponent } from 'src/app/components/base/base.component';
import { slideAnimation } from 'src/app/animations/slide.animation';
import { UIState } from 'src/app/store/ui.states';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ciiService } from 'src/app/services/cii/cii.service';
import { UserService } from 'src/app/services/postgres/user.service';
import { OrganisationService } from 'src/app/services/postgres/organisation.service';
import { contactService } from 'src/app/services/contact/contact.service';
import { ContactType } from 'src/app/models/contactDetail';
import { environment } from "src/environments/environment";
import { Observable } from 'rxjs';
import { filter, map, share } from 'rxjs/operators';
import { TokenService } from 'src/app/services/auth/token.service';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-buyer-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  animations: [
    slideAnimation({
      close: { 'transform': 'translateX(12.5rem)' },
      open: { left: '-12.5rem' }
    })
  ],
  encapsulation: ViewEncapsulation.None
})
export class BuyerSearchComponent extends BaseComponent implements OnInit {

  formGroup: FormGroup;
  currentPage: number = 1;
  pageCount: number = 0;
  pageSize: number = environment.listPageSize;
  tableHeaders = ['Organisation'];
  columns = [
    'legalName',
    'organisationId',
    'organisationUri',
    'partyId',
    'rightToBuy'];
  public selectedOrg: string = '';
  public selectedOrgId: string = '';
  public data: any[] = [];
  public pageOfItems!: any
  public organisationId!: number;

  constructor(private cf: ChangeDetectorRef, private formBuilder: FormBuilder, private translateService: TranslateService, private readonly tokenService: TokenService, private organisationService: OrganisationService, private router: Router, private route: ActivatedRoute, protected uiStore: Store<UIState>, protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper) {
    super(uiStore, viewportScroller, scrollHelper);
    this.formGroup = this.formBuilder.group({
      search: [, Validators.compose([Validators.required])],
    });
  }

  async ngOnInit() {
    let org = await this.organisationService.getById(this.tokenService.getCiiOrgId()).toPromise();
    if (org) {
      this.organisationId = org.organisationId;
      this.data = await this.organisationService.get('').toPromise();
      this.data.forEach((x: any) => {
        x.legalName = x.legalName == null ? 'Unknown' : x.legalName;
      });
      // this.pageOfItems = this.data.slice(0, 10);
      // this.selectedOrg = results[0];
      // this.selectedOrgId = results[0].organisationId;
      // setTimeout(() => {
      //   this.cf.detectChanges();
      // }, 100);
    }
  }

  async onSearch() {
    this.currentPage = 1;
    let orgName = this.formGroup.get('search')?.value
    this.data = this.pageOfItems = await this.organisationService.get(orgName ?? '').toPromise();

    //items = items.filter((item: any) => item.legalName !== null && item.legalName.toLowerCase().includes((this.formGroup.get('search')?.value) + ''.toLowerCase()));
    // this.data$.subscribe({
    //   next: results => {
    //     // if (results.length > 0) {
    //     this.data = results;
    //     this.pageOfItems = this.data.slice(0, 10);
    //     // if(results.length > 0) {
    //     //   this.selectedOrg = results[0];
    //     //   this.selectedOrgId = results[0].organisationId;
    //     // }
    //     // }
    //     setTimeout(() => {
    //       this.cf.detectChanges();
    //     }, 100);
    //   }
    // });
  }

  public onSelect(event: any, item: any) {
    this.selectedOrg = item;
    this.selectedOrgId = item.ciiOrganisationId;
    if (event.target.nodeName === 'LABEL') {
      event.target.previousSibling.checked = true;
    }
    setTimeout(() => {
      this.cf.detectChanges();
    }, 100);
  }

  public onContinueClick() {
    this.router.navigateByUrl(`buyer/details/${this.selectedOrgId}`);
  }

  public onCancelClick() {
    this.router.navigateByUrl('home');
  }

  onChangePage(pageOfItems: Array<any>) {
    this.pageOfItems = pageOfItems;
  }
}
