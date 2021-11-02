import { ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
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

@Component({
  selector: 'app-manage-organisation-registration-step-2',
  templateUrl: './manage-organisation-registration-step-2.component.html',
  styleUrls: ['./manage-organisation-registration-step-2.component.scss'],
  animations: [
    slideAnimation({
      close: { 'transform': 'translateX(12.5rem)' },
      open: { left: '-12.5rem' }
    })
  ]
})
export class ManageOrgRegStep2Component extends BaseComponent implements OnInit {

  public items$!: Observable<any>;
  public scheme!: string;
  public schemeSubject: BehaviorSubject<string> = new BehaviorSubject<string>('GB-COH');
  public schemeSubjectObs: Observable<string> = this.schemeSubject.asObservable();
  public schemeName!: string;
  public txtValue!: string;
  submitted: boolean = false;

  @ViewChildren('input') inputs!: QueryList<ElementRef>;

  constructor(private ref: ChangeDetectorRef, private ciiService: ciiService, private router: Router, protected uiStore: Store<UIState>, protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper) {
    super(uiStore, viewportScroller, scrollHelper);
    this.txtValue = '';
  }

  ngOnInit() {
    this.items$ = this.ciiService.getSchemes().pipe(share());
    this.items$.subscribe({
      next: result => {
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

  public onSubmit() {
    this.submitted = true;
    if (this.txtValue && this.txtValue.length > 0) {
      this.router.navigateByUrl(`manage-org/register/search/${this.scheme}?id=${encodeURIComponent(this.txtValue)}`);
    }
    else {
      this.scrollHelper.scrollToFirst('error-summary');
    }
  }

  public onBackClick() {
    this.router.navigateByUrl('manage-org/register/type');
  }

  public onSelect(item: any) {
    this.schemeSubject.next(item.scheme);
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

}
