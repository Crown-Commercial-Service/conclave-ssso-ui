import { ViewportScroller } from "@angular/common";
import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from "@angular/core";
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
import { MatAutocompleteTrigger } from "@angular/material/autocomplete";
import { PatternService } from "src/app/shared/pattern.service";
import { DataLayerService } from "src/app/shared/data-layer.service";
import { SessionService } from "src/app/shared/session.service";


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
    filteredOptions: OrganisationSearchDto[] = [];
    showMoreThreshold: number = 8;
    showMoreOptionsVisible: boolean = false;
    previousSearchValue: string = '';
    @ViewChild(MatAutocompleteTrigger) autocomplete!: MatAutocompleteTrigger;
    panelShowTimeout: any;
    searchOrgName: string = '';
    public formId : string = 'Enter_detail _create_account';

    constructor(private sessionService:SessionService,private organisationService: OrganisationService,private PatternService:PatternService, private formBuilder: FormBuilder, private router: Router, protected uiStore: Store<UIState>,
        protected viewportScroller: ViewportScroller, protected scrollHelper: ScrollHelper,private dataLayerService:DataLayerService) {
        super(uiStore, viewportScroller, scrollHelper);

        let orgInfoExists = sessionStorage.getItem('orgreginfo') != null;
        let orgreginfo = orgInfoExists ? JSON.parse(sessionStorage.getItem('orgreginfo') || '') : '';
        if (orgreginfo != '') {
            this.formGroup = this.formBuilder.group({
                firstName: [orgreginfo.adminUserFirstName, Validators.compose([Validators.required,Validators.pattern(this.PatternService.NameValidator)])],
                lastName: [orgreginfo.adminUserLastName, Validators.compose([Validators.required,Validators.pattern(this.PatternService.NameValidator)])],
                email: [orgreginfo.adminEmail, Validators.compose([Validators.required,Validators.pattern(this.PatternService.emailPattern)])],
                organisation: [orgreginfo.orgName, Validators.compose([Validators.required])]
            });
            this.searchOrgName = orgreginfo.orgName;
            this.dataLayerService.pushFormStartEvent(this.formId);
        }
        else {
            this.formGroup = this.formBuilder.group({
                firstName: ['', Validators.compose([Validators.required,Validators.pattern(this.PatternService.NameValidator)])],
                lastName: ['', Validators.compose([Validators.required,Validators.pattern(this.PatternService.NameValidator)])],
                email: ['', Validators.compose([Validators.required, Validators.pattern(this.PatternService.emailPattern)])],
                organisation: ['', Validators.compose([Validators.required])]
            });
        }
    }

    ngOnInit() {
        this.dataLayerService.pushPageViewEvent();
        this.dataLayerService.pushFormStartEvent(this.formId);
    }

    async onSearchTextChange(value: any) {
        if (value.length > 2) {
            let result = await this.organisationService.getByName(value, false).toPromise();
            this.filteredOptions = result;
        }
        else {
            this.filteredOptions = [];
        }

    }

    doFilter(value: string): Observable<OrganisationSearchDto[]> {
        this.showMoreOptionsVisible = false;
        if (value.length > 2) {
            let result$ = this.organisationService.getByName(value, false)
                .pipe(
                    map(response => response),
                );
            return result$;
        }
        else {
            return Observable.of([]);
        }
    }

    showMoreClicked(buttonText: string) {
        this.showMoreOptionsVisible = true;
        this.panelShowTimeout = setTimeout(() => {
            this.autocomplete.openPanel();
        }, 30);
        this.pushDataLayerEvent(buttonText);
    }


    setFocus(inputIndex: number) {
        this.inputs.toArray()[inputIndex].nativeElement.focus();
    }


    public customFocum(): void {
        if (
          this.formGroup.controls['firstName'].invalid &&
          this.formGroup.controls['lastName'].invalid
        ) {
          this.inputs.toArray()[1].nativeElement.focus();
        } else if (this.formGroup.controls['firstName'].invalid) {
          this.inputs.toArray()[1].nativeElement.focus();
        } else if (this.formGroup.controls['lastName'].invalid) {
          this.inputs.toArray()[2].nativeElement.focus();
        }
      }
    /**
      * iterate through each form control and validate
      */
    public formValid(form: FormGroup): Boolean {
        if (form == null) return false;
        if (form.controls == null) return false;
        return form.valid;
    }

    validateEmailLength(data:any){
        if(this.PatternService.emailValidator(data.target.value)){
            this.formGroup.controls['email'].setErrors({ 'incorrect': true})
          }
    }


    async onSubmit(form: FormGroup) {
        this.submitted = true;
        if(this.PatternService.emailValidator(form.get('email')?.value)){
            this.formGroup.controls['email'].setErrors({ 'incorrect': true});
            this.dataLayerService.pushFormErrorEvent(this.formId);
        }
        if (this.formValid(form)) {
            this.dataLayerService.pushFormSubmitEvent(this.formId);
            let organisationRegisterDto: OrganisationRegBasicInfo = {
                adminEmail: form.get('email')?.value,
                adminUserFirstName: form.get('firstName')?.value,
                adminUserLastName: form.get('lastName')?.value,
                orgName: form.get('organisation')?.value,
                ciiOrgId: '',
                isMfaRequired:false
            };
            sessionStorage.setItem('orgreginfo', JSON.stringify(organisationRegisterDto));
            sessionStorage.setItem('RegExistsingOrgName', organisationRegisterDto.orgName);
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
                this.router.navigateByUrl(`manage-org/register/initial-search-status/exists?data=` + btoa(JSON.stringify(0)));
            }
            else {
                //Multiple Orgs exists
                this.router.navigateByUrl(`manage-org/register/initial-search-status/duplicate`);
            }
        } else {
               this.dataLayerService.pushFormErrorEvent(this.formId);
        }
        this.pushDataLayerEvent('Continue');
    }

    goBack() {
        this.router.navigateByUrl(`manage-org/register`);
    }

    ngOnDestroy() {
        if (this.panelShowTimeout) {
            clearTimeout(this.panelShowTimeout);
        }
    }

    pushDataLayerEvent(buttonText:string) {
      this.dataLayerService.pushClickEvent(buttonText);
	  }
}
