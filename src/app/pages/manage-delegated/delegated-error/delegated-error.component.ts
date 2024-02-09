import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataLayerService } from 'src/app/shared/data-layer.service';
import { SessionService } from 'src/app/shared/session.service';

@Component({
  selector: 'app-delegated-error',
  templateUrl: './delegated-error.component.html',
  styleUrls: ['./delegated-error.component.scss']
})
export class DelegatedErrorComponent implements OnInit {

  constructor(private router: Router, private dataLayerService: DataLayerService,private sessionService:SessionService) { }

  ngOnInit(): void {
    this.dataLayerService.pushPageViewEvent();
  }

}
