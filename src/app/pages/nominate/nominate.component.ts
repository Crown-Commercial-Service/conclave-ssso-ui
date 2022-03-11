import { ChangeDetectionStrategy, Component, ElementRef, OnInit, QueryList, ViewChildren, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';

import { BaseComponent } from 'src/app/components/base/base.component';
import { slideAnimation } from 'src/app/animations/slide.animation';
import { UIState } from 'src/app/store/ui.states';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { ViewportScroller } from '@angular/common';
import { PatternService } from 'src/app/shared/pattern.service';

@Component({
  selector: 'app-nominate',
  templateUrl: './nominate.component.html',
  styleUrls: ['./nominate.component.scss'],
  animations: [
    slideAnimation({
      close: { 'transform': 'translateX(12.5rem)' },
      open: { left: '-12.5rem' }
    })
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NominateComponent extends BaseComponent {

  formGroup: FormGroup;
  submitted: boolean = false;
  @ViewChildren('input') inputs!: QueryList<ElementRef>;

  constructor(private formBuilder: FormBuilder,
    private PatternService:PatternService,
    private authService: AuthService, private router: Router,
    protected uiStore: Store<UIState>, protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper) {
    super(uiStore, viewportScroller, scrollHelper);
    this.formGroup = this.formBuilder.group({
      firstName: [, Validators.compose([Validators.required])],
      lastName: [, Validators.compose([Validators.required])],
      email: [, Validators.compose([Validators.required, Validators.pattern(this.PatternService.emailPattern)])],
    });
  }

  validateEmailLength(data:any){
    if(this.PatternService.emailValidator(data.target.value)){
        this.formGroup.controls['email'].setErrors({ 'incorrect': true})
      }
}
  public onSubmit(form: FormGroup) {
    this.submitted = true;
 if(this.PatternService.emailValidator(form.get('email')?.value)){
  this.formGroup.controls['email'].setErrors({ 'incorrect': true})
}
    if (this.formValid(form)) {
      let uname = form.get('email')?.value;
      this.authService.nominate(uname).toPromise().then(() => {
        this.submitted = false;
        this.router.navigateByUrl(`nominate/success?uid=` + encodeURIComponent(uname));
      });
    }
  }

  /**
    * iterate through each form control and validate
    */
  public formValid(form: FormGroup): Boolean {
    if (form == null) return false;
    if (form.controls == null) return false;
    return form.valid;
    // let array = _.takeWhile(form.controls, function(c:FormControl) { return !c.valid; });
    // let array = _.takeWhile([], function(c:FormControl) { return !c.valid; });
    // return array.length > 0;
  }

  setFocus(inputIndex: number) {
    if (this.inputs.toArray()[inputIndex]) {
      this.inputs.toArray()[inputIndex].nativeElement.focus();
    }
  }

  goBack(){
    window.history.back();
  }

}
