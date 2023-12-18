import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataLayerService } from 'src/app/shared/data-layer.service';
import { SessionService } from 'src/app/shared/session.service';

@Component({
  selector: 'app-find-your-administrator',
  templateUrl: './find-your-administrator.component.html',
  styleUrls: ['./find-your-administrator.component.scss']
})
export class FindyouradministratorComponent implements OnInit {

  constructor(private router: Router, private dataLayerService: DataLayerService,private sessionService:SessionService) { }

  ngOnInit(): void {
    this.dataLayerService.pushPageViewEvent();
  }

  goBack(buttonText:string) {
    window.history.back();
   this.dataLayerService.pushClickEvent(buttonText);
  }
}
