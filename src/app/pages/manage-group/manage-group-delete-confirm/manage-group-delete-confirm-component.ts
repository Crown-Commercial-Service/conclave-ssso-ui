import { Component } from "@angular/core";
import { OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { BaseComponent } from "src/app/components/base/base.component";
import { UIState } from "src/app/store/ui.states";
import { slideAnimation } from "src/app/animations/slide.animation";
import { ActivatedRoute, Router } from "@angular/router";
import { OperationEnum } from "src/app/constants/enum";
import { WrapperOrganisationGroupService } from "src/app/services/wrapper/wrapper-org--group-service";
import { ScrollHelper } from "src/app/services/helper/scroll-helper.services";
import { ViewportScroller } from "@angular/common";
import { OrganisationGroupResponseInfo } from "src/app/models/organisationGroup";
import { SharedDataService } from "src/app/shared/shared-data.service";
import { DataLayerService } from "src/app/shared/data-layer.service";
import { SessionService } from "src/app/shared/session.service";

@Component({
    selector: 'app-manage-group-delete-confirm',
    templateUrl: './manage-group-delete-confirm-component.html',
    styleUrls: ['./manage-group-delete-confirm-component.scss'],
    animations: [
        slideAnimation({
            close: { 'transform': 'translateX(12.5rem)' },
            open: { left: '-12.5rem' }
        })
    ]
})
export class ManageGroupDeleteConfirmComponent extends BaseComponent implements OnInit {
    public GroupDetails:any = {};
    isEdit: boolean = false;
    groupId: number = 0;
    organisationId: string = '';
    routeData: any = {};
    constructor(protected uiStore: Store<UIState>, private router: Router, private activatedRoute: ActivatedRoute,private sessionService:SessionService,
        private orgGroupService: WrapperOrganisationGroupService, protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper,private SharedDataService:SharedDataService, private dataLayerService: DataLayerService) {
        super(uiStore,viewportScroller,scrollHelper);
        let queryParams = this.activatedRoute.snapshot.queryParams;
        if (queryParams.data) {
            this.routeData = JSON.parse(queryParams.data);
            this.isEdit = this.routeData['isEdit'];
            this.groupId = this.routeData['groupId'];
            this.organisationId = this.routeData['organisationId'];
        }
    }

    ngOnInit() {
        this.dataLayerService.pushPageViewEvent();
        this.orgGroupService
        .getOrganisationGroup(this.organisationId, this.groupId)
        .subscribe(
          (group: OrganisationGroupResponseInfo) => {
              this.GroupDetails=group
            //   groupName
          },
          (error) => {
            console.log(error);
            console.log(error.error);
          }
        );
    }

    onDeleteConfirmClick(buttonText:string) {
        this.orgGroupService.deleteOrganisationGroup(this.organisationId, this.groupId).subscribe({
            next: () => { 
                this.SharedDataService.manageGroupStorage(this.GroupDetails.groupName)
                this.router.navigateByUrl(`manage-groups/operation-success/${OperationEnum.GroupDelete}`);             
            },
            error: (error) => {
                console.log(error);
            }
        });
        this.pushDataLayerEvent(buttonText);
    }

    onCancelClick(buttonText:string){
        this.router.navigateByUrl('manage-groups/view?data=' + JSON.stringify(this.routeData));
        if(buttonText==='Cancel')
        {
        this.pushDataLayerEvent(buttonText);
        }
    }

    pushDataLayerEvent(buttonText:string) {
		this.dataLayerService.pushClickEvent(buttonText);
	  }
  
}