import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';

import { ManageUserBulkUploadStatusComponent } from './manage-user-bulk-upload-status.component';

describe('ManageUserBulkUploadStatusComponent', () => {
  let component: ManageUserBulkUploadStatusComponent;
  let fixture: ComponentFixture<ManageUserBulkUploadStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        TranslateModule.forRoot(),
      ],
      declarations: [ManageUserBulkUploadStatusComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: '123' }),
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageUserBulkUploadStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the component', () => {
    expect(component.organisationId).toBeDefined();
    expect(component.errorServer).toBeFalsy();
    expect(component.errorDetails).toEqual([]);
    expect(component.statusCheckComplete).toBeFalsy();
    expect(component.errorTableHeaders).toEqual([
      'ERROR_HEADING',
      'ERROR_DESCRIPTION',
    ]);
    expect(component.errorColumnsToDisplay).toEqual([
      'errorHeading',
      'errorDescription',
    ]);
    expect(component.errorsGridInfoList).toEqual([]);
    expect(component.isBulkUpload).toBeDefined();
  });

  it('should check status and set interval on ngOnInit', () => {
    jest.spyOn(component, 'checkStatus');
    component.ngOnInit();
    expect(component.checkStatus).toHaveBeenCalledWith('123');
    expect(component.statusInterval).toBeDefined();
  });

  it('should clear interval on ngOnDestroy', () => {
    jest.spyOn(window, 'clearInterval');
    component.ngOnDestroy();
    expect(window.clearInterval).toHaveBeenCalled();
  });
});
