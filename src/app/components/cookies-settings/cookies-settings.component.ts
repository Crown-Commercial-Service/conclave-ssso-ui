import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-cookies-settings',
  templateUrl: './cookies-settings.component.html',
  styleUrls: ['./cookies-settings.component.scss']
})
export class CookiesSettingsComponent implements OnInit {
  essentialcookies_Header = ['Name', 'Purpose', 'Expires'];
  essentialcookies_Display= ['notify_admin_session', 'Used to keep you signed in', '20'];
  public essentialcookiesData: any = [
    'notify_admin_session','Used to keep you signed in','20',
  ];

  notify_admin_session =  environment.cookies_policy.essentialcookies.notify_admin_session;
  cookie_policy =  environment.cookies_policy.essentialcookies.cookie_policy;

  _ga =  environment.cookies_policy.analyticscookies._ga;
  _gid =  environment.cookies_policy.analyticscookies._gid;

  constructor() { }

  ngOnInit(): void {
  }

}
