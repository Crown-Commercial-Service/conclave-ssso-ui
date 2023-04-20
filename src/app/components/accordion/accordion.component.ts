import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss']
})
export class AccordionComponent implements OnInit, OnChanges {

  @Input() data!: any[];
  @Input() headerText!: string
  @Input() headerTextKeys!: string
  @Input() isAdmin!: boolean
  @Input() accessTable!: string
  @Input() groupShow!: boolean
  @Output() checkBoxRemoveRoles = new EventEmitter<any>();
  @Output() checkBoxAddRoles = new EventEmitter<any>();

  // public groupShow: boolean = false;
  constructor(private router: Router) { }

  ngOnChanges(): void {
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

  public toggleRoleForUser(id: string):void{
    const el: any = document.getElementById(id);
    el.style.display = (el.style.display === 'block') ? 'none' : 'block';
  }

  public goToEditGroup(groupId:any){
      let data = {
      isEdit: false,
      groupId: groupId,
      accessFrom: "users",
      isUserAccess: true
    };
    window.open( 'manage-groups/view?data=' + JSON.stringify(data));
  }
}
