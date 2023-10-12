import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { Title } from '@angular/platform-browser';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';

import { ManageGroupEditNameComponent } from './manage-group-edit-name-component';
import { WrapperOrganisationGroupService } from 'src/app/services/wrapper/wrapper-org--group-service';
import { SharedDataService } from 'src/app/shared/shared-data.service';
import { OperationEnum } from 'src/app/constants/enum';

describe('ManageGroupEditNameComponent', () => {
  let component: ManageGroupEditNameComponent;
  let fixture: ComponentFixture<ManageGroupEditNameComponent>;
  let router: Router;
  let activatedRoute: ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        StoreModule.forRoot({}),
        HttpClientTestingModule,
        TranslateModule.forRoot(),
      ],
      declarations: [ManageGroupEditNameComponent],
      providers: [
        ViewportScroller,
        WrapperOrganisationGroupService,
        Title,
        SharedDataService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageGroupEditNameComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    activatedRoute = TestBed.inject(ActivatedRoute);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set the page title correctly', () => {
    const titleService = TestBed.inject(Title);
    const isEdit = true;
    spyOn(titleService, 'setTitle');
    component.isEdit = isEdit;
    component.ngOnInit();
    const expectedTitle = isEdit
      ? 'Edit Name - Manage Groups - CCS'
      : 'Create - Manage Groups - CCS';
    fixture.detectChanges();
    expect(titleService.setTitle).toHaveBeenCalledWith(expectedTitle);
  });

  it('should navigate to the correct route on cancel and go to group click', () => {
    component.isEdit = true;
    spyOn(router, 'navigateByUrl');
    component.onCancelAndGoToGroupClick();
    const expectedRoute =
      'manage-groups/view?data=' + JSON.stringify(component.routeData);
    expect(router.navigateByUrl).toHaveBeenCalledWith(expectedRoute);
  });

  it('should navigate to the correct route on cancel click', () => {
    spyOn(router, 'navigateByUrl');
    component.onCancelClick();
    expect(router.navigateByUrl).toHaveBeenCalledWith('manage-groups');
  });
});
