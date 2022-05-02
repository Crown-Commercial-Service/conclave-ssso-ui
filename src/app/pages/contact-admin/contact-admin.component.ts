import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contact-admin',
  templateUrl: './contact-admin.component.html',
  styleUrls: ['./contact-admin.component.scss'],
})
export class ContactAdminComponent implements OnInit {
  public adminDetails: any = [
    {
      FirstName: 'ajith',
      LastName: 'muthukumar',
      email: 'ajith.muthukumar@brickendon.com',
      Role: 'Admin',
    },
    {
      FirstName: 'karpagam',
      LastName: 'nallasamy',
      email: 'karpagam.nallasamy@brickendon.com',
      Role: 'Admin',
    },
  ];

  constructor() {}

  ngOnInit(): void {}


  public openEmailWindow(email:string):void{
    let AdminEmail='mailto:'+email
    window.location.href =AdminEmail;
  }
}
