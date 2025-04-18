import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OrganisationAuditListResponse } from 'src/app/models/organisation';
import { WrapperBuyerBothService } from 'src/app/services/wrapper/wrapper-buyer-both.service';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { DataLayerService } from 'src/app/shared/data-layer.service';
import { SessionService } from 'src/app/shared/session.service';
import { LoadingIndicatorService } from 'src/app/services/helper/loading-indicator.service';

@Component({
    selector: 'app-buyer-both-requests',
    templateUrl: './buyer-both-requests.component.html',
    styleUrls: ['./buyer-both-requests.component.scss'],
    standalone: false
})
export class BuyerBothRequestsComponent implements OnInit {
  public searchText: string = '';
  public searchSumbited: boolean = false;
  public tabConfig = {
    pendingOrg: true,
    verifiedOrg: false,
  };
  private organisationId: string = '';
  public pendingVerificationBuyerAndBoth: any = {
    currentPage: 1,
    pageCount: 0,
    pageSize: environment.listPageSize,
    usersTableHeaders: ['Organisation name ', 'Organisation type ', 'Date of registration'],
    usersColumnsToDisplay: [
      'organisationName',
      'organisationTypeName',
      'dateOfRegistration',
    ],
    organisationAuditList: '',
    pageName: 'Contactadmin',
    hyperTextrray: ['View'],
  };

  public verifiedBuyerAndBoth: any = {
    currentPage: 1,
    pageCount: 0,
    pageSize: environment.listPageSize,
    usersTableHeaders: ['Organisation name ', 'Organisation type ', 'Date of registration'],
    usersColumnsToDisplay: [
      'organisationName',
      'organisationTypeName',
      'dateOfRegistration',
    ],
    organisationAuditList: '',
    pageName: 'Contactadmin',
    hyperTextrray: ['View'],
  };
  constructor(
    private router: Router,
    private wrapperBuyerAndBothService:WrapperBuyerBothService,
    private translate: TranslateService,
    private dataLayerService: DataLayerService,
    private sessionService:SessionService,
    public route:ActivatedRoute,
    private loadingIndicatorService: LoadingIndicatorService
  ) {
    this.organisationId = localStorage.getItem('cii_organisation_id') || '';
    this.pendingVerificationBuyerAndBoth.organisationAuditList = {
      currentPage: this.pendingVerificationBuyerAndBoth.currentPage,
      pageCount: 0,
      rowCount: 0,
      organisationId: this.organisationId,
      organisationAuditList: [],
    };
    this.verifiedBuyerAndBoth.organisationAuditList = {
      currentPage: this.pendingVerificationBuyerAndBoth.currentPage,
      pageCount: 0,
      rowCount: 0,
      organisationId: this.organisationId,
      organisationAuditList: [],
    };
  }

  ngOnInit() {
    this.loadingIndicatorService.isLoading.next(true);
    this.loadingIndicatorService.isCustomLoading.next(true);
    
    this.dataLayerService.pushPageViewEvent();
    this.tabChanged(sessionStorage.getItem('activetab') || 'pendingOrg');
    this.getPendingVerificationOrg();
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

  public onSearchClick(): void {
    this.searchSumbited = true;
    this.getPendingVerificationOrg();
  }

  public onLinkClick(data: any): void {
    if (data.event.target.innerText === 'Decline') {
      this.router.navigateByUrl(
        'confirm-decline?data=' + btoa(JSON.stringify(data))
      );
    } else if (data.event.target.innerText === 'Accept') {
      this.router.navigateByUrl(
        'confirm-accept?data=' + btoa(JSON.stringify(data))
      );
    } else {
      this.router.navigateByUrl(
        'pending-verification?data=' + btoa(encodeURIComponent(JSON.stringify(data)))
      );
    }
  }

  public OnClickView(event: any) {
    let data = {
      header: 'View request',
      Description: '',
      Breadcrumb: 'View request',
      status: '003',
      event: event,
    };
    this.router.navigateByUrl(
      'verified-organisations?data=' + btoa(encodeURIComponent(JSON.stringify(data)))
    );
  }

  setPagecurrentUsers(pageNumber: any) {
    this.pendingVerificationBuyerAndBoth.currentPage = pageNumber;
    this.getPendingVerificationOrg();
  }

  setPageexpiredUsers(pageNumber: any) {
    this.verifiedBuyerAndBoth.currentPage = pageNumber;
    this.geVerifiedOrg();
  }

  getPendingVerificationOrg() {
    this.wrapperBuyerAndBothService.getpendingVerificationOrg(
      this.organisationId,
      this.searchText,
      this.pendingVerificationBuyerAndBoth.currentPage,
      this.pendingVerificationBuyerAndBoth.pageSize
    ).subscribe({
      next: (orgListResponse: OrganisationAuditListResponse) => {
        if (orgListResponse != null) {
          this.pendingVerificationBuyerAndBoth.organisationAuditList = orgListResponse;
          this.pendingVerificationBuyerAndBoth.pageCount = orgListResponse.pageCount;
          this.assignOrgTypeName(orgListResponse);
          Array.from(this.pendingVerificationBuyerAndBoth.organisationAuditList.organisationAuditList).forEach((f: any)=>{
              let queryParams = {data: btoa(encodeURIComponent(JSON.stringify(f))),isNewTab: true}
               f.routeLink= `/pending-verification`,
               f.routeData = queryParams
          })
        }
        this.geVerifiedOrg()
      },
      error: (error: any) => {
        // this.router.navigateByUrl('delegated-error');
      },
    });
  }

  geVerifiedOrg() {
    this.wrapperBuyerAndBothService.getVerifiedOrg(
      this.organisationId,
      this.searchText,
      this.verifiedBuyerAndBoth.currentPage,
      this.verifiedBuyerAndBoth.pageSize
    ).subscribe({
      next: (orgListResponse: OrganisationAuditListResponse) => {
        if (orgListResponse != null) {
          this.verifiedBuyerAndBoth.organisationAuditList = orgListResponse;
          this.verifiedBuyerAndBoth.pageCount = orgListResponse.pageCount;
          this.assignOrgTypeName(orgListResponse);
          Array.from(this.verifiedBuyerAndBoth.organisationAuditList.organisationAuditList).forEach((f: any)=>{
            let data = {
              header: 'View request',
              Description: '',
              Breadcrumb: 'View request',
              status: '003',
              event: f,
            };
              let queryParams = {data: btoa(encodeURIComponent(JSON.stringify(data))),isNewTab: true}
               f.routeLink= `/verified-organisations`,
               f.routeData = queryParams
          })
          
        }
      },
      error: (error: any) => {
        this.router.navigateByUrl('delegated-error');
      },
    });
  }

  public tabChanged(activetab: string): void {
    document.getElementById(activetab)!.scrollIntoView({
      block: 'start',
      inline: 'nearest',
    });
    if (activetab === 'verifiedOrg') {
      this.tabConfig.pendingOrg = false;
      this.tabConfig.verifiedOrg = true;
    } else {
      this.tabConfig.pendingOrg = true;
      this.tabConfig.verifiedOrg = false;
    }
    this.dataLayerService.pushEvent({
      event: "tab_navigation",
      link_text: activetab === 'verifiedOrg' ? "Approved / declined Buyer status requests": "Buyer status pending"
    })
  }

  private assignOrgTypeName(orgListResponse: OrganisationAuditListResponse): void{
    orgListResponse.organisationAuditList.forEach(org => {
      if(org.organisationType == 0){
        this.translate.get('SUPPLIER_TYPE').subscribe(val => org.organisationTypeName = val);
      }
      else if(org.organisationType == 1){
        this.translate.get('BUYER_TYPE').subscribe(val => org.organisationTypeName = val);
      }
      else if(org.organisationType == 2){
        this.translate.get('BUYER_AND_SUPPLIER_TYPE').subscribe(val => org.organisationTypeName = val);
      }
    });
  }

  ngOnDestroy(): void {
    sessionStorage.removeItem('activetab');
  }
}
