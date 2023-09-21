import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageOrgRegDetailsWrongComponent } from './manage-organisation-registration-error-details-wrong.component';

describe('ManageOrgRegDetailsWrongComponent', () => {
  let component: ManageOrgRegDetailsWrongComponent;
  let fixture: ComponentFixture<ManageOrgRegDetailsWrongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageOrgRegDetailsWrongComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageOrgRegDetailsWrongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
