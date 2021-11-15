import { ViewportScroller } from '@angular/common';
import { Component, OnInit, Output, EventEmitter, ViewChildren, QueryList, ChangeDetectorRef, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { UIState } from 'src/app/store/ui.states';
import { ciiService } from 'src/app/services/cii/cii.service';
import { share } from 'rxjs/operators';
import { BaseComponent } from '../../base/base.component';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-cii-options',
  templateUrl: './cii-options.component.html',
  styleUrls: ['./cii-options.component.scss']
})
export class CIIOptions extends BaseComponent implements OnInit {

  public items$!: Observable<any>;
  public scheme!: string;
  public schemeSubject: BehaviorSubject<string> = new BehaviorSubject<string>('GB-COH');
  public schemeSubjectObs: Observable<string> = this.schemeSubject.asObservable();
  public schemeName!: string;
  public txtValue!: string;
  submitted: boolean = false;

  @Output() onOrgSeleceted = new EventEmitter<string>();
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
        localStorage.setItem('scheme', this.scheme);
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
      this.onOrgSeleceted.emit(this.txtValue);
    }
    else {
      this.scrollHelper.scrollToFirst('error-summary');
    }
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
