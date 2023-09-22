import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataMigrationService } from './data-migration.service';

describe('DataMigrationService', () => {
  let component: DataMigrationService;
  let fixture: ComponentFixture<DataMigrationService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataMigrationService ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataMigrationService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
