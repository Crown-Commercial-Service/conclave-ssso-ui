import { ViewportScroller } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-terms-conditions',
  templateUrl: './terms-conditions.component.html',
  styleUrls: ['./terms-conditions.component.scss'],
})
export class TermsConditionsComponent implements OnInit {
  public userName = ''
  public isOrgAdmin: boolean = false;

  constructor(private router: Router, private scroller: ViewportScroller) {
    this.isOrgAdmin = JSON.parse(localStorage.getItem('isOrgAdmin') || 'false');
    this.userName = localStorage.getItem('user_name') || '';
  }

  ngOnInit(): void {}


  public scrollContent(id: string): void {
    document.getElementById(id)?.scrollIntoView({
      block: 'start',
      inline: 'nearest',
    });
  }
}
