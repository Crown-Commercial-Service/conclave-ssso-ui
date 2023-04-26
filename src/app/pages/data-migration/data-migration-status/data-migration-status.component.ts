import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { DataMigrationService } from 'src/app/services/postgres/data-migration.service';

@Component({
  selector: 'app-data-migration-status',
  templateUrl: './data-migration-status.component.html',
  styleUrls: ['./data-migration-status.component.scss']
})
export class DataMigrationStatusComponent implements OnInit {

  constructor(private DataMigrationService: DataMigrationService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((details: any) => {
      this.getUploadedFilesDetails(details)
    });
  }


  public getUploadedFilesDetails(details:any) {
    this.DataMigrationService.getDataMigrationFileStatusById(details.data).subscribe((data)=>{
      console.log("data",data)
    })
}
}
