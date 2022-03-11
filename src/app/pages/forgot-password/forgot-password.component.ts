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
    @ViewChildren('input') inputs!: QueryList<ElementRef>;
    constructor(private formBuilder: FormBuilder,
        private translateService: TranslateService,
        private router: Router,
        private authService: AuthService,
        private PatternService:PatternService,
        protected uiStore: Store<UIState>, protected viewportScroller:
            ViewportScroller, protected scrollHelper: ScrollHelper
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
        this.translateService.get('RESET_PASSWORD_ERROR').subscribe((value) => {
            this.resetErrorString = value;
        });
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
    onSubmit(form: FormGroup): void {
        this.submitted = true;
        if(this.PatternService.emailValidator(form.get('userName')?.value)){
            this.resetForm.controls['userName'].setErrors({ 'incorrect': true})
   }
        if (this.formValid(form)) {
            this.authService.resetPassword(form.get('userName')?.value).toPromise()
            .then(() => {
                sessionStorage.setItem(SessionStorageKey.ForgotPasswordUserName, form.get('userName')?.value);
                this.router.navigateByUrl(`forgot-password-success`);
            });
        }
    }

    setFocus(inputIndex: number) {
        this.inputs.toArray()[inputIndex].nativeElement.focus();
    }

    public formValid(form: FormGroup): Boolean {
        if (form == null) return false;
        if (form.controls == null) return false;
        return form.valid;
    }

    public onCancelClick() {
        this.router.navigateByUrl('login');
    }
}
