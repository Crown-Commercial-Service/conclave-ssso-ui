import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageGroupDeleteConfirmComponent } from './manage-group-delete-confirm-component';

describe('ManageGroupDeleteConfirmComponent', () => {
  let component: ManageGroupDeleteConfirmComponent;
  let fixture: ComponentFixture<ManageGroupDeleteConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageGroupDeleteConfirmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageGroupDeleteConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
