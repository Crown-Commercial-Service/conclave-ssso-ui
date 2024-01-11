import { Component, ElementRef, QueryList, ViewChildren } from "@angular/core";
import { OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { ViewportScroller } from '@angular/common';
import { BaseComponent } from "src/app/components/base/base.component";
import { UIState } from "src/app/store/ui.states";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { slideAnimation } from "src/app/animations/slide.animation";
import { ActivatedRoute, Router } from "@angular/router";
import { ScrollHelper } from "src/app/services/helper/scroll-helper.services";
import { DataLayerService } from "src/app/shared/data-layer.service";

@Component({
    selector: 'app-contact-assign-selection-component',
    templateUrl: './contact-assign-selection-component.html',
    styleUrls: ['./contact-assign-selection-component.scss'],
    animations: [
        slideAnimation({
            close: { 'transform': 'translateX(12.5rem)' },
            open: { left: '-12.5rem' }
        })
    ]
})
export class ContactAssignSelectionComponent extends BaseComponent implements OnInit {
    submitted!: boolean;
    selectionForm!: FormGroup;
    assigningSiteId: number = 0;
    assigningOrgId: string = "";
    public formId :string = 'Assign_Contacts_Selection';

    @ViewChildren('input') inputs!: QueryList<ElementRef>;
    siteCreate: any;

    constructor(protected uiStore: Store<UIState>, public router: Router, private formBuilder: FormBuilder,
        protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper, private activatedRoute: ActivatedRoute, private dataLayerService: DataLayerService) {
        super(uiStore,viewportScroller,scrollHelper);
        this.selectionForm = this.formBuilder.group({
            selection: ['', Validators.compose([Validators.required])],
        });
        let queryParams = this.activatedRoute.snapshot.queryParams;
        if (queryParams.data) {
            let routeData = JSON.parse(queryParams.data);
            this.assigningSiteId = routeData['assigningSiteId'] || 0;
            this.assigningOrgId = routeData['assigningOrgId'] || "";
            this.siteCreate=routeData['siteCreate'] || false;
        }
    }

    ngOnInit() {
        this.dataLayerService.pushPageViewEvent();
        this.dataLayerService.pushFormStartEvent(this.formId, this.selectionForm);
    }

    ngAfterViewChecked() {
        this.scrollHelper.doScroll();
    }

    setFocus(inputIndex: number) {
        this.inputs.toArray()[inputIndex].nativeElement.focus();
    }

    pushDataLayerEvent(buttonText:string) {
        this.dataLayerService.pushClickEvent(buttonText);
      }
    
    public onSubmit(form: FormGroup) {
        this.submitted = true;
        if (this.formValid(form)) {
            this.submitted = false;
            let data = {
                'assigningSiteId': this.assigningSiteId,
                'assigningOrgId': this.assigningOrgId,
                'siteCreate':this.siteCreate
            };

            this.dataLayerService.pushFormSubmitEvent(this.formId);

            let selection = form.get('selection')?.value;
            if (selection === "userContact"){
                console.log("userContact");
                
                this.router.navigateByUrl("contact-assign/user-search?data=" + JSON.stringify(data));
            }
            else{
                this.router.navigateByUrl("contact-assign/site-search?data=" + JSON.stringify(data));
            }
        } else {
            this.dataLayerService.pushFormErrorEvent(this.formId);
        }
    }

    public formValid(form: FormGroup): Boolean {
        if (form == null) return false;
        if (form.controls == null) return false;
        return form.valid;
    }

    onNavigateToSiteClick(){
        let data = {
            'isEdit': true,
            'siteId': this.assigningSiteId
        };
        this.router.navigateByUrl('manage-org/profile/site/edit?data=' + JSON.stringify(data));
    }

    onCancelClick(buttonText:string) {
      window.history.back();
      this.pushDataLayerEvent(buttonText);
        // if (this.assigningSiteId != 0){
        //     this.onNavigateToSiteClick();
        // }
        // else{
        //     this.router.navigateByUrl('manage-org/profile');
        // }
    }

    pushDataLayer(event:string){
        this.dataLayerService.pushEvent({
            'event': event,
            'form_id': 'Manage_my_account Change_password'
        });
    }
}