import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { Title } from '@angular/platform-browser';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

import { ManageGroupEditNameComponent } from './manage-group-edit-name-component';
import { WrapperOrganisationGroupService } from 'src/app/services/wrapper/wrapper-org--group-service';
import { SharedDataService } from 'src/app/shared/shared-data.service';
import { OperationEnum } from 'src/app/constants/enum';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('ManageGroupEditNameComponent', () => {
  let component: ManageGroupEditNameComponent;
  let fixture: ComponentFixture<ManageGroupEditNameComponent>;
  let router: Router;
  let activatedRoute: ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        StoreModule.forRoot({}),
        TranslateModule.forRoot(),
      ],
      declarations: [ManageGroupEditNameComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        ViewportScroller,
        WrapperOrganisationGroupService,
        Title,
        SharedDataService,
      ],
      schemas: [NO_ERRORS_SCHEMA]
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
    component.onCancelAndGoToGroupClick('Edit Group');
    const expectedRoute =
      'manage-groups/view?data=' + JSON.stringify(component.routeData);
    expect(router.navigateByUrl).toHaveBeenCalledWith(expectedRoute);
  });

  it('should navigate to the correct route on cancel click', () => {
    spyOn(router, 'navigateByUrl');
    component.onCancelClick('Cancel');
    expect(router.navigateByUrl).toHaveBeenCalledWith('manage-groups');
  });
});
