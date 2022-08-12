import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-delegated-user-status',
  templateUrl: './delegated-user-status.component.html',
  styleUrls: ['./delegated-user-status.component.scss'],
})
export class DelegatedUserStatusComponent implements OnInit {
  constructor(private route: ActivatedRoute, private router: Router) {}
  public UserStatus = {
    header: '',
    Description: '',
    Breadcrumb: '',
    status: '',
  };

  ngOnInit(): void {
    this.route.queryParams.subscribe((para: any) => {
      let RouteData = JSON.parse(atob(para.data));
      switch (RouteData.status) {
        case '001': {
          this.UserStatus = RouteData;
          break;
        }
        case '002': {
          this.UserStatus = RouteData;
          //statements;
          break;
        }
        default: {
          //statements;
          break;
        }
      }
    });
  }

  public BackToDelegated() {
    this.router.navigateByUrl('delegated-access');
  }
  public BackToDashboard() {
    this.router.navigateByUrl('home');
  }
}
