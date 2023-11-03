import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
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
import { environment } from 'src/environments/environment';
import { DataLayerService } from 'src/app/shared/data-layer.service';

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
  public isCustomMfaEnabled:boolean=environment.appSetting.customMfaEnabled;
  public items$!: Observable<any>;
  public scheme!: string;
  public schemeSubject: BehaviorSubject<string> = new BehaviorSubject<string>(
    'GB-COH'
  );
  public schemeSubjectObs: Observable<string> =
    this.schemeSubject.asObservable();
  public schemeName!: string;
  public txtValue!: string;
  public validationObj:any = {
    activeElement: '',
    stringIdentifier: true,
    isDunlength: false,
    DunData:'',
  };
  public pageAccessMode:any;
  submitted: boolean = false;
  public newScheme:any = [];

  @ViewChildren('input') inputs!: QueryList<ElementRef>;

  constructor(
    private ref: ChangeDetectorRef,
    private ciiService: ciiService,
    private router: Router,
    protected uiStore: Store<UIState>,
    protected viewportScroller: ViewportScroller,
    public scrollHelper: ScrollHelper,
    private formBuilder: FormBuilder,
    private ActivatedRoute: ActivatedRoute,
    private SharedDataService:SharedDataService,
    private dataLayerService: DataLayerService
  ) {
    super(uiStore, viewportScroller, scrollHelper);
    this.txtValue = '';
    this.ActivatedRoute.queryParams.subscribe((para: any) => {
      if(para.data != undefined){
        this.pageAccessMode = JSON.parse(atob(para.data));
        localStorage.setItem('organisation_type',this.pageAccessMode)
      } else {
        this.pageAccessMode = null
        localStorage.setItem('organisation_type','null')
      }
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
    this.items$ = this.ciiService.getSchemes().pipe(share());
    this.items$.subscribe({
      next: (result) => {
        this.newScheme = result
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
    let schemeDetails = {
      scheme:this.scheme,
      schemeID:this.txtValue,
    }
    this.submitted = true;
    this.validationObj.isDunlength = false;
      if (this.txtValue && this.txtValue.length > 0) {
        localStorage.setItem('schemeDetails', (JSON.stringify(schemeDetails)));
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
    // this.router.navigateByUrl('manage-org/register/type');
    window.history.back();
  }

  public onSelect(item: any) {
    this.schemeSubject.next(item.scheme);
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
