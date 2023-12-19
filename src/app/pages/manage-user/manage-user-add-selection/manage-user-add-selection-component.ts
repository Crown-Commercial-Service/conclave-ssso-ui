import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ViewportScroller } from '@angular/common';
import { BaseComponent } from 'src/app/components/base/base.component';
import { UIState } from 'src/app/store/ui.states';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { slideAnimation } from 'src/app/animations/slide.animation';
import { Router } from '@angular/router';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { DataLayerService } from 'src/app/shared/data-layer.service';
import { SessionService } from 'src/app/shared/session.service';

@Component({
  selector: 'app-manage-user-add-selection-component',
  templateUrl: './manage-user-add-selection-component.html',
  styleUrls: ['./manage-user-add-selection-component.scss'],
  animations: [
    slideAnimation({
      close: { transform: 'translateX(12.5rem)' },
      open: { left: '-12.5rem' },
    }),
  ],
})
export class ManageUserAddSelectionComponent
  extends BaseComponent
  implements OnInit
{
  submitted!: boolean;
  selectionForm!: FormGroup;
  public formId : string = 'Manage_user_accounts Add_users';

  @ViewChildren('input') inputs!: QueryList<ElementRef>;

  constructor(
    protected uiStore: Store<UIState>,
    public router: Router,
    private formBuilder: FormBuilder,
    protected viewportScroller: ViewportScroller,
    protected scrollHelper: ScrollHelper,
    private dataLayerService: DataLayerService,
    private sessionService:SessionService
  ) {
    super(uiStore, viewportScroller, scrollHelper);
    this.selectionForm = this.formBuilder.group({
      selection: ['', Validators.compose([Validators.required])],
    });
  }

  ngOnInit() {
    this.dataLayerService.pushPageViewEvent();
    this.dataLayerService.pushFormStartEvent(this.formId);
  }

  ngAfterViewChecked() {
    this.scrollHelper.doScroll();
  }

  setFocus(inputIndex: number) {
    this.inputs.toArray()[inputIndex].nativeElement.focus();
  }

  pushDataLayerEvent(buttonText:string) {
		this.dataLayerService.pushClickEvent(buttonText)
	  }

  public onSubmit(form: FormGroup) {
    this.submitted = true;
    if (this.formValid(form)) {
      this.dataLayerService.pushFormSubmitEvent(this.formId);
      this.submitted = false;

      let selection = form.get('selection')?.value;
      if (selection === 'singleUser') {
        this.router.navigateByUrl('manage-users/add-user/details');
      } else {
        console.log('Add Multiple Users Selected');
        this.router.navigateByUrl('manage-users/bulk-users');
      }
    } else {
      this.dataLayerService.pushFormErrorEvent(this.formId);
    }
  }

  public formValid(form: FormGroup): Boolean {
    if (form == null) return false;
    if (form.controls == null) return false;
    return form.valid;
  }

  onCancelClick(buttonText:string) {
    this.router.navigateByUrl('manage-users');
    this.pushDataLayerEvent(buttonText);
  }
}
