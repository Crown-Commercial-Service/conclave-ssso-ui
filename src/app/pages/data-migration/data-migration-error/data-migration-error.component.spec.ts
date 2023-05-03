import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataMigrationErrorComponent } from './data-migration-error.component';

describe('DataMigrationErrorComponent', () => {
  let component: DataMigrationErrorComponent;
  let fixture: ComponentFixture<DataMigrationErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataMigrationErrorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataMigrationErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
