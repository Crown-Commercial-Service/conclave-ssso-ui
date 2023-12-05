import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataMigrationSummaryComponent } from './data-migration-summary.component';

describe('DataMigrationSummaryComponent', () => {
  let component: DataMigrationSummaryComponent;
  let fixture: ComponentFixture<DataMigrationSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataMigrationSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataMigrationSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
