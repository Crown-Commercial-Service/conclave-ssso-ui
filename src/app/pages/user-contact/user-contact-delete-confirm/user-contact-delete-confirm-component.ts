import { Component } from "@angular/core";
import { OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { BaseComponent } from "src/app/components/base/base.component";
import { UIState } from "src/app/store/ui.states";
import { slideAnimation } from "src/app/animations/slide.animation";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "src/app/services/auth/auth.service";
import { OperationEnum } from "src/app/constants/enum";
import { WrapperUserContactService } from "src/app/services/wrapper/wrapper-user-contact.service";
import { ScrollHelper } from "src/app/services/helper/scroll-helper.services";
import { ViewportScroller } from "@angular/common";
import { SessionStorageKey } from "src/app/constants/constant";

@Component({
    selector: 'app-user-contact-delete-confirm',
    templateUrl: './user-contact-delete-confirm-component.html',
    styleUrls: ['./user-contact-delete-confirm-component.scss'],
    animations: [
        slideAnimation({
            close: { 'transform': 'translateX(12.5rem)' },
            open: { left: '-12.5rem' }
        })
    ]
})
export class UserContactDeleteConfirmComponent extends BaseComponent implements OnInit {
    userName: string = '';
    contactId: number = 0;
    constructor(protected uiStore: Store<UIState>, private router: Router, private activatedRoute: ActivatedRoute,
        private contactService: WrapperUserContactService, protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper) {
        super(uiStore,viewportScroller,scrollHelper);
        let queryParams = this.activatedRoute.snapshot.queryParams;
        if (queryParams.data) {
            let routeData = JSON.parse(queryParams.data);
            console.log(routeData);
            this.userName = sessionStorage.getItem(SessionStorageKey.UserContactUsername) ?? '';
            this.contactId = routeData['contactId'];
        }
    }

    ngOnInit() {
    }

    onDeleteConfirmClick() {
        this.contactService.deleteUserContact(this.userName, this.contactId).subscribe({
            next: () => { 
                this.router.navigateByUrl(`operation-success/${OperationEnum.MyAccountContactDelete}`);             
            },
            error: (error) => {
                console.log(error);
            }
        });
    }

    onCancelClick(){
        let data = {
            'isEdit':true,
            'contactId': this.contactId
        };
        this.router.navigateByUrl('user-contact-edit?data=' + JSON.stringify(data));
    }
}