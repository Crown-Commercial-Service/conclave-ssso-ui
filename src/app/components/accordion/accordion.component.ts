import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

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

  @Input() noRoleMessage!: string
  @Input() noDataGroupsMemberMessage!: string
  @Input() noDatanoneGroupsMemberMessage!: string


  @Output() checkBoxRemoveRoles = new EventEmitter<any>();
  @Output() checkBoxAddRoles = new EventEmitter<any>();
  public routeData: any = {};
  public isEdit: boolean = false;


  // public groupShow: boolean = false;
  constructor(private activatedRoute: ActivatedRoute,) { }

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

  public toggleRoleForUser(id: string): void {
    const el: any = document.getElementById(id);
    el.style.display = (el.style.display === 'block') ? 'none' : 'block';
  }

  public goToEditGroup(groupId: any) {
    let queryParams = this.activatedRoute.snapshot.queryParams;
    if(queryParams.data)
    {
      this.routeData = JSON.parse(atob(queryParams.data));
      this.isEdit = this.routeData['isEdit'];
    }
    let data = {
      isEdit: true,
      groupId: groupId,
      accessFrom: "users",
      isUserAccess: true,
      userEditStatus: this.isEdit
    };
    window.open('manage-groups/view?data=' + JSON.stringify(data));
  }
}
