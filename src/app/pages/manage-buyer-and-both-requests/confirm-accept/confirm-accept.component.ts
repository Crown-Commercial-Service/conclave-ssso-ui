import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-confirm-accept',
  templateUrl: './confirm-accept.component.html',
  styleUrls: ['./confirm-accept.component.scss']
})
export class ConfirmAcceptComponent implements OnInit {

  private organisationId: string;

  constructor(private route: ActivatedRoute, private router: Router) {
    this.organisationId = localStorage.getItem('cii_organisation_id') || '';
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((para: any) => {
      let RouteData = JSON.parse(atob(para.data));
    });
  }

  public confirm(): void {
    // let UserSelectedinfo:any;
    // this.DelegatedService.createDelegatedUser(UserSelectedinfo).subscribe({
    //   next: (roleListResponse: any) => {
    //     this.router.navigateByUrl('buyer-and-both-success');
    //   },
    //   error: (error: any) => {
    //     this.route.navigateByUrl('delegated-error')
    //   },
    // });
    let data = {
      status: 'accept',
    };
    this.router.navigateByUrl(
      'buyer-and-both-success?data=' + btoa(JSON.stringify(data))
    );
  }

  public Back(): void {
    window.history.back();
  }

}
