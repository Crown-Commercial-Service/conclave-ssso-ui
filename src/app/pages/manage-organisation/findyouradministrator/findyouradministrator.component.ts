import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-findyouradministrator',
  templateUrl: './findyouradministrator.component.html',
  styleUrls: ['./findyouradministrator.component.scss']
})
export class FindyouradministratorComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  goBack() {
    window.history.back();
  }
}
