import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
  ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';

import { BaseComponent } from 'src/app/components/base/base.component';
import { slideAnimation } from 'src/app/animations/slide.animation';
import { UIState } from 'src/app/store/ui.states';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { ViewportScroller } from '@angular/common';
import { PatternService } from 'src/app/shared/pattern.service';
import { SharedDataService } from 'src/app/shared/shared-data.service';
import { DataLayerService } from 'src/app/shared/data-layer.service';

@Component({
  selector: 'app-nominate',
  templateUrl: './nominate.component.html',
  styleUrls: ['./nominate.component.scss'],
  animations: [
    slideAnimation({
      close: { transform: 'translateX(12.5rem)' },
      open: { left: '-12.5rem' },
    }),
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NominateComponent extends BaseComponent {
  formGroup: FormGroup;
  submitted: boolean = false;
  public pageAccessMode:any;
  @ViewChildren('input') inputs!: QueryList<ElementRef>;

  constructor(
    private formBuilder: FormBuilder,
    private dataService: SharedDataService,
    private PatternService: PatternService,
    private authService: AuthService,
    public router: Router,
    protected uiStore: Store<UIState>,
    protected viewportScroller: ViewportScroller,
    protected scrollHelper: ScrollHelper,
    private ActivatedRoute: ActivatedRoute,
    private dataLayerService: DataLayerService
  ) {
    super(uiStore, viewportScroller, scrollHelper);
    this.formGroup = this.formBuilder.group({
      firstName: [
        ,
        Validators.compose([
          Validators.required,
          Validators.pattern(this.PatternService.NameValidator),
        ]),
      ],
      lastName: [
        ,
        Validators.compose([
          Validators.required,
          Validators.pattern(this.PatternService.NameValidator),
        ]),
      ],
      email: [
        ,
        Validators.compose([
          Validators.required,
          Validators.pattern(this.PatternService.emailPattern),
        ]),
      ],
    });
    this.ActivatedRoute.queryParams.subscribe((para: any) => {
      this.pageAccessMode = JSON.parse(atob(para.data));
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

  validateEmailLength(data: any) {
    if (this.PatternService.emailValidator(data.target.value)) {
      this.formGroup.controls['email'].setErrors({ incorrect: true });
    }
  }
  public onSubmit(form: FormGroup) {
    this.router.navigateByUrl(`nominate/success?data=` + btoa(JSON.stringify(this.pageAccessMode)));
    this.submitted = true;
    if (this.PatternService.emailValidator(form.get('email')?.value)) {
      this.formGroup.controls['email'].setErrors({ incorrect: true });
    }
    if (this.formValid(form)) {
      let uname = form.get('email')?.value;
      this.pushDataLayer("form_submit");
      this.authService
        .nominate(uname)
        .toPromise()
        .then(() => {
          this.submitted = false;
          this.dataService.NominiData.next(uname);
          this.router.navigateByUrl(`nominate/success?data=` + btoa(JSON.stringify(this.pageAccessMode)));
        });
    } else {
      this.pushDataLayer("form_error");
    }
    this.dataLayerService.pushEvent({ 
		  event: "cta_button_click" ,
		  page_location: "Nominate"
		});
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
  public customFocum(): void {
    if (
      this.formGroup.controls['firstName'].invalid &&
      this.formGroup.controls['lastName'].invalid
    ) {
      this.inputs.toArray()[0].nativeElement.focus();
    } else if (this.formGroup.controls['firstName'].invalid) {
      this.inputs.toArray()[0].nativeElement.focus();
    } else if (this.formGroup.controls['lastName'].invalid) {
      this.inputs.toArray()[1].nativeElement.focus();
    }
  }

  goBack() {
    window.history.back();
  }

  public goConfirmOrgPage():void{
    const schemeDetails = JSON.parse(localStorage.getItem('schemeDetails') || '');
    this.router.navigateByUrl(
      `manage-org/register/search/${schemeDetails.scheme}?id=${encodeURIComponent(
        schemeDetails.schemeID
      )}`
    );
  }

  pushDataLayer(event:string){
    this.dataLayerService.pushEvent({
        'event': event,
        'form_id': 'Create_administrator_account Nominate'
    });
  }
}
