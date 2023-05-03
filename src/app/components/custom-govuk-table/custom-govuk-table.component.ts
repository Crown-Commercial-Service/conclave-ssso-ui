import { ViewportScroller } from '@angular/common';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { UIState } from 'src/app/store/ui.states';
import { environment } from 'src/environments/environment';
import { BaseComponent } from '../base/base.component';
@Component({
  selector: 'app-custom-govuk-table',
  templateUrl: './custom-govuk-table.component.html',
  styleUrls: ['./custom-govuk-table.component.scss']
})
export class CustomGovukTableComponent extends BaseComponent implements OnInit {

  @Input() headerTextKeys!: string[];
  @Input() data!: any[];
  @Input() dataKeys!: string[];
  @Input() isHyperLinkVisible?: boolean;
  @Input() hyperLinkText?: string;
  @Input() isCheckBoxVisible?: boolean;
  @Input() isRadioVisible?: boolean;
  @Input() useServerPagination?: boolean;
  @Input() serverPageCount?: number;
  @Input() serverPageCurrentPage?: number;
  @Input() useClientPagination?: boolean;
  @Input() pageName?: string;
  @Input() hyperLinkArray?:string[];
  @Input() hyperArrayVisible?:boolean;
  @Output() hyperLinkClickEvent = new EventEmitter<any>();
  @Output() checkBoxClickEvent = new EventEmitter<any>();
  @Output() radioClickEvent = new EventEmitter<any>();
  @Output() changeCurrentPageEvent = new EventEmitter<number>();

  pageCount?: number;
  currentPage: number = 1;
  totalPagesArray: number[] = [];
  pageSize: number = environment.listPageSize;
  tableVisibleData!: any[];
  constructor(
    protected uiStore: Store<UIState>, protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper) {
    super(uiStore, viewportScroller, scrollHelper);
  }

  ngOnInit() {
  }

  ngOnChanges() {
  this.initChanges()
  }

  private initChanges(){
    this.pageCount = this.serverPageCount;
    this.tableVisibleData = this.data;
    this.totalPagesArray = Array(this.serverPageCount).fill(0).map((x, i) => i + 1);
    this.currentPage = this.serverPageCurrentPage || 1;
  }

  public onTableRowClick(dataRow: any, index: number,event:any) {
    dataRow.event=event
    this.hyperLinkClickEvent.emit(dataRow);
  }

  public onSetPageClick(pageNumber: number) {
      this.changeCurrentPageEvent.emit(pageNumber);
  }
}
