import { ViewportScroller } from "@angular/common";
import { Component, ElementRef, OnInit, QueryList, ViewChildren } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { BaseComponent } from "src/app/components/base/base.component";
import { OrganisationRegBasicInfo } from "src/app/models/organisation";
import { ScrollHelper } from "src/app/services/helper/scroll-helper.services";
import { UIState } from "src/app/store/ui.states";


@Component({
    selector: 'app-manage-reg-organisation-search.component',
    templateUrl: './manage-reg-organisation-search.component.html',
    styleUrls: ['./manage-reg-organisation-search.component.scss']
})

export class ManageOrgRegSearchComponent extends BaseComponent {
    @ViewChildren('input') inputs!: QueryList<ElementRef>;
    formGroup: FormGroup;
    submitted: boolean = false;

    constructor(private formBuilder: FormBuilder, private router: Router, protected uiStore: Store<UIState>,
        protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper) {
        super(uiStore, viewportScroller, scrollHelper);

        let orgInfoExists = sessionStorage.getItem('orgreginfo') != null;
        let orgreginfo = orgInfoExists ? JSON.parse(sessionStorage.getItem('orgreginfo') || '') : '';
        if (orgreginfo != '') {
            this.formGroup = this.formBuilder.group({
                firstName: [orgreginfo.adminUserFirstName, Validators.compose([Validators.required])],
                lastName: [orgreginfo.adminUserLastName, Validators.compose([Validators.required])],
                email: [orgreginfo.adminEmail, Validators.compose([Validators.required, Validators.email])],
                organisation: [orgreginfo.orgName, Validators.compose([Validators.required])]
            });
        }
        else {
            this.formGroup = this.formBuilder.group({
                firstName: ['', Validators.compose([Validators.required])],
                lastName: ['', Validators.compose([Validators.required])],
                email: ['', Validators.compose([Validators.required, Validators.email])],
                organisation: ['', Validators.compose([Validators.required])]
            });
        }
    }

    setFocus(inputIndex: number) {
        this.inputs.toArray()[inputIndex].nativeElement.focus();
      }

    /**
      * iterate through each form control and validate
      */
    public formValid(form: FormGroup): Boolean {
        if (form == null) return false;
        if (form.controls == null) return false;
        return form.valid;
    }

    public onSubmit(form: FormGroup) {
        this.submitted = true;
        if (this.formValid(form)) {
            let organisationRegisterDto: OrganisationRegBasicInfo = {
                adminEmail: form.get('email')?.value,
                adminUserFirstName: form.get('firstName')?.value,
                adminUserLastName: form.get('lastName')?.value,
                orgName: form.get('organisation')?.value,
            };
            sessionStorage.setItem('orgreginfo', JSON.stringify(organisationRegisterDto));
            this.router.navigateByUrl(`manage-org/register/initial-search-status`);
        }
    }

    goBack() {
        this.router.navigateByUrl(`manage-org/register`);
    }

}