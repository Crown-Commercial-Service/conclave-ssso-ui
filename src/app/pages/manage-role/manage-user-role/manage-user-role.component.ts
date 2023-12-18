import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WrapperUserService } from 'src/app/services/wrapper/wrapper-user.service';
import { DataLayerService } from 'src/app/shared/data-layer.service';
import { SessionService } from 'src/app/shared/session.service';

@Component({
  selector: 'app-manage-user-role',
  templateUrl: './manage-user-role.component.html',
  styleUrls: ['./manage-user-role.component.scss']
})
export class ManageUserRoleComponent implements OnInit {
public userDetails:any
public errorResponce:boolean = false;
public isOrgAdmin: boolean = false;
public tokenPara : any=[];
  constructor(private sessionService:SessionService,private wrapperUserService: WrapperUserService,private router: Router,private route: ActivatedRoute, private dataLayerService: DataLayerService) { 
    this.isOrgAdmin = JSON.parse(localStorage.getItem('isOrgAdmin') || 'false');
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((para: any) => {
      this.tokenPara = para.token;
      this.verifytoken(para.token)
    });
    this.dataLayerService.pushPageViewEvent();
  }

  public verifytoken(encryptedtoken:string):void {
    this.wrapperUserService.userTokenVerify(encryptedtoken).subscribe((data)=>{
      this.userDetails = data
    },(err)=>{
      this.errorResponce = true
    })
  }

  public acceptRejectRequest(responce:number):void{
    this.userDetails=null;
    this.wrapperUserService.userTokenVerify(this.tokenPara).subscribe((data)=>{
    this.userDetails = data;  
    if(this.userDetails.status !== 1 && this.userDetails.status !== 2 && this.userDetails.status !== 4)
    {
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
        this.userDetails.responce = error
        this.router.navigateByUrl('manage-users/role/failed?data=' + btoa(JSON.stringify(this.userDetails)));
      },
    });
    }
  },(err)=>{
    this.errorResponce = true
  })
  this.dataLayerService.pushEvent({ 
    event: "cta_button_click" ,
    page_location: "Fleet Portal access verification"
  });
  }
}
