import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss']
})
export class AccordionComponent implements OnInit, OnChanges {

  @Input() data!: any[];
  @Input() headerTextKeys!: string
  @Input() isAdmin!: boolean
  @Output() checkBoxRemoveRoles = new EventEmitter<any>();
  @Output() checkBoxAddRoles = new EventEmitter<any>();

  public groupShow: boolean = false;
  constructor() { }

  ngOnChanges(): void {
    console.log("isAdmin",this.isAdmin)
  }

  ngOnInit(): void {
  }

  public onTopToggle(): void {
    this.groupShow = !this.groupShow
  }

  public onBottomToggle(id: string): void {
    const el: any = document.getElementById(id);
    el.style.display = (el.style.display === 'block') ? 'none' : 'block';
  }

  public getElementStatus(id: string) {
    const el: any = document.getElementById(id);
    return el.style.display === 'block' ? 'Hide services' : 'Show services'
  }

  public onCheckBoxClick(data: any, checkValue: any): void {
    const eventName = checkValue ? 'checkBoxRemoveRoles' : 'checkBoxAddRoles';
    this[eventName].emit(data);
  }
}
