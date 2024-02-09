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
    this.dataLayerService.pushPageViewEvent();
  }

}
