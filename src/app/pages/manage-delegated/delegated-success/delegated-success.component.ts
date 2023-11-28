import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { DataLayerService } from 'src/app/shared/data-layer.service';

@Component({
  selector: 'app-delegated-success',
  templateUrl: './delegated-success.component.html',
  styleUrls: ['./delegated-success.component.scss'],
})
export class DelegatedSuccessComponent implements OnInit {
  public userInfo: any = {};

  constructor(
    public ActivatedRoute: ActivatedRoute,
    public titleService: Title,
    private router: Router,
    private dataLayerService: DataLayerService
  ) {}

  ngOnInit(): void {
    this.router.events.subscribe(value => {
      this.dataLayerService.pushEvent({ 
          event: "page_view" ,
          page_location: this.router.url.toString(),
          user_name: localStorage.getItem("user_name"),
          cii_organisataion_id: localStorage.getItem("cii_organisation_id"),
      });
    })
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
