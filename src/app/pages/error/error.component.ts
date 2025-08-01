﻿import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
  Self,
  ViewChildren,
  QueryList,
  ElementRef,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormArray,
  Validators,
} from '@angular/forms';
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
import { PatternService } from 'src/app/shared/pattern.service';
import { RollbarErrorService } from 'src/app/shared/rollbar-error.service';
import { DataLayerService } from 'src/app/shared/data-layer.service';
import { SessionService } from 'src/app/shared/session.service';

@Component({
    templateUrl: './error.component.html',
    styleUrls: ['./error.component.scss'],
    standalone: false
})
export class ErrorComponent extends BaseComponent implements OnInit {
  resendForm!: FormGroup;
  submitted!: boolean;
  public mainPageUrl: string = environment.uri.web.dashboard;
  public errorCode = '';
  expiredLinkErrorCodeValue: string = 'Access expired.';
  public formId : string = 'error';
  public isRegUser = false;

  @ViewChildren('input') inputs!: QueryList<ElementRef>;
  userName: string;

  constructor(
    private route: ActivatedRoute,
    private PatternService: PatternService,
    protected uiStore: Store<UIState>,
    private authService: AuthService,
    protected viewportScroller: ViewportScroller,
    protected scrollHelper: ScrollHelper,
    private router: Router,
    public formBuilder: FormBuilder,
    private userService: UserService,
    private RollbarErrorService:RollbarErrorService,
    private dataLayerService: DataLayerService,
    private sessionService:SessionService
  ) {
    super(uiStore, viewportScroller, scrollHelper);
    this.route.queryParams.subscribe((params) => {
      this.errorCode = params['error_description'];
      if (this.errorCode === this.expiredLinkErrorCodeValue) {
        this.resendForm = this.formBuilder.group({
          userName: [
            '',
            Validators.compose([
              Validators.required,
              Validators.pattern(this.PatternService.emailPattern),
            ]),
          ],
        });
      }
    });
    this.userName = this.sessionService.decrypt('user_name')
  }
  ngOnInit(): void {
    
    var fragment=this.route.snapshot.fragment;
    if(fragment)
    {
      var regUser=this.route.snapshot.fragment?.indexOf('&is-reg-user')
      if(regUser!=-1 )
      {
        this.isRegUser=true;
      }
    }
    this.RollbarErrorService.RollbarDebug('Error Page:'.concat(this.errorCode));
    this.dataLayerService.pushPageViewEvent();
    this.dataLayerService.pushFormStartEvent(this.formId, this.resendForm);
  }

  displayError(error: string) {
    var errorMessage = document.getElementById('error-message');
    if (errorMessage != undefined) {
      errorMessage.innerHTML = error;
      errorMessage.style.display = 'block';
    }
  }
   
  public nevigateToHome():void{
    if (this.userName) {
      this.goToDashboard()
    } else {
      this.signoutUser()
    }
  } 

  signoutUser() {
    // request for full session clean
    this.authService.logOutAndRedirect();
  }

  goToDashboard() {
    this.router.navigate(['/home'], { replaceUrl: true });
  }

  validateEmailLength(data: any) {
    if (this.PatternService.emailValidator(data.target.value)) {
      this.resendForm.controls['userName'].setErrors({ incorrect: true });
    }
  }

  onSubmit(form: FormGroup,buttonText:string): void {
    this.submitted = true;

    if (this.PatternService.emailValidator(form.get('userName')?.value)) {
      this.resendForm.controls['userName'].setErrors({ incorrect: true });
      this.dataLayerService.pushFormErrorEvent(this.formId);
    }
    if (this.formValid(form)) {
      this.dataLayerService.pushFormSubmitEvent(this.formId);
      
      this.userService
        .resendUserActivationEmail(form.get('userName')?.value, true, this.isRegUser)
        .toPromise()
        .then(() => {
          
          this.router.navigateByUrl(
            `resend-link-success?un= + ${encodeURIComponent(
              form.get('userName')?.value
            )}`
          );
        });
    } else {
      this.dataLayerService.pushFormErrorEvent(this.formId);
    }
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
}
