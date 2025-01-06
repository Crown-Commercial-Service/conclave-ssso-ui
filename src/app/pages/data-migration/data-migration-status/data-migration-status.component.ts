import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { DataMigrationService } from 'src/app/services/postgres/data-migration.service';
import { DataLayerService } from 'src/app/shared/data-layer.service';
import { SessionService } from 'src/app/shared/session.service';

@Component({
  selector: 'app-data-migration-status',
  templateUrl: './data-migration-status.component.html',
  styleUrls: ['./data-migration-status.component.scss']
})
export class DataMigrationStatusComponent implements OnInit {

  constructor(private DataMigrationService: DataMigrationService,private sessionService:SessionService, private route: ActivatedRoute, private router: Router, private dataLayerService: DataLayerService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((details: any) => {
      this.triggerDataMigrationStatus(details)
    });
    this.dataLayerService.pushPageViewEvent();
  }

  private triggerDataMigrationStatus(details:any){
    this.getUploadedFilesDetails(details)
   }


   private getUploadedFilesDetails(details:any) {
    this.DataMigrationService.getDataMigrationFileStatusById(details.data).subscribe((data)=>{
      if(data.dataMigrationStatus === 0){
       this.triggerDataMigrationStatus(details)
      }
    })
}
}
