import { ViewportScroller } from '@angular/common';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { UIState } from 'src/app/store/ui.states';
import { BaseComponent } from '../base/base.component';
import { DataLayerService } from 'src/app/shared/data-layer.service';

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss']
})
export class SearchBoxComponent extends BaseComponent implements OnInit {

  searchTextValue: string = "";
  @Input() pageName: string = "";

  @Input()
  get searchText() {
    return this.searchTextValue;
  }

  @Output() searchTextChange = new EventEmitter();
  set searchText(val) {
    let interactiontype = "";

    if(this.searchTextValue.length > 0 && val.length === 0){
      interactiontype = "clear";
    }
    else if(this.searchTextValue.length > val.length){
      interactiontype = "remove";
    }  
    this.searchTextValue = val;
    if(interactiontype != ""){
      this.dataLayerService.pushEvent({ 
        event: "search_filter" ,
        interaction_type: interactiontype,
        interaction_detail: this.pageName
      });
    }
    this.searchTextChange.emit(this.searchTextValue);
  }

  @Output() onSearchClickEvent = new EventEmitter<any>();

  constructor(
    protected uiStore: Store<UIState>, protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper,public dataLayerService: DataLayerService) {
    super(uiStore, viewportScroller, scrollHelper);
  }

  ngOnInit() {
  }

  onSearchClick() {
    this.onSearchClickEvent.emit();
    this.dataLayerService.pushEvent({ 
		  event: "view_search_results" ,
		  interaction_detail: this.pageName
		});
  }
}
