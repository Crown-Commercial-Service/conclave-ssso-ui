import { ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { share } from 'rxjs/operators';

import { BaseComponent } from 'src/app/components/base/base.component';
import { slideAnimation } from 'src/app/animations/slide.animation';
import { UIState } from 'src/app/store/ui.states';
import { ciiService } from 'src/app/services/cii/cii.service';
import { ViewportScroller } from '@angular/common';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedDataService } from 'src/app/shared/shared-data.service';

@Component({
  selector: 'app-manage-organisation-profile-registry-search',
  templateUrl: './manage-organisation-profile-registry-search.component.html',
  styleUrls: ['./manage-organisation-profile-registry-search.component.scss'],
  animations: [
    slideAnimation({
      close: { 'transform': 'translateX(12.5rem)' },
      open: { left: '-12.5rem' }
    })
  ]
})
export class ManageOrganisationRegistrySearchComponent extends BaseComponent implements OnInit {
  private specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  public dunNumber: FormGroup | any;
  public items$!: Observable<any>;
  public scheme!: string;
  public schemeSubject: BehaviorSubject<string> = new BehaviorSubject<string>('GB-COH');
  public schemeSubjectObs: Observable<string> = this.schemeSubject.asObservable();
  public schemeName!: string;
  public txtValue!: string;
  public organisationId!: number;
  submitted: boolean = false;
  public orgId!: string;
  public validationObj: any = {
    activeElement: '',
    stringIdentifier: true,
    isDunlength: false,
    DunData: '',
  };

  @ViewChildren('input') inputs!: QueryList<ElementRef>;

  constructor(private ref: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private ciiService: ciiService, private router: Router, private route: ActivatedRoute,private SharedDataService:SharedDataService, protected uiStore: Store<UIState>, protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper) {
    super(uiStore, viewportScroller, scrollHelper);
    this.organisationId = parseInt(this.route.snapshot.paramMap.get('organisationId') || '0');
    this.txtValue = '';
    this.orgId = JSON.parse(localStorage.getItem('organisation_id') + '');
  }

  ngOnInit() {
    this.dunNumber = this.formBuilder.group({
      data1: [
        '',
        [Validators.required, Validators.minLength(3), Validators.maxLength(3)],
      ],
      data2: [
        '',
        [Validators.required, Validators.minLength(3), Validators.maxLength(3)],
      ],
      data3: [
        '',
        [Validators.required, Validators.minLength(3), Validators.maxLength(3)],
      ],
    });
    this.items$ = this.ciiService.getSchemes().pipe(share());
    this.items$.subscribe({
      next: result => {
        console.log(result);
        this.scheme = result[0].scheme;
        this.schemeName = result[0].schemeName;
        localStorage.setItem('scheme_name', this.schemeName);
      }
    });
  }

  ngAfterViewChecked() {
    this.scrollHelper.doScroll();
  }

  setFocus(inputIndex: number) {
    this.inputs.toArray()[inputIndex].nativeElement.focus();
  }

  // public onSubmit() {
  //   this.submitted = true;
  //   if (this.txtValue && this.txtValue.length > 0) {
  //     this.router.navigateByUrl(`manage-org/profile/${this.organisationId}/registry/search_confirm/${this.scheme}?id=${encodeURIComponent(this.txtValue)}`);
  //   }
  //   else {
  //     this.scrollHelper.scrollToFirst('error-summary');
  //   }
  // }


  public onSubmit() {
    this.submitted = true;
    this.validationObj.isDunlength = false;
    if (this.validationObj.activeElement == 'US-DUN') {
      this.validationObj.DunData =
       this.dunNumber.get('data1').value +
       this.dunNumber.get('data2').value +
       this.dunNumber.get('data3').value;
     if (this.validationObj.DunData.length >= 9) {
       this.validationObj.isDunlength = false;
       if (isNaN(this.validationObj.DunData) || this.specialChars.test(this.validationObj.DunData)) {
         this.validationObj.stringIdentifier = true;
       } else {
         this.validationObj.stringIdentifier = false;
         this.router.navigateByUrl(`manage-org/profile/${this.organisationId}/registry/search_confirm/${this.scheme}?id=${encodeURIComponent(this.validationObj.DunData)}`);

       }
     } else {
       this.validationObj.isDunlength=true
     }
   } else {
      if (this.txtValue && this.txtValue.length > 0) {
      this.router.navigateByUrl(`manage-org/profile/${this.organisationId}/registry/search_confirm/${this.scheme}?id=${encodeURIComponent(this.txtValue)}`);
      } else {
        this.scrollHelper.scrollToFirst('error-summary');
      }
    }
  }

  /**
   * DUN input fucus changing functionlity
   * @param Data input value
   * @param box which box user typing
   */
  public ValueChanged(data: string, box: string): void {
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

  /**
   * Focus dun nummber dynamically
   */
   public setDun_numberfocus() {
    let Controls = [
      { data: 'data3', key: 'input3' },
      { data: 'data2', key: 'input2' },
      { data: 'data1', key: 'input1' },
    ];
    Controls.forEach((f) => {
      if (!this.dunNumber.get(f.data).value || this.dunNumber.get(f.data).value.length < 3) {
        document.getElementById(f.key)?.focus();
      }
      if(isNaN(this.dunNumber.get(f.data).value) || this.specialChars.test(this.dunNumber.get(f.data).value)){
        document.getElementById(f.key)?.focus();
      }
    });
  }

  public onSelect(item: any) {
    this.schemeSubject.next(item.scheme);
    this.dunNumber.reset()
    this.validationObj.activeElement = item.scheme;
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
   * checking whether scheme should show or not
   * @param item getting scheme from html
   * @returns returning boolean true or false
   */
     public checkShowStatus(item:any){
      return this.SharedDataService.checkBlockedScheme(item) 
     }
}
