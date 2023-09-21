import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageOrgRegStep1BComponent } from './manage-organisation-registration-step-1b.component';

describe('ManageOrgRegStep1BComponent', () => {
  let component: ManageOrgRegStep1BComponent;
  let fixture: ComponentFixture<ManageOrgRegStep1BComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageOrgRegStep1BComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageOrgRegStep1BComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
