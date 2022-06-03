import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ViewportScroller } from '@angular/common';
import { BaseComponent } from 'src/app/components/base/base.component';
import { UIState } from 'src/app/store/ui.states';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { slideAnimation } from 'src/app/animations/slide.animation';
import { ActivatedRoute, Router } from '@angular/router';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { WrapperOrganisationGroupService } from 'src/app/services/wrapper/wrapper-org--group-service';
import {
  OrganisationGroupNameInfo,
  OrganisationGroupRequestInfo,
  Role,
} from 'src/app/models/organisationGroup';
import { OperationEnum } from 'src/app/constants/enum';
import { Title } from '@angular/platform-browser';
import { FormBaseComponent } from 'src/app/components/form-base/form-base.component';
import { SharedDataService } from 'src/app/shared/shared-data.service';

@Component({
  selector: 'app-manage-group-edit-name',
  templateUrl: './manage-group-edit-name-component.html',
  styleUrls: ['./manage-group-edit-name-component.scss'],
})
export class ManageGroupEditNameComponent
  extends FormBaseComponent
  implements OnInit
{
  submitted!: boolean;
  organisationId: string;
  routeData: any = {};
  isEdit: boolean = false;
  editingGroupId: number = 0;
  groupName: string = '';
  private specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~£€]/;
  @ViewChildren('input') inputs!: QueryList<ElementRef>;

  constructor(
    protected uiStore: Store<UIState>,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    protected viewportScroller: ViewportScroller,
    protected scrollHelper: ScrollHelper,
    private orgGroupService: WrapperOrganisationGroupService,
    private titleService: Title,
    private SharedDataService: SharedDataService
  ) {
    super(
      viewportScroller,
      formBuilder.group({
        groupName: ['', Validators.compose([Validators.required])],
      })
    );
    let queryParams = this.activatedRoute.snapshot.queryParams;
    if (queryParams.data) {
      this.routeData = JSON.parse(queryParams.data);
      this.isEdit = this.routeData['isEdit'];
      this.editingGroupId = this.routeData['groupId'] || 0;
      this.groupName = this.routeData['groupName'] || '';
      this.formGroup.controls['groupName'].setValue(this.groupName);
    }
    this.organisationId = localStorage.getItem('cii_organisation_id') || '';
  }

  ngOnInit() {
    this.titleService.setTitle(
      `${this.isEdit ? 'Edit Name' : 'Create'}  - Manage Groups - CCS`
    );
    if(this.isEdit){
    this.groupName=sessionStorage.getItem('Gname') || ''
    this.formGroup.controls['groupName'].setValue(this.groupName);
    }
    this.onFormValueChange();
  }
  
   public get specialCharsVaidation(){
     let indexOfGname=this.formGroup.value.groupName.length
     let indexOfspecialChars:number=0
    for (let i = 0; i < this.formGroup.value.groupName.length; i++) {
      if(this.specialChars.test(this.formGroup.value.groupName[i])){
        indexOfspecialChars = indexOfspecialChars + 1
      }
    }
    return indexOfGname === indexOfspecialChars ? true : false
    }


 

  ngAfterViewChecked() {
    this.scrollHelper.doScroll();
  }

  scrollToAnchor(elementId: string): void {
    this.viewportScroller.scrollToAnchor(elementId);
  }

  setFocus(inputIndex: number) {
    this.inputs.toArray()[inputIndex].nativeElement.focus();
  }

  onSubmit(form: FormGroup) {
    this.submitted = true;
    if (this.formValid(form)) {
      if (!this.specialCharsVaidation) {
        this.groupName = form.get('groupName')?.value;
        if (this.isEdit == true) {          
          let groupPatchRequestInfo: OrganisationGroupRequestInfo = {
            groupName: this.groupName,
          };
          this.orgGroupService
            .patchUpdateOrganisationGroup(
              this.organisationId,
              this.editingGroupId,
              groupPatchRequestInfo
            )
            .subscribe(
              (result) => {
                this.submitted = false;
                let data = {
                  isEdit: this.isEdit,
                  groupId: this.editingGroupId,
                };
                this.router.navigateByUrl(
                  `manage-groups/operation-success/${OperationEnum.GroupNameUpdate}?data=` +
                    JSON.stringify(data)
                );
              },
              (error) => {
                if (error.status == 409) {
                  form.controls['groupName'].setErrors({ alreadyExists: true });
                  this.scrollHelper.scrollToFirst('error-summary');
                }
                if (error.status == 400) {
                  this.formGroup.controls['groupName'].setErrors({ 'specialCharsincluded': true})
                  this.scrollHelper.scrollToFirst('error-summary');
                }
                console.log(error);
                console.log(error.error);
              }
            );
        } else {
          let groupRequest: OrganisationGroupNameInfo = {
            groupName: this.groupName,
          };
          this.SharedDataService.manageGroupStorage(this.groupName);
          this.orgGroupService
            .createOrganisationGroups(this.organisationId, groupRequest)
            .subscribe(
              (result) => {
                if (result != 0) {
                  this.submitted = false;
                  let data = {
                    isEdit: false,
                    groupId: result,
                    userNames: [],
                  };
                  this.router.navigateByUrl(
                    'manage-groups/edit-users?data=' + JSON.stringify(data)
                  );
                }
              },
              (error) => {
                if (error.status == 409) {
                  form.controls['groupName'].setErrors({ alreadyExists: true });
                  this.scrollHelper.scrollToFirst('error-summary');
                }
                if (error.status == 400) {
                  this.formGroup.controls['groupName'].setErrors({ 'specialCharsincluded': true})
                  this.scrollHelper.scrollToFirst('error-summary');
                }
                console.log(error);
                console.log(error.error);
              }
            );
        }
      }else{
        this.formGroup.controls['groupName'].setErrors({ 'specialCharsincluded': true})
      }
    } else {
      this.scrollHelper.scrollToFirst('error-summary');
    }
  }

  formValid(form: FormGroup): Boolean {
    if (form == null) return false;
    if (form.controls == null) return false;
    return form.valid;
  }

  onCancelAndGoToGroupClick() {
    if (this.isEdit == true) {
      this.router.navigateByUrl(
        'manage-groups/view?data=' + JSON.stringify(this.routeData)
      );
    }
  }

  onCancelClick() {
    this.router.navigateByUrl('manage-groups');
  }
}
