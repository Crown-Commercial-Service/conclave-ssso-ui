import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { share } from 'rxjs/operators';

import { BaseComponent } from 'src/app/components/base/base.component';
import { slideAnimation } from 'src/app/animations/slide.animation';
import { UIState } from 'src/app/store/ui.states';
import { ciiService } from 'src/app/services/cii/cii.service';
import { ViewportScroller } from '@angular/common';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-manage-organisation-registration-step-2',
  templateUrl: './manage-organisation-registration-step-2.component.html',
  styleUrls: ['./manage-organisation-registration-step-2.component.scss'],
  animations: [
    slideAnimation({
      close: { transform: 'translateX(12.5rem)' },
      open: { left: '-12.5rem' },
    }),
  ],
})
export class ManageOrgRegStep2Component
  extends BaseComponent
  implements OnInit
{
  public dunNumber: FormGroup | any;
  // public dunNumber:any = {
  //   data1:'',
  //   data2:'',
  //   data3:''
  // }
  public items$!: Observable<any>;
  public scheme!: string;
  public schemeSubject: BehaviorSubject<string> = new BehaviorSubject<string>(
    'GB-COH'
  );
  public schemeSubjectObs: Observable<string> =
    this.schemeSubject.asObservable();
  public schemeName!: string;
  public txtValue!: string;
  public activeElement: string = '';
  submitted: boolean = false;

  @ViewChildren('input') inputs!: QueryList<ElementRef>;

  constructor(
    private ref: ChangeDetectorRef,
    private ciiService: ciiService,
    private router: Router,
    protected uiStore: Store<UIState>,
    protected viewportScroller: ViewportScroller,
    protected scrollHelper: ScrollHelper,
    private formBuilder: FormBuilder
  ) {
    super(uiStore, viewportScroller, scrollHelper);
    this.txtValue = '';
  }

  ngOnInit() {
    this.dunNumber = this.formBuilder.group({
      data1: ["", [Validators.required,Validators.minLength(3),Validators.maxLength(3),Validators.pattern(/^[0-9]\d*$/)]],
      data2: ["", [Validators.required,Validators.minLength(3),Validators.maxLength(3),Validators.pattern(/^[0-9]\d*$/)]],
      data3: ["", [Validators.required,Validators.minLength(3),Validators.maxLength(3),Validators.pattern(/^[0-9]\d*$/)]],
    });

    this.items$ = this.ciiService.getSchemes().pipe(share());
    this.items$.subscribe({
      next: (result) => {
        this.scheme = result[0].scheme;
        this.schemeName = result[0].schemeName;
        localStorage.setItem('scheme_name', this.schemeName);
      },
    });
  }

  ngAfterViewChecked() {
    this.scrollHelper.doScroll();
  }

  setFocus(inputIndex: number) {
    this.inputs.toArray()[inputIndex].nativeElement.focus();
  }

  public onSubmit() {
    this.submitted = true;
    if (this.txtValue && this.txtValue.length > 0) {
      console.log('this.txtValue', this.txtValue, this.scheme);
      this.router.navigateByUrl(
        `manage-org/register/search/${this.scheme}?id=${encodeURIComponent(
          this.txtValue
        )}`
      );
    } else {
      this.scrollHelper.scrollToFirst('error-summary');
    }
  }

  public onBackClick() {
    this.router.navigateByUrl('manage-org/register/type');
  }

  public onSelect(item: any) {
    this.schemeSubject.next(item.scheme);
    this.activeElement = item.scheme;
    var el = document.getElementById(item.scheme) as HTMLInputElement;
    if (el) {
      el.checked = true;
    }
    this.scheme = item.scheme;
    this.submitted = false;
    this.txtValue = '';
    localStorage.setItem('scheme', this.scheme);
    localStorage.setItem('scheme_name', item.schemeName);
  }

  /**
   * DUN input fucus changing functionlity
   * @param Data input value
   * @param box which box user typing
   */
  public ValueChanged(data: string, box: string): void {
    console.log("event",data)
    // let StringyfyData = data.toString();
    if (box == 'input1' && data.length > 2) {
      document.getElementById('input2')?.focus();
    } else if (box == 'input2' && data.length > 2) {
      document.getElementById('input3')?.focus();
    }
  }


  /**
   * back space function
   * @param data data from html 
   * @param box box place value from html
   */
  public tiggerBackspace(data: any, box: string) {
    let StringyfyData: any;
    if (data) {
      StringyfyData = data.toString();
    } else {
      StringyfyData = null;
    }
    if (box == 'input2' && StringyfyData == null) {
      document.getElementById('input1')?.focus();
    } else if (box == 'input3' && StringyfyData == null) {
      document.getElementById('input2')?.focus();
    }
  }
  
  
}
