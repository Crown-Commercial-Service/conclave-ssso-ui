import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageOrgRegSuccessComponent } from './manage-organisation-registration-success.component';

describe('ManageOrgRegSuccessComponent', () => {
  let component: ManageOrgRegSuccessComponent;
  let fixture: ComponentFixture<ManageOrgRegSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageOrgRegSuccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageOrgRegSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
