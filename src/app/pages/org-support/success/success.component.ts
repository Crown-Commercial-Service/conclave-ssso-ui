import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';

import { BaseComponent } from 'src/app/components/base/base.component';
import { slideAnimation } from 'src/app/animations/slide.animation';
import { UIState } from 'src/app/store/ui.states';
import { Observable } from 'rxjs';
import { ViewportScroller } from '@angular/common';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { SessionStorageKey } from 'src/app/constants/constant';
import { DataLayerService } from 'src/app/shared/data-layer.service';
import { SessionService } from 'src/app/shared/session.service';

@Component({
  selector: 'app-org-support-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss'],
  animations: [
    slideAnimation({
      close: { 'transform': 'translateX(12.5rem)' },
      open: { left: '-12.5rem' }
    })
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrgSupportSuccessComponent extends BaseComponent implements OnInit {

  public user$!: Observable<any>;
  displayMessage: string = '';
  public deactivateEnabled : boolean = false;
  public reactivateEnabled : boolean = false;
  

  constructor(private route: ActivatedRoute, protected uiStore: Store<UIState>, protected viewportScroller: ViewportScroller,
    protected scrollHelper: ScrollHelper,private sessionService:SessionService,  private router: Router, private dataLayerService: DataLayerService) {
    super(uiStore, viewportScroller, scrollHelper);
  }

  ngOnInit() {
    this.router.events.subscribe(value => {
      this.dataLayerService.pushEvent({ 
          event: "page_view" ,
          page_location: this.router.url.toString(),
          user_name: this.sessionService.decrypt('user_name'),
          cii_organisataion_id: localStorage.getItem("cii_organisation_id"),
      });
    })
    let userName = sessionStorage.getItem(SessionStorageKey.OrgUserSupportUserName) ?? '';
    let changePassword = false;
    let resetMfa = false;
    let changeRoleType: string = "noChange";

    this.route.queryParams.subscribe(para => {
      if (para.rpwd != undefined) {
        changePassword = JSON.parse(para.rpwd);
      }

      if (para.rmfa != undefined) {
        resetMfa = JSON.parse(para.rmfa);
      }

      if (para.chrole != undefined) {
        changeRoleType = para.chrole;
      }
      if (para.deuser != undefined)
      {
        this.deactivateEnabled = JSON.parse(para.deuser);
      }
      if (para.reuser != undefined)
      {
        this.reactivateEnabled = JSON.parse(para.reuser);
      }

      this.displayMessage = '';

      if (changeRoleType !== "noChange") {
        this.displayMessage = changeRoleType == "assign" ? `You have successfully assigned admin role for ${userName}.` :
          `You have successfully unassigned admin role for ${userName}.`;
      }

      if (changePassword) {
        this.displayMessage = changeRoleType !== "noChange" ? (this.displayMessage + `\n Password reset email has been sent to ${userName}.`) :
          `Password reset email has been sent to ${userName}.`;
      }

      if (resetMfa) {
        this.displayMessage = changePassword || changeRoleType !== "noChange" ? this.displayMessage + `\n Additional security reset email has been sent to ${userName}.` :
          `Additional security reset email has been sent to ${userName}.`;
      }
      if (this.deactivateEnabled)
      {
        this.displayMessage = changePassword || changeRoleType !== "noChange" || resetMfa ? this.displayMessage + `\n You have successfully deactivated user ${userName}.` :
          `You have successfully deactivated user ${userName}.`;
      }
      if (this.reactivateEnabled)
      {
        this.displayMessage =  `You have successfully reactivated user ${userName}.`;
      }
    });
  }

  ngOnDestroy(){
    sessionStorage.removeItem(SessionStorageKey.OrgUserSupportUserName);
  }
}
