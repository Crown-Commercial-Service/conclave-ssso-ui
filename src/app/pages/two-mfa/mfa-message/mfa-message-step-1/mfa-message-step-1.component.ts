import { ViewportScroller } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { slideAnimation } from "src/app/animations/slide.animation";
import { BaseComponent } from "src/app/components/base/base.component";
import { AuthService } from "src/app/services/auth/auth.service";
import { ScrollHelper } from "src/app/services/helper/scroll-helper.services";
import { UIState } from "src/app/store/ui.states";
import { PatternService } from 'src/app/shared/pattern.service';
import {
    CountryISO,
    PhoneNumberFormat,
    SearchCountryField,
  } from 'ngx-intl-tel-input';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DataLayerService } from "src/app/shared/data-layer.service";

@Component({
    selector: 'app-mfa-message-step-1',
    templateUrl: './mfa-message-step-1.component.html',
    styleUrls: ['./mfa-message-step-1.component.scss'],
    animations: [
        slideAnimation({
            close: { 'transform': 'translateX(12.5rem)' },
            open: { left: '-12.5rem' }
        })
    ],

})
export class MfaMessageStep1Component extends BaseComponent implements OnInit {
 formGroup: FormGroup;
 separateDialCode = false;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [
    CountryISO.UnitedStates,
    CountryISO.UnitedKingdom,
  ];
    auth0token: string = "";
    oob_code: any;
    public formId : string = 'mfa_setup_Enter_your_mobile_number'
 
    
    
    constructor(private activatedRoute: ActivatedRoute, private formBuilder: FormBuilder, private router: Router, private PatternService: PatternService, private authService: AuthService,
        protected uiStore: Store<UIState>, protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper, private dataLayerService: DataLayerService) {
        super(uiStore, viewportScroller, scrollHelper);
        this.formGroup = this.formBuilder.group({
            mobile: ['', [Validators.required]],
          });
    }
    
        ngOnInit() {
          this.dataLayerService.pushPageViewEvent();
          this.dataLayerService.pushFormStartEvent(this.formId, this.formGroup);
        }

    onContinueBtnClick() {
            const mobileControl = this.formGroup.get('mobile');
            if (mobileControl && mobileControl.valid) {
              const phoneNumber = mobileControl.value;
              console.log(phoneNumber);
              console.log(phoneNumber.e164Number);
            localStorage.setItem('phonenumber', phoneNumber.e164Number);
            this.dataLayerService.pushFormSubmitEvent(this.formId);
              this.router.navigateByUrl('mfa-message-step-2');

            }
        }
    onBackBtnClick(buttonText:string) {
            this.router.navigateByUrl('mfa-selection');
            this.pushDataLayerEvent(buttonText);
        }
    onNavigateToMFAClick() {
            this.router.navigateByUrl('mfa-selection');
        }

        pushDataLayerEvent(buttonText:string) {
          this.dataLayerService.pushClickEvent(buttonText);
          }
    }