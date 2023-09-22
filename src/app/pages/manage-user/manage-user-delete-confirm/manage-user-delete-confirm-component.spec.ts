import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageUserDeleteConfirmComponent } from './manage-user-delete-confirm-component';

describe('ManageUserDeleteConfirmComponent', () => {
  let component: ManageUserDeleteConfirmComponent;
  let fixture: ComponentFixture<ManageUserDeleteConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageUserDeleteConfirmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageUserDeleteConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
