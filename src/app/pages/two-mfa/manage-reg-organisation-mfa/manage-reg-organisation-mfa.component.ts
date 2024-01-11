import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewEncapsulation } from "@angular/core";
import { slideAnimation } from "src/app/animations/slide.animation";
import { BaseComponent } from "src/app/components/base/base.component";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "src/app/services/auth/auth.service";
import { UIState } from "src/app/store/ui.states";
import { Store } from "@ngrx/store";
import { WorkerService } from "src/app/services/worker.service";
import { TokenService } from "src/app/services/auth/token.service";
import { ViewportScroller } from "@angular/common";
import { ScrollHelper } from "src/app/services/helper/scroll-helper.services";
import { DataLayerService } from "src/app/shared/data-layer.service";
import { DetailsToggleService } from "src/app/shared/shared-details-toggle.service";

@Component({
    selector: 'app-manage-reg-organisation-mfa',
    templateUrl:'./manage-reg-organisation-mfa.component.html',
    styleUrls: ['./manage-reg-organisation-mfa.component.scss'],
    animations: [
        slideAnimation({
            close: { 'transform': 'translateX(12.5rem)' },
            open: { left: '-12.5rem' }
        })
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManageOrgRegMfaComponent extends BaseComponent implements OnInit {

constructor(private activatedRoute: ActivatedRoute,private router:Router, private authService: AuthService,
    protected uiStore: Store<UIState>, protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper, private dataLayerService: DataLayerService,
    private elementRef: ElementRef,private detailsToggleService : DetailsToggleService) {
    super(uiStore,viewportScroller,scrollHelper);
}
   selectedOption: string = "required";
   public linkText : string = 'Two-factor authentication (2FA) - Help content'
    ngOnInit() {
        this.dataLayerService.pushPageViewEvent();
    }
    ngAfterViewInit() {
        const detailsElement = this.elementRef.nativeElement.querySelector('details');
    
        this.detailsToggleService.addToggleListener(detailsElement, (isOpen: boolean) => {
          if (isOpen) {
            this.dataLayerService.pushEvent({
              event: "accordion_use",
              interaction_type: "open",
              link_text: this.linkText
            })
          } else {
            this.dataLayerService.pushEvent({
              event: "accordion_use",
              interaction_type: "close",
              link_text: this.linkText
            })
          }
        });
       
      }
    public onContinueClick(option :string | null)
    {
        let orgInfoExists = sessionStorage.getItem('orgreginfo') != null;
        let orgReginfo = orgInfoExists
          ? JSON.parse(sessionStorage.getItem('orgreginfo') || '')
          : '';
          orgReginfo.isMfaRequired = (option === "optional") ? false : true;
        sessionStorage.setItem('orgreginfo', JSON.stringify(orgReginfo));
        this.router.navigateByUrl(`manage-org/register/type`);
        this.dataLayerService.pushClickEvent('Continue');
    }
    ngOnDestroy() {
        const detailsElement = this.elementRef.nativeElement.querySelector('details');
        this.detailsToggleService.removeToggleListener(detailsElement);
      }
}