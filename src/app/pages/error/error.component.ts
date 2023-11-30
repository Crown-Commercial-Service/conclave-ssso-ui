import {
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
})
export class ErrorComponent extends BaseComponent implements OnInit {
  resendForm!: FormGroup;
  submitted!: boolean;
  public mainPageUrl: string = environment.uri.web.dashboard;
  public errorCode = '';
  expiredLinkErrorCodeValue: string = 'Access expired.';

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
    this.pushDataLayer("form_start");
  }
  ngOnInit(): void {
    console.log("errorCode",this.errorCode)
    this.RollbarErrorService.RollbarDebug('Error Page:'.concat(this.errorCode));
    this.router.events.subscribe(value => {
      this.dataLayerService.pushEvent({ 
       event: "page_view" ,
       page_location: this.router.url.toString(),
       user_name: this.sessionService.decrypt('user_name'),
       cii_organisataion_id: localStorage.getItem("cii_organisation_id"),
     });
    })
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

  onSubmit(form: FormGroup): void {
    this.submitted = true;

    if (this.PatternService.emailValidator(form.get('userName')?.value)) {
      this.resendForm.controls['userName'].setErrors({ incorrect: true });
    }
    if (this.formValid(form)) {
      this.pushDataLayer("form_submit");
      console.log(form.get('userName')?.value);
      this.userService
        .resendUserActivationEmail(form.get('userName')?.value, true)
        .toPromise()
        .then(() => {
          console.log('scuuccess');
          this.router.navigateByUrl(
            `resend-link-success?un= + ${encodeURIComponent(
              form.get('userName')?.value
            )}`
          );
        });
    } else {
      this.pushDataLayer("form_error");
    }
    this.dataLayerService.pushEvent({ 
      event: "cta_button_click" ,
      page_location: "Error"
    });
  }

  setFocus(inputIndex: number) {
    this.inputs.toArray()[inputIndex].nativeElement.focus();
  }

  public formValid(form: FormGroup): Boolean {
    if (form == null) return false;
    if (form.controls == null) return false;
    return form.valid;
  }

  pushDataLayer(event:string){
    this.dataLayerService.pushEvent({
        'event': event,
        'form_id': 'error'
    });
  }
}
