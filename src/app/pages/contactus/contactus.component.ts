import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';

import { BaseComponent } from 'src/app/components/base/base.component';
import { slideAnimation } from 'src/app/animations/slide.animation';
import { UIState } from 'src/app/store/ui.states';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { ViewportScroller } from '@angular/common';
import { PatternService } from 'src/app/shared/pattern.service';
import { DataLayerService } from 'src/app/shared/data-layer.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contactus',
  templateUrl: './contactus.component.html',
  styleUrls: ['./contactus.component.scss'],
  animations: [
    slideAnimation({
      close: { 'transform': 'translateX(12.5rem)' },
      open: { left: '-12.5rem' }
    })
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactUsComponent extends BaseComponent implements OnInit {

  formGroup: FormGroup;
  submitted: boolean = false;

  constructor(public formBuilder: FormBuilder,public PatternService:PatternService, protected uiStore: Store<UIState>, protected viewportScroller: ViewportScroller,
    protected scrollHelper: ScrollHelper, private dataLayerService: DataLayerService, private router: Router) {
    super(uiStore,viewportScroller,scrollHelper);
    this.formGroup = this.formBuilder.group({
      firstName: [, Validators.compose([Validators.required])],
      email: [, Validators.compose([Validators.required, Validators.pattern(this.PatternService.emailPattern)
      ])],
    });
  }

  ngOnInit() {
    this.router.events.subscribe(value => {
      this.dataLayerService.pushEvent({ 
       event: "page_view" ,
       page_location: this.router.url.toString(),
       user_name: localStorage.getItem("user_name"),
       cii_organisataion_id: localStorage.getItem("cii_organisation_id"),
     });
    })
  }

  public onSubmit(form: FormGroup) {
    this.submitted = true;
    if(this.PatternService.emailValidator(form.get('email')?.value)){
      this.formGroup.controls['email'].setErrors({ 'incorrect': true})
}
    if (this.formValid(form)) {
      this.pushDataLayer("form_submit");
      // this.authService.nominate(form.get('firstName')?.value, form.get('lastName')?.value, form.get('email')?.value).toPromise().then((response: any) => {
      //   console.log(response);
         this.submitted = false;
      //   this.router.navigateByUrl(`nominate/success`);
      // }, (err) => {
      //   console.log(err);
      // });
    } else {
      this.pushDataLayer("form_error");
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

  pushDataLayer(event:string){
    this.dataLayerService.pushEvent({
        'event': event,
        'form_id': 'contact_us'
    });
  }
}
