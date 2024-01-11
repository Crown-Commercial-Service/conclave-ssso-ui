import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataLayerService } from 'src/app/shared/data-layer.service';

@Component({
  selector: 'app-buyer-both-error',
  templateUrl: './buyer-both-error.component.html',
  styleUrls: ['./buyer-both-error.component.scss']
})
export class BuyerBothErrorComponent implements OnInit {

  constructor(private router: Router, private dataLayerService: DataLayerService) { }

  ngOnInit(): void {
    this.dataLayerService.pushPageViewEvent();
  }

}
