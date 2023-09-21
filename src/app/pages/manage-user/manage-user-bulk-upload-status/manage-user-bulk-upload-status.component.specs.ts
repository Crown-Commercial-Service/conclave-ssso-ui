import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageUserBulkUploadStatusComponent } from './manage-user-bulk-upload-status.component';

describe('ManageUserBulkUploadStatusComponent', () => {
  let component: ManageUserBulkUploadStatusComponent;
  let fixture: ComponentFixture<ManageUserBulkUploadStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageUserBulkUploadStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageUserBulkUploadStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
