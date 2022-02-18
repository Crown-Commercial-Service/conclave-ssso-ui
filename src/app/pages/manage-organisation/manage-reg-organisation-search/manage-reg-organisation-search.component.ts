import { ViewportScroller } from "@angular/common";
import { Component, ElementRef, OnInit, QueryList, ViewChildren } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { BaseComponent } from "src/app/components/base/base.component";
import { OrganisationRegBasicInfo, OrganisationSearchDto } from "src/app/models/organisation";
import { ScrollHelper } from "src/app/services/helper/scroll-helper.services";
import { OrganisationService } from "src/app/services/postgres/organisation.service";
import { UIState } from "src/app/store/ui.states";
import { debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';


@Component({
    selector: 'app-manage-reg-organisation-search.component',
    templateUrl: './manage-reg-organisation-search.component.html',
    styleUrls: ['./manage-reg-organisation-search.component.scss']
})

export class ManageOrgRegSearchComponent extends BaseComponent implements OnInit {
    @ViewChildren('input') inputs!: QueryList<ElementRef>;
    formGroup: FormGroup;
    submitted: boolean = false;
    options: OrganisationSearchDto[] = [];
    filteredOptions$!: Observable<OrganisationSearchDto[]>;
    visibleOptions$!: Observable<OrganisationSearchDto[]>;
    showMoreThreshold: number = 8;

    constructor(private organisationService: OrganisationService, private formBuilder: FormBuilder, private router: Router, protected uiStore: Store<UIState>,
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

    ngOnInit() {
        this.filteredOptions$ = this.formGroup.get('organisation')!.valueChanges.pipe(
            startWith(''),
            debounceTime(300),
            //map(value => this.filter(value)),
            switchMap((val: string) => {
                console.log("Changing controller", val);
                return this.doFilter(val || '')
            })
        );
    }

    doFilter(value: string): Observable<OrganisationSearchDto[]> {
        if (value.length > 2) {
            console.log("Calling API", value);
            return this.organisationService.getByName(value, false)
                .pipe(
                    map(response => response),
                );
        }
        else {
            console.log("NOT Calling API", value);
            return Observable.of([]);
        }
    }

    showMoreClicked() {
        console.log("SEE_MORE_CLICKED");

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

    async onSubmit(form: FormGroup) {
        this.submitted = true;
        if (this.formValid(form)) {
            let organisationRegisterDto: OrganisationRegBasicInfo = {
                adminEmail: form.get('email')?.value,
                adminUserFirstName: form.get('firstName')?.value,
                adminUserLastName: form.get('lastName')?.value,
                orgName: form.get('organisation')?.value,
                ciiOrgId: ''
            };
            sessionStorage.setItem('orgreginfo', JSON.stringify(organisationRegisterDto));

            let data = await this.organisationService.getByName(organisationRegisterDto.orgName).toPromise();
            localStorage.removeItem('scheme');
            localStorage.removeItem('scheme_name');
            if (data.length == 0) {
                //Org does not exist
                this.router.navigateByUrl(`manage-org/register/initial-search-status/new`);
            }
            else if (data.length == 1) {
                //Single Org exists
                organisationRegisterDto.ciiOrgId = data[0].ciiOrganisationId;
                sessionStorage.setItem('orgreginfo', JSON.stringify(organisationRegisterDto));
                this.router.navigateByUrl(`manage-org/register/initial-search-status/exists`);
            }
            else {
                //Multiple Orgs exists
                this.router.navigateByUrl(`manage-org/register/initial-search-status/duplicate`);
            }
        }
    }

    goBack() {
        this.router.navigateByUrl(`manage-org/register`);
    }

}