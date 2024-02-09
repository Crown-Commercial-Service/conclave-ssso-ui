import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Location, ViewportScroller } from '@angular/common';
import * as _ from 'lodash';
import { BaseComponent } from 'src/app/components/base/base.component';
import { UIState } from 'src/app/store/ui.states';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { DataLayerService } from 'src/app/shared/data-layer.service';
import { SessionService } from 'src/app/shared/session.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends BaseComponent {

  formGroup: FormGroup;
  public formId : string = 'Signin';

  @ViewChildren('input') inputs!: QueryList<ElementRef>;

  constructor(private formBuilder: FormBuilder, private authService: AuthService,
    private router: Router, protected uiStore: Store<UIState>, private location: Location,private sessionService:SessionService,
    protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper, private dataLayerService: DataLayerService) {
    super(uiStore, viewportScroller, scrollHelper);
    this.formGroup = this.formBuilder.group({
      userName: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])],
    });
  }

  ngOnInit() {
      this.dataLayerService.pushPageViewEvent();
      this.dataLayerService.pushFormStartEvent(this.formId, this.formGroup);
  }

  public onSubmit(form: FormGroup) {
    this.dataLayerService.pushFormSubmitEvent(this.formId);
    this.authService.login(form.get('userName')?.value, form.get('password')?.value);
  }

  pushDataLayerEvent(buttonText:string) {
   this.dataLayerService.pushClickEvent(buttonText);
  }

  public onCancelClick(buttonText:string) {
    this.location.back();
    this.pushDataLayerEvent(buttonText);
  }
}
