import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageOrgRegBuyerTypeComponent } from './manage-organisation-registration-buyer-type.component';

describe('ManageOrgRegBuyerTypeComponent', () => {
  let component: ManageOrgRegBuyerTypeComponent;
  let fixture: ComponentFixture<ManageOrgRegBuyerTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageOrgRegBuyerTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageOrgRegBuyerTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
