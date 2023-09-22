import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkUploadService } from './bulk-upload.service';

describe('BulkUploadService', () => {
  let component: BulkUploadService;
  let fixture: ComponentFixture<BulkUploadService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulkUploadService ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkUploadService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
