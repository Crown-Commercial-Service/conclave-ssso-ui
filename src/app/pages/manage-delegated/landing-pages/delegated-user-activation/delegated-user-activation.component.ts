import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserListResponse } from 'src/app/models/user';
import { WrapperUserDelegatedService } from 'src/app/services/wrapper/wrapper-user-delegated.service';

@Component({
  selector: 'app-delegated-user-activation',
  templateUrl: './delegated-user-activation.component.html',
  styleUrls: ['./delegated-user-activation.component.scss'],
})
export class DelegatedUserActivationComponent implements OnInit {
  
  public userActivation:boolean=false

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private DelegatedService: WrapperUserDelegatedService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((para: any) => {
      this.DelegatedService.activateUser(para.activationcode).subscribe({
        next: (userResponse: any) => {
         this.userActivation = true
        },
        error: (error: any) => {
          this.userActivation = false
        },
      });
    });
  }
}
