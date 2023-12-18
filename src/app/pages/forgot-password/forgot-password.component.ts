import { Component, ViewEncapsulation, ChangeDetectionStrategy, OnInit, OnDestroy, ViewChildren, QueryList, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { BaseComponent } from 'src/app/components/base/base.component';
import { dataService } from 'src/app/services/data/data.service';
import { UIState } from 'src/app/store/ui.states';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ViewportScroller } from '@angular/common';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { SessionStorageKey } from 'src/app/constants/constant';
import { PatternService } from 'src/app/shared/pattern.service';
import { ActivatedRoute } from '@angular/router';
import { DataLayerService } from 'src/app/shared/data-layer.service';
import { SessionService } from 'src/app/shared/session.service';
import { NzButtonComponent } from 'ng-zorro-antd/button';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent extends BaseComponent implements OnInit {

    resetForm!: FormGroup;
    resetErrorString!: string;
    submitted!: boolean;
    public errorCode = '';
    public formId : string = 'forgot_password'
    @ViewChildren('input') inputs!: QueryList<ElementRef>;
    constructor(private formBuilder: FormBuilder,
        private translateService: TranslateService,
        private router: Router,
        private authService: AuthService,
        private PatternService:PatternService,
        private sessionService:SessionService,
        protected uiStore: Store<UIState>, protected viewportScroller:
            ViewportScroller, protected scrollHelper: ScrollHelper,
            private route : ActivatedRoute,
        private dataLayerService: DataLayerService
    ) {
        super(uiStore, viewportScroller, scrollHelper);
        this.resetForm = this.formBuilder.group({
            userName: ['', Validators.compose([Validators.required, Validators.pattern(this.PatternService.emailPattern)])],
        });
    }

    /**
    * @memberof ForgotPasswordComponent
    */
    ngOnInit() {
        // console.log("storage",localStorage.getItem('lastUserEmail'));
        // console.log("mail", this.route.snapshot.queryParamMap.get('email'));
        this.resetForm.setValue({
            userName : this.route.snapshot.queryParamMap.get('email')
        }) ;
        this.translateService.get('RESET_PASSWORD_ERROR').subscribe((value) => {
            this.resetErrorString = value;
        });
        this.dataLayerService.pushFormStartEvent(this.formId);
        this.dataLayerService.pushPageViewEvent();
    }



    validateEmailLength(data:any){
        if(this.PatternService.emailValidator(data.target.value)){
            this.resetForm.controls['userName'].setErrors({ 'incorrect': true})
          }
    }

    /**
    * Triggered each time the user clicks the submit button.
    *
    * @memberof ForgotPasswordComponent
    */
    onSubmit(form: FormGroup,buttonText:string): void {
        this.submitted = true;
        if(this.PatternService.emailValidator(form.get('userName')?.value)){
            this.resetForm.controls['userName'].setErrors({ 'incorrect': true})
   }
        if (this.formValid(form)) {
            this.dataLayerService.pushFormSubmitEvent(this.formId);
            this.authService.resetPassword(form.get('userName')?.value).toPromise()
            .then(() => {
                sessionStorage.setItem(SessionStorageKey.ForgotPasswordUserName, form.get('userName')?.value);
                this.router.navigateByUrl(`forgot-password-success`);
            },(err) => {
                if (err.error == "ERROR_MAX_ATTEMPT") {
                    this.router.navigateByUrl(`forgot-password-error`);
                }
        })
        } else {
            this.dataLayerService.pushFormErrorEvent(this.formId);
        }
        this.pushDataLayerEvent(buttonText);
    }

    pushDataLayerEvent(buttonText:string) {
       this.dataLayerService.pushClickEvent(buttonText)
      }

    setFocus(inputIndex: number) {
        this.inputs.toArray()[inputIndex].nativeElement.focus();
    }

    public formValid(form: FormGroup): Boolean {
        if (form == null) return false;
        if (form.controls == null) return false;
        return form.valid;
    }

    public onCancelClick(buttonText:string) {
        this.router.navigateByUrl('login');
        this.pushDataLayerEvent(buttonText);
    }
}
