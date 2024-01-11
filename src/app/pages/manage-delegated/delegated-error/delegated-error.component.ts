import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataLayerService } from 'src/app/shared/data-layer.service';

@Component({
  selector: 'app-delegated-error',
  templateUrl: './delegated-error.component.html',
  styleUrls: ['./delegated-error.component.scss']
})
export class DelegatedErrorComponent implements OnInit {

  constructor(private router: Router, private dataLayerService: DataLayerService) { }

  ngOnInit(): void {
    this.dataLayerService.pushPageViewEvent();
  }

}
