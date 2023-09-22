import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageOrgRegRightToBuyComponent } from './manage-organisation-registration-type.component';

describe('ManageOrgRegRightToBuyComponent', () => {
  let component: ManageOrgRegRightToBuyComponent;
  let fixture: ComponentFixture<ManageOrgRegRightToBuyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageOrgRegRightToBuyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageOrgRegRightToBuyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
