import { ViewportScroller } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BaseComponent } from 'src/app/components/base/base.component';
import { SessionStorageKey } from 'src/app/constants/constant';
import { OperationEnum } from 'src/app/constants/enum';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { WrapperUserService } from 'src/app/services/wrapper/wrapper-user.service';
import { UIState } from 'src/app/store/ui.states';

@Component({
  selector: 'app-manage-user-reactivate-confirm',
  templateUrl: './manage-user-reactivate-confirm.component.html',
  styleUrls: ['./manage-user-reactivate-confirm.component.scss']
})
export class ManageUserReactivateConfirmComponent extends BaseComponent implements OnInit {
  userName: string = '';
  fromPage:string ='edit_user'
  constructor(protected uiStore: Store<UIState>, private router: Router, private activatedRoute: ActivatedRoute,
      private wrapperUserService: WrapperUserService, protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper) {
      super(uiStore,viewportScroller,scrollHelper);
      this.userName = sessionStorage.getItem(SessionStorageKey.ManageUserUserName) ?? '';
      this.userName = localStorage.getItem('ManageUserUserName') ?? '';
    //   const previousRoute = this.router.getCurrentNavigation()?.previousNavigation?.finalUrl?.toString();
    // console.log('Previous Route:', previousRoute);
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['isNewTab'] === 'true') {
        const urlTree = this.router.parseUrl(this.router.url);
        delete urlTree.queryParams['isNewTab'];
        this.router.navigateByUrl(urlTree.toString(), { replaceUrl: true });
      }
    });
  }
  public onReactivateConfirmClick()
  {
    this.wrapperUserService.reActivateUser(this.userName,this.fromPage).subscribe(
      {
        next:() =>{
          sessionStorage.setItem(SessionStorageKey.OperationSuccessUserName, this.userName);
          localStorage.setItem('OperationSuccessUserName', this.userName);
          this.router.navigateByUrl(`operation-success/${OperationEnum.UserReactivate}`);

        },
        error:(err) =>{
          console.log(err);
          
        }

      });

  }
  public onCancelClick(){
    window.history.back();
}

getQueryData(): string {
  let userName= localStorage.getItem('ManageUserUserName'); 
  let data = {
      'isEdit': true,
      'name': userName
  };
  return btoa(JSON.stringify(data));
}
}
