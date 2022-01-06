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

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends BaseComponent {

  formGroup: FormGroup;

  @ViewChildren('input') inputs!: QueryList<ElementRef>;

  constructor(private formBuilder: FormBuilder, private authService: AuthService,
    private router: Router, protected uiStore: Store<UIState>, private location: Location,
    protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper) {
    super(uiStore, viewportScroller, scrollHelper);
    this.formGroup = this.formBuilder.group({
      userName: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])],
    });
  }

  public onSubmit(form: FormGroup) {
    this.authService.login(form.get('userName')?.value, form.get('password')?.value);
  }

  public onCancelClick() {
    this.location.back();
  }
}
