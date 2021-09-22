import { ViewportScroller } from '@angular/common';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { UIState } from 'src/app/store/ui.states';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss']
})
export class SearchBoxComponent extends BaseComponent implements OnInit {

  searchTextValue: string = "";

  @Input()
  get searchText() {
    return this.searchTextValue;
  }

  @Output() searchTextChange = new EventEmitter();
  set searchText(val) {
    this.searchTextValue = val;
    this.searchTextChange.emit(this.searchTextValue);
  }

  @Output() onSearchClickEvent = new EventEmitter<any>();

  constructor(
    protected uiStore: Store<UIState>, protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper) {
    super(uiStore, viewportScroller, scrollHelper);
  }

  ngOnInit() {
  }

  onSearchClick() {
    this.onSearchClickEvent.emit();
  }
}
