import { ViewportScroller } from '@angular/common';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { UIState } from 'src/app/store/ui.states';
import { environment } from 'src/environments/environment';
import { BaseComponent } from '../base/base.component';
import { PaginationService } from 'src/app/shared/pagination.service';
import { HelperService } from 'src/app/shared/helper.service';

@Component({
  selector: 'app-govuk-table',
  templateUrl: './govuk-table.component.html',
  styleUrls: ['./govuk-table.component.scss']
})
export class GovUKTableComponent extends BaseComponent implements OnInit {

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
  @Input() isRadioDisabled?: (dataRow: any) => boolean;
  @Input() isHyperLinkRowVisible?: (dataRow: any) => boolean;

  pageCount?: number | any;
  currentPage: number = 1;
  totalPagesArray: number[] = [];
  pageSize: number = environment.listPageSize;
  tableVisibleData: any[] = [];
  selectedRadioId: string = 'table-radio-id-non';
  public maxVisibleDots = 5
   constructor(
    // private translateService: TranslateService,
    private PaginationService:PaginationService,public helperservice:HelperService,
    protected uiStore: Store<UIState>, protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper) {
    super(uiStore, viewportScroller, scrollHelper);
  }

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.useClientPagination) {
      this.pageCount = Math.ceil(this.data.length / this.pageSize);
      this.totalPagesArray = Array(this.pageCount).fill(0).map((x, i) => i + 1);
      this.tableVisibleData = this.data.slice(0, this.pageSize);
      this.currentPage = 1;
    }
    else {
      this.totalPagesArray = Array(this.serverPageCount).fill(0).map((x, i) => i + 1);
      this.pageCount = this.serverPageCount;
      this.tableVisibleData = this.data;
      this.currentPage = this.serverPageCurrentPage || 1;
    }
  }

 public getPaginationData(): Array<any> {
   return this.PaginationService.getVisibleDots(this.currentPage,this.pageCount)
  }
  

  onRowClick(dataRow: any, index: number,event:any) {
    if (this.isCheckBoxVisible && !dataRow.isDisable) {
      dataRow.isChecked = !dataRow.isChecked;
      this.checkBoxClickEvent.emit(dataRow);
    }
    else if (this.isRadioVisible) {
      if (!dataRow.isDormant) {
        this.selectedRadioId = 'table-radio-id-' + index;
        this.radioClickEvent.emit(dataRow);
      }
      else if (this.pageName ==='OUS')
      {
        this.selectedRadioId = 'table-radio-id-' + index;
        this.radioClickEvent.emit(dataRow);
      }
    }
    else if (this.isHyperLinkVisible || this.hyperArrayVisible) {
      if(dataRow.contactReason!='REGISTRY')
      {
      if(this.hyperArrayVisible){
        dataRow.event=event
        this.hyperLinkClickEvent.emit(dataRow);
      }else{
        this.hyperLinkClickEvent.emit(dataRow);
      }
    }
    }
    else {
    }
  }

  onSetPageClick(pageNumber: any) {
    if(pageNumber === '...') {
      return
    }
    if (this.isRadioVisible) { // Emit the event to remove the radio selection 
      this.selectedRadioId = 'table-radio-id-non';
      this.radioClickEvent.emit(null);
    }
    this.currentPage = pageNumber;
    if (this.useClientPagination) {
      let startIndex = this.pageSize * (this.currentPage - 1);
      let endIndex = startIndex + this.pageSize;
      this.tableVisibleData = this.data.slice(startIndex, endIndex);
    }
    else {
      this.changeCurrentPageEvent.emit(pageNumber);
    }
  }


  public findDateKey(key: string): boolean {
    const dateKeys = ['endDate','startDate','dateofRegistration', 'dateOfRegistration', 'dateOfUpload', 'date'];
    return dateKeys.includes(key);
  }
}