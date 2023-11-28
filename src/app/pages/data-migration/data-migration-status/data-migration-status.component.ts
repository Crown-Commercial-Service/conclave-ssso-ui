import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { DataMigrationService } from 'src/app/services/postgres/data-migration.service';
import { DataLayerService } from 'src/app/shared/data-layer.service';

@Component({
  selector: 'app-data-migration-status',
  templateUrl: './data-migration-status.component.html',
  styleUrls: ['./data-migration-status.component.scss']
})
export class DataMigrationStatusComponent implements OnInit {

  constructor(private DataMigrationService: DataMigrationService, private route: ActivatedRoute, private router: Router, private dataLayerService: DataLayerService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((details: any) => {
      this.triggerDataMigrationStatus(details)
    });
    this.router.events.subscribe(value => {
      this.dataLayerService.pushEvent({ 
          event: "page_view" ,
          page_location: this.router.url.toString(),
          user_name: localStorage.getItem("user_name"),
          cii_organisataion_id: localStorage.getItem("cii_organisation_id"),
      });
    })
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
