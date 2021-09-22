import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { slideAnimation } from 'src/app/animations/slide.animation';

import { BaseComponent } from 'src/app/components/base/base.component';
import { UIState } from 'src/app/store/ui.states';
import { OperationEnum } from 'src/app/constants/enum';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { ViewportScroller } from '@angular/common';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-manage-group-operation-success',
    templateUrl: './manage-group-operation-success-component.html',
    styleUrls: ['./manage-group-operation-success-component.scss'],
    animations: [
        slideAnimation({
            close: { 'transform': 'translateX(12.5rem)' },
            open: { left: '-12.5rem' }
        })
    ]
})
export class ManageGroupOperationSuccessComponent extends BaseComponent implements OnInit {
    operation: OperationEnum;
    operationEnum = OperationEnum;
    isEdit: boolean = false;
    groupId: string = '';
    userCount: number = 0;
    roleCount: number = 0;

    constructor(private router: Router, private activatedRoute: ActivatedRoute, private titleService: Title,
        protected uiStore: Store<UIState>, protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper) {
        super(uiStore, viewportScroller, scrollHelper);
        this.operation = parseInt(this.activatedRoute.snapshot.paramMap.get('operation') || '0');
        let queryParams = this.activatedRoute.snapshot.queryParams;
        if (queryParams.data) {
            let routeData = JSON.parse(queryParams.data);
            this.isEdit = routeData['isEdit'];
            this.groupId = routeData['groupId'];
            this.userCount = routeData['userCount'] || 0;
            this.roleCount = routeData['roleCount'] || 0;
        }
    }

    ngOnInit() {
        let area: string = "";
        switch (this.operation) {
            case this.operationEnum.GroupAdd:
                area = 'Create'
                break;
            case this.operationEnum.GroupNameUpdate:
                area = 'Edit Name'
                break;
            case this.operationEnum.GroupUserAdd:
                area = 'Add Users'
                break;
            case this.operationEnum.GroupUserUpdate:
                area = 'Add/Remove Users'
                break;
            case this.operationEnum.GroupRoleUpdate:
                area = 'Add/Remove Roles'
                break;
            case this.operationEnum.GroupDelete:
                area = 'Delete'
                break;
            default:
                break
        }
        this.titleService.setTitle(`Success - ${area} - Manage Groups - CCS`);
    }

    onNavigateToGroupClick() {
        let data = {
            'isEdit': true,
            'groupId': this.groupId
        };
        this.router.navigateByUrl('manage-groups/view?data=' + JSON.stringify(data));
    }
}
