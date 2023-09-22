import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageOrgRegStep2Component } from './manage-organisation-registration-step-2.component';

describe('ManageOrgRegStep2Component', () => {
  let component: ManageOrgRegStep2Component;
  let fixture: ComponentFixture<ManageOrgRegStep2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageOrgRegStep2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageOrgRegStep2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
