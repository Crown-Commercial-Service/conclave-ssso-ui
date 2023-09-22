import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageOrgRegConfirmComponent } from './manage-organisation-registration-confirm.component';

describe('ManageOrgRegConfirmComponent', () => {
  let component: ManageOrgRegConfirmComponent;
  let fixture: ComponentFixture<ManageOrgRegConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageOrgRegConfirmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageOrgRegConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
