import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageOrgRegFailureComponent } from './manage-organisation-registration-failure.component';

describe('ManageOrgRegFailureComponent', () => {
  let component: ManageOrgRegFailureComponent;
  let fixture: ComponentFixture<ManageOrgRegFailureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageOrgRegFailureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageOrgRegFailureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
