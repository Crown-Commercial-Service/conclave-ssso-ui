import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-find-your-administrator',
  templateUrl: './find-your-administrator.component.html',
  styleUrls: ['./find-your-administrator.component.scss']
})
export class FindyouradministratorComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  goBack() {
    window.history.back();
  }
}
