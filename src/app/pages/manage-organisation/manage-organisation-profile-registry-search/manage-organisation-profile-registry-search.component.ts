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
    private SharedDataService:SharedDataService,
    private formBuilder: FormBuilder,
    private ciiService: ciiService, private router: Router, private route: ActivatedRoute, protected uiStore: Store<UIState>, protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper) {
    super(uiStore, viewportScroller, scrollHelper);
    this.organisationId = parseInt(this.route.snapshot.paramMap.get('organisationId') || '0');
    this.txtValue = '';
    this.orgId = JSON.parse(localStorage.getItem('organisation_id') + '');
  }

  ngOnInit() {
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
      if (this.txtValue && this.txtValue.length > 0) {
      this.router.navigateByUrl(`manage-org/profile/${this.organisationId}/registry/search_confirm/${this.scheme}?id=${encodeURIComponent(this.txtValue)}`);
      } else {
        this.scrollHelper.scrollToFirst('error-summary');
      }
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
