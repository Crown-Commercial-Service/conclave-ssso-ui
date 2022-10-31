import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-remove-right-to-buy',
  templateUrl: './remove-right-to-buy.component.html',
  styleUrls: ['./remove-right-to-buy.component.scss']
})
export class RemoveRightToBuyComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit(): void {
  }

 public Back():void {
    window.history.back();
  }
  public confirm(){
    let data = {
      status: 'remove',
    };
    this.router.navigateByUrl(
      'remove-right-to-buy-success?data=' + btoa(JSON.stringify(data))
    );
  }
}
