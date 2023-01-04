import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WrapperUserService } from 'src/app/services/wrapper/wrapper-user.service';

@Component({
  selector: 'app-manage-user-role',
  templateUrl: './manage-user-role.component.html',
  styleUrls: ['./manage-user-role.component.scss']
})
export class ManageUserRoleComponent implements OnInit {

  constructor(private wrapperUserService: WrapperUserService,private router: Router,private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((para: any) => {
      this.verifytoken(para.activationcode)
    });
  }

  private verifytoken(encryptedtoken:string):void {
    this.wrapperUserService.userTokenVerify(encryptedtoken).subscribe((data)=>{
      console.log("data",data)
    })
  }

}
