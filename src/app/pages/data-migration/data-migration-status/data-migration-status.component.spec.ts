import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataMigrationStatusComponent } from './data-migration-status.component';

describe('DataMigrationStatusComponent', () => {
  let component: DataMigrationStatusComponent;
  let fixture: ComponentFixture<DataMigrationStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataMigrationStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataMigrationStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
