import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-delegated-success',
  templateUrl: './delegated-success.component.html',
  styleUrls: ['./delegated-success.component.scss']
})
export class DelegatedSuccessComponent implements OnInit {
public userInfo:any;
  constructor(private ActivatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.ActivatedRoute.queryParams.subscribe((para: any) => {
      this.userInfo = JSON.parse(atob(para.data));
      console.log("this.userInfo",this.userInfo)
    });
  }

}
