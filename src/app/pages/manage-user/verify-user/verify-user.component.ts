import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WrapperUserService } from 'src/app/services/wrapper/wrapper-user.service';

@Component({
  selector: 'app-verify-user',
  templateUrl: './verify-user.component.html',
  styleUrls: ['./verify-user.component.scss'],
})
export class VerifyUserComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private wrapperUserService: WrapperUserService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((para: any) => {
      this.addUserTokenVerification(para.details);
    });
  }

  /**
   * token verification for create user
   * @param encryptedtoken token from backend
   */
  private addUserTokenVerification(encryptedtoken: any): void {
    this.wrapperUserService.addUserTokenVerification(encryptedtoken).subscribe(
      (data:any) => {
        if(data.firstName == null){
          let errorData= {
            status:data.errorCode,
            email:data.email
          }
          this.router.navigateByUrl('manage-users/verify-user/status?data=' + btoa(JSON.stringify(errorData)));
        } else {
          let modelObject = {
            firstName:data.firstName,
            lastName:data.lastName,
            userName:data.email,
            isCreatedByAdmin: true
           }
           this.router.navigateByUrl('manage-users/add-user/details?data=' + btoa(JSON.stringify(modelObject)));
        }
      },
      (err) => {
        if(err.status === 403){
          let errorObject= {
            status:'UNAUTHORIZED',
          }
        this.router.navigateByUrl('manage-users/verify-user/status?data=' + btoa(JSON.stringify(errorObject)));
        } else if(err.status === 400) {
          let errorObject= {
            status:'INVALID_USER_DETAIL',
          }
        this.router.navigateByUrl('manage-users/verify-user/status?data=' + btoa(JSON.stringify(errorObject)));
        }
      }
    );
  }
}
