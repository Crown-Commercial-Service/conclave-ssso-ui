import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { acceptRejectRequestDetail } from 'src/app/models/user';
import { WrapperUserService } from 'src/app/services/wrapper/wrapper-user.service';

@Component({
  selector: 'app-manage-user-role',
  templateUrl: './manage-user-role.component.html',
  styleUrls: ['./manage-user-role.component.scss']
})
export class ManageUserRoleComponent implements OnInit {
public userDetails:any
  constructor(private wrapperUserService: WrapperUserService,private router: Router,private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((para: any) => {
      this.verifytoken(para.token)
    });
  }

  private verifytoken(encryptedtoken:string):void {
    this.wrapperUserService.userTokenVerify(encryptedtoken).subscribe((data)=>{
      this.userDetails = data
    })
  }

  public acceptRejectRequest(responce:number):void{
    let userRequest:any = {
      pendingRoleIds:[],
      status:responce
    }
    userRequest.pendingRoleIds.push(this.userDetails.id)
    this.wrapperUserService.acceptRejectRequest(userRequest).subscribe({
      next: (roleListResponse: any) => {
        this.userDetails.responce = responce
        this.router.navigateByUrl('manage-users/role/success?data=' + btoa(JSON.stringify(this.userDetails)));
      },
      error: (error: any) => { 
        this.router.navigateByUrl('manage-users/role/failed');
      },
    });
  }
}
