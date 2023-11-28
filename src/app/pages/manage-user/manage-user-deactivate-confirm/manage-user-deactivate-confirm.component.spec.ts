import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageUserDeactivateConfirmComponent } from './manage-user-deactivate-confirm.component';

describe('ManageUserDeactivateConfirmComponent', () => {
  let component: ManageUserDeactivateConfirmComponent;
  let fixture: ComponentFixture<ManageUserDeactivateConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageUserDeactivateConfirmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageUserDeactivateConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
