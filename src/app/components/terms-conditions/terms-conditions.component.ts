import { ViewportScroller } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataLayerService } from 'src/app/shared/data-layer.service';
import { SessionService } from 'src/app/shared/session.service';

@Component({
  selector: 'app-terms-conditions',
  templateUrl: './terms-conditions.component.html',
  styleUrls: ['./terms-conditions.component.scss'],
})
export class TermsConditionsComponent implements OnInit {
  public userName = ''
  public isOrgAdmin: boolean = false;

  constructor(private router: Router, private scroller: ViewportScroller, private dataLayerService: DataLayerService, private sessionService:SessionService) {
    this.isOrgAdmin = JSON.parse(localStorage.getItem('isOrgAdmin') || 'false');
    this.userName = this.sessionService.decrypt('user_name')
  }

  ngOnInit(): void {
    this.dataLayerService.pushPageViewEvent();
  }


  public scrollContent(id: string): void {
    document.getElementById(id)?.scrollIntoView({
      block: 'start',
      inline: 'nearest',
    });
  }
}
