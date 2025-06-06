import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserListResponse } from 'src/app/models/user';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { WrapperUserDelegatedService } from 'src/app/services/wrapper/wrapper-user-delegated.service';
import { DataLayerService } from 'src/app/shared/data-layer.service';
import { PatternService } from 'src/app/shared/pattern.service';
import { SessionService } from 'src/app/shared/session.service';

@Component({
    selector: 'app-find-delegated-user',
    templateUrl: './find-delegated-user.component.html',
    styleUrls: ['./find-delegated-user.component.scss'],
    standalone: false
})
export class FindDelegatedUserComponent implements OnInit {
  public formGroup!: FormGroup;
  public submitted: boolean = false;
  public organisationId: string = ''
  public error: string = ''
  public formId : string = 'find_delegated_user';
  constructor(
    public route: Router,
    private formBuilder: FormBuilder,
    private PatternService: PatternService,
    public WrapperUserDelegatedService: WrapperUserDelegatedService,
    protected scrollHelper: ScrollHelper,
    private router: Router,
    private dataLayerService: DataLayerService,
    private sessionService:SessionService,
  ) {
    this.organisationId = localStorage.getItem('cii_organisation_id') || '';
  }

  ngOnInit(): void {
    this.dataLayerService.pushPageViewEvent();
    this.formGroup = this.formBuilder.group({
      email: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(this.PatternService.emailPattern),
        ]),
      ],
    });
    
    this.dataLayerService.pushFormStartEvent(this.formId, this.formGroup);
  }

  validateEmailLength(data: any) {
    if (this.PatternService.emailValidator(data.target.value)) {
      this.formGroup.controls['email'].setErrors({ incorrect: true });
    }
  }

  /**
   * iterate through each form control and validate
   */
  public formValid(form: FormGroup): Boolean {
    if (form == null) return false;
    if (form.controls == null) return false;
    return form.valid;
  }

  public setFocus(data: any) {
    document.getElementById('email')?.focus();
  }



  public GetUserStatus(from: FormGroup,buttonText:string) {
    this.submitted = true;
    if (this.formValid(from)) {
      this.dataLayerService.pushFormSubmitEvent(this.formId);
      this.WrapperUserDelegatedService.getuserDetail(from.controls.email.value, this.organisationId).subscribe({
        next: (userResponse: any) => {
          if (userResponse.organisationId === this.organisationId) {
            let data = {
              header: 'The user is registered under your organisation',
              Description: 'You cannot give a delegated access to a user from your own Organisation.',
              Breadcrumb: 'User from your Organisation',
              status: '001'
            }
            this.route.navigateByUrl('delegated-user-status?data=' + btoa(JSON.stringify(data)))
          }
          else if(userResponse.isDormant) 
          {
            let data = {
              header: 'User is in dormant state',
              Description: 'This user is in dormant state.\ You can\'t delegate access to users who are in dormant state.',
              Breadcrumb: 'User inactive',
              status: '004'
            }
            this.route.navigateByUrl('delegated-user-status?data=' + btoa(JSON.stringify(data)))
          }
          else {
            userResponse.pageaccessmode = "add";
            // userResponse.userName = escape(encodeURIComponent(userResponse.userName));
            this.route.navigateByUrl('delegate-access-user?data=' + btoa(encodeURIComponent(JSON.stringify(userResponse))))
          }
        },
        error: (error: any) => {
          if (error.status === 409) {
            this.error = 'ALREADY_EXIST'
            this.formGroup.controls['email'].setErrors({ alreadyExists: true });
          } else if (error.status === 404) {
            let data = {
              header: 'We could not find this user in our system',
              Description: 'This Email address does not exist in our database. Please make sure that the Email address you entered is correct or contact the User you want to give the delegated access to.',
              Breadcrumb: 'User not found',
              status: '002'
            }
            this.route.navigateByUrl('delegated-user-status?data=' + btoa(JSON.stringify(data)))
          } else if(error.status === 400) {
            this.formGroup.controls['email'].setErrors({ incorrect: true });
          }else{
            this.route.navigateByUrl('delegated-error')
          }
        }
      });
    } else {
      this.scrollHelper.scrollToFirst('error-summary');
      this.dataLayerService.pushFormErrorEvent(this.formId);
    }
    this.pushDataLayerEvent(buttonText);
  }

  public Cancel(buttonText:string) {
    window.history.back();
    this.pushDataLayerEvent(buttonText);
  }

  pushDataLayerEvent(buttonText:string) {
    this.dataLayerService.pushClickEvent(buttonText)
  }
}
