import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataMigrationService } from 'src/app/services/postgres/data-migration.service';
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
    usersColumnsToDisplay: ['key', 'value'],
    errorList: '',
    pageName: 'Contactadmin',
  }
  constructor(private DataMigrationService: DataMigrationService, private route: ActivatedRoute) {
    this.userUploadHistoryTable.data = {
      currentPage: this.userUploadHistoryTable.currentPage,
      pageCount: 0,
      rowCount: 0,
      organisationId: this.organisationId,
      errorList: [],
    };
   }


  ngOnInit(): void {
    this.route.queryParams.subscribe((details: any) => {
      this.getUploadedFilesDetails(details)
    });
  }


  public getUploadedFilesDetails(details:any) {
    this.DataMigrationService.getDataMigrationFileStatusById(details.data).subscribe((data)=>{
      this.userUploadHistoryTable.data.errorList = data.errorDetails
    })
}
}
