import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Location, ViewportScroller } from '@angular/common';
import * as _ from 'lodash';

import { BaseComponent } from 'src/app/components/base/base.component';
import { UIState } from 'src/app/store/ui.states';
import { slideAnimation } from 'src/app/animations/slide.animation';
import { AuthService } from 'src/app/services/auth/auth.service';
import { PasswordChangeDetail } from 'src/app/models/passwordChangeDetail';
import { OperationEnum } from 'src/app/constants/enum';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { environment } from 'src/environments/environment';
import { DataLayerService } from 'src/app/shared/data-layer.service';
import { SessionService } from 'src/app/shared/session.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  animations: [
    slideAnimation({
      close: { 'transform': 'translateX(12.5rem)' },
      open: { left: '-12.5rem' }
    })
  ]
})
export class ChangePasswordComponent extends BaseComponent implements OnInit {

  formGroup: FormGroup;
  submitted: boolean = false;
  usedPasswordThreshold: number = environment.usedPasswordThreshold;
  public isOrgAdmin: boolean = false;
  public formId :string = 'Manage_my_account Change_password';

  @ViewChildren('input') inputs!: QueryList<ElementRef>;

  constructor(private formBuilder: FormBuilder, private authService: AuthService,
    public router: Router, protected uiStore: Store<UIState>, private location: Location,
    protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper, private dataLayerService: DataLayerService, private sessionService:SessionService) {
    super(uiStore,viewportScroller,scrollHelper);
    this.formGroup = this.formBuilder.group({
      currentPassword: ['', Validators.compose([Validators.required])],
      newPassword: ['', Validators.compose([Validators.required, this.checkPasswordStrong])],
      confirmPassword: ['', Validators.compose([Validators.required])]
    }, { validators: this.checkPasswords });
  }

  ngOnInit() {
    this.isOrgAdmin = JSON.parse(localStorage.getItem('isOrgAdmin') || 'false');
    this.dataLayerService.pushPageViewEvent();
    this.dataLayerService.pushFormStartEvent(this.formId);
  }

  ngAfterViewChecked() {
    this.scrollHelper.doScroll();
  }

  public scrollToAnchor(elementId: string): void {
    this.viewportScroller.scrollToAnchor(elementId);
  }
  
  setFocus(inputIndex: number){
    if (this.inputs.toArray()[inputIndex]) {
      this.inputs.toArray()[inputIndex].nativeElement.focus();
    }
  }

  public checkPasswordStrong(control: FormControl) {
    var format = /[!"#$%&'()*+,\-.\/:;<=>?@[\]\\^_{|}]+/;
    let hasNumber = /\d/.test(control.value);
    let hasUpper = /[A-Z]/.test(control.value);
    let hasLower = /[a-z]/.test(control.value);
    let hasSpecial = format.test(control.value);
    let isInLength = control.value.length >= 10;
    const valid = hasNumber && hasUpper && hasLower && hasSpecial && isInLength;
    if (!valid) {
      return { 'pattern': true };
    }
    return null;
  }

  checkPasswords(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { errorConfirmPassword: true }
  }

  public onSubmit(form: FormGroup) {

    this.submitted = true;
    if (this.formValid(form)) {
      let userName = this.sessionService.decrypt('user_name')
      let contactData: PasswordChangeDetail = {
        oldPassword: form.get('currentPassword')?.value,
        newPassword: form.get('newPassword')?.value,
        userName: userName
      };
     this.dataLayerService.pushFormSubmitEvent(this.formId);

      this.authService.changePassword(contactData).toPromise()
        .then((response) => {
          console.log(response);
         // this.authService.signOut();
          this.router.navigateByUrl(`change-password-success/${OperationEnum.PasswordChanged}`);
        }, (err) => {
          if (err.error == "INVALID_CURRENT_PASSWORD") {
            form.controls['currentPassword'].setErrors({ 'invalidCurrentPassword': true });
          //  this.authService.signOut();
           // this.router.navigateByUrl(`change-password-failed/${OperationEnum.PasswordChanged}`);
          }
          else if (err.error == "ERROR_PASSWORD_CONTAINS_USER_INFO") {
            form.controls['newPassword'].setErrors({ 'passwordContainsUserInfo': true });
          }
          else if (err.error == "ERROR_PASSWORD_ALREADY_USED") {
            form.controls['newPassword'].setErrors({ 'recentlyUsedPassword': true });
          }
          else {
            console.log(err);
          }
        });
    }
    else {
      this.scrollHelper.scrollToFirst('error-summary');
      this.dataLayerService.pushFormErrorEvent(this.formId);
    }
  }

  public formValid(form: FormGroup): Boolean {
    if (form == null) return false;
    if (form.controls == null) return false;
    return form.valid;
  }

  public onCancelClick() {
    this.location.back();
    this.pushDataLayerEvent();
  }

  pushDataLayerEvent() {
    this.dataLayerService.pushEvent({ 
      event: "cta_button_click" ,
      page_location: "Change Password"
    });
  }
}
