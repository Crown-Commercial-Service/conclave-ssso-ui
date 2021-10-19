import { Component, ViewEncapsulation, ChangeDetectionStrategy, OnInit, OnDestroy, Self, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { timeout } from 'rxjs/operators';
import * as _ from 'lodash';

import { BaseComponent } from 'src/app/components/base/base.component';
import { Data } from 'src/app/models/data';
import { dataService } from 'src/app/services/data/data.service';
import { UIState } from 'src/app/store/ui.states';
import { slideAnimation } from 'src/app/animations/slide.animation';
import { AuthService } from 'src/app/services/auth/auth.service';
import { TokenInfo } from 'src/app/models/auth';
import { TokenService } from 'src/app/services/auth/token.service';
import { environment } from 'src/environments/environment';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { ViewportScroller } from '@angular/common';
import { UserService } from 'src/app/services/postgres/user.service';

@Component({
    templateUrl: './error.component.html',
    styleUrls: ['./error.component.scss']
})
export class ErrorComponent extends BaseComponent {

    resendForm!: FormGroup;
    submitted!: boolean;
    public mainPageUrl: string = environment.uri.web.dashboard;
    public errorCode = '';
    expiredLinkErrorCodeValue: string = 'Access expired.';

    @ViewChildren('input') inputs!: QueryList<ElementRef>;

    constructor(private route: ActivatedRoute, protected uiStore: Store<UIState>, private authService: AuthService,
        protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper, private router: Router,
        private formBuilder: FormBuilder, private userService: UserService) {
        super(uiStore, viewportScroller, scrollHelper);
        this.route.queryParams.subscribe(params => {
            this.errorCode = params['error_description'];
            console.log(this.errorCode);
            if (this.errorCode === this.expiredLinkErrorCodeValue) {
                this.resendForm = this.formBuilder.group({
                    userName: ['', Validators.compose([Validators.required, Validators.email])],
                });
            }
        });
    }

    displayError(error: string) {
        var errorMessage = document.getElementById('error-message');
        if (errorMessage != undefined) {
            errorMessage.innerHTML = error;
            errorMessage.style.display = 'block';
        }
    }

    signoutUser() {
        // request for full session clean
        this.authService.logOutAndRedirect();
    }

    goToDashboard() {
        this.router.navigate(['/home'], { replaceUrl: true });
    }

    onSubmit(form: FormGroup): void {
        this.submitted = true;
        if (this.formValid(form)) {
            console.log(form.get('userName')?.value);
            this.userService.resendUserActivationEmail(form.get('userName')?.value, true).toPromise()
                .then(() => {
                    console.log("scuuccess");
                    this.router.navigateByUrl(`resend-link-success?un= + ${encodeURIComponent(form.get('userName')?.value)}`);
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
}
