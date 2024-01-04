import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataMigrationService } from 'src/app/services/postgres/data-migration.service';
import { DataLayerService } from 'src/app/shared/data-layer.service';
import { SessionService } from 'src/app/shared/session.service';
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
  constructor(private DataMigrationService: DataMigrationService,private sessionService:SessionService, private activatedRoute: ActivatedRoute, private router: Router, private dataLayerService: DataLayerService) {
    this.userUploadHistoryTable.data = {
      currentPage: this.userUploadHistoryTable.currentPage,
      pageCount: 0,
      rowCount: 0,
      organisationId: this.organisationId,
      errorList: [],
    };
   }


  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((routeData: any) => {
      this.getUploadedFilesDetails(routeData)
    });
    this.dataLayerService.pushPageViewEvent();
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['isNewTab'] === 'true') {
        const urlTree = this.router.parseUrl(this.router.url);
        delete urlTree.queryParams['isNewTab'];
        this.router.navigateByUrl(urlTree.toString(), { replaceUrl: true });
      }
    });
  }


  public getUploadedFilesDetails(details:any) {
    this.DataMigrationService.getDataMigrationFileStatusById(details.data).subscribe((data)=>{
      this.userUploadHistoryTable.data.errorList = data.errorDetails
    })
}
}
