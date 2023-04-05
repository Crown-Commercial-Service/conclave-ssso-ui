import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';

import { BaseComponent } from 'src/app/components/base/base.component';
import { slideAnimation } from 'src/app/animations/slide.animation';
import { UIState } from 'src/app/store/ui.states';
import { OrganisationService } from 'src/app/services/postgres/organisation.service';
import { environment } from "src/environments/environment";
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
  public showRoleView:boolean = environment.appSetting.hideSimplifyRole
  formGroup: FormGroup;
  currentPage: number = 1;
  pageCount: number = 0;
  pageSize: number = environment.listPageSize;
  tableHeaders = ['ORGANISATION'];
  tableColumnsToDisplay = ['legalName'];
  searchText: string = "";
  public selectedOrg: string = '';
  public selectedOrgId: string = '';
  public data: any;
  public ciiOrganisationId!: string;
  public searchSumbited:boolean=false;
  constructor(private cf: ChangeDetectorRef, private formBuilder: FormBuilder, private organisationService: OrganisationService,
    private router: Router, protected uiStore: Store<UIState>, protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper) {
    super(uiStore, viewportScroller, scrollHelper);
    this.formGroup = this.formBuilder.group({
      search: [, Validators.compose([Validators.required])],
    });
    this.ciiOrganisationId = localStorage.getItem('cii_organisation_id') || '';
    this.data = {
      currentPage: this.currentPage,
      pageCount: 0,
      rowCount: 0,
      orgList: []
  }
  }

  async ngOnInit() {
    await this.onSearch();
    this.data.forEach((x: any) => {
      x.legalName = x.legalName?.toUpperCase() || 'UNKNOWN';
    });
  }

  async onSearchClick() {
    this.searchSumbited=true
    this.currentPage = 1;
    await this.onSearch();
  }

  async setPage(pageNumber: any) {
    this.currentPage = pageNumber;
    await this.onSearch();
  }

  async onSearch() {
    let result = await this.organisationService.get(this.searchText,this.currentPage, this.pageSize).toPromise();
    this.data = result;
    this.pageCount = this.data.pageCount;
  }

  public onContinueClick() {
    this.router.navigateByUrl(`buyer/details/${this.selectedOrgId}`);
  }

  public onCancelClick() {
    this.router.navigateByUrl('home');
  }

  onSelectRow(dataRow: any) {
    this.selectedOrgId = dataRow?.ciiOrganisationId ?? '';
  }
}
