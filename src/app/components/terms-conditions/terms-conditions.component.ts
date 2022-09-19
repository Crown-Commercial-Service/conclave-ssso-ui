import { ViewportScroller } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-terms-conditions',
  templateUrl: './terms-conditions.component.html',
  styleUrls: ['./terms-conditions.component.scss']
})
export class TermsConditionsComponent implements OnInit {
  private userName = localStorage.getItem('user_name') || '';
  constructor(private router: Router,private scroller: ViewportScroller) { }

  ngOnInit(): void {
  }


  public navigateToHome():void{
    if(this.userName){
      this.router.navigateByUrl(`home`);
    }else{
      window.location.href='https://www.crowncommercial.gov.uk';  
    }
  }

  public scrollContent(id:string):void{
    document.getElementById(id) ?.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest"
    });
  }
}
