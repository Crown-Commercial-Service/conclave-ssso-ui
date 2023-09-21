import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageOrgRegStep1Component } from './manage-organisation-registration-step-1.component';

describe('ManageOrgRegStep1Component', () => {
  let component: ManageOrgRegStep1Component;
  let fixture: ComponentFixture<ManageOrgRegStep1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageOrgRegStep1Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageOrgRegStep1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
