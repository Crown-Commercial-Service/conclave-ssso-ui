import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BaseComponent } from 'src/app/components/base/base.component';
import { slideAnimation } from 'src/app/animations/slide.animation';
import { UIState } from 'src/app/store/ui.states';
import { OrganisationService } from 'src/app/services/postgres/organisation.service';
import { Observable } from 'rxjs';
import { map, share } from 'rxjs/operators';
import { WrapperOrganisationService } from 'src/app/services/wrapper/wrapper-org-service';
import { TokenService } from 'src/app/services/auth/token.service';
import { ViewportScroller } from '@angular/common';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { OrganisationUserDto, OrgUserListResponse } from 'src/app/models/user';
import { environment } from 'src/environments/environment';
import { SessionStorageKey } from 'src/app/constants/constant';
import { DataLayerService } from 'src/app/shared/data-layer.service';
import { SessionService } from 'src/app/shared/session.service';
import { LoadingIndicatorService } from 'src/app/services/helper/loading-indicator.service';

@Component({
  selector: 'app-org-support-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class OrgSupportSearchComponent extends BaseComponent implements OnInit {

  formGroup: FormGroup;
  public selectedRow!: string;
  public selectedRowId: string = '';
  public data: OrgUserListResponse;
  public pageOfItems!: any;
  public organisationId!: number;
  searchText: string = "";
  currentPage: number = 1;
  pageCount: number = 0;
  pageSize: number = environment.listPageSize;
  pageName : string ='OUS';
  tableHeaders = ['NAME', 'ORGANISATION', 'USER_EMAIL'];
  tableColumnsToDisplay = ['name', 'organisationLegalName', 'userName'];
  searchSumbited:boolean=false;
  constructor(private cf: ChangeDetectorRef, private formBuilder: FormBuilder,private sessionService:SessionService, private translateService: TranslateService, private organisationService: OrganisationService, private wrapperOrganisationService: WrapperOrganisationService, private readonly tokenService: TokenService, private router: Router, private route: ActivatedRoute, protected uiStore: Store<UIState>, protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper, private dataLayerService: DataLayerService,
    private loadingIndicatorService: LoadingIndicatorService) {
    super(uiStore, viewportScroller, scrollHelper);
    this.formGroup = this.formBuilder.group({
      search: [, Validators.compose([Validators.required])],
    });
    this.data = {
      currentPage: this.currentPage,
      pageCount: 0,
      rowCount: 0,
      orgUserList: []
    }
    sessionStorage.removeItem(SessionStorageKey.OrgUserSupportUserName);
  }

  async ngOnInit() {
    this.loadingIndicatorService.isLoading.next(true);
    this.loadingIndicatorService.isCustomLoading.next(true);
    // TODO This api call required a refactoring since its suppose to give a lot of data records (entire users in the system)
    // Suggestions:-
    // 1. Server side pagination
    let org = await this.organisationService.getById(this.tokenService.getCiiOrgId()).toPromise();
    if (org) {
      this.organisationId = org.organisationId;
      this.onSearch();
    }

    this.dataLayerService.pushPageViewEvent();
    this.loadingIndicatorService.isLoading.next(false);
    this.loadingIndicatorService.isCustomLoading.next(false);

    this.route.queryParams.subscribe(params => {
      if (params['isNewTab'] === 'true') {
        const urlTree = this.router.parseUrl(this.router.url);
        delete urlTree.queryParams['isNewTab'];
        this.router.navigateByUrl(urlTree.toString(), { replaceUrl: true });
      }
    });

  }

  async onSearch() {
    let result = await this.organisationService.getUsers(this.searchText, this.currentPage, this.pageSize).toPromise();
    this.data = result;
    if( this.data && this.data.orgUserList.length <= 0)
    {
     this.selectedRowId = '';
    }
    this.pageCount = this.data.pageCount;
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

  public onContinueClick(buttonText:string) {
    sessionStorage.setItem(SessionStorageKey.OrgUserSupportUserName, this.selectedRowId);
    this.router.navigateByUrl(`org-support/details`);
    this.pushDataLayerEvent(buttonText);
  }

  public onCancelClick(buttonText:string) {
    sessionStorage.removeItem(SessionStorageKey.OrgUserSupportUserName);
    this.router.navigateByUrl('home');
    this.pushDataLayerEvent(buttonText);
  }

  pushDataLayerEvent(buttonText:string) {
		this.dataLayerService.pushClickEvent(buttonText)
	  }
  
  onSelectRow(dataRow: any) {
    this.selectedRowId = dataRow?.userName ?? '';
  }

}
