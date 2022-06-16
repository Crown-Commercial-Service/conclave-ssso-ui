import { Component, OnInit } from '@angular/core';

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

  constructor() { }

  ngOnInit(): void {
  }

  public print():void{
    window.print()
  }

}
