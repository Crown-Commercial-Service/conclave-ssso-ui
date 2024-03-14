import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataLayerService } from 'src/app/shared/data-layer.service';

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss']
})
export class AccordionComponent implements OnInit, OnChanges {

  @Input() data: any[] = [];
  @Input() headerText!: string
  @Input() headerTextKeys!: string
  @Input() isAdmin!: boolean
  @Input() accessTable!: string
  @Input() groupShow!: boolean
  @Input() noRoleText!: string
  @Input() noRoleMessage!: string
  @Input() noDataGroupsMemberMessage!: string
  @Input() noDatanoneGroupsMemberMessage!: string


  @Output() checkBoxRemoveRoles = new EventEmitter<any>();
  @Output() checkBoxAddRoles = new EventEmitter<any>();
  public routeData: any = {};
  public isEdit: boolean = false;


  // public groupShow: boolean = false;
  constructor(private router: Router, private activatedRoute: ActivatedRoute, private dataLayerService: DataLayerService) { }

  ngOnChanges(): void {
  }

  ngOnInit(): void {
  }

  public onTopToggle(): void {
    this.dataLayerService.pushEvent({
      event: "accordion_use",
      interaction_type: this.groupShow ? "close": "open",
      link_text: this.headerText
    })
    this.groupShow = !this.groupShow
  }

  onBottomToggle(event: Event, groupdata: any) {
    const el: any = document.getElementById(groupdata.groupId);
    const groupNameEventText  = groupdata['groupName'];
    el.style.display = (el.style.display === 'block') ? 'none' : 'block';
    var eventNameText =  (el.style.display === 'block') ?  'Show services' : 'Hide services';
    this.dataLayerService.pushEvent({
      event: "accordion_use",
      interaction_type: (el.style.display === 'block') ? 'open':'close',
      link_text: `${groupNameEventText} - ${eventNameText}`
    })
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
    let isFromManageMyAccount = this.router.url === '/profile';
    let queryParams = this.activatedRoute.snapshot.queryParams;
    if(queryParams.data)
    {
      this.routeData = JSON.parse(atob(queryParams.data));
      this.isEdit = this.routeData['isEdit'];
    }
    let data = {
      isEdit: true,
      groupId: groupId,
      accessFrom: isFromManageMyAccount ? "profile" : "users",
      isUserAccess: true,
      userEditStatus: this.isEdit
    };
    window.open('manage-groups/view?data=' + JSON.stringify(data));
  }

  getQueryData(groupId: any): string {
    let isFromManageMyAccount = this.router.url === '/profile';
    let queryParams = this.activatedRoute.snapshot.queryParams;
    if(queryParams.data)
    {
      this.routeData = JSON.parse(atob(queryParams.data));
      this.isEdit = this.routeData['isEdit'];
    }
    let data = {
      isEdit: true,
      groupId: groupId,
      accessFrom: isFromManageMyAccount ? "profile" : "users",
      isUserAccess: true,
      userEditStatus: this.isEdit
    };
    return JSON.stringify(data);
  }
}
