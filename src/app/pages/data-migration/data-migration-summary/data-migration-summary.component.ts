import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataLayerService } from 'src/app/shared/data-layer.service';
import { SessionService } from 'src/app/shared/session.service';

@Component({
  selector: 'app-data-migration-summary',
  templateUrl: './data-migration-summary.component.html',
  styleUrls: ['./data-migration-summary.component.scss']
})
export class DataMigrationSummaryComponent implements OnInit {

  constructor(private router: Router, private dataLayerService: DataLayerService,private sessionService:SessionService) { }

  ngOnInit(): void {
    this.router.events.subscribe(value => {
      this.dataLayerService.pushEvent({ 
          event: "page_view" ,
          page_location: this.router.url.toString(),
          user_name: this.sessionService.decrypt('user_name'),
          cii_organisataion_id: localStorage.getItem("cii_organisation_id"),
      });
    })
  }

}
