import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageOrgRegStep3Component } from './manage-organisation-registration-step-3.component';

describe('ManageOrgRegStep3Component', () => {
  let component: ManageOrgRegStep3Component;
  let fixture: ComponentFixture<ManageOrgRegStep3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageOrgRegStep3Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageOrgRegStep3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
