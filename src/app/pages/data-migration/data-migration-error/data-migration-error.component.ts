import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-data-migration-error',
  templateUrl: './data-migration-error.component.html',
  styleUrls: ['./data-migration-error.component.scss']
})
export class DataMigrationErrorComponent implements OnInit {
  private organisationId: string ='';
  public userUploadHistoryTable: any = {
    currentPage: 1,
    pageCount: 0,
    pageSize: environment.listPageSize,
    usersTableHeaders: ['Error description', 'Row'],
    usersColumnsToDisplay: ['description', 'row'],
    userList: '',
    pageName: 'Contactadmin',
  }
  constructor() {
    this.userUploadHistoryTable.userList = {
      currentPage: this.userUploadHistoryTable.currentPage,
      pageCount: 0,
      rowCount: 0,
      organisationId: this.organisationId,
      userList: [],
    };
   }

  ngOnInit(): void {

    this.userUploadHistoryTable.userList.userList = [
      {
          description: 'invalid details',
          row:'Row 1'  
      },
      {
          description: 'invalid details',
          row:'Row 2'  
      },
  ]
  }

}
