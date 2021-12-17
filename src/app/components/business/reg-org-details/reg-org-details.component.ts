import { ViewportScroller } from '@angular/common';
import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { UIState } from 'src/app/store/ui.states';
import { ciiService } from 'src/app/services/cii/cii.service';
import { BaseComponent } from '../../base/base.component';

@Component({
  selector: 'app-reg-org-details',
  templateUrl: './reg-org-details.component.html',
  styleUrls: ['./reg-org-details.component.scss']
})
export class OrgRegDetails extends BaseComponent implements OnInit, OnChanges {

  public orgGroup: string = 'manage-org/register/user';
  id!: string;
  ciiOrg: any;
  orgRegInfo: any;
  schemeName: string = ''
  @Input() ciiOrgId: string = '';
  @Input() ciiRegNumber: string = '';

  constructor(private ciiService: ciiService, protected uiStore: Store<UIState>,
    protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper) {
    super(uiStore, viewportScroller, scrollHelper);
  }

  async ngOnChanges() {
    //Write your code here
    await this.loadData();
  }

  async ngOnInit() {
    await this.loadData();
  }

  async loadData() {
    let orgInfoExists = sessionStorage.getItem('orgreginfo') != null;
    // this.schemeName = localStorage.getItem('scheme_name') ?? '';
    let scheme = localStorage.getItem('scheme') ?? '';
    this.orgRegInfo = orgInfoExists ? JSON.parse(sessionStorage.getItem('orgreginfo') || '') : '';
    // This path always fail if the CII reg number is already used. CII returns 409 and as a result we can't perform a search
    if (this.ciiRegNumber != '') {
      this.ciiService.getIdentifierDetails(scheme, this.ciiRegNumber);
    }
    else {
      await this.ciiService.getOrgDetails(this.ciiOrgId).toPromise().then((response: any) => {
        this.ciiOrg = response;
        this.orgRegInfo.orgName = this.ciiOrg?.identifier?.legalName;
        sessionStorage.setItem('orgreginfo', JSON.stringify(this.orgRegInfo));
        this.schemeName = this.ciiService.getSchemaName(response.identifier.scheme)
      });
    }
  }
}
