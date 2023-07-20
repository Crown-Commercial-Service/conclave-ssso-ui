import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-environment-banner',
  templateUrl: './environment-banner.component.html',
  styleUrls: ['./environment-banner.component.scss']
})
export class EnvironmentBannerComponent implements OnInit {

  environmentName =  environment.uri.web.name
  constructor() { }

  ngOnInit(): void {
  }

}
