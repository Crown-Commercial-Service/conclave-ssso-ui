import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataMigrationUploadComponent } from './data-migration-upload.component';

describe('DataMigrationUploadComponent', () => {
  let component: DataMigrationUploadComponent;
  let fixture: ComponentFixture<DataMigrationUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataMigrationUploadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataMigrationUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
