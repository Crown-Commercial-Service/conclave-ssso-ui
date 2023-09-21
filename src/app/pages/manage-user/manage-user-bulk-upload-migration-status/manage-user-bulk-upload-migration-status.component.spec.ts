import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageUserBulkUploadMigrationStatusComponent } from './manage-user-bulk-upload-migration-status.component';

describe('ManageUserBulkUploadMigrationStatusComponent', () => {
  let component: ManageUserBulkUploadMigrationStatusComponent;
  let fixture: ComponentFixture<ManageUserBulkUploadMigrationStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageUserBulkUploadMigrationStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageUserBulkUploadMigrationStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
