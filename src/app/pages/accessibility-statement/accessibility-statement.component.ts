import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataLayerService } from 'src/app/shared/data-layer.service';
import { SessionService } from 'src/app/shared/session.service';

@Component({
    selector: 'app-accessibility-statement',
    templateUrl: './accessibility-statement.component.html',
    styleUrls: ['./accessibility-statement.component.scss'],
    standalone: false
})
export class AccessibilityStatementComponent implements OnInit {

public representingTag={ 
  LevelA:'<span _ngcontent-ary-c81="" style="font-weight: 600; font-size: 24px;">',
  LevelAA:'<h1>',
  KeyboardLevelA:'<a>',
  PageTitledLevelA:'<html>'
}
public userName =  '';
public isOrgAdmin: boolean = false;

  constructor(private router: Router, private dataLayerService: DataLayerService,private sessionService:SessionService) { 
    this.isOrgAdmin = JSON.parse(localStorage.getItem('isOrgAdmin') || 'false');
    this.userName = this.sessionService.decrypt('user_name')
  }

  ngOnInit(): void {
    this.dataLayerService.pushPageViewEvent();
  }

  public print(buttonText:string):void{
    window.print()
    this.dataLayerService.pushClickEvent(buttonText);
  }

}
