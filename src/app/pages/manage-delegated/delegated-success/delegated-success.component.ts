import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-delegated-success',
  templateUrl: './delegated-success.component.html',
  styleUrls: ['./delegated-success.component.scss'],
})
export class DelegatedSuccessComponent implements OnInit {
  public userInfo: any = {};

  constructor(
    public ActivatedRoute: ActivatedRoute,
    public titleService: Title
  ) {}

  ngOnInit(): void {
    this.ActivatedRoute.queryParams.subscribe((para: any) => {
      this.userInfo = JSON.parse(atob(para.data));
      this.userInfo.userName = decodeURIComponent(
        unescape(this.userInfo.userName)
      );
      switch (this.userInfo.status) {
        case 'create': {
          this.titleService.setTitle(`Delegated user successfully added - CCS`);
          break;
        }
        default: {
          //statements;
          break;
        }
      }
    });
  }
}
