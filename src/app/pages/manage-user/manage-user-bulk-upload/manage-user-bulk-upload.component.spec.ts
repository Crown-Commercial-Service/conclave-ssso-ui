import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageUserBulkUploadComponent } from './manage-user-bulk-upload.component';

describe('ManageUserBulkUploadComponent', () => {
  let component: ManageUserBulkUploadComponent;
  let fixture: ComponentFixture<ManageUserBulkUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageUserBulkUploadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageUserBulkUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
