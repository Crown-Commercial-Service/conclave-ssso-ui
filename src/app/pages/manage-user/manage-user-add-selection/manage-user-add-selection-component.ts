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

  @ViewChildren('input') inputs!: QueryList<ElementRef>;

  constructor(
    protected uiStore: Store<UIState>,
    public router: Router,
    private formBuilder: FormBuilder,
    protected viewportScroller: ViewportScroller,
    protected scrollHelper: ScrollHelper
  ) {
    super(uiStore, viewportScroller, scrollHelper);
    this.selectionForm = this.formBuilder.group({
      selection: ['', Validators.compose([Validators.required])],
    });
  }

  ngOnInit() {}

  ngAfterViewChecked() {
    this.scrollHelper.doScroll();
  }

  setFocus(inputIndex: number) {
    this.inputs.toArray()[inputIndex].nativeElement.focus();
  }

  public onSubmit(form: FormGroup) {
    this.submitted = true;
    if (this.formValid(form)) {
      this.submitted = false;

      let selection = form.get('selection')?.value;
      if (selection === 'singleUser') {
        this.router.navigateByUrl('manage-users/add-user/details');
      } else {
        console.log('Add Multiple Users Selected');
        this.router.navigateByUrl('manage-users/bulk-users');
      }
    }
  }

  public formValid(form: FormGroup): Boolean {
    if (form == null) return false;
    if (form.controls == null) return false;
    return form.valid;
  }

  onCancelClick() {
    this.router.navigateByUrl('manage-users');
  }
}
