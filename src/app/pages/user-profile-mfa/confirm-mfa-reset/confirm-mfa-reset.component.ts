import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { SessionStorageKey } from 'src/app/constants/constant';
import { MFAService } from 'src/app/services/auth/mfa.service';
import { DataLayerService } from 'src/app/shared/data-layer.service';

@Component({
  selector: 'app-confirm-mfa-reset',
  templateUrl: './confirm-mfa-reset.component.html',
  styleUrls: ['./confirm-mfa-reset.component.scss'],
})
export class ConfirmMfaResetComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private mfaService: MFAService,
    private dataLayerService: DataLayerService
  ) {}

  public decodedData: any = { };
  isOrgAdmin: boolean = false;

  ngOnInit(): void {
    this.isOrgAdmin = JSON.parse(localStorage.getItem('isOrgAdmin') || 'false');
    this.route.queryParams.subscribe((para: any) => {
      let RouteData = JSON.parse(atob(para.data));
      this.decodedData = RouteData;
    });
    this.dataLayerService.pushPageViewEvent();
  }

  public navigateTosuccess(buttonText:string): void {
    this.mfaService
      .sendResetMFANotification(this.decodedData.data)
      .toPromise()
      .then(() => {
        this.router.navigateByUrl(
          'user-mfa-reset-success?data=' +btoa(JSON.stringify(this.decodedData))
        );
      })
      .catch((error: any) => {
        if (error?.status != 401) {
            this.router.navigateByUrl(
              'user-mfa-reset-success?error=' + +btoa(JSON.stringify(this.decodedData))
            );
          }
      });
      this.pushDataLayerEvent(buttonText);
  }

  public OnCancel(buttonText:string):void {
    window.history.back();
    this.pushDataLayerEvent(buttonText);
  }

  pushDataLayerEvent(buttonText:string) {
		this.dataLayerService.pushClickEvent(buttonText)
	  }
}
