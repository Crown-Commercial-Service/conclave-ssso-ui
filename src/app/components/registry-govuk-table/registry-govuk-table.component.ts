import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PaginationService } from 'src/app/shared/pagination.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-registry-govuk-table',
  templateUrl: './registry-govuk-table.component.html',
  styleUrls: ['./registry-govuk-table.component.scss']
})
export class RegistryGovukTableComponent implements OnInit {
  @Input() headerText!: string[];
  @Input() data!: any[];
  @Output() hyperLinkClickEvent = new EventEmitter<any>();

  public pageCount?: number | any;
  public totalPagesArray: number[] = [];
  public tableVisibleData: any[] = [];
  public currentPage: number = 1;
  public pageSize: number = environment.listPageSize;
  public useClientPagination:boolean = true
  public useServerPagination:boolean =false
  
  constructor(private PaginationService:PaginationService) { }

  ngOnInit(): void {
  }
  ngOnChanges() {
    this.pageCount = Math.ceil(this.data.length / this.pageSize);
    this.totalPagesArray = Array(this.pageCount).fill(0).map((x, i) => i + 1);
    this.tableVisibleData = this.data.slice(0, this.pageSize);
    this.currentPage = 1;
   console.log("headerText",this.headerText)
   console.log("data",this.data)
  }

  public getPaginationData(): Array<any> {
    return this.PaginationService.getVisibleDots(this.currentPage,this.pageCount)
   }
   

   onSetPageClick(pageNumber: any) {
    if(pageNumber === '...') {
      return
    }
    this.currentPage = pageNumber;
    if (this.useClientPagination) {
      let startIndex = this.pageSize * (this.currentPage - 1);
      let endIndex = startIndex + this.pageSize;
      this.tableVisibleData = this.data.slice(startIndex, endIndex);
    }
    else {
      // this.changeCurrentPageEvent.emit(pageNumber);
    }
  }


  onRowClick(dataRow:any){
    this.hyperLinkClickEvent.emit(dataRow);
  }
}
