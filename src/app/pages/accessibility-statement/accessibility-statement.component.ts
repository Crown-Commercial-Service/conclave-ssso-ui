import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-accessibility-statement',
  templateUrl: './accessibility-statement.component.html',
  styleUrls: ['./accessibility-statement.component.scss']
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
  constructor(private router: Router) { 
    this.isOrgAdmin = JSON.parse(localStorage.getItem('isOrgAdmin') || 'false');
    this.userName = localStorage.getItem('user_name') || '';
  }

  ngOnInit(): void {
  }

  public print():void{
    window.print()
  }

  public navigateToHome():void{
    if(this.userName){
      this.router.navigateByUrl(`home`);
    }else{
      window.location.href='https://www.crowncommercial.gov.uk';  
    }
  }
}
